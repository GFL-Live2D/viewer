import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
// Dynamic import used for Live2DModel to avoid SSR crashes regarding 'document'
import type { Live2DModel } from 'untitled-pixi-live2d-engine';
import { Spring } from './spring';
import live2dOverrides from '../data/live2d-overrides.json';

export const ZOOM_MIN = -20;
export const ZOOM_MAX = 20;

// Zoom values are logarithmic
const ZOOM_BASE = 1.1;

export enum ModelLoadingState {
    IDLE = 'idle',
    LOADING = 'loading',
    READY = 'ready',
    ERROR = 'error',
}

interface MotionData {
    id: number;
    motion_name: string;
    probability: number;
    touch_area: string;
    voice_string: string;
    delay: number;
    is_hurt: number;
}

interface VoiceData {
    char_code: string;
    voice_key: string;
    caption: string;
}

interface CharacterEntry {
    id: number;
    code: string;
    directory: string;
    motions: number[]; // List of motion IDs
}

// Internal structure types for untitled-pixi-live2d-engine
// We need these to access internal properties that are not exposed in the public type definitions
// or to fix type mismatches where the library uses 'any' or incorrect types.
interface ExtendedModelSettings {
    layout?: {
        scale?: number;
        Scale?: number;
        [key: string]: any;
    };
    json?: {
        layout?: {
            scale?: number;
            Scale?: number;
        };
        FileReferences?: {
            Layout?: {
                Scale?: number;
            };
        };
    };
}

interface PrivateMotion {
    _motionData?: {
        duration: number;
    };
    File?: string; // Sometimes attached directly
}

interface ExtendedMotionManager {
    definitions: Record<string, any[]>;
    groups: {
        idle: string | null;
        [key: string]: any;
    };
    motionGroups?: Record<string, any[]>;
    stopAllMotions?: () => void;
    loadMotion: (group: string, index: number) => Promise<any>;
}

interface ExtendedInternalModel {
    settings: ExtendedModelSettings;
    motionManager: ExtendedMotionManager;
    coreModel: any;
    on(event: string, callback: () => void): void;
    getDrawableBounds(index: number): { x: number; y: number; width: number; height: number };
    hitAreas?: Record<string, { index: number }>;
    focusController: {
        focus(x: number, y: number, instant?: boolean): void;
    };
}

export class Live2DController {
    app: PIXI.Application;
    model: Live2DModel | undefined;
    private canvas: HTMLCanvasElement;
    private bgSprite: PIXI.Sprite | null = null;
    private bgUrl: string | null = null; // URL passed to Assets.load for the current bgSprite's texture
    private modelUrl: string | null = null; // model3.json URL of the currently loaded model
    private highlightedPartId: string | null = null;
    private paramOverrides = new Map<number, number>(); // parameter index -> pinned value
    private applyOverrides?: () => void;
    private frozenEffects?: { breath: unknown; physics: unknown; pose: unknown; eyeBlink: unknown };
    private GifSource: any; // Set once pixi.js/gif is imported in initPixi
    private captionText: PIXI.Text | null = null;
    private captionInsets = { left: 0, right: 0, bottom: 0 };
    private isCanvasCaptionSuppressed = false;

    public state = $state<{
        loading: ModelLoadingState;
        loadingStep: string | null;
        error: string | null;
        caption: string | null;
        motionProgress: number;
        showProgressBar: boolean;
        isMotionPlaying: boolean;
        motionGroups: string[];
        currentMotionGroup: string | null;
        currentMotionIndex: number;
        scaleMultiplier: number;
        focusWeight: number;
        showHitboxDebug: boolean;
        loadedVoiceKeys: Set<string>;
        groupAudioState: Record<string, boolean>; // Cache for UI: "groupName:index" -> isLoaded
        isMoveMode: boolean; // Move/drag mode toggle
        isAlwaysFocus: boolean; // Always-on focus tracking toggle
        parameters: Array<{
            index: number;
            name: string;
            value: number;
            min: number;
            max: number;
            missing: boolean;
        }>;
        parts: Array<{
            id: string;
            index: number;
            opacity: number;
        }>;
        highlightHoveredPart: boolean; // Tint a part on the model while its label is hovered
        overriddenParams: number[]; // Indices of parameters pinned to a manual value
        isFrozen: boolean; // Suspend breath, physics, pose and focus so manual values hold still
        motionsPaused: boolean; // Motions stopped and idle disabled until a motion is played
        followParameterValues: boolean; // Auto-update parameters from animation
        forceLipSync: boolean; // Enable library lip sync (audio-driven, additive to animation)
        renderCaptionsOnCanvas: boolean; // Draw captions directly on canvas
        useCustomInitialPositioning: boolean; // Apply CanvasOrigin centering and live2d-overrides.json nudges on load
    }>({
        loading: ModelLoadingState.IDLE,
        loadingStep: 'Loading model data',
        error: null,
        caption: null,
        motionProgress: 0,
        showProgressBar: false,
        isMotionPlaying: false,
        motionGroups: [],
        currentMotionGroup: null,
        currentMotionIndex: 0,
        scaleMultiplier: 0,
        focusWeight: 3,
        showHitboxDebug: false,
        loadedVoiceKeys: new Set(),
        groupAudioState: {},
        isMoveMode: false,
        isAlwaysFocus: false,
        parameters: [],
        parts: [],
        highlightHoveredPart: true,
        overriddenParams: [],
        isFrozen: false,
        motionsPaused: false,
        followParameterValues: false,
        forceLipSync: false,
        renderCaptionsOnCanvas: false,
        useCustomInitialPositioning: true,
    });

    private motionMap: Record<number, MotionData> = {};
    private voiceMap: Record<number, VoiceData> = {};
    private normalVoiceMap: Record<number, VoiceData> = {}; // Fallback for idle-only damaged variants
    private currentCharacterCode: string = '';
    private currentVariant: string = '';
    private assetBaseUrl: string = '/assets';
    private fileToMotionId: Record<string, number> = {}; // MotionFile -> MotionID mapping

    private motionMetadata: Record<string, Array<{ duration: number; fps: number; probability?: number }>> = {};
    private motionGroups: string[] = [];

    private isDragging = false;
    private isForcedDrag = false;
    private dragStart = { x: 0, y: 0 };
    private modelStart = { x: 0, y: 0 };
    private baseScale = 0.1;
    private defaultZoom = 1; // Default zoom from model metadata (Layout.Scale)
    private zoomSpring: Spring;

    private resizeObserver: ResizeObserver | null = null;

    private gestureManager: any = null;
    private pinchZoomEnabled = true;
    private directZoom: number | null = null; // When set, use this zoom value instead of spring (for hard: true updates)

    private loadId = 0;

    private cubism4Promise: Promise<void>;

    private hitAreaFrames?: any;

    private motionStartTime = 0;
    private motionDuration = 0;

    private currentAudio: HTMLAudioElement | null = null;
    private audioPromiseCache: Map<string, Promise<string>> = new Map(); // key -> Promise<BlobURL>
    private audioProgressInterval: number | null = null;
    private audioPlayPending: boolean = false; // Held while an audio-only voiceline loads and plays

    // Resolves once `this.app` is initialized. PIXI v8's Application.init() is async,
    // so anything touching `this.app` must await this first.
    private initPromise: Promise<void>;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.app = new PIXI.Application();

        this.zoomSpring = new Spring(0, { stiffness: 0.1, damping: 0.8 });

        (window as any).PIXI = PIXI;

        this.cubism4Promise = this.initializeCubism4();

        window.addEventListener('resize', this.handleResize);

        this.initPromise = this.initPixi();
        // Rejection is surfaced by whoever awaits initPromise, this only stops the
        // unhandled rejection fired when nothing is awaiting it yet.
        this.initPromise.catch(() => {});
    }

    private async initPixi() {
        // Must register before the renderer is created (app.init below), otherwise the
        // engine falls back to lazily patching the render pipe on first draw. Imported from
        // the same /cubism chunk as Live2DModel below, since each entry point bundles its
        // own copy of these classes and the render pipe's instanceof check needs them to match.
        const { Live2DPlugin } = await import('untitled-pixi-live2d-engine/cubism');
        PIXI.extensions.add(Live2DPlugin);

        const { GifSource } = await import('pixi.js/gif');
        this.GifSource = GifSource;

        // Cubism draws through raw GL calls, so the canvas fallback renderer can never work.
        // Failing here beats letting the engine throw once per frame from inside the ticker.
        if (!PIXI.isWebGLSupported()) {
            throw new Error(
                'WebGL is unavailable, so this model cannot be rendered. Please enable WebGL in your browser and reload.',
            );
        }

        const dpr = window.devicePixelRatio || 1;
        await this.app.init({
            canvas: this.canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: dpr * 2,
            autoDensity: true,
            antialias: false,
            backgroundAlpha: 0,
            preference: 'webgl',
        });

        this.startRendering();

        this.captionText = new PIXI.Text({
            text: '',
            style: {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 20,
                fill: 0xffffff,
                stroke: { color: 0x000000, width: 4 },
                align: 'center',
                wordWrap: true,
                wordWrapWidth: window.innerWidth * 0.8,
            },
        });
        this.captionText.anchor.set(0.5, 1);
        this.captionText.visible = false;
        this.app.stage.addChild(this.captionText);
        this.updateCaptionLayout();

    }

    private async initializeCubism4() {
        try {
            const { configureCubismSDK } = await import('untitled-pixi-live2d-engine/cubism');
            configureCubismSDK({ memorySizeMB: 128 });
        } catch (err) {
            throw err;
        }
    }

    private handleResize = () => {
        if (!this.app.renderer) return;

        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        if (newWidth !== this.app.renderer.width || newHeight !== this.app.renderer.height) {
            this.app.renderer.resize(newWidth, newHeight);

            this.updateCaptionLayout();
        }
    };

    // Refitting recomputes the tuned placement for the new size, so it must not run where a
    // viewer can pan or zoom, which it would discard
    private handleAutoFit = () => {
        if (!this.app.renderer || !this.model) return;

        this.handleResize();
        this.fitModelToScreen();
    };

    // An embedded canvas is resized by its parent page, which fires no window resize event
    public setAutoFitOnResize(enabled: boolean) {
        if (!enabled || this.resizeObserver || typeof ResizeObserver === 'undefined') return;

        this.resizeObserver = new ResizeObserver(this.handleAutoFit);
        this.resizeObserver.observe(this.canvas);
    }

    private updateCaptionLayout() {
        if (!this.captionText) return;

        const availableWidth = Math.max(
            0,
            this.app.screen.width - this.captionInsets.left - this.captionInsets.right
        );
        this.captionText.style.wordWrapWidth = availableWidth * 0.8;
        this.captionText.position.set(
            this.captionInsets.left + availableWidth / 2,
            this.app.screen.height - this.captionInsets.bottom - 40
        );
    }

    public setCaptionInsets(left: number, right: number, bottom: number = 0) {
        this.captionInsets = { left, right, bottom };
        this.updateCaptionLayout();
    }

    public setCanvasCaptionSuppressed(suppressed: boolean) {
        this.isCanvasCaptionSuppressed = suppressed;
    }

    private startRendering() {
        this.app.ticker.add((ticker) => {
            this.zoomSpring.update(ticker.deltaTime);

            if (this.model) {
                const zoomValue = this.directZoom !== null ? this.directZoom : this.zoomSpring.current;
                // Final Scale = Base (Fit to Screen) * Default (Layout.Scale) * UserOffset (Spring/Direct)
                const userScaleFactor = Math.pow(ZOOM_BASE, zoomValue);
                const targetScale = this.baseScale * this.defaultZoom * userScaleFactor;
                this.model.scale.set(targetScale, targetScale);
            }

            if (this.captionText) {
                if (
                    this.state.renderCaptionsOnCanvas &&
                    !this.isCanvasCaptionSuppressed &&
                    this.state.caption
                ) {
                    // Replace <> with space for canvas display (UI box uses newline instead)
                    this.captionText.text = this.state.caption.replace(/<>/g, ' ');
                    this.captionText.visible = true;
                } else {
                    this.captionText.visible = false;
                }
            }

            if (this.state.isMotionPlaying) {
                const duration = this.motionDuration;
                const elapsed = Date.now() - this.motionStartTime;
                const progress = Math.max(0, Math.min(elapsed / (duration * 1000), 1));
                this.state.motionProgress = progress;

                if (progress >= 1) {
                    this.state.isMotionPlaying = false;
                    this.state.motionProgress = 0;
                    this.state.caption = null;
                }
            } else {
                this.state.motionProgress = 0;
            }
        });
    }

    async loadCharacter(
        entry: CharacterEntry,
        variant: string = 'normal',
        motionData?: any,
        voiceData?: any,
        shouldResetZoom: boolean = true,
        assetBaseUrl: string = '/assets',
        normalVoiceData?: any,
    ): Promise<boolean> {
        const myLoadId = ++this.loadId;

        if (this.state.loading === ModelLoadingState.READY) {
            this.state.loading = ModelLoadingState.IDLE;
        }

        try {
            // Inside the try so a renderer init failure reaches the error overlay
            this.state.loadingStep = 'Starting renderer';
            await this.initPromise;
            if (this.loadId !== myLoadId) return false;

            this.stopAudio();

            this.state.loadingStep = 'Preparing viewer';
            await this.cubism4Promise;

            if (this.loadId !== myLoadId) return false;

            this.state.loading = ModelLoadingState.LOADING;
            this.state.error = null;
            this.state.motionGroups = [];

            if (shouldResetZoom) {
                this.resetZoom();
            }

            this.state.showProgressBar = false;
            this.state.isMotionPlaying = false;
            this.state.motionProgress = 0;
            this.state.caption = null;
            this.state.loadedVoiceKeys = new Set();
            this.state.groupAudioState = {};
            this.motionStartTime = 0;
            this.motionDuration = 0;

            this.audioPromiseCache.forEach(async (p) => {
                try {
                    const url = await p;
                    URL.revokeObjectURL(url);
                } catch (err) {
                    // Silently ignore revocation errors
                }
            });
            this.audioPromiseCache.clear();

            // Note: We DO NOT cleanup the previous model yet to prevent flickering.
            // We verify the new model fully loads first (Swap pattern).

            // Use directory if present (from extract-live2d.py), else fall back to code
            const dirName = entry.directory || entry.code;
            this.currentCharacterCode = entry.code;
            this.assetBaseUrl = assetBaseUrl;

            const basePath = `${assetBaseUrl}/models/${dirName}/${variant}`;
            const modelUrl = `${basePath}/${dirName}.model3.json`;

            this.state.loadingStep = 'Loading textures';

            const { Live2DModel } = await import('untitled-pixi-live2d-engine/cubism');

            if (this.loadId !== myLoadId) return false;

            // Load model via URL with custom interaction (focus only on left click down)
            let newModel: any;
            try {
                newModel = await Live2DModel.from(modelUrl, {
                    autoHitTest: false,
                    autoFocus: false,
                    lipSyncGain: 1.0,
                    lipSyncWeight: 0.4,
                });
            } catch (loadErr: any) {
                throw new Error(`Failed to load Live2D model: ${loadErr.message}`);
            }

            if (this.loadId !== myLoadId) {
                newModel.destroy({ children: true });
                return false;
            }

            this.state.loadingStep = 'Loading animations';

            this.cleanupModel();
            this.model = newModel;
            this.modelUrl = modelUrl;
            this.currentCharacterCode = entry.code;
            this.currentVariant = variant;

            this.extractDefaultZoom();

            this.extractMotionGroupsFromModel();

            const currentModel = this.model;
            if (!currentModel) throw new Error('Model not initialized during setup');

            const motionManager = (currentModel.internalModel as unknown as ExtendedInternalModel).motionManager;

            const allMotionLoadPromises: Promise<any>[] = [];
            for (const groupName of this.motionGroups) {
                const definitions = motionManager.definitions[groupName];
                if (definitions) {
                    const motionArray = Array.isArray(definitions) ? definitions : [definitions];
                    for (let i = 0; i < motionArray.length; i++) {
                        allMotionLoadPromises.push(
                            motionManager.loadMotion(groupName, i).catch((err: any) => {
                                throw new Error(`Failed to load motion ${groupName}[${i}]: ${err.message}`);
                            }),
                        );
                    }
                }
            }

            await Promise.all(allMotionLoadPromises);

            if (this.loadId !== myLoadId) return false; // Should have been caught by cleanup check logic if we swapped earlier, but good for safety if we add async steps.

            await Promise.all([
                this.extractMotionDurationsFromModel(), // Uses this.model
                this.loadMotionData(entry, motionData),
                this.loadVoiceData(String(entry.id), voiceData, normalVoiceData),
            ]);

            this.preloadAllVoiceLines();

            this.state.loadingStep = 'Setting up';
            this.state.motionGroups = [...this.motionGroups]; // Update UI now that metadata is ready

            // Borrowed and idle-only voicelines play as bare audio, so nothing else would move the mouth.
            const isIdleOnly =
                this.motionGroups.length === 0 || (this.motionGroups.length === 1 && this.motionGroups[0] === 'Idle');
            this.setForceLipSync(isIdleOnly || this.shouldBorrowNormalVoice());

            this.app.stage.addChild(this.model!);
            if (this.captionText) {
                this.app.stage.addChild(this.captionText);
            }
            this.fitModelToScreen();
            this.setupInteraction();
            this.setupGestureManager();

            this.state.loadingStep = '';
            this.state.loading = ModelLoadingState.READY;

            this.refreshParametersState();
            this.refreshPartsState();

            return true;
        } catch (err: any) {
            // A superseded load's error is irrelevant, only the current one surfaces to the UI.
            if (this.loadId === myLoadId) {
                this.state.error = err.message;
                this.state.loading = ModelLoadingState.ERROR;
            }
            return false;
        }
    }

    private extractDefaultZoom() {
        // We must access internalModel.settings.json (raw) to find it reliably.
        const model = this.model;
        if (!model) return; // Should not happen if called correctly

        const internalModel = model.internalModel;
        if (!internalModel || !internalModel.settings) {
            throw new Error('Model internal structure not ready for zoom extraction');
        }

        const settings = internalModel.settings as unknown as ExtendedModelSettings;
        let scale: number | undefined;

        // Try to access raw JSON if available (settings.json is typed as JSONObject in library)
        const rawJson = settings.json;

        if (rawJson) {
            // 1. Cubism 3/4: FileReferences.Layout.Scale
            if (rawJson.FileReferences && rawJson.FileReferences.Layout) {
                const rawLayout = rawJson.FileReferences.Layout;
                if (typeof rawLayout.Scale === 'number') {
                    scale = rawLayout.Scale;
                }
            }

            // 2. Cubism 2: layout.scale (or Layout.Scale depending on legacy format)
            if (scale === undefined && rawJson.layout) {
                if (typeof rawJson.layout.scale === 'number') scale = rawJson.layout.scale;
                else if (typeof rawJson.layout.Scale === 'number') scale = rawJson.layout.Scale;
            }
        }

        // 3. Normalized fallback (unlikely to work for Scale but good hygiene)
        if (scale === undefined && settings.layout) {
            if (typeof settings.layout.scale === 'number') scale = settings.layout.scale;
            else if (typeof settings.layout.Scale === 'number') scale = settings.layout.Scale;
        }

        if (typeof scale !== 'number') {
            throw new Error('Layout.Scale not found in model metadata (raw JSON check failed)');
        }

        this.defaultZoom = scale;
    }

    private extractMotionGroupsFromModel() {
        const model = this.model;
        if (!model) return;

        const internalModel = model.internalModel;
        if (!internalModel) throw new Error('Model internal structure not ready');

        if (!internalModel.motionManager || !internalModel.motionManager.definitions) {
            throw new Error('Motion manager definitions not available');
        }

        this.motionGroups = Object.keys(internalModel.motionManager.definitions);
    }

    private async extractMotionDurationsFromModel() {
        const model = this.model;
        if (!model) return;

        const internalModel = model.internalModel;
        if (!internalModel || !internalModel.motionManager) {
            throw new Error('Motion manager not available on model');
        }

        const motionManager = internalModel.motionManager;

        // Loaded motions are stored in motionGroups (structure: Record<groupName, (Motion | undefined | null)[]>)
        if (!motionManager.motionGroups) {
            throw new Error('motionGroups not available on motion manager');
        }

        for (const groupName of this.motionGroups) {
            const loadedMotions = motionManager.motionGroups[groupName];
            if (!loadedMotions) {
                throw new Error(`No loaded motions found for group: ${groupName}`);
            }

            if (loadedMotions.length === 0) {
                throw new Error(
                    `No motions loaded for group ${groupName}. motionGroups content: ${JSON.stringify(Object.keys(motionManager.motionGroups || {}))}`,
                );
            }

            this.motionMetadata[groupName] = [];

            for (let i = 0; i < loadedMotions.length; i++) {
                const motion = loadedMotions[i];

                if (!motion) {
                    throw new Error(
                        `Motion ${groupName}[${i}] is ${motion === null ? 'null (failed to load)' : 'undefined (not loaded)'}`,
                    );
                }

                const internalMotion = motion as unknown as PrivateMotion;
                if (!internalMotion._motionData || internalMotion._motionData.duration === undefined) {
                    throw new Error(
                        `Motion ${groupName}[${i}] has no _motionData.duration. Keys: ${Object.keys(motion || {}).join(', ')}`,
                    );
                }

                const duration = internalMotion._motionData.duration;
                if (duration <= 0) {
                    throw new Error(`Invalid duration for ${groupName}[${i}]: ${duration}`);
                }

                this.motionMetadata[groupName].push({ duration, fps: 30 });
            }
        }

    }

    private async loadMotionData(entry: CharacterEntry, motionData?: any) {
        if (!motionData) {
            throw new Error('Motion data not provided by server');
        }
        if (Object.keys(motionData).length === 0) {
            throw new Error('Motion data is empty for model ' + entry.id);
        }

        // motionData is already pre-filtered by model ID and variant on the server
        // Structure: { motionId -> MotionData }
        const modelMotions = motionData;

        this.motionMap = {};
        this.fileToMotionId = {};

        for (const m of Object.values(modelMotions)) {
            const motion = m as MotionData;
            this.motionMap[motion.id] = motion;

            // Build file -> motion ID map for onMotionStart lookup
            // motions.json stores: "motions/touch_1.mtn"
            // model3.json uses: "motions/touch_1.motion3.json"
            // Convert to .motion3.json format for lookup
            if (motion.motion_name) {
                const motion3Path = motion.motion_name.replace('.mtn', '.motion3.json');
                this.fileToMotionId[motion3Path] = motion.id;

                const basename3 = (motion.motion_name.split('/').pop() || '').replace('.mtn', '.motion3.json');
                this.fileToMotionId[basename3] = motion.id;
            }

            // Build probability lookup by group and index
            // Parse group and index from motion data (need to get from model during loading)
        }

    }

    private async loadVoiceData(modelId: string, voiceData?: any, normalVoiceData?: any) {
        if (!voiceData) {
            throw new Error('Voice data not provided by server for model ' + modelId);
        }

        // voiceData is already pre-filtered by model ID and variant on the server
        // Structure: { motionId -> { voice_key, caption } }
        if (typeof voiceData !== 'object') {
            throw new Error('Invalid voice data structure: expected object, got ' + typeof voiceData);
        }

        this.voiceMap = voiceData;
        this.normalVoiceMap = typeof normalVoiceData === 'object' && normalVoiceData ? normalVoiceData : {};
    }

    private bgTransform = { x: 0, y: 0, scale: 1 };

    public async setBackground(url: string | null): Promise<void> {
        await this.initPromise;

        // Cleanup old sprite. Its texture is owned by Assets (loaded via Assets.load below),
        // so release it through Assets.unload rather than destroying the texture directly.
        if (this.bgSprite) {
            this.app.stage.removeChild(this.bgSprite);
            this.bgSprite.destroy({ children: true });
            this.bgSprite = null;
        }
        if (this.bgUrl) {
            await PIXI.Assets.unload(this.bgUrl).catch(() => {});
            this.bgUrl = null;
        }

        if (!url) return;

        try {
            // Texture.fromURL doesn't exist in Pixi v8; Assets.load is the replacement.
            const resource = await PIXI.Assets.load(url);

            // GIFs load as a GifSource, not a Texture, and need GifSprite to animate.
            const { GifSprite } = await import('pixi.js/gif');
            this.bgSprite =
                this.GifSource && resource instanceof this.GifSource
                    ? new GifSprite({ source: resource })
                    : new PIXI.Sprite(resource);
            this.bgUrl = url;
            this.bgSprite.anchor.set(0.5);
            this.applyBackgroundTransform();

            this.app.stage.addChildAt(this.bgSprite, 0);
        } catch (err) {
            // Silently ignore background loading errors
        }
    }

    public updateBackground(x: number, y: number, scale: number) {
        this.bgTransform = { x, y, scale };
        this.applyBackgroundTransform();
    }

    private applyBackgroundTransform() {
        if (!this.bgSprite) return;

        const screenW = this.app.screen.width;
        const screenH = this.app.screen.height;
        const centerX = screenW / 2;
        const centerY = screenH / 2;

        const { x, y, scale } = this.bgTransform;

        this.bgSprite.position.set(centerX + x, centerY + y);
        this.bgSprite.scale.set(scale);
    }

    // moc3 "repeat" params should wrap at min/max instead of clamping. The SDK defaults to
    // overriding that flag off, so we opt in to let moc3-authored repeat parameters wrap.
    private setupRepeatParameters(model: Live2DModel) {
        const coreModel = (model.internalModel as unknown as ExtendedInternalModel).coreModel;
        coreModel?.setOverrideFlagForModelParameterRepeat?.(false);
    }

    private setupInteraction() {
        const model = this.model;
        if (!model) return;

        model.eventMode = 'static';

        model.automator.autoHitTest = true;

        if (this.state.isAlwaysFocus) {
            window.addEventListener('pointermove', this.handleGlobalPointerMove);
            window.addEventListener('touchmove', this.handleGlobalTouchMove, { passive: false });
        } else {
            if (model.internalModel?.focusController) {
                model.internalModel.focusController.focus(0, 0, true);
            }
        }

        model.on('pointerdown', (event: any) => {
        });

        model.on('pointerup', this.handleGlobalPointerUp);
        window.addEventListener('pointerup', this.handleGlobalPointerUp);

        if (this.state.isAlwaysFocus) {
            window.removeEventListener('pointermove', this.handleGlobalPointerMove);
            window.addEventListener('pointermove', this.handleGlobalPointerMove);
            window.addEventListener('touchmove', this.handleGlobalTouchMove, { passive: false });
        } else {
            model.internalModel.focusController.focus(0, 0, true);
        }

        model.on('hit', (hitAreas: string[]) => {
            if (this.state.showProgressBar) {
                return;
            }
            this.state.showProgressBar = true;
            this.state.isMotionPlaying = true;
            this.motionStartTime = Date.now();
            this.handleTap(hitAreas);
        });

        this.setupRepeatParameters(model);

        (model.internalModel as unknown as ExtendedInternalModel).on('afterMotionUpdate', () => {
            if (!this.state.showProgressBar || !this.motionStartTime) return;

            const elapsed = Date.now() - this.motionStartTime;
            const durationMs = this.motionDuration * 1000;
            const threshold = durationMs + 50;

            if (elapsed >= threshold) {
                this.motionStartTime = 0;
                setTimeout(() => {
                    this.state.showProgressBar = false;
                    this.state.isMotionPlaying = false;
                    this.state.motionProgress = 0;
                }, 50);
            }
        });
    }

    private async setupGestureManager() {
        // Client-only: interact.js requires browser APIs
        if (!this.model || typeof window === 'undefined') return;

        try {
            const interact = (await import('interactjs')).default;

            let isGestureActive = false; // Track which action is active to prevent conflicts

            const canvasElement = this.canvas;

            let pinchStartScaleMultiplier = 0; // Track UI target zoom at gesture start
            interact(canvasElement)
                .gesturable({})
                .on('gesturestart', (event: any) => {
                    if (!this.model || !this.state.isMoveMode || !this.pinchZoomEnabled) {
                        event.preventDefault();
                        return;
                    }
                    isGestureActive = true;
                    // Start from the rendered value so interrupting a slider animation cannot jump.
                    pinchStartScaleMultiplier = this.getCurrentZoom();
                })
                .on('gesturemove', (event: any) => {
                    if (!this.model || !this.state.isMoveMode || !this.pinchZoomEnabled || !isGestureActive) return;

                    // No limits here - model can zoom to any level, only UI slider has limits
                    const scaleFactor = Math.pow(ZOOM_BASE, pinchStartScaleMultiplier);
                    const gestureScale = scaleFactor * event.scale;
                    const targetScaleMultiplier = Math.log(gestureScale) / Math.log(ZOOM_BASE);

                    const rect = this.canvas.getBoundingClientRect();
                    this.zoomAtPoint(
                        targetScaleMultiplier,
                        event.clientX - rect.left,
                        event.clientY - rect.top,
                    );
                })
                .on('gestureend', (event: any) => {
                    if (!isGestureActive) return;
                    isGestureActive = false;
                    pinchStartScaleMultiplier = 0;
                    // The hard updates keep the spring synchronised, so releasing never rebounds.
                    this.directZoom = null;
                });

            this.gestureManager = { destroy: () => { } }; // Placeholder for cleanup compatibility
        } catch (err) {
            // Silently ignore gesture manager initialization errors
        }
    }

    // model3.json group names (TapHead/TapBody/etc) don't reliably match their touch_area,
    // so resolve hit areas via STC's own touch_area and is_hurt fields instead.
    private findGroupsForHitArea(area: string): string[] {
        const model = this.model;
        if (!model) return [];

        const definitions = model.internalModel.motionManager.definitions as Record<string, any[]>;
        const isHurtVariant = this.currentVariant !== 'normal';

        const matchingFiles = new Set(
            Object.values(this.motionMap)
                .filter((m) => m.touch_area === area && Boolean(m.is_hurt) === isHurtVariant)
                .map((m) => (m.motion_name.split('/').pop() || '').replace('.mtn', '.motion3.json'))
        );
        if (matchingFiles.size === 0) return [];

        const groups: string[] = [];
        for (const [groupName, defs] of Object.entries(definitions)) {
            const groupFiles = defs.map((def) => (def.File.split('/').pop() || ''));
            if (groupFiles.some((f) => matchingFiles.has(f))) {
                groups.push(groupName);
            }
        }
        return groups;
    }

    private handleTap(hitAreas: string[]) {
        const model = this.model;
        if (hitAreas.length === 0 || !model) {
            this.stopAudioProgress(); // Release the slot the hit handler claimed
            return;
        }

        const isIdleOnly = this.motionGroups.length === 0 ||
            (this.motionGroups.length === 1 && this.motionGroups[0] === 'Idle');

        // Hit area names are arbitrary, so a lone "head" box may still cover the whole model
        const hasTouchMotion = hitAreas.some((area) => this.findGroupsForHitArea(area).length > 0);

        if ((isIdleOnly || this.shouldBorrowNormalVoice()) && !hasTouchMotion) {
            const unmappedVoicelines = this.getUnmappedVoicelines();
            if (unmappedVoicelines.length > 0) {
                const randomIndex = Math.floor(Math.random() * unmappedVoicelines.length);
                const voiceline = unmappedVoicelines[randomIndex];
                // Hit handler already claimed the playback slot, so hold it across the async audio load
                this.playAudioOnly(voiceline.motionId);
                return;
            }
        }

        const groupWeights: Record<string, number> = {};

        for (const area of hitAreas) {
            const groupNamesForArea = this.findGroupsForHitArea(area);

            for (const groupName of groupNamesForArea) {
                const definitions = (model.internalModel.motionManager.definitions as any)[groupName];
                if (!definitions || definitions.length === 0) continue;

                const weights = definitions.map((def: any) => {
                    const meta = this.findMotionMetadata(def.File);
                    return meta?.probability ?? 1.0;
                });
                const avgWeight = weights.reduce((a: number, b: number) => a + b, 0) / weights.length;
                groupWeights[groupName] = avgWeight;
            }
        }

        const groupNames = Object.keys(groupWeights);
        if (groupNames.length === 0) {
            this.stopAudioProgress(); // Release the slot the hit handler claimed
            return;
        }

        const totalWeight = Object.values(groupWeights).reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        let selectedGroupName = groupNames[0];

        for (const groupName of groupNames) {
            random -= groupWeights[groupName];
            if (random <= 0) {
                selectedGroupName = groupName;
                break;
            }
        }

        const definitions = (model.internalModel.motionManager.definitions as any)[selectedGroupName];
        let selectedIndex = 0;

        const candidates = definitions.map((def: any, index: number) => {
            const file = def.File;
            const meta = this.findMotionMetadata(file);
            return { index, prob: meta?.probability ?? 1.0 };
        });

        const motionTotalWeight = candidates.reduce((sum: number, c: any) => sum + c.prob, 0);
        let motionRandom = Math.random() * motionTotalWeight;

        for (const c of candidates) {
            motionRandom -= c.prob;
            if (motionRandom <= 0) {
                selectedIndex = c.index;
                break;
            }
        }

        this.state.currentMotionGroup = selectedGroupName;
        this.state.currentMotionIndex = selectedIndex;

        this.motionDuration = this.getMotionDuration(selectedGroupName, selectedIndex);

        let audioUrl: string | undefined;
        const def = definitions[selectedIndex];
        if (def && def.File) {
            let motionId = this.findMotionId(def.File);

            if (motionId !== undefined && this.voiceMap[motionId]?.voice_key) {
                const voice = this.voiceMap[motionId];
                this.state.caption = voice.caption;
                audioUrl = this.getAudioUrl(voice.char_code, voice.voice_key);
            } else {
                this.state.caption = null;
            }
        }

        model.motion(selectedGroupName, selectedIndex, 2, { loop: false }).then(() => {
            const audioDelay = this.resolveAudioDelay(def?.File);

            if (audioUrl) {
                const playAudioWithDelay = async () => {
                    if (audioDelay > 0) {
                        await new Promise((resolve) => setTimeout(resolve, audioDelay * 1000));
                    }
                    try {
                        if (this.currentAudio) {
                            this.currentAudio.pause();
                            this.currentAudio = null;
                        }
                        const blobUrl = await this.loadAudio(audioUrl);
                        const audio = new Audio(blobUrl);
                        this.currentAudio = audio;
                        audio.volume = 0.5;
                        await audio.play();
                        audio.onended = () => {
                            if (this.currentAudio === audio) {
                                this.currentAudio = null;
                            }
                        };
                    } catch (err) {
                        // Silently ignore audio playback errors
                    }
                };
                playAudioWithDelay();
            }
        });
    }

    private findMotionId(filePath: string): number | undefined {
        if (this.fileToMotionId[filePath]) {
            return this.fileToMotionId[filePath];
        }

        const basename = filePath.split('/').pop() || '';
        if (this.fileToMotionId[basename]) {
            return this.fileToMotionId[basename];
        }

        const jsonPath = filePath.replace('.mtn', '.motion3.json');
        if (this.fileToMotionId[jsonPath]) {
            return this.fileToMotionId[jsonPath];
        }

        return undefined;
    }

    private getAudioUrl(charCode: string, voiceKey: string): string {
        // charCode is STC's own voice bank id, which can differ from the skin code (e.g. HK416_0).
        const baseId = (charCode || this.currentCharacterCode.split('_')[0]).toUpperCase();

        return `${this.assetBaseUrl}/audio/${baseId}/${baseId}_${voiceKey}_JP.ogg`;
    }

    private async loadAudio(url: string): Promise<string> {
        if (this.audioPromiseCache.has(url)) {
            return this.audioPromiseCache.get(url)!;
        }

        const promise = (async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                return blobUrl;
            } catch (err) {
                const fallbackUrl = this.getFallbackAudioUrl(url);
                if (fallbackUrl && fallbackUrl !== url) {
                    try {
                        const fallbackResponse = await fetch(fallbackUrl);
                        if (!fallbackResponse.ok)
                            throw new Error(`Failed to fetch audio: ${fallbackResponse.statusText}`);
                        const blob = await fallbackResponse.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        return blobUrl;
                    } catch (fallbackErr) {
                        this.audioPromiseCache.delete(url);
                        throw fallbackErr;
                    }
                }

                this.audioPromiseCache.delete(url); // Remove failed promise so we can retry
                throw err;
            }
        })();

        this.audioPromiseCache.set(url, promise);
        return promise;
    }

    private getFallbackAudioUrl(originalUrl: string): string {
        // URL format: {assetBaseUrl}/audio/{baseId}/{baseId}_{voiceKey}_JP.ogg
        const voiceKeyPattern = /_([A-Z0-9_]+)_JP\.ogg$/i;
        const match = originalUrl.match(voiceKeyPattern);

        if (!match) {
            return originalUrl; // Invalid format, return original
        }

        const voiceKey = match[1];

        let baseId = this.currentCharacterCode.split('_')[0].toUpperCase();

        let fallbackBaseId: string;
        if (baseId.toUpperCase().endsWith('MOD')) {
            fallbackBaseId = baseId.slice(0, -3);
        } else {
            fallbackBaseId = baseId + 'MOD';
        }

        return `${this.assetBaseUrl}/audio/${fallbackBaseId}/${fallbackBaseId}_${voiceKey}_JP.ogg`;
    }

    private async preloadAllVoiceLines() {
        const promises: Promise<void>[] = [];

        for (const voice of Object.values(this.voiceMap)) {
            if (voice.voice_key) {
                const url = this.getAudioUrl(voice.char_code, voice.voice_key);

                const voiceKey = voice.voice_key;
                this.loadAudio(url)
                    .then(() => {
                        this.state.loadedVoiceKeys.add(voiceKey);
                        this.updateGroupAudioState(voiceKey);
                    })
                    .catch(() => { });

                promises.push(
                    this.loadAudio(url)
                        .then(() => { })
                        .catch(() => { }),
                );
            }
        }

        await Promise.allSettled(promises);
    }

    private updateGroupAudioState(loadedKey: string) {
        // Keyed per group+index since each motion variant is its own button in the grid.
        const model = this.model;
        if (!model) return;

        for (const group of this.motionGroups) {
            const defs = (model.internalModel.motionManager.definitions as any)[group];
            if (!defs) continue;

            for (let index = 0; index < defs.length; index++) {
                const key = `${group}:${index}`;
                if (this.state.groupAudioState[key]) continue; // Already loaded

                const file = defs[index]?.File;
                if (!file) continue;

                const motionId = this.findMotionId(file);
                if (motionId && this.voiceMap[motionId]?.voice_key === loadedKey) {
                    this.state.groupAudioState[key] = true;
                }
            }
        }
    }

    private async playVoice(voiceKey: string) {
        this.stopAudio();

        if (!voiceKey) {
            return;
        }

        try {
            const url = this.getAudioUrl('', voiceKey);
            const blobUrl = await this.loadAudio(url);

            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio = null;
            }

            const audio = new Audio(blobUrl);
            this.currentAudio = audio;

            try {
                await audio.play();
            } catch (e) {
                // Silently ignore autoplay failures
            }

            audio.onended = () => {
                if (this.currentAudio === audio) {
                    this.currentAudio = null;
                }
            };
        } catch (err) {
            // Silently ignore voice playback errors
        }
    }

    private stopAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        this.model?.stopSpeaking();
    }

    async playAudioOnly(motionId: number) {
        // Claim the slot before any await, else rapid taps race through during the audio fetch
        if (this.audioPlayPending) return;
        this.audioPlayPending = true;
        this.state.showProgressBar = true;
        this.state.isMotionPlaying = true;

        const voice = this.voiceMap[motionId] || this.normalVoiceMap[motionId];
        if (!voice || !voice.voice_key) {
            this.stopAudioProgress();
            return;
        }

        const model = this.model;
        if (!model) {
            this.stopAudioProgress();
            return;
        }

        try {
            const url = this.getAudioUrl(voice.char_code, voice.voice_key);
            const blobUrl = await this.loadAudio(url);

            this.stopAudio();

            // Use the library's own speak() so it drives lipsync through its analyser,
            // rather than a plain HTMLAudioElement the library's update loop doesn't see.
            const played = await model.speak(blobUrl, {
                volume: 0.5,
                onFinish: () => this.stopAudioProgress(),
                onError: (err: Error) => {
                    console.error('[Controller] Audio playback error:', err);
                    this.stopAudioProgress();
                }
            });

            if (!played) {
                this.stopAudioProgress();
                return;
            }

            const audioDuration = (model.internalModel?.motionManager as any)?.currentAudio?.duration ?? 0;

            this.state.showProgressBar = true;
            this.state.isMotionPlaying = true;
            this.state.caption = voice.caption;
            this.motionStartTime = Date.now();
            this.motionDuration = audioDuration;

            if (this.audioProgressInterval !== null) {
                clearInterval(this.audioProgressInterval);
            }

            this.audioProgressInterval = window.setInterval(() => {
                const audio = (model.internalModel?.motionManager as any)?.currentAudio;
                if (!audio || !audio.isPlaying) {
                    this.stopAudioProgress();
                    return;
                }

                const elapsed = Date.now() - this.motionStartTime;
                const progress = audioDuration > 0 ? Math.min(elapsed / (audioDuration * 1000), 1) : 0;
                this.state.motionProgress = progress;

                if (progress >= 1) {
                    this.stopAudioProgress();
                }
            }, 100);

        } catch (err) {
            console.error('[Controller] Failed to play audio-only:', err);
            this.stopAudioProgress();
        }
    }

    private stopAudioProgress() {
        this.audioPlayPending = false;
        if (this.audioProgressInterval !== null) {
            clearInterval(this.audioProgressInterval);
            this.audioProgressInterval = null;
        }
        const motionManager = this.model?.internalModel?.motionManager as any;
        if (motionManager) {
            motionManager.currentAudio = null;
        }
        this.state.showProgressBar = false;
        this.state.isMotionPlaying = false;
        this.state.motionProgress = 0;
        this.state.caption = null;
        this.motionStartTime = 0;
        this.motionDuration = 0;
    }

    // A damaged variant with zero voice rows is an STC gap, not a silent character, so normal's lines stand in.
    private shouldBorrowNormalVoice(): boolean {
        if (this.currentVariant === 'normal') return false;
        const hasOwnVoice = Object.values(this.voiceMap).some((v) => v && v.voice_key);
        return !hasOwnVoice;
    }

    getUnmappedVoicelines(): Array<{ motionId: number; voice_key: string; caption: string }> {
        const unmappedMap = new Map<string, { motionId: number; voice_key: string; caption: string }>();

        for (const [motionIdStr, voice] of Object.entries(this.voiceMap)) {
            const motionId = Number(motionIdStr);
            const motionData = this.motionMap[motionId];

            if (!voice || !voice.voice_key) continue;

            if (motionData && motionData.motion_name && motionData.motion_name !== 'motions/idle.mtn' && motionData.motion_name !== 'motions/daiji.mtn' && motionData.motion_name !== 'motions/daiji_idle_01.mtn') {
                continue;
            }

            if (!unmappedMap.has(voice.voice_key)) {
                unmappedMap.set(voice.voice_key, {
                    motionId,
                    voice_key: voice.voice_key,
                    caption: voice.caption || voice.voice_key
                });
            }
        }

        if (unmappedMap.size === 0 && this.shouldBorrowNormalVoice()) {
            for (const [motionIdStr, voice] of Object.entries(this.normalVoiceMap)) {
                const motionId = Number(motionIdStr);
                if (!voice || !voice.voice_key) continue;
                if (!unmappedMap.has(voice.voice_key)) {
                    unmappedMap.set(voice.voice_key, {
                        motionId,
                        voice_key: voice.voice_key,
                        caption: voice.caption || voice.voice_key
                    });
                }
            }
        }

        return Array.from(unmappedMap.values());
    }

    private findMotionMetadata(file: string): MotionData | undefined {
        // file: "motions/touch_1.mtn"
        const motionId = this.fileToMotionId[file] || this.fileToMotionId[file.split('/').pop() || ''];
        if (motionId) {
            return this.motionMap[motionId];
        }
        return undefined;
    }

    private resolveAudioDelay(file: string | undefined): number {
        const meta = file ? this.findMotionMetadata(file) : undefined;
        return meta ? meta.delay / 1000 : 0;
    }

    getMotionGroups(): string[] {
        return this.motionGroups;
    }

    getMotionCountForGroup(groupName: string): number {
        return this.motionMetadata[groupName]?.length ?? 0;
    }

    getMotionVariants(groupName: string): Array<{ index: number; label: string }> {
        const count = this.getMotionCountForGroup(groupName);
        const definitions = (this.model?.internalModel.motionManager.definitions as any)?.[groupName];
        const variants = [];
        for (let i = 0; i < count; i++) {
            variants.push({
                index: i,
                label: this.getMotionLabel(groupName, i, definitions?.[i]?.File),
            });
        }
        return variants;
    }

    // model3.json group names don't reliably match their touch_area content, so label from STC instead.
    private getMotionLabel(groupName: string, index: number, file: string | undefined): string {
        const fallback = `${groupName} ${this.getMotionCountForGroup(groupName) > 1 ? index + 1 : ''}`;
        if (!file) return fallback;

        const meta = this.findMotionMetadata(file);
        if (!meta || !meta.touch_area || meta.touch_area === '0') return fallback;

        const area = meta.touch_area.charAt(0).toUpperCase() + meta.touch_area.slice(1);
        const sameAreaCount = Object.values(this.motionMap).filter(
            (m) => m.touch_area === meta.touch_area && Boolean(m.is_hurt) === Boolean(meta.is_hurt)
        ).length;
        const sameAreaIndex = Object.values(this.motionMap)
            .filter((m) => m.touch_area === meta.touch_area && Boolean(m.is_hurt) === Boolean(meta.is_hurt))
            .findIndex((m) => m.id === meta.id);

        return `${area} ${sameAreaCount > 1 ? sameAreaIndex + 1 : ''}`;
    }

    private getMotionDuration(groupName: string, index: number): number {
        const metadata = this.motionMetadata[groupName];
        if (!metadata || !metadata[index]) {
            throw new Error(`[Motion Duration] No metadata found for ${groupName}[${index}]`);
        }

        const duration = metadata[index].duration;
        if (duration <= 0) {
            throw new Error(`[Motion Duration] Invalid duration for ${groupName}[${index}]: ${duration}`);
        }

        return duration;
    }

    private async playMotionWithAudio(groupName: string, motionIndex: number) {
        if (!this.model) return;

        const definitions = (this.model.internalModel.motionManager.definitions as any)[groupName];
        if (!definitions || !definitions[motionIndex]) return;

        const def = definitions[motionIndex];
        if (!def.File) return;

        const motionId = this.findMotionId(def.File);
        let audioUrl: string | undefined;

        if (motionId !== undefined && this.voiceMap[motionId]?.voice_key) {
            const voice = this.voiceMap[motionId];
            this.state.caption = voice.caption;
            audioUrl = this.getAudioUrl(voice.char_code, voice.voice_key);
        } else {
            this.state.caption = null;
        }

        const audioDelay = this.resolveAudioDelay(def.File);

        if (this.model?.internalModel) {
            (this.model.internalModel as any).lipSync = this.state.forceLipSync;
        }

        if (this.state.forceLipSync && audioUrl) {
            const blobUrl = await this.loadAudio(audioUrl);

            if (audioDelay > 0) {
                await new Promise((resolve) => setTimeout(resolve, audioDelay * 1000));
            }

            await this.model.motion(groupName, motionIndex, 2, { sound: blobUrl, volume: 0.5, loop: false });
        } else {
            // Without library lip sync, audio isn't tied to the motion call so timing is handled manually below
            await this.model.motion(groupName, motionIndex, 2, { loop: false });

            if (audioUrl) {
                const playAudioWithDelay = async () => {
                    try {
                        const blobUrl = await this.loadAudio(audioUrl);

                        if (audioDelay > 0) {
                            await new Promise((resolve) => setTimeout(resolve, audioDelay * 1000));
                        }

                        if (this.currentAudio) {
                            this.currentAudio.pause();
                            this.currentAudio = null;
                        }

                        const audio = new Audio(blobUrl);
                        this.currentAudio = audio;
                        audio.volume = 0.5;
                        await audio.play();
                        audio.onended = () => {
                            if (this.currentAudio === audio) {
                                this.currentAudio = null;
                            }
                        };
                    } catch (err) {
                        console.error(`[Live2D] Error playing audio:`, err);
                    }
                };
                playAudioWithDelay();
            }
        }
    }

    async playMotionGroup(groupName: string, index?: number) {
        if (!this.model) return;
        if (this.state.showProgressBar) {
            return;
        }
        const motionIndex = index ?? 0;

        this.motionDuration = this.getMotionDuration(groupName, motionIndex);

        this.state.showProgressBar = true;
        this.state.isMotionPlaying = true;
        this.state.motionsPaused = false;
        this.state.currentMotionGroup = groupName;
        this.state.currentMotionIndex = motionIndex;
        this.motionStartTime = Date.now();

        await this.playMotionWithAudio(groupName, motionIndex);
    }

    setForceLipSync(enabled: boolean) {
        this.state.forceLipSync = enabled;
        if (this.model?.internalModel) {
            (this.model.internalModel as any).lipSync = enabled;
        }
    }

    setZoom(multiplier: number, options?: { hard?: boolean }) {
        this.state.scaleMultiplier = multiplier;
        if (options?.hard) {
            // Direct inputs stay synchronised with the spring so releasing a gesture cannot rebound.
            this.directZoom = multiplier;
            this.zoomSpring.set(multiplier, { instant: true });
        } else {
            this.directZoom = null;
            this.zoomSpring.set(multiplier);
        }
    }

    // Keeps the canvas point under the cursor or pinch midpoint fixed while the model scales
    zoomAtPoint(multiplier: number, x: number, y: number) {
        if (!this.model) {
            this.setZoom(multiplier, { hard: true });
            return;
        }

        const ratio = Math.pow(ZOOM_BASE, multiplier - this.getCurrentZoom());
        this.model.position.set(
            x + (this.model.position.x - x) * ratio,
            y + (this.model.position.y - y) * ratio,
        );
        this.setZoom(multiplier, { hard: true });
    }

    getCurrentZoom() {
        return this.directZoom ?? this.zoomSpring.current;
    }

    setPinchZoomEnabled(enabled: boolean) {
        this.pinchZoomEnabled = enabled;
    }

    resetZoom() {
        this.setZoom(0, { hard: true });
    }

    startDrag(x: number, y: number, force: boolean = false) {
        if (!this.model) return;

        this.dragStart = { x, y };
        this.modelStart = { x: this.model.position.x, y: this.model.position.y };

        if (force || this.state.isMoveMode) {
            this.isDragging = true;
            this.isForcedDrag = force;
        }
    }

    handleDrag(x: number, y: number) {
        if (!this.model) return;

        if (this.isDragging && (this.state.isMoveMode || this.isForcedDrag)) {
            const dx = x - this.dragStart.x;
            const dy = y - this.dragStart.y;
            this.model.position.set(this.modelStart.x + dx, this.modelStart.y + dy);
        } else {
            this.processMove(x, y);
        }
    }

    endDrag() {
        this.isDragging = false;
        this.isForcedDrag = false;
    }

    // untitled-pixi-live2d-engine's own HitAreaFrames tool extends Graphics and calls
    // addChild on itself, which Pixi v8 no longer allows (only Containers may have children).
    // Draw the same rectangles + labels ourselves, rooted in a real Container instead.
    async toggleHitboxDebug(enable: boolean) {
        const model = this.model;
        if (!model) return;

        if (enable && !this.hitAreaFrames) {
            const frames = new PIXI.Container();
            const graphics = new Graphics();
            frames.addChild(graphics);

            const internalModel = (model.internalModel as unknown as ExtendedInternalModel) as any;
            const hitAreaNames = Object.keys(internalModel.hitAreas ?? {});
            const texts = hitAreaNames.map((name) => {
                const text = new PIXI.Text({
                    text: name,
                    style: { fontSize: 24, fill: '#ffffff', stroke: { color: '#000000', width: 4 } },
                });
                frames.addChild(text);
                return text;
            });

            const strokeWidth = 4;
            const normalColor = 0xe31a1a;
            const activeColor = 0x1ec832;
            const tickerCallback = () => {
                const activeAreas = new Set(
                    model.hitTest(
                        this.app.renderer.events.pointer.global.x,
                        this.app.renderer.events.pointer.global.y,
                    ),
                );
                const matrix = frames.worldTransform;
                const scale = 1 / Math.sqrt(matrix.a ** 2 + matrix.b ** 2);
                const transform = internalModel.localTransform;

                graphics.clear();
                hitAreaNames.forEach((name, i) => {
                    const hitArea = internalModel.hitAreas[name];
                    const text = texts[i];
                    text.visible = activeAreas.has(name);

                    let drawIndex = hitArea.index;
                    if (drawIndex < 0) {
                        drawIndex = internalModel.getDrawableIndex(hitArea.id);
                        if (drawIndex < 0) return;
                        hitArea.index = drawIndex;
                    }

                    const bounds = internalModel.getDrawableBounds(drawIndex);
                    const x = bounds.x * transform.a + transform.tx;
                    const y = bounds.y * transform.d + transform.ty;
                    const width = bounds.width * transform.a;
                    const height = bounds.height * transform.d;

                    graphics
                        .setStrokeStyle({ width: strokeWidth * scale, color: text.visible ? activeColor : normalColor })
                        .rect(x, y, width, height)
                        .stroke();

                    text.x = x + strokeWidth * scale;
                    text.y = y + strokeWidth * scale;
                    text.scale.set(scale);
                });
            };
            this.app.ticker.add(tickerCallback);
            (frames as any).__tickerCallback = tickerCallback;

            this.hitAreaFrames = frames;
            model.addChild(frames);
        } else if (!enable && this.hitAreaFrames) {
            const tickerCallback = (this.hitAreaFrames as any).__tickerCallback;
            if (tickerCallback) this.app.ticker.remove(tickerCallback);
            try {
                model.removeChild(this.hitAreaFrames);
            } catch (err) {
                // Already removed or not in model
            }
            this.hitAreaFrames.destroy({ children: true });
            this.hitAreaFrames = undefined;
        }
    }

    fitModelToScreen(displacement?: { x?: number; y?: number }) {
        const model = this.model;
        if (!model) return;

        model.scale.set(1.0);

        model.anchor.set(0.5, 0.5);

        const width = model.internalModel.width || model.width;
        const height = model.internalModel.height || model.height;

        if (!width || !height) {
            this.baseScale = 1.0;
            return;
        }

        // Use logical display dimensions scaled by 2 to account for the fixed resolution multiplier
        // This balances the fit across all device pixel ratios
        const canvasWidth = this.canvas.clientWidth * 2;
        const canvasHeight = this.canvas.clientHeight * 2;

        const scaleX = canvasWidth / width;
        const scaleY = canvasHeight / height;

        // Multiplied by 0.85 for breathing room (padding)
        let fitScale = Math.min(scaleX, scaleY) * 0.85;

        // Initialize center variables using logical display dimensions, not internal PIXI resolution
        // The canvas is rendered at 2x resolution but displayed at 1x, so position at logical center
        let centerX = window.innerWidth / 2;
        let centerY = window.innerHeight / 2;

        if (displacement) {
            centerX += displacement.x ?? 0;
            centerY += displacement.y ?? 0;
        }

        // CanvasOrigin centering and manual per-model overrides are opt-in;
        // some deployments want raw geometric centering instead
        if (this.state.useCustomInitialPositioning) {
            try {
                // @ts-ignore
                const canvasInfo = this.model.internalModel.coreModel.getModel().canvasinfo;
                const originX = canvasInfo.CanvasOriginX;
                const originY = canvasInfo.CanvasOriginY;

                const manualOverride = (live2dOverrides as any)[this.currentCharacterCode]?.[this.currentVariant];

                if (manualOverride && typeof manualOverride.scale === 'number') {
                    fitScale *= manualOverride.scale;
                }

                // Aligns the model's declared origin with screen center rather than its geometric center.
                // "origin": false opts out, so a y offset tunes from a stable baseline instead.
                if (
                    manualOverride?.origin !== false &&
                    typeof originX === 'number' &&
                    typeof originY === 'number'
                ) {
                    const offsetX = (width / 2 - originX) / 2;
                    let offsetY = (height / 2 - originY) / 2;

                    // Origin below center would push the model down when subtracted, so only lift up, never down
                    if (offsetY < 0) {
                        offsetY = 0;
                    }

                    centerX -= offsetX * fitScale;
                    centerY -= offsetY * fitScale;
                }

                if (manualOverride && typeof manualOverride.y === 'number') {
                    // Apply offset scaled by fitScale to maintain consistency across resolutions
                    const manualLift = manualOverride.y * fitScale;
                    centerY -= manualLift;
                }
            } catch (e) {
                // Silently ignore centering calculation errors
            }
        }

        model.position.set(centerX, centerY);

        // Used as the baseline frequency for zoom
        this.baseScale = fitScale * 0.5;
        this.defaultZoom = 1.0;
    }

    cleanup() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('pointermove', this.handleGlobalPointerMove);
            window.removeEventListener('touchmove', this.handleGlobalTouchMove);
            window.removeEventListener('pointerup', this.handleGlobalPointerUp);
        }
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
        if (this.gestureManager) {
            this.gestureManager.destroy();
            this.gestureManager = null;
        }
        this.stopAudio();
        this.cleanupModel();
        try {
            // Keep canvas element; Svelte owns it and will clean up
            this.app.destroy(false, { children: true });
        } catch (e) {
            // Silently ignore cleanup errors
        }
    }

    getAvailableParameters(): {
        index: number;
        name: string;
        value: number;
        min: number;
        max: number;
        default: number;
        missing?: boolean;
    }[] {
        try {
            const coreModel = this.model?.internalModel?.coreModel as any;
            const model = coreModel?.getModel?.();
            if (!model?.parameters) return [];

            const params: {
                index: number;
                name: string;
                value: number;
                min: number;
                max: number;
                default: number;
                missing?: boolean;
            }[] = [];
            const count = model.parameters.count;

            for (let i = 0; i < count; i++) {
                const hasMissing =
                    model.parameters.values[i] === undefined ||
                    model.parameters.minimumValues[i] === undefined ||
                    model.parameters.maximumValues[i] === undefined;

                params.push({
                    index: i,
                    name: model.parameters.ids[i] || `Unknown_${i}`,
                    value: model.parameters.values[i] ?? 0,
                    min: model.parameters.minimumValues[i] ?? 0,
                    max: model.parameters.maximumValues[i] ?? 0,
                    default: model.parameters.defaultValues[i] ?? 0,
                    missing: hasMissing,
                });
            }
            return params;
        } catch (e) {
            return [];
        }
    }

    logParameterValues() {
        const params = this.getAvailableParameters();
        return params;
    }

    private originalIdleGroup: string | null = null;

    stopAllMotions() {
        const model = this.model;
        if (!model?.internalModel?.motionManager) return;

        const motionManager = model.internalModel.motionManager as unknown as ExtendedMotionManager;

        if (typeof motionManager.stopAllMotions === 'function') {
            motionManager.stopAllMotions();
        }
    }

    pauseMotions() {
        const model = this.model;
        if (!model?.internalModel?.motionManager) return;

        const motionManager = model.internalModel.motionManager as unknown as ExtendedMotionManager;

        if (typeof motionManager.stopAllMotions === 'function') {
            motionManager.stopAllMotions();
        }

        this.originalIdleGroup = motionManager.groups.idle;
        motionManager.groups.idle = null;

        this.state.showProgressBar = false;
        this.state.motionProgress = 0;
        this.motionStartTime = 0;
        this.state.motionsPaused = true;
    }

    resumeMotions() {
        const model = this.model;
        if (!model?.internalModel?.motionManager) return;

        const motionManager = model.internalModel.motionManager;

        if (this.originalIdleGroup) {
            motionManager.groups.idle = this.originalIdleGroup;
        }
        this.state.motionsPaused = false;
    }

    setParameterValue(paramName: string, value: number) {
        const model = this.model;
        if (!model?.internalModel?.coreModel) return;

        try {
            const coreModel = model.internalModel.coreModel as any;
            const param = this.state.parameters.find((p) => p.name === paramName);
            if (!param) return;

            // *ById needs a framework-interned CubismIdHandle; paramName is a plain string, so use the index.
            coreModel.setParameterValueByIndex(param.index, value);
            model.update(0);

            param.value = value;

            this.paramOverrides.set(param.index, value);
            this.state.overriddenParams = [...this.paramOverrides.keys()];
            this.ensureOverrideHook();
        } catch (e) {
            // Silently ignore invalid parameter names or out-of-range values
        }
    }

    // Motions, focus, physics and pose all write parameters each frame, so pinned values are
    // re-applied on beforeModelUpdate, the last hook before the core model reads them.
    private ensureOverrideHook() {
        const model = this.model;
        if (!model || this.applyOverrides) return;

        const coreModel = model.internalModel.coreModel as any;
        this.applyOverrides = () => {
            for (const [index, value] of this.paramOverrides) {
                coreModel.setParameterValueByIndex?.(index, value);
            }
        };
        model.internalModel.on('beforeModelUpdate', this.applyOverrides);
    }

    private removeOverrideHook() {
        if (!this.applyOverrides) return;
        this.model?.internalModel.off('beforeModelUpdate', this.applyOverrides);
        this.applyOverrides = undefined;
    }

    /**
     * Release one parameter back to animation control
     */
    releaseParameter(index: number) {
        this.paramOverrides.delete(index);
        this.state.overriddenParams = [...this.paramOverrides.keys()];
        if (this.paramOverrides.size === 0) this.removeOverrideHook();
        this.refreshParametersState();
    }

    /**
     * Release every pinned parameter
     */
    releaseAllParameters() {
        this.paramOverrides.clear();
        this.state.overriddenParams = [];
        this.removeOverrideHook();
        this.refreshParametersState();
    }

    /**
     * Suspend the per-frame parameter writers while leaving the ticker running so edits still draw
     */
    setFrozen(frozen: boolean) {
        const internal = this.model?.internalModel as any;
        if (!internal) return;

        if (frozen) {
            // Motions outrank every ambient effect, so they have to go too for the pose to hold
            this.pauseMotions();
            this.frozenEffects = {
                breath: internal.breath,
                physics: internal.physics,
                pose: internal.pose,
                eyeBlink: internal.eyeBlink,
            };
            internal.breath = undefined;
            internal.physics = undefined;
            internal.pose = undefined;
            internal.eyeBlink = undefined;
            internal.focusController?.focus(0, 0, true);
        } else if (this.frozenEffects) {
            internal.breath = this.frozenEffects.breath;
            internal.physics = this.frozenEffects.physics;
            internal.pose = this.frozenEffects.pose;
            internal.eyeBlink = this.frozenEffects.eyeBlink;
            this.frozenEffects = undefined;
            this.resumeMotions();
        }

        this.state.isFrozen = frozen;
    }

    /**
     * Toggle move/drag mode
     */
    setMoveMode(enabled: boolean) {
        this.state.isMoveMode = enabled;
    }

    /**
     * Check if currently dragging (for UI layer)
     */
    get isCurrentlyDragging(): boolean {
        return this.isDragging;
    }

    /**
     * Refresh parameters state from model (used after manual parameter changes)
     */
    refreshParametersState() {
        if (!this.model) return;
        const params = this.getAvailableParameters();
        this.state.parameters = params.map((p) => ({
            ...p,
            // A pinned slider tracks the user's value, not what the animation wrote
            value: this.paramOverrides.get(p.index) ?? p.value,
            missing: p.missing ?? false,
        }));
    }

    /**
     * Get available parts with current opacity values and update state
     */
    refreshPartsState() {
        if (!this.model) return [];
        const coreModel = this.model.internalModel.coreModel as any;
        const model = coreModel?.getModel?.();
        if (!model?.parts) return [];

        const parts = [];
        const ids = model.parts.ids;
        for (let i = 0; i < ids.length; i++) {
            parts.push({
                id: ids[i],
                index: i,
                opacity: model.parts.opacities[i] ?? 1,
            });
        }

        this.state.parts = parts;
        return parts;
    }

    /**
     * Set part opacity by ID
     */
    setPartOpacity(id: string, opacity: number) {
        if (!this.model) return;
        const coreModel = this.model.internalModel.coreModel as any;
        // *ById needs a framework-interned CubismIdHandle; id is a plain string, so use the index.
        const index = this.state.parts.find((p) => p.id === id)?.index;
        if (index === undefined) return;
        coreModel.setPartOpacityByIndex?.(index, opacity);
        this.refreshPartsState();
    }

    /**
     * Reset all parts to full opacity
     */
    resetPartOpacities() {
        if (!this.model) return;
        this.state.parts.forEach((part) => {
            this.setPartOpacity(part.id, 1);
        });
    }

    /**
     * Tint one part with an additive screen colour so hovering its label reveals it on the model
     */
    highlightPart(id: string | null) {
        if (!this.model) return;
        if (this.highlightedPartId === id) return;

        const coreModel = this.model.internalModel.coreModel as any;
        if (!coreModel?.setPartScreenColorByRGBA) return;

        const apply = (partId: string, on: boolean) => {
            const index = this.state.parts.find((p) => p.id === partId)?.index;
            if (index === undefined) return;
            // Child drawables only inherit the colour while the part's override flag is set
            coreModel.setOverrideColorForPartScreenColors?.(index, on);
            const v = on ? 1 : 0;
            coreModel.setPartScreenColorByRGBA(index, v, v, v, 1);
        };

        if (this.highlightedPartId) apply(this.highlightedPartId, false);
        if (id) apply(id, true);
        this.highlightedPartId = id;
    }

    /**
     * Drop the highlight without touching state the next model load rebuilds
     */
    clearPartHighlight() {
        this.highlightPart(null);
    }

    /**
     * Enable/disable real-time parameter following
     */
    setFollowParameters(enabled: boolean) {
        this.state.followParameterValues = enabled;
    }

    setFocusWeight(weight: number) {
        this.state.focusWeight = weight;
    }

    setAlwaysFocus(enabled: boolean) {
        this.state.isAlwaysFocus = enabled;
        if (this.model) {

            if (enabled) {
                window.addEventListener('pointermove', this.handleGlobalPointerMove);
            } else {
                window.removeEventListener('pointermove', this.handleGlobalPointerMove);
                (this.model.internalModel as unknown as ExtendedInternalModel).focusController.focus(0, 0);
            }
        }
    }

    private handleGlobalPointerMove = (event: PointerEvent) => {
        if (!this.model) return;
        this.processMove(event.clientX, event.clientY);
    };

    private cleanupModel() {
        if (this.hitAreaFrames) {
            try {
                this.model?.removeChild(this.hitAreaFrames);
            } catch (e) {
                // Already removed
            }
            this.hitAreaFrames = undefined;
        }

        // Indices are per-model, so pinned values must not carry over to the next one
        this.removeOverrideHook();
        this.paramOverrides.clear();
        this.state.overriddenParams = [];
        this.frozenEffects = undefined;
        this.state.isFrozen = false;
        this.state.motionsPaused = false;

        if (this.model) {
            try {
                this.app.stage.removeChild(this.model);
            } catch (e) {
                // Already removed or not in stage
            }
            try {
                this.model.destroy({ children: true });
            } catch (e) {
                // Already destroyed or partially initialized
            }
            this.model = undefined;
            this.modelUrl = null;
        }
        this.motionMap = {};
        this.voiceMap = {};
        this.fileToMotionId = {};
        this.currentCharacterCode = '';
        this.highlightedPartId = null;
    }

    private handleGlobalTouchMove = (e: TouchEvent) => {
        if (!this.model) return;
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            this.processMove(touch.clientX, touch.clientY);
        }
    };

    private handleGlobalPointerUp = () => {
        if (!this.model) return;
        if (!this.state.isAlwaysFocus && this.model.internalModel?.focusController) {
            (this.model.internalModel as unknown as ExtendedInternalModel).focusController.focus(0, 0);
        }
    };

    private handleGlobalTouchEnd = () => {
        this.removeTouchListeners();
        if (this.model && !this.state.isAlwaysFocus && !this.state.isMoveMode) {
            (this.model.internalModel as unknown as ExtendedInternalModel).focusController.focus(0, 0);
        }
    };

    private removeTouchListeners() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('touchmove', this.handleGlobalTouchMove);
            window.removeEventListener('touchend', this.handleGlobalTouchEnd);
        }
    }

    private processMove(clientX: number, clientY: number) {
        if (!this.model) return;

        if (this.isDragging) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const tempPoint = new PIXI.Point(x, y);
        const modelPoint = new PIXI.Point();

        this.model.toModelPosition(tempPoint, modelPoint);

        const internalModel = this.model.internalModel as unknown as ExtendedInternalModel & {
            originalWidth: number;
            originalHeight: number;
        };

        const w = internalModel.originalWidth;
        const h = internalModel.originalHeight;

        const viewX = (modelPoint.x / w) * 2 - 1;
        const viewY = (modelPoint.y / h) * 2 - 1;

        const weight = this.state.focusWeight;
        let focusX = viewX * weight;
        let focusY = -viewY * weight; // Invert Y

        // Clamp magnitude to 1.0 to avoid "over-looking" when far away
        const mag = Math.sqrt(focusX * focusX + focusY * focusY);
        if (mag > 1.0) {
            focusX /= mag;
            focusY /= mag;
        }

        internalModel.focusController.focus(focusX, focusY);
    }
}
