import { browser } from '$app/environment';

// Tailwind v4 emits @theme breakpoints as :root custom properties, so CSS stays the single source
function readBreakpoint(name: string, fallback: number): number {
    if (!browser) return fallback;
    const raw = getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-${name}`);
    return parseFloat(raw) || fallback;
}

// Width where the side panel layout replaces the mobile drawer
export const sidePanelMinWidth = () => readBreakpoint('md', 768);

// Above this the layout has room for the wide desktop arrangement
export const desktopMinWidth = () => readBreakpoint('2xl', 1800);
