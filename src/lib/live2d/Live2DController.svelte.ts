import * as PIXI from 'pixi.js';
// Dynamic import used for Live2DModel to avoid SSR crashes regarding 'document'
import type { Live2DModel } from 'pixi-live2d-display-advanced';
import { Spring } from 'svelte/motion';
import live2dOverrides from '$lib/data/live2d-overrides.json';
import Stats from 'stats.js';

export const ZOOM_MIN = -20;
export const ZOOM_MAX = 20;

// Priority list of mouth parameters to check for audio delay detection
// Scanned in order; first one found with movement determines audio timing
const MOUTH_PARAM_PRIORITY = [
    'ParamMouthOpenY',
    'ParamMouthOpenX',
    'ParamMouthForm',
    'ParamMouthY',
    'ParamMouthX',
    'ParamMouthOpen',
    'PARAM_MOUTH_OPEN_Y',
    'ParamMHMouth',
    'ParamMouthOpeY',
];

export enum ModelLoadingState {
    IDLE = 'idle',
    LOADING = 'loading',
    READY = 'ready',
    ERROR = 'error',
}

// Types for our data sources
interface MotionData {
    id: number;
    motion_name: string;
    probability: number;
    touch_area: string;
    voice_string: string;
}

interface VoiceData {
    voice_key: string;
    caption: string;
}

interface CharacterEntry {
    id: number;
    code: string;
    directory: string;
    motions: number[]; // List of motion IDs
}

// --- Extended Types for Library Internals ---
// Internal structure types for pixi-live2d-display-advanced
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
    _audioDelay?: number; // Audio playback delay calculated from mouth animation curves
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
    // Pixi Internals
    app: PIXI.Application;
    model: Live2DModel | undefined; // Live2DModel
    private canvas: HTMLCanvasElement; // Store canvas reference
    private bgSprite: PIXI.Sprite | null = null; // Background sprite
    private captionText: PIXI.Text | null = null; // Caption text overlay

    // State (Using getters/setters effectively for reactivity if needed, or just public properties)
    // Reactive State (Svelte 5 Runes)
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
        groupAudioState: Record<string, boolean>; // Cache for UI: groupName -> isLoaded
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
        followParameterValues: boolean; // Auto-update parameters from animation
        experimentalVoiceSync: boolean; // Use computed voice delay from mouth params
        forceLipSync: boolean; // Enable library lip sync (audio-driven, additive to animation)
        renderCaptionsOnCanvas: boolean; // Draw captions directly on canvas
    }>({
        loading: ModelLoadingState.IDLE,
        loadingStep: null,
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
        followParameterValues: false,
        experimentalVoiceSync: true,
        forceLipSync: false,
        renderCaptionsOnCanvas: false,
    });

    // Data Cache
    private motionMap: Record<number, MotionData> = {}; // MotionID -> Data
    private voiceMap: Record<number, VoiceData> = {}; // MotionID -> Voice Data
    private currentCharacterCode: string = '';
    private currentVariant: string = '';
    private assetBaseUrl: string = '/assets';
    private fileToMotionId: Record<string, number> = {}; // MotionFile -> MotionID mapping

    // Motion metadata for progress tracking
    private motionMetadata: Record<string, Array<{ duration: number; fps: number; probability?: number }>> = {};
    private motionGroups: string[] = [];

    // Viewport State
    private isDragging = false;
    private isForcedDrag = false; // Track middle-click forced drag
    private dragStart = { x: 0, y: 0 };
    private modelStart = { x: 0, y: 0 };
    private baseScale = 0.1;
    private defaultZoom = 1; // Default zoom from model metadata (Layout.Scale)
    private zoomSpring: Spring<number>;

    // Gesture management
    private gestureManager: any = null;
    private directZoom: number | null = null; // When set, use this zoom value instead of spring (for hard: true updates)

    // Load state tracking
    private loadId = 0; // Monotonically increasing ID to track latest load request

    // Cubism4 initialization state
    private cubism4Promise: Promise<void>;

    // Hitbox debug visualization
    private hitAreaFrames?: any;

    // Motion tracking for progress slider
    private motionStartTime = 0;
    private motionDuration = 0;

    // Audio playback tracking
    private currentAudio: HTMLAudioElement | null = null;
    private audioPromiseCache: Map<string, Promise<string>> = new Map(); // key -> Promise<BlobURL>
    private audioProgressInterval: number | null = null; // For audio-only progress tracking

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const dpr = window.devicePixelRatio || 1;
        this.app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: dpr * 2,
            autoDensity: true,
            antialias: false,
            backgroundAlpha: 0,
        });

        // Initialize spring for smooth zoom with exponential scaling
        this.zoomSpring = new Spring(0, {
            stiffness: 0.1,
            damping: 0.8,
        });

        // Auto-start render with spring update loop
        this.startRendering();

        // Initialize caption text overlay
        this.captionText = new PIXI.Text('', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 20,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: window.innerWidth * 0.8,
        });
        this.captionText.anchor.set(0.5, 1);
        this.captionText.visible = false;
        this.app.stage.addChild(this.captionText);

        // Initialize performance monitor
        if (typeof window !== 'undefined') {
            const stats = new Stats();
            stats.showPanel(0); // 0 = fps, 1 = ms, 2 = mb
            stats.dom.id = 'stats';
            document.body.appendChild(stats.dom);
            this.app.ticker.add(() => {
                stats.update();
            });
        }

        // Expose PIXI for Live2D plugin
        (window as any).PIXI = PIXI;

        // Configure Cubism4 before loading any models
        this.cubism4Promise = this.initializeCubism4();

        // Resize listener
        window.addEventListener('resize', this.handleResize);
    }

    private async initializeCubism4() {
        try {
            const { configureCubism4 } = await import('pixi-live2d-display-advanced/cubism4');
            configureCubism4({ memorySizeMB: 128 });
            // console.log('[Controller] Cubism4 configured');
        } catch (err) {
            throw err;
        }
    }

    private handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        if (newWidth !== this.app.renderer.width || newHeight !== this.app.renderer.height) {
            this.app.renderer.resize(newWidth, newHeight);

            // Update caption text word wrap width
            if (this.captionText) {
                this.captionText.style.wordWrapWidth = newWidth * 0.8;
            }
        }
    };

    private startRendering() {
        this.app.ticker.add(() => {
            // Update model scale from spring animation or direct zoom
            if (this.model) {
                const ZOOM_BASE = 1.1; // Smoother zoom steps
                // Use direct zoom (hard: true updates) if set, otherwise use spring animation
                const zoomValue = this.directZoom !== null ? this.directZoom : this.zoomSpring.current;
                // Apply zoom slider as offset to model's default zoom
                // Final Scale = Base (Fit to Screen) * Default (Layout.Scale) * UserOffset (Spring/Direct)
                const userScaleFactor = Math.pow(ZOOM_BASE, zoomValue);
                const targetScale = this.baseScale * this.defaultZoom * userScaleFactor;
                this.model.scale.set(targetScale, targetScale);
            }

            // Update caption text overlay (use screen dimensions, not renderer which is supersampled)
            if (this.captionText) {
                if (this.state.renderCaptionsOnCanvas && this.state.caption) {
                    // Replace <> with space for canvas display (UI box uses newline instead)
                    this.captionText.text = this.state.caption.replace(/<>/g, ' ');
                    this.captionText.position.set(
                        this.app.screen.width / 2,
                        this.app.screen.height - 40
                    );
                    this.captionText.visible = true;
                } else {
                    this.captionText.visible = false;
                }
            }

            // Update motion progress
            if (this.state.isMotionPlaying) {
                if (!this.motionDuration) {
                    // console.warn('[Controller] Motion duration unknown, cannot track progress');
                }
                const duration = this.motionDuration;
                const elapsed = Date.now() - this.motionStartTime;
                const progress = Math.max(0, Math.min(elapsed / (duration * 1000), 1));
                this.state.motionProgress = progress;

                // Auto-stop if motion duration exceeded
                if (progress >= 1) {
                    // console.log('[Controller] Motion finished');
                    this.state.isMotionPlaying = false;
                    this.state.motionProgress = 0;
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
    ): Promise<boolean> {
        // Increment load ID to invalidate previous pending loads
        const myLoadId = ++this.loadId;

        // Force reset 'READY' state to allow re-loading the same character
        if (this.state.loading === ModelLoadingState.READY) {
            this.state.loading = ModelLoadingState.IDLE;
        }

        try {
            // Stop any currently playing audio immediately
            this.stopAudio();

            // Ensure Cubism4 is configured before loading model
            this.state.loadingStep = 'Preparing viewer';
            await this.cubism4Promise;

            // Check if we've been superseded during await
            if (this.loadId !== myLoadId) return false;

            this.state.loading = ModelLoadingState.LOADING;
            this.state.error = null;
            this.state.motionGroups = [];

            // Reset zoom state if requested
            if (shouldResetZoom) {
                this.resetZoom();
            }

            // Reset animation/progress state
            this.state.showProgressBar = false;
            this.state.isMotionPlaying = false;
            this.state.motionProgress = 0;
            this.state.caption = null;
            this.state.loadedVoiceKeys = new Set();
            this.state.groupAudioState = {};
            this.motionStartTime = 0;
            this.motionDuration = 0;

            // Clear audio cache for new character to free memory
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

            // 1. Resolve Directory
            // Use directory if present (from extract-live2d.py), else fall back to code
            const dirName = entry.directory || entry.code;
            this.currentCharacterCode = entry.code;
            this.assetBaseUrl = assetBaseUrl;

            // 2. Load Model
            const basePath = `${assetBaseUrl}/models/${dirName}/${variant}`;
            const modelUrl = `${basePath}/${dirName}.model3.json`;

            // console.log(`[Controller] Loading Model URL: ${modelUrl} (LoadID: ${myLoadId})`);

            this.state.loadingStep = 'Loading textures';

            const { Live2DModel } = await import('pixi-live2d-display-advanced/cubism4');

            // Check if superseded
            if (this.loadId !== myLoadId) return false;

            // console.log('[Controller] Live2DModel loaded:', Live2DModel);

            // Load model via URL with custom interaction (focus only on left click down)
            let newModel: any;
            try {
                newModel = await Live2DModel.from(modelUrl, { autoHitTest: false, autoFocus: false });
            } catch (loadErr: any) {
                // console.error('[Controller] Failed to load model from URL:', loadErr);
                throw new Error(`Failed to load Live2D model: ${loadErr.message}`);
            }

            // Check if superseded after heavy network load
            if (this.loadId !== myLoadId) {
                newModel.destroy(); // Cleanup the orphaned model result
                return false;
            }

            // 3. Load Metadata (motion durations from model, voice data)
            this.state.loadingStep = 'Loading animations';

            // Cleanup previous model
            this.cleanupModel();
            this.model = newModel;
            this.currentCharacterCode = entry.code;
            this.currentVariant = variant;

            // Extract default zoom from model metadata
            this.extractDefaultZoom();

            // Extract motion groups from model
            this.extractMotionGroupsFromModel();

            // Manually preload all motions
            const currentModel = this.model;
            if (!currentModel) throw new Error('Model not initialized during setup');

            const motionManager = (currentModel.internalModel as unknown as ExtendedInternalModel).motionManager;

            // Hook into createMotion EARLY to analyze audio delays from mouth parameter curves
            const originalCreateMotion = (motionManager as any).createMotion.bind(motionManager);

            (motionManager as any).createMotion = function (data: any, group: string, definition: any) {
                // Analyze ALL mouth parameters and select the earliest oscillation start
                let audioDelay = 0;
                let minAudioDelay = Infinity;
                let selectedParam: string | null = null;
                const candidateDelays: Array<{ param: string; delay: number }> = [];

                try {
                    const curves = (data as any).Curves || [];

                    for (const paramId of MOUTH_PARAM_PRIORITY) {
                        const mouthCurve = curves.find((c: any) => c.Id === paramId);

                        if (!mouthCurve || !mouthCurve.Segments) {
                            continue;
                        }

                        const segments = mouthCurve.Segments;

                        // Calculate change range for this parameter
                        let minVal = Infinity;
                        let maxVal = -Infinity;

                        for (let i = 1; i < segments.length; i += 3) {
                            const value = segments[i];
                            minVal = Math.min(minVal, value);
                            maxVal = Math.max(maxVal, value);
                        }

                        const change = maxVal - minVal;

                        // Skip parameters without meaningful oscillation (mouth must actually flap)
                        if (change <= 0.01) {
                            continue;
                        }

                        let prevValue: number | null = null;
                        let prevTime: number | null = null;
                        let prevDirection: number | null = null;
                        let oscillationStart = 0;

                        // Seed with the very first keyframe (t=0) so direction comparison has a baseline
                        let i = 0;
                        if (segments.length >= 2) {
                            prevValue = segments[1];
                            prevTime = segments[0];
                            i = 2;
                        }

                        // Parse segments (handles both linear and cubic)
                        let stepCount = 1;
                        while (i < segments.length && stepCount < 50) {
                            const segmentType = segments[i];
                            let time: number;
                            let value: number;

                            if (segmentType === 0 || segmentType === 2 || segmentType === 3) {
                                // Linear, stepped, or inverse-stepped: 1 point follows
                                time = segments[i + 1];
                                value = segments[i + 2];
                                i += 3;
                            } else if (segmentType === 1) {
                                // Cubic Bezier: 3 points follow (P1, P2, P3); only P3 endpoint matters here
                                time = segments[i + 5];
                                value = segments[i + 6];
                                i += 7;
                            } else {
                                break;
                            }

                            let direction = 0;
                            if (prevValue !== null) {
                                if (value > prevValue) direction = 1;
                                else if (value < prevValue) direction = -1;
                            }

                            // Direction change between two significant values marks the first mouth flap
                            if (
                                prevValue !== null &&
                                Math.abs(prevValue) > 0.01 &&
                                Math.abs(value) > 0.01 &&
                                prevDirection &&
                                prevDirection !== 0 &&
                                direction !== 0 &&
                                prevDirection !== direction
                            ) {
                                oscillationStart = prevTime || time;
                                break;
                            }

                            prevValue = value;
                            prevTime = time;
                            if (direction !== 0) prevDirection = direction;
                            stepCount++;
                        }

                        // Calculate delay for this parameter
                        let paramDelay = 0;
                        if (oscillationStart > 0) {
                            paramDelay = oscillationStart;
                        } else {
                            for (let i = 0; i < segments.length; i += 3) {
                                const value = segments[i + 1];
                                if (Math.abs(value) > 0.01) {
                                    paramDelay = segments[i];
                                    break;
                                }
                            }
                        }

                        candidateDelays.push({ param: paramId, delay: paramDelay });

                        if (paramDelay < minAudioDelay) {
                            minAudioDelay = paramDelay;
                            selectedParam = paramId;
                        }
                    }

                    // Use the earliest delay found, or default to 0s
                    if (selectedParam !== null && minAudioDelay !== Infinity) {
                        audioDelay = minAudioDelay;
                    } else {
                        audioDelay = 0;
                    }
                } catch (e) {
                    console.error(`Error analyzing audio delay for motion ${group}:`, e);
                    audioDelay = 0;
                }

                const motion = originalCreateMotion(data, group, definition) as PrivateMotion;
                motion._audioDelay = audioDelay;
                return motion;
            };

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
                this.loadVoiceData(String(entry.id), voiceData),
            ]);

            // Preload all voice lines in background
            this.preloadAllVoiceLines();

            // 4. Setup Model
            this.state.loadingStep = 'Setting up';
            this.state.motionGroups = [...this.motionGroups]; // Update UI now that metadata is ready

            // Default forceLipSync to true for idle-only models
            if (this.motionGroups.length === 0 || (this.motionGroups.length === 1 && this.motionGroups[0] === 'Idle')) {
                this.state.forceLipSync = true;
            }

            this.app.stage.addChild(this.model!);
            // Bring caption text to front (above model)
            if (this.captionText) {
                this.app.stage.addChild(this.captionText);
            }
            this.fitModelToScreen();
            this.setupInteraction();
            this.setupGestureManager();

            this.state.loadingStep = '';
            this.state.loading = ModelLoadingState.READY;

            // Populate parameters and parts state for UI components
            this.refreshParametersState();
            this.refreshPartsState();

            // console.log(`[Controller] Loaded ${entry.code} at ${dirName} (LoadID: ${myLoadId})`);
            return true;
        } catch (err: any) {
            if (this.loadId === myLoadId) {
                this.state.error = err.message;
                this.state.loading = ModelLoadingState.ERROR;
            } else {
                // console.warn(
                //     `[Controller] Error from superseded load ${myLoadId}, current load is ${this.loadId}:`,
                //     err,
                // );
            }
            return false;
        }
    }

    // -- Data Loading --

    private extractDefaultZoom() {
        // Extract default zoom from model's Layout.Scale in model3.json
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

        // Debug: Log complete Layout info
        // try {
        //     const layout = (settings as any)?.json?.FileReferences?.Layout || (settings as any)?.layout;
        //     console.log('[Controller] Model3.json Layout Info:', layout);
        //     console.log('[Controller] Canvas Config:', {
        //         width: this.app.renderer.width,
        //         height: this.app.renderer.height,
        //         modelScale: scale,
        //         view: (this.app.view as HTMLCanvasElement).style?.width,
        //     });
        // } catch (e) {
        //     console.warn('[Controller] Failed to log layout info', e);
        // }

        // console.log('[Controller] Default zoom from model3.json Layout.Scale:', this.defaultZoom);
    }

    private extractMotionGroupsFromModel() {
        // Extract motion groups from loaded model's animation structure
        const model = this.model;
        if (!model) return;

        const internalModel = model.internalModel;
        if (!internalModel) throw new Error('Model internal structure not ready');

        // Access motion manager definitions
        if (!internalModel.motionManager || !internalModel.motionManager.definitions) {
            throw new Error('Motion manager definitions not available');
        }

        this.motionGroups = Object.keys(internalModel.motionManager.definitions);
    }

    private async extractMotionDurationsFromModel() {
        // Extract motion durations from loaded model's motion manager
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

        // Iterate through all motion groups
        for (const groupName of this.motionGroups) {
            const loadedMotions = motionManager.motionGroups[groupName];
            if (!loadedMotions) {
                throw new Error(`No loaded motions found for group: ${groupName}`);
            }

            // If no motions loaded yet, that's an error
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

                // Duration is stored in _motionData.duration (already in seconds)
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

        // console.log(
        //     '[Controller] Motion durations extracted from loaded motions:',
        //     Object.keys(this.motionMetadata).length,
        //     'groups',
        // );
    }

    private async loadMotionData(entry: CharacterEntry, motionData?: any) {
        if (!motionData) {
            throw new Error('Motion data not provided by server');
        }
        if (Object.keys(motionData).length === 0) {
            throw new Error('Motion data is empty for model ' + entry.id);
        }

        // motionData is already pre-filtered by model ID on the frontend
        // Structure: { motionId -> MotionData }
        const modelMotions = motionData;

        this.motionMap = {};
        this.fileToMotionId = {};

        for (const m of Object.values(modelMotions)) {
            const motion = m as MotionData;
            // Store by motion ID for direct lookup
            this.motionMap[motion.id] = motion;

            // Build file -> motion ID map for onMotionStart lookup
            // motions.json stores: "motions/touch_1.mtn"
            // model3.json uses: "motions/touch_1.motion3.json"
            // Convert to .motion3.json format for lookup
            if (motion.motion_name) {
                const motion3Path = motion.motion_name.replace('.mtn', '.motion3.json');
                this.fileToMotionId[motion3Path] = motion.id;

                // Also store by basename for flexibility
                const basename3 = (motion.motion_name.split('/').pop() || '').replace('.mtn', '.motion3.json');
                this.fileToMotionId[basename3] = motion.id;
            }

            // Build probability lookup by group and index
            // Parse group and index from motion data (need to get from model during loading)
        }

        // console.log('[Controller] Loaded motion data:', Object.keys(this.motionMap).length, 'entries');
        // console.log('[Controller] File -> MotionID map:', Object.keys(this.fileToMotionId).slice(0, 10));
    }

    private async loadVoiceData(modelId: string, voiceData?: any) {
        if (!voiceData) {
            throw new Error('Voice data not provided by server for model ' + modelId);
        }

        // voiceData is already pre-filtered by model ID on the frontend
        // Structure: { motionId -> { voice_key, caption } }
        if (typeof voiceData !== 'object') {
            throw new Error('Invalid voice data structure: expected object, got ' + typeof voiceData);
        }

        this.voiceMap = voiceData;
    }

    // -- Background Management --

    private bgTransform = { x: 0, y: 0, scale: 1 };

    public async setBackground(url: string | null): Promise<void> {
        // Cleanup old sprite
        if (this.bgSprite) {
            this.app.stage.removeChild(this.bgSprite);
            this.bgSprite.destroy({ children: true, texture: true, baseTexture: true });
            this.bgSprite = null;
        }

        if (!url) return;

        try {
            const texture = await PIXI.Texture.fromURL(url);
            // Check if superseded or destroyed? (Simplification: assume linear usage for now)

            this.bgSprite = new PIXI.Sprite(texture);
            this.bgSprite.anchor.set(0.5);
            // Apply cached transform immediately
            this.applyBackgroundTransform();

            // Add to the very bottom (index 0)
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

        // Start from center of screen (logical coordinates)
        const screenW = this.app.screen.width;
        const screenH = this.app.screen.height;
        const centerX = screenW / 2;
        const centerY = screenH / 2;

        const { x, y, scale } = this.bgTransform;

        this.bgSprite.position.set(centerX + x, centerY + y);
        this.bgSprite.scale.set(scale);
    }

    // -- Interaction --

    private setupInteraction() {
        const model = this.model;
        if (!model) return;

        // Ensure Pixi can receive events on this model
        model.eventMode = 'static';

        // Enable hit testing for tap interactions
        model.automator.autoHitTest = true;

        // Initialize with always-focus if enabled (moved up to ensure clean state)
        if (this.state.isAlwaysFocus) {
            window.addEventListener('pointermove', this.handleGlobalPointerMove);
            window.addEventListener('touchmove', this.handleGlobalTouchMove, { passive: false });
        } else {
            // Default to center if not focused
            if (model.internalModel?.focusController) {
                // Guard against missing focusController
                model.internalModel.focusController.focus(0, 0, true);
            }
        }

        model.on('pointerdown', (event: any) => {
            // Only handle "Hit" testing via PIXI events here if needed,
            // but the library usually handles 'hit' event separately.
            // We removed the drag logic here to avoid conflict with GunLive2D.
        });

        // Handle pointer up/window up only for focus cleanup if needed
        // (GunLive2D calls endDrag, so we just need to ensure focus resets if not always-focus)
        // Use class method for cleanup
        model.on('pointerup', this.handleGlobalPointerUp);
        window.addEventListener('pointerup', this.handleGlobalPointerUp);

        // Initialize with always-focus if enabled
        if (this.state.isAlwaysFocus) {
            // Add global move listener for always-focus
            // We use a custom handler to ensure we can control the magnitude
            window.removeEventListener('pointermove', this.handleGlobalPointerMove);
            window.addEventListener('pointermove', this.handleGlobalPointerMove);
            // Touch support for always focus
            window.addEventListener('touchmove', this.handleGlobalTouchMove, { passive: false });
        } else {
            model.internalModel.focusController.focus(0, 0, true);
        }

        // Handle tap interactions
        model.on('hit', (hitAreas: string[]) => {
            // Prevent overlapping animations
            if (this.state.showProgressBar) {
                return;
            }
            this.state.showProgressBar = true;
            this.state.isMotionPlaying = true;
            this.motionStartTime = Date.now();
            this.handleTap(hitAreas);
        });

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

            // Setup gesture interaction for pinch-zoom (2+ fingers only, takes priority)
            // Drag is handled by pointer events in GunLive2D.svelte (works perfectly there)
            let pinchStartScaleMultiplier = 0; // Track UI target zoom at gesture start
            interact(canvasElement)
                .gesturable({})
                .on('gesturestart', (event: any) => {
                    if (!this.model || !this.state.isMoveMode) {
                        event.preventDefault();
                        return;
                    }
                    // Gesture requires 2+ pointers automatically by interact.js
                    isGestureActive = true;
                    // Capture current target zoom level (UI state, not actual scale)
                    // This ensures pinch always starts from consistent baseline
                    pinchStartScaleMultiplier = this.state.scaleMultiplier;
                })
                .on('gesturemove', (event: any) => {
                    if (!this.model || !this.state.isMoveMode) return;

                    // event.scale is the ratio of current distance to start distance
                    const ZOOM_BASE = 1.1;

                    // Calculate target zoom: start from UI zoom baseline, apply gesture scale
                    // No limits here - model can zoom to any level, only UI slider has limits
                    const scaleFactor = Math.pow(ZOOM_BASE, pinchStartScaleMultiplier);
                    const gestureScale = scaleFactor * event.scale;
                    const targetScaleMultiplier = Math.log(gestureScale) / Math.log(ZOOM_BASE);

                    // Update zoom instantly during gesture with hard: true (skip spring animation for responsiveness)
                    this.setZoom(targetScaleMultiplier, { hard: true });
                })
                .on('gestureend', (event: any) => {
                    isGestureActive = false;
                    pinchStartScaleMultiplier = 0;
                    // Clear direct zoom so spring animation takes over on next input
                    this.directZoom = null;
                    // Update spring target to current state for smooth continuation
                    this.zoomSpring.target = this.state.scaleMultiplier;
                });

            this.gestureManager = { destroy: () => { } }; // Placeholder for cleanup compatibility
        } catch (err) {
            // Silently ignore gesture manager initialization errors
        }
    }

    private handleTap(hitAreas: string[]) {
        if (hitAreas.length === 0) return;
        const model = this.model;
        if (!model) return;

        // console.log('[Controller] Handling tap on hitareas:', hitAreas);

        // For idle-only models, play unmapped voicelines on body tap instead of motion
        const isIdleOnly = this.motionGroups.length === 0 ||
            (this.motionGroups.length === 1 && this.motionGroups[0] === 'Idle');

        if (isIdleOnly && hitAreas.includes('body')) {
            const unmappedVoicelines = this.getUnmappedVoicelines();
            if (unmappedVoicelines.length > 0) {
                const randomIndex = Math.floor(Math.random() * unmappedVoicelines.length);
                const voiceline = unmappedVoicelines[randomIndex];
                // Reset state set by hit handler so playAudioOnly can set its own
                this.state.showProgressBar = false;
                this.state.isMotionPlaying = false;
                this.playAudioOnly(voiceline.motionId);
                return;
            }
        }

        // Collect all motion groups and their combined weights
        const groupWeights: Record<string, number> = {};

        for (const area of hitAreas) {
            const groupName = `Tap${area.charAt(0).toUpperCase() + area.slice(1)}`;
            const definitions = (model.internalModel.motionManager.definitions as any)[groupName];

            if (!definitions || definitions.length === 0) continue;

            // Calculate average weight for this group
            const weights = definitions.map((def: any) => {
                const meta = this.findMotionMetadata(def.File);
                return meta?.probability ?? 1.0;
            });
            const avgWeight = weights.reduce((a: number, b: number) => a + b, 0) / weights.length;
            groupWeights[groupName] = avgWeight;
        }

        // console.log('[Controller] Group weights:', groupWeights);

        // Select group based on combined weights
        const groupNames = Object.keys(groupWeights);
        if (groupNames.length === 0) return;

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

        // console.log('[Controller] Selected group:', selectedGroupName);

        // Now select motion within the chosen group using weighted random
        const definitions = (model.internalModel.motionManager.definitions as any)[selectedGroupName];
        let selectedIndex = 0;

        const candidates = definitions.map((def: any, index: number) => {
            const file = def.File;
            const meta = this.findMotionMetadata(file);
            return { index, prob: meta?.probability ?? 1.0 };
        });

        // Weighted Random
        const motionTotalWeight = candidates.reduce((sum: number, c: any) => sum + c.prob, 0);
        let motionRandom = Math.random() * motionTotalWeight;

        for (const c of candidates) {
            motionRandom -= c.prob;
            if (motionRandom <= 0) {
                selectedIndex = c.index;
                break;
            }
        }

        // console.log('[Controller] Selected motion index:', selectedIndex);

        // Update State
        this.state.currentMotionGroup = selectedGroupName;
        this.state.currentMotionIndex = selectedIndex;

        // Fetch actual duration for this tap motion instead of using hardcoded 3 seconds
        this.motionDuration = this.getMotionDuration(selectedGroupName, selectedIndex);

        // Get voice audio URL if available
        let audioUrl: string | undefined;
        const def = definitions[selectedIndex];
        if (def && def.File) {
            // Find motion ID from File path
            let motionId = this.findMotionId(def.File);

            if (motionId !== undefined && this.voiceMap[motionId]) {
                const voice = this.voiceMap[motionId];
                this.state.caption = voice.caption;
                audioUrl = this.getAudioUrl(voice.voice_key);
            } else {
                this.state.caption = null;
            }
        }

        // Play motion without audio - we'll handle timing manually
        model.motion(selectedGroupName, selectedIndex).then(() => {
            // Get the audio delay from the motion's ParamMouthOpenY curve
            const mm = this.model?.internalModel.motionManager as any;
            const motionGroup = mm.motionGroups?.[selectedGroupName];
            const loadedMotion = motionGroup?.[selectedIndex];
            const audioDelay = (loadedMotion as any)?._audioDelay || 0;

            // If audio URL exists, play it after the delay
            if (audioUrl) {
                const playAudioWithDelay = async () => {
                    if (audioDelay > 0) {
                        await new Promise((resolve) => setTimeout(resolve, audioDelay * 1000));
                    }
                    try {
                        // Stop any current audio
                        if (this.currentAudio) {
                            this.currentAudio.pause();
                            this.currentAudio = null;
                        }
                        // Load and play audio
                        const blobUrl = await this.loadAudio(audioUrl);
                        const audio = new Audio(blobUrl);
                        this.currentAudio = audio;
                        audio.volume = 0.5;
                        await audio.play();
                        audio.onended = () => {
                            if (this.currentAudio === audio) {
                                this.currentAudio = null;
                                this.state.caption = null;
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
        // Try exact match
        if (this.fileToMotionId[filePath]) {
            return this.fileToMotionId[filePath];
        }

        // Try basename match
        const basename = filePath.split('/').pop() || '';
        if (this.fileToMotionId[basename]) {
            return this.fileToMotionId[basename];
        }

        // Try replacing extension
        const jsonPath = filePath.replace('.mtn', '.motion3.json');
        if (this.fileToMotionId[jsonPath]) {
            return this.fileToMotionId[jsonPath];
        }

        return undefined;
    }

    // -- Audio Handling --

    private getAudioUrl(voiceKey: string): string {
        // Extract base character ID: G41_2401 -> G41 (or G41MOD_2401 -> G41MOD)
        // Keep MOD suffix if present; fallback logic handles base variant if needed
        const baseId = this.currentCharacterCode.split('_')[0].toUpperCase();

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
                // Fallback: try alternate variant (add/remove MOD suffix)
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
                        // Both URLs failed
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
        // Extract voiceKey from original URL
        // URL format: {assetBaseUrl}/audio/{baseId}/{baseId}_{voiceKey}_JP.ogg
        const voiceKeyPattern = /_([A-Z0-9_]+)_JP\.ogg$/i;
        const match = originalUrl.match(voiceKeyPattern);

        if (!match) {
            return originalUrl; // Invalid format, return original
        }

        const voiceKey = match[1];

        // Extract baseId from currentCharacterCode (same logic as getAudioUrl)
        let baseId = this.currentCharacterCode.split('_')[0].toUpperCase();

        // Determine fallback baseId (toggle MOD suffix)
        let fallbackBaseId: string;
        if (baseId.toUpperCase().endsWith('MOD')) {
            fallbackBaseId = baseId.slice(0, -3);
        } else {
            fallbackBaseId = baseId + 'MOD';
        }

        // Reconstruct URL with fallback baseId (same format as getAudioUrl)
        return `${this.assetBaseUrl}/audio/${fallbackBaseId}/${fallbackBaseId}_${voiceKey}_JP.ogg`;
    }

    private async preloadAllVoiceLines() {
        const promises: Promise<void>[] = [];

        for (const voice of Object.values(this.voiceMap)) {
            if (voice.voice_key) {
                const url = this.getAudioUrl(voice.voice_key);
                // We just trigger the load, we don't await individual ones here unless we want to track progress

                // Track promise completion to update UI state
                const voiceKey = voice.voice_key;
                this.loadAudio(url)
                    .then(() => {
                        this.state.loadedVoiceKeys.add(voiceKey);
                        // Force update for Set reactivity (Svelte 5 Set is reactive but we might need to trigger dependents)
                        // Better yet, update the group map
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

        // Optional: track total progress
        await Promise.allSettled(promises);
    }

    private updateGroupAudioState(loadedKey: string) {
        // Reverse lookup required: iterate groups to find which use this voice key
        // Optimization possible: build VoiceKey -> GroupNames[] map during loadCharacter
        // Or just re-evaluate all groups that are not yet loaded.
        // For 60fps UI, we want a simple map lookup.

        // Let's iterate all groups and if they map to this voice key, marking them true.
        // Optimization: In `loadCharacter` we could build a map: VoiceKey -> GroupNames[]

        // Simple approach: Iterate all groups.
        for (const group of this.motionGroups) {
            if (this.state.groupAudioState[group]) continue; // Already loaded

            // Check if group's primary motion (0) uses this key
            const model = this.model;
            if (!model) continue;

            const defs = (model.internalModel.motionManager.definitions as any)[group];
            if (defs && defs[0] && defs[0].File) {
                const motionId = this.findMotionId(defs[0].File);
                if (motionId && this.voiceMap[motionId] && this.voiceMap[motionId].voice_key === loadedKey) {
                    this.state.groupAudioState[group] = true;
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
            const url = this.getAudioUrl(voiceKey);
            const blobUrl = await this.loadAudio(url);

            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio = null;
            }

            const audio = new Audio(blobUrl);
            this.currentAudio = audio;

            // Resume context if needed (browsers block autoplay)
            try {
                await audio.play();
            } catch (e) {
                // Silently ignore autoplay failures
            }

            audio.onended = () => {
                if (this.currentAudio === audio) {
                    this.currentAudio = null;
                    this.state.caption = null;
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
    }

    async playAudioOnly(motionId: number) {
        // Prevent overlapping playback
        if (this.state.showProgressBar) {
            return;
        }

        const voice = this.voiceMap[motionId];
        if (!voice || !voice.voice_key) {
            console.warn('[Controller] No voice data for motion', motionId);
            return;
        }

        try {
            const url = this.getAudioUrl(voice.voice_key);
            const blobUrl = await this.loadAudio(url);

            this.stopAudio();

            const audio = new Audio(blobUrl);
            this.currentAudio = audio;

            // Wait for metadata to get duration
            await new Promise<void>((resolve) => {
                audio.addEventListener('loadedmetadata', () => resolve(), { once: true });
                audio.load();
            });

            const audioDuration = audio.duration;

            // Set up progress tracking
            this.state.showProgressBar = true;
            this.state.isMotionPlaying = true;
            this.state.caption = voice.caption;
            this.motionStartTime = Date.now();
            this.motionDuration = audioDuration;

            // Clear any existing interval
            if (this.audioProgressInterval !== null) {
                clearInterval(this.audioProgressInterval);
            }

            // Update progress every 100ms
            this.audioProgressInterval = window.setInterval(() => {
                if (!this.currentAudio || this.currentAudio.paused || this.currentAudio.ended) {
                    this.stopAudioProgress();
                    return;
                }

                const elapsed = Date.now() - this.motionStartTime;
                const progress = Math.min(elapsed / (audioDuration * 1000), 1);
                this.state.motionProgress = progress;

                if (progress >= 1) {
                    this.stopAudioProgress();
                }
            }, 100);

            // Handle audio end
            audio.addEventListener('ended', () => {
                this.stopAudioProgress();
            }, { once: true });

            audio.addEventListener('error', (err) => {
                console.error('[Controller] Audio playback error:', err);
                this.stopAudioProgress();
            }, { once: true });

            audio.volume = 0.5;
            await audio.play();

        } catch (err) {
            console.error('[Controller] Failed to play audio-only:', err);
            this.stopAudioProgress();
        }
    }

    private stopAudioProgress() {
        if (this.audioProgressInterval !== null) {
            clearInterval(this.audioProgressInterval);
            this.audioProgressInterval = null;
        }
        this.state.showProgressBar = false;
        this.state.isMotionPlaying = false;
        this.state.motionProgress = 0;
        this.state.caption = null;
        this.motionStartTime = 0;
        this.motionDuration = 0;
    }

    getUnmappedVoicelines(): Array<{ motionId: number; voice_key: string; caption: string }> {
        const unmappedMap = new Map<string, { motionId: number; voice_key: string; caption: string }>();

        // Check all motion IDs in voiceMap
        for (const [motionIdStr, voice] of Object.entries(this.voiceMap)) {
            const motionId = Number(motionIdStr);
            const motionData = this.motionMap[motionId];

            // Skip if no voice data
            if (!voice || !voice.voice_key) continue;

            // Skip if motion has a file (means it's mapped to a motion group)
            if (motionData && motionData.motion_name && motionData.motion_name !== 'motions/idle.mtn' && motionData.motion_name !== 'motions/daiji.mtn' && motionData.motion_name !== 'motions/daiji_idle_01.mtn') {
                continue;
            }

            // Deduplicate by voice_key
            if (!unmappedMap.has(voice.voice_key)) {
                unmappedMap.set(voice.voice_key, {
                    motionId,
                    voice_key: voice.voice_key,
                    caption: voice.caption || voice.voice_key
                });
            }
        }

        return Array.from(unmappedMap.values());
    }

    private findMotionMetadata(file: string): MotionData | undefined {
        // file: "motions/touch_1.mtn"
        // Lookup motion ID from file path, then get metadata
        const motionId = this.fileToMotionId[file] || this.fileToMotionId[file.split('/').pop() || ''];
        if (motionId) {
            return this.motionMap[motionId];
        }
        return undefined;
    }

    // -- Viewport Controls --

    getMotionGroups(): string[] {
        return this.motionGroups;
    }

    getMotionCountForGroup(groupName: string): number {
        return this.motionMetadata[groupName]?.length ?? 0;
    }

    getMotionVariants(groupName: string): Array<{ index: number; label: string }> {
        const count = this.getMotionCountForGroup(groupName);
        const variants = [];
        for (let i = 0; i < count; i++) {
            variants.push({
                index: i,
                label: `${groupName} ${count > 1 ? i + 1 : ''}`,
            });
        }
        return variants;
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

        // Get motion definition
        const definitions = (this.model.internalModel.motionManager.definitions as any)[groupName];
        if (!definitions || !definitions[motionIndex]) return;

        const def = definitions[motionIndex];
        if (!def.File) return;

        // Find voice for this motion
        const motionId = this.findMotionId(def.File);
        let audioUrl: string | undefined;

        if (motionId !== undefined && this.voiceMap[motionId]) {
            const voice = this.voiceMap[motionId];
            this.state.caption = voice.caption;
            audioUrl = this.getAudioUrl(voice.voice_key);
        } else {
            this.state.caption = null;
        }

        // Get audio delay from motion curve for manual playback or delayed library playback
        const mm = this.model?.internalModel.motionManager as any;
        const motionGroup = mm.motionGroups?.[groupName];
        const loadedMotion = motionGroup?.[motionIndex] as PrivateMotion | undefined;
        const audioDelay = loadedMotion?._audioDelay || 0;

        // Enable/disable library lip sync based on forceLipSync setting
        if (this.model?.internalModel) {
            (this.model.internalModel as any).lipSync = this.state.forceLipSync;
        }

        // Start motion with or without integrated audio+lipsync
        if (this.state.forceLipSync && audioUrl) {
            // Use library's integrated audio + additive lip sync
            const blobUrl = await this.loadAudio(audioUrl);

            // Wait for delay if experimental sync is enabled
            if (this.state.experimentalVoiceSync && audioDelay > 0) {
                await new Promise((resolve) => setTimeout(resolve, audioDelay * 1000));
            }

            await this.model.motion(groupName, motionIndex, 2, { sound: blobUrl, volume: 0.5 });
        } else {
            // Original behavior: motion only, manual audio
            await this.model.motion(groupName, motionIndex);

            // Play audio manually with delay if available
            if (audioUrl) {
                const playAudioWithDelay = async () => {
                    try {
                        // Load audio (should be instant if preloaded)
                        const blobUrl = await this.loadAudio(audioUrl);

                        // Wait for the audio delay calculated from mouth animation
                        if (this.state.experimentalVoiceSync && audioDelay > 0) {
                            await new Promise((resolve) => setTimeout(resolve, audioDelay * 1000));
                        }

                        // Stop any current audio and play new one
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
                                this.state.caption = null;
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
        // Prevent overlapping animations
        if (this.state.showProgressBar) {
            return;
        }
        const motionIndex = index ?? 0;

        // Get motion duration (preloaded during initialization)
        this.motionDuration = this.getMotionDuration(groupName, motionIndex);

        this.state.showProgressBar = true;
        this.state.isMotionPlaying = true;
        this.state.currentMotionGroup = groupName;
        this.state.currentMotionIndex = motionIndex;
        this.motionStartTime = Date.now();

        await this.playMotionWithAudio(groupName, motionIndex);
    }

    setZoom(multiplier: number, options?: { hard?: boolean }) {
        this.state.scaleMultiplier = multiplier;
        if (options?.hard) {
            // Skip spring animation: use direct zoom value (instant response)
            this.directZoom = multiplier;
        } else {
            // Use spring animation for smooth transition
            this.directZoom = null;
            this.zoomSpring.target = multiplier;
        }
    }

    resetZoom() {
        this.setZoom(0, { hard: true });
    }

    startDrag(x: number, y: number, force: boolean = false) {
        if (!this.model) return;

        // Cache initial drag coordinates for both drag and focus tracking
        this.dragStart = { x, y };
        this.modelStart = { x: this.model.position.x, y: this.model.position.y };

        // Only enable dragging if forced (middle click) or in move mode
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
            // Process move for focus if not actively dragging (e.g. hovering or verify focus update)
            this.processMove(x, y);
        }
    }

    endDrag() {
        this.isDragging = false;
        this.isForcedDrag = false;
    }

    // -- Hitbox Debug --

    async toggleHitboxDebug(enable: boolean) {
        const model = this.model;
        if (!model) return;

        if (enable && !this.hitAreaFrames) {
            try {
                const { HitAreaFrames } = await import('pixi-live2d-display-advanced/extra');
                this.hitAreaFrames = new HitAreaFrames();
                model.addChild(this.hitAreaFrames);
                // console.log('[Controller] Hitbox debug enabled');
            } catch (err) {
                // console.warn('[Controller] Failed to enable hitbox debug:', err);
            }
        } else if (!enable && this.hitAreaFrames) {
            try {
                model.removeChild(this.hitAreaFrames);
            } catch (err) {
                // Already removed or not in model
            }
            this.hitAreaFrames = undefined;
            // console.log('[Controller] Hitbox debug disabled');
        }
    }

    // -- Utilities --

    fitModelToScreen(displacement?: { x?: number; y?: number }) {
        const model = this.model;
        if (!model) return;

        //
        // // Debug: Check canvas element vs PIXI app dimensions
        // const canvasElement = this.canvas as HTMLCanvasElement;
        // console.log('[Controller] Canvas Element vs PIXI App:', {
        //     canvasElement: { width: canvasElement.width, height: canvasElement.height, clientWidth: canvasElement.clientWidth, clientHeight: canvasElement.clientHeight },
        //     appRenderer: { width: this.app.renderer.width, height: this.app.renderer.height },
        //     windowInner: { width: window.innerWidth, height: window.innerHeight },
        // });

        // 1. Reset scale to 1.0 to measure native bounds
        model.scale.set(1.0);

        // 2. Center the anchor
        model.anchor.set(0.5, 0.5);

        // 3. Measure native size
        // Note: Live2D models in Pixi can have deferred bounds updates.
        // We use internalModel original size if available, or container bounds.
        const width = model.internalModel.width || model.width;
        const height = model.internalModel.height || model.height;

        if (!width || !height) {
            // console.warn('[Controller] Model has no width/height, defaulting to 1.0 scale');
            this.baseScale = 1.0;
            return;
        }

        // 4. Calculate Scale-to-Fit
        // Use logical display dimensions scaled by 2 to account for the fixed resolution multiplier
        // This balances the fit across all device pixel ratios
        const canvasWidth = this.canvas.clientWidth * 2;
        const canvasHeight = this.canvas.clientHeight * 2;

        const scaleX = canvasWidth / width;
        const scaleY = canvasHeight / height;

        // Use the smaller scale to ensure it fits entirely
        // Multiplied by 0.85 for breathing room (padding)
        let fitScale = Math.min(scaleX, scaleY) * 0.85;

        // console.log('[Controller] Calculated Fit-to-Screen Scale:', {
        //     nativeSize: { width, height },
        //     rendererSize: { width: canvasWidth, height: canvasHeight },
        //     logicalSize: { width: this.canvas.clientWidth, height: this.canvas.clientHeight },
        //     fitScale: fitScale,
        // });

        // Initialize center variables using logical display dimensions, not internal PIXI resolution
        // The canvas is rendered at 2x resolution but displayed at 1x, so position at logical center
        let centerX = window.innerWidth / 2;
        let centerY = window.innerHeight / 2;

        // Apply custom displacement if provided (e.g., for tablet side panel offset)
        if (displacement) {
            centerX += displacement.x ?? 0;
            centerY += displacement.y ?? 0;
        }

        // Debug: Log all data relevant to centering
        try {
            // @ts-ignore
            const canvasInfo = this.model.internalModel.coreModel.getModel().canvasinfo;
            const originX = canvasInfo.CanvasOriginX;
            const originY = canvasInfo.CanvasOriginY;
            // console.log('[Controller] CanvasOrigin Info:', { originX, originY, canvasWidth, canvasHeight });

            // Visual Bounds (HitAreas)
            const internal = model.internalModel as any;
            const hitAreas = internal.hitAreas;
            let minX = Infinity,
                minY = Infinity,
                maxX = -Infinity,
                maxY = -Infinity;
            let count = 0;
            if (hitAreas) {
                for (const key of Object.keys(hitAreas)) {
                    const area = hitAreas[key];
                    if (area.index >= 0) {
                        const bounds = internal.getDrawableBounds(area.index);
                        if (bounds.width > 0 && bounds.height > 0) {
                            minX = Math.min(minX, bounds.x);
                            minY = Math.min(minY, bounds.y);
                            maxX = Math.max(maxX, bounds.x + bounds.width / 2);
                            maxY = Math.max(maxY, bounds.y + bounds.height / 2);
                            count++;
                        }
                    }
                }
            }
            if (count > 0 && minX !== Infinity) {
                const visualCenterX = (minX + maxX) / 2;
                const visualCenterY = (minY + maxY) / 2;
                // console.log('[Controller] Visual Bounds (HitAreas):', {
                //     minX,
                //     minY,
                //     maxX,
                //     maxY,
                //     visualCenterX,
                //     visualCenterY,
                // });
            } else {
                // console.log('[Controller] Visual Bounds: No valid hit areas found');
            }

            const manualOverride = (live2dOverrides as any)[this.currentCharacterCode]?.[this.currentVariant];

            if (manualOverride && typeof manualOverride.scale === 'number') {
                fitScale *= manualOverride.scale;
                // console.log(
                //     `[Controller] Applied Manual Override for ${this.currentCharacterCode}/${this.currentVariant}: Scale multiplier ${manualOverride.scale}`,
                // );
            }

            // CanvasOrigin centering aligns model's defined origin with screen center (not geometric center)
            if (typeof originX === 'number' && typeof originY === 'number') {
                const offsetX = (width / 2 - originX) / 2;
                let offsetY = (height / 2 - originY) / 2;

                // "Only Rise" Heuristic:
                // User Request: "clamp so this function only moves up if needed"
                // If offsetY < 0, it means Origin is "Lower" than Center.
                // Subtracting a negative would push the model DOWN. We ignore this.
                if (offsetY < 0) {
                    offsetY = 0;
                }

                // Adjust center position
                centerX -= offsetX * fitScale;
                centerY -= offsetY * fitScale;

                // console.log('[Controller] Applied CanvasOrigin offset (Only Rise):', { offsetX, offsetY, centerX, centerY });
            }

            // Method C: Manual Overrides (Highest Priority for specific adjustments)
            // Lifts the model further or scales it if specified in data/live2d-overrides.json
            if (manualOverride && typeof manualOverride.y === 'number') {
                // Apply offset scaled by fitScale to maintain consistency across resolutions
                const manualLift = manualOverride.y * fitScale;
                centerY -= manualLift;
                // console.log(
                //     `[Controller] Applied Manual Override for ${this.currentCharacterCode}/${this.currentVariant}: Lifting by ${manualOverride.y} (scaled: ${manualLift})`,
                // );
            }
        } catch (e) {
            // console.warn('[Controller] Failed to log centering debug info:', e);
        }

        // console.log('[Controller] Final model position:', { centerX, centerY, baseScale: fitScale * 0.5 });
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

                if (hasMissing) {
                    // console.warn(`[Controller] Parameter ${i} (${model.parameters.ids[i]}) has missing bounds data`);
                }

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
            // console.warn('[Controller] Failed to get parameters:', e);
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

        // Stop all currently playing motions
        if (typeof motionManager.stopAllMotions === 'function') {
            motionManager.stopAllMotions();
        }
    }

    pauseMotions() {
        const model = this.model;
        if (!model?.internalModel?.motionManager) return;

        const motionManager = model.internalModel.motionManager as unknown as ExtendedMotionManager;

        // Stop all currently playing motions
        if (typeof motionManager.stopAllMotions === 'function') {
            motionManager.stopAllMotions();
        }

        // Disable idle motions so they don't auto-start
        this.originalIdleGroup = motionManager.groups.idle;
        motionManager.groups.idle = null;

        // Stop progress bar immediately
        this.state.showProgressBar = false;
        this.state.motionProgress = 0;
        this.motionStartTime = 0;

        // console.log('[Controller] Motions paused - parameters can now be adjusted');
    }

    resumeMotions() {
        const model = this.model;
        if (!model?.internalModel?.motionManager) return;

        const motionManager = model.internalModel.motionManager;

        // Restore idle motions
        if (this.originalIdleGroup) {
            motionManager.groups.idle = this.originalIdleGroup;
        }
    }

    setParameterValue(paramName: string, value: number) {
        const model = this.model;
        if (!model?.internalModel?.coreModel) return;

        try {
            const coreModel = model.internalModel.coreModel as any;
            coreModel.setParameterValueById(paramName, value);
            model.update(0);

            // Optimistically update local state to avoid full re-render
            const param = this.state.parameters.find((p) => p.name === paramName);
            if (param) {
                param.value = value;
            }
        } catch (e) {
            // console.warn(`[Controller] Failed to set parameter ${paramName}:`, e);
        }
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
        // Map to ensure missing is always boolean (not optional)
        this.state.parameters = params.map((p) => ({
            ...p,
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
        coreModel.setPartOpacityById?.(id, opacity);
        // Update state to reflect change
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
            // We don't use model.automator.autoFocus anymore because it normalizes magnitude
            // We handle it manually in handleGlobalPointerMove

            if (enabled) {
                window.addEventListener('pointermove', this.handleGlobalPointerMove);
                // Trigger an initial update with current mouse position if possible,
                // but we don't track mouse globally without events.
                // It will update on next move.
            } else {
                window.removeEventListener('pointermove', this.handleGlobalPointerMove);
                // Reset to center
                (this.model.internalModel as unknown as ExtendedInternalModel).focusController.focus(0, 0);
            }
        }
    }

    private handleGlobalPointerMove = (event: PointerEvent) => {
        if (!this.model) return;
        this.processMove(event.clientX, event.clientY);
    };

    private cleanupModel() {
        // Clean up hitbox debug frames first
        if (this.hitAreaFrames) {
            try {
                this.model?.removeChild(this.hitAreaFrames);
            } catch (e) {
                // Already removed
            }
            this.hitAreaFrames = undefined;
        }

        if (this.model) {
            try {
                // Remove from stage first
                this.app.stage.removeChild(this.model);
            } catch (e) {
                // Already removed or not in stage
            }
            try {
                // Destroy with texture cleanup to release GPU memory and texture cache entries
                this.model.destroy({ texture: true, baseTexture: true });
            } catch (e) {
                // console.warn('[Controller] Error destroying model:', e);
            }
            this.model = undefined;
        }
        // Clear cached data
        this.motionMap = {};
        this.voiceMap = {};
        this.fileToMotionId = {};
        this.currentCharacterCode = '';

        // Clear stage completely
        this.app.stage.removeChildren();
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

        // Prevent focus tracking when actively dragging in move mode
        if (this.isDragging) {
            return;
        }

        // Focus mode (look at cursor)
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Convert to model space using the model's transform
        const tempPoint = new PIXI.Point(x, y);
        const modelPoint = new PIXI.Point();

        this.model.toModelPosition(tempPoint, modelPoint);

        // Normalize to [-1, 1] relative to model original size
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
