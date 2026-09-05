import type { Live2DModelIndex } from '$lib/model-data/live2d';

// "destroy" is the internal name for what the UI and share links call "damaged"
export function displayVariant(variant: string): string {
    return variant.toLowerCase() === 'destroy' ? 'damaged' : variant;
}

export function internalVariant(variant: string): string {
    return variant.toLowerCase() === 'damaged' ? 'destroy' : variant;
}

// Hostname labels and query values both lose punctuation, so keys are compared stripped
export function normaliseKey(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function shareName(entry: Pick<Live2DModelIndex, 'code' | 'costumeName'>): string {
    const mod = /Mod(_\d+)?$/i.test(entry.code);
    return mod || !entry.costumeName ? entry.code : entry.costumeName;
}

// Hostname labels cannot carry spaces or punctuation
export function shareLabel(entry: Pick<Live2DModelIndex, 'code' | 'costumeName'>): string {
    return normaliseKey(shareName(entry));
}

// A query value only has to survive encoding, so it keeps the spacing that makes it readable
export function shareQueryLabel(entry: Pick<Live2DModelIndex, 'code' | 'costumeName'>): string {
    return shareName(entry)
        .trim()
        .replace(/[^a-zA-Z0-9 ]/g, ' ')
        .replace(/\s+/g, ' ');
}

// Hyphens survive normaliseKey's stripping, so a readable path still matches a flat one
export function pathSlug(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function modelSlugs(entry: Live2DModelIndex): string[] {
    const names = [entry.costumeName, entry.gunName, entry.code, entry.directory];
    const slugs = names.filter((n): n is string => !!n).map(pathSlug);
    return [...new Set(slugs.filter(Boolean))];
}

export function resolveModel(
    models: Live2DModelIndex[],
    name: string,
    aliases: Record<string, string> = {},
): Live2DModelIndex | null {
    if (!name) return null;

    const target = normaliseKey(aliases[name.toLowerCase()] ?? name);
    if (!target) return null;

    const exact = (m: Live2DModelIndex) =>
        normaliseKey(m.gunName || '') === target ||
        normaliseKey(m.code) === target ||
        normaliseKey(m.directory) === target;

    const suffixless = (m: Live2DModelIndex) => normaliseKey(m.code.replace(/_\d+$/, '')) === target;

    // Costumes are matched last so they never shadow a gun name or code
    return (
        models.find(exact) ??
        models.find(suffixless) ??
        models.find((m) => normaliseKey(m.costumeName || '') === target) ??
        null
    );
}
