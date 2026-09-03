import { writable } from 'svelte/store';
import type { Live2DController } from '$lib/live2d/Live2DController.svelte';
import type { Live2DModelIndex } from '$lib/server/live2d';

// Controller instance (single source of truth for model state)
export const controller = writable<Live2DController | undefined>(undefined);

// Model selection state
export const selectedModel = writable<string>('');
export const selectedVariant = writable<string>('');
export const selectedCharacterEntry = writable<Live2DModelIndex | null>(null);

// Model data
export const models = writable<Live2DModelIndex[]>([]);
export const filteredModels = writable<any[]>([]);
export const modelNames = writable<Record<string, string>>({});
export const variantsByModel = writable<Record<string, string[]>>({});

// UI filters and preferences
export const searchQuery = writable<string>('');
export const sortBy = writable<'gun' | 'id' | 'name'>('gun');
export const filterDuplicates = writable<boolean>(true);
export const decensor = writable<boolean>(false);
export const isCaptionDetached = writable<boolean>(false);

// UI layout state (desktop/mobile can share or override these)
export const uiState = writable({
    isLeftPanelOpen: true,
    isAllPanelsExpanded: true,
    isParametersPanelOpen: true,
    hideUI: false, // Master UI visibility toggle (used in direct gun mode)
});

export const viewerPreferences = writable({
    renderCaptionsOnCanvas: false,
    followParameterValues: false,
    focusWeight: 3,
    isAlwaysFocus: false,
    showHitboxDebug: false,
    useCustomInitialPositioning: true,
});

// Action to select a model and update characterEntry atomically
export function selectModelFull(modelId: string, modelsArray: Live2DModelIndex[]) {
    const entry = modelsArray.find((m) => m.id === modelId);
    selectedModel.set(modelId);
    selectedCharacterEntry.set(entry ?? null);
}
