import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { SORT_BY_STORAGE_KEY, parseSortBy, type SortBy } from '$lib/sortBy';
import type { Live2DController } from '$lib/live2d/Live2DController.svelte';
import type { Live2DModelIndex } from '$lib/model-data/live2d';

// Controller instance (single source of truth for model state)
export const controller = writable<Live2DController | undefined>(undefined);

// Model selection state
export const selectedModel = writable<string>('');
export const selectedVariant = writable<string>('');
export const selectedCharacterEntry = writable<Live2DModelIndex | null>(null);

// Last normal/damaged choice
export const preferredVariantKind = writable<'normal' | 'damaged'>('normal');

// Model data
export const models = writable<Live2DModelIndex[]>([]);
export const filteredModels = writable<any[]>([]);
export const modelNames = writable<Record<string, string>>({});
export const variantsByModel = writable<Record<string, string[]>>({});

// Hostname carries the model, so share links are built as subdomains
export const subdomainMode = writable<boolean>(false);
export const subdomain = writable<string>('');

// The model list renders only after the client measures the viewport, so localStorage is in time
function createSortByStore() {
    const initial = parseSortBy(browser ? localStorage.getItem(SORT_BY_STORAGE_KEY) : null);

    const { subscribe, set, update } = writable<SortBy>(initial);

    function persist(value: SortBy) {
        if (browser) localStorage.setItem(SORT_BY_STORAGE_KEY, value);
    }

    return {
        subscribe,
        set: (value: SortBy) => {
            persist(value);
            set(value);
        },
        update: (updater: (value: SortBy) => SortBy) => {
            update((current) => {
                const next = updater(current);
                persist(next);
                return next;
            });
        },
    };
}

export type ListDensity = 'list' | 'table';

const LIST_DENSITY_STORAGE_KEY = 'gfl:list-density';

// Null means no explicit choice, which leaves the density to the CSS width rules
function createListDensityStore() {
    const stored = browser ? localStorage.getItem(LIST_DENSITY_STORAGE_KEY) : null;
    const initial = stored === 'table' || stored === 'list' ? stored : null;
    const { subscribe, set } = writable<ListDensity | null>(initial);

    return {
        subscribe,
        set: (value: ListDensity) => {
            if (browser) localStorage.setItem(LIST_DENSITY_STORAGE_KEY, value);
            set(value);
        },
    };
}

// UI filters and preferences
export const searchQuery = writable<string>('');
export const sortBy = createSortByStore();
export const listDensity = createListDensityStore();
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
