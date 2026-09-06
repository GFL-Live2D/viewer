import { Live2DModel } from 'untitled-pixi-live2d-engine';
import * as PIXI from 'pixi.js';
export declare const ZOOM_MIN = -20;
export declare const ZOOM_MAX = 20;
export declare enum ModelLoadingState {
    IDLE = "idle",
    LOADING = "loading",
    READY = "ready",
    ERROR = "error"
}
interface CharacterEntry {
    id: number;
    code: string;
    directory: string;
    motions: number[];
}
export interface Live2DState {
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
    groupAudioState: Record<string, boolean>;
    isMoveMode: boolean;
    isAlwaysFocus: boolean;
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
    highlightHoveredPart: boolean;
    overriddenParams: number[];
    isFrozen: boolean;
    motionsPaused: boolean;
    followParameterValues: boolean;
    forceLipSync: boolean;
    renderCaptionsOnCanvas: boolean;
    useCustomInitialPositioning: boolean;
}
export declare class Live2DController {
    app: PIXI.Application;
    model: Live2DModel | undefined;
    private canvas;
    private bgSprite;
    private bgUrl;
    private modelUrl;
    private highlightedPartId;
    private paramOverrides;
    private applyOverrides?;
    private frozenEffects?;
    private GifSource;
    private captionText;
    private captionInsets;
    private isCanvasCaptionSuppressed;
    state: Live2DState;
    private motionMap;
    private voiceMap;
    private normalVoiceMap;
    private currentCharacterCode;
    private currentVariant;
    private assetBaseUrl;
    private fileToMotionId;
    private motionMetadata;
    private motionGroups;
    private isDragging;
    private isForcedDrag;
    private dragStart;
    private modelStart;
    private baseScale;
    private defaultZoom;
    private zoomSpring;
    private resizeObserver;
    private gestureManager;
    private pinchZoomEnabled;
    private directZoom;
    private loadId;
    private cubism4Promise;
    private hitAreaFrames?;
    private motionStartTime;
    private motionDuration;
    private currentAudio;
    private audioPromiseCache;
    private audioProgressInterval;
    private audioPlayPending;
    private initPromise;
    constructor(canvas: HTMLCanvasElement);
    private initPixi;
    private initializeCubism4;
    private handleResize;
    private handleAutoFit;
    setAutoFitOnResize(enabled: boolean): void;
    private updateCaptionLayout;
    setCaptionInsets(left: number, right: number, bottom?: number): void;
    setCanvasCaptionSuppressed(suppressed: boolean): void;
    private startRendering;
    loadCharacter(entry: CharacterEntry, variant?: string, motionData?: any, voiceData?: any, shouldResetZoom?: boolean, assetBaseUrl?: string, normalVoiceData?: any): Promise<boolean>;
    private extractDefaultZoom;
    private extractMotionGroupsFromModel;
    private extractMotionDurationsFromModel;
    private loadMotionData;
    private loadVoiceData;
    private bgTransform;
    setBackground(url: string | null): Promise<void>;
    updateBackground(x: number, y: number, scale: number): void;
    private applyBackgroundTransform;
    private setupRepeatParameters;
    private removeWindowInteractionListeners;
    private setupInteraction;
    private setupGestureManager;
    private findGroupsForHitArea;
    private handleTap;
    private findMotionId;
    private getAudioUrl;
    private loadAudio;
    private getFallbackAudioUrl;
    private preloadAllVoiceLines;
    private updateGroupAudioState;
    private playVoice;
    private stopAudio;
    playAudioOnly(motionId: number): Promise<void>;
    private stopAudioProgress;
    private shouldBorrowNormalVoice;
    getUnmappedVoicelines(): Array<{
        motionId: number;
        voice_key: string;
        caption: string;
    }>;
    private findMotionMetadata;
    private resolveAudioDelay;
    getMotionGroups(): string[];
    getMotionCountForGroup(groupName: string): number;
    getMotionVariants(groupName: string): Array<{
        index: number;
        label: string;
    }>;
    private getMotionLabel;
    private getMotionDuration;
    private playMotionWithAudio;
    playMotionGroup(groupName: string, index?: number): Promise<void>;
    setForceLipSync(enabled: boolean): void;
    setZoom(multiplier: number, options?: {
        hard?: boolean;
    }): void;
    zoomAtPoint(multiplier: number, x: number, y: number): void;
    getCurrentZoom(): number;
    setPinchZoomEnabled(enabled: boolean): void;
    resetZoom(): void;
    startDrag(x: number, y: number, force?: boolean): void;
    handleDrag(x: number, y: number): void;
    endDrag(): void;
    toggleHitboxDebug(enable: boolean): Promise<void>;
    fitModelToScreen(displacement?: {
        x?: number;
        y?: number;
    }): void;
    cleanup(): void;
    getAvailableParameters(): {
        index: number;
        name: string;
        value: number;
        min: number;
        max: number;
        default: number;
        missing?: boolean;
    }[];
    logParameterValues(): {
        index: number;
        name: string;
        value: number;
        min: number;
        max: number;
        default: number;
        missing?: boolean;
    }[];
    private originalIdleGroup;
    stopAllMotions(): void;
    pauseMotions(): void;
    resumeMotions(): void;
    setParameterValue(paramName: string, value: number): void;
    private ensureOverrideHook;
    private removeOverrideHook;
    /**
     * Release one parameter back to animation control
     */
    releaseParameter(index: number): void;
    /**
     * Release every pinned parameter
     */
    releaseAllParameters(): void;
    /**
     * Suspend the per-frame parameter writers while leaving the ticker running so edits still draw
     */
    setFrozen(frozen: boolean): void;
    /**
     * Toggle move/drag mode
     */
    setMoveMode(enabled: boolean): void;
    /**
     * Check if currently dragging (for UI layer)
     */
    get isCurrentlyDragging(): boolean;
    /**
     * Refresh parameters state from model (used after manual parameter changes)
     */
    refreshParametersState(): void;
    /**
     * Get available parts with current opacity values and update state
     */
    refreshPartsState(): {
        id: any;
        index: number;
        opacity: any;
    }[];
    /**
     * Set part opacity by ID
     */
    setPartOpacity(id: string, opacity: number): void;
    /**
     * Reset all parts to full opacity
     */
    resetPartOpacities(): void;
    /**
     * Tint one part with an additive screen colour so hovering its label reveals it on the model
     */
    highlightPart(id: string | null): void;
    /**
     * Drop the highlight without touching state the next model load rebuilds
     */
    clearPartHighlight(): void;
    /**
     * Enable/disable real-time parameter following
     */
    setFollowParameters(enabled: boolean): void;
    setFocusWeight(weight: number): void;
    setAlwaysFocus(enabled: boolean): void;
    private handleGlobalPointerMove;
    private cleanupModel;
    private handleGlobalTouchMove;
    private handleGlobalPointerUp;
    private handleGlobalTouchEnd;
    private removeTouchListeners;
    private processMove;
}
export {};
