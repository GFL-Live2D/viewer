export type Theme = 'sangvis' | 'paradeus';

export const DEFAULT_THEME: Theme = 'sangvis';

// Embed routes carry no toggle, so they pin a theme rather than follow the visitor's preference
const EMBED_THEME: Theme = 'paradeus';
const EMBED_ROUTES = new Set(['/[model]', '/[model]/[variant]']);

export function routeTheme(routeId: string | null): Theme | null {
    return EMBED_ROUTES.has(routeId ?? '') ? EMBED_THEME : null;
}

export function parseTheme(value: string | null | undefined): Theme | null {
    const v = value?.toLowerCase();
    return v === 'sangvis' || v === 'paradeus' ? v : null;
}

export function themeIcon(value: Theme): string {
    return value === 'sangvis' ? '/sangvis.png' : '/paradeus.png';
}
