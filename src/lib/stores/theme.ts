import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'sangvis' | 'paradeus';

const STORAGE_KEY = 'theme-preference';
const DEFAULT_THEME: Theme = 'sangvis';

function applyTheme(value: Theme) {
    document.documentElement.dataset.theme = value;
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (icon) icon.href = value === 'sangvis' ? '/sangvis.png' : '/paradeus.png';
}

function createThemeStore() {
    const stored = browser ? localStorage.getItem(STORAGE_KEY) : null;
    const initial: Theme = (stored as Theme) || DEFAULT_THEME;

    const { subscribe, set, update } = writable<Theme>(initial);

    if (browser) applyTheme(initial);

    return {
        subscribe,
        set: (value: Theme) => {
            if (browser) {
                localStorage.setItem(STORAGE_KEY, value);
                applyTheme(value);
            }
            set(value);
        },
        toggle: () => {
            update((current) => {
                const next: Theme = current === 'sangvis' ? 'paradeus' : 'sangvis';
                if (browser) {
                    localStorage.setItem(STORAGE_KEY, next);
                    applyTheme(next);
                }
                return next;
            });
        },
    };
}

export const theme = createThemeStore();
