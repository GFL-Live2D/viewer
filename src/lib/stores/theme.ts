import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { type Theme, DEFAULT_THEME, parseTheme } from '$lib/theme';

const STORAGE_KEY = 'theme-preference';

function createThemeStore() {
    const stored = browser ? localStorage.getItem(STORAGE_KEY) : null;
    const initial: Theme = parseTheme(stored) ?? DEFAULT_THEME;

    const { subscribe, set, update } = writable<Theme>(initial);

    const persist = (value: Theme) => {
        if (browser) localStorage.setItem(STORAGE_KEY, value);
    };

    return {
        subscribe,
        set: (value: Theme) => {
            persist(value);
            set(value);
        },
        toggle: () => {
            update((current) => {
                const next: Theme = current === 'sangvis' ? 'paradeus' : 'sangvis';
                persist(next);
                return next;
            });
        },
    };
}

export const theme = createThemeStore();
