import type { Live2DModelIndex } from '$lib/server/live2d';

// Hostname labels and query values both lose punctuation, so keys are compared stripped
export function normaliseKey(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function shareLabel(entry: Pick<Live2DModelIndex, 'code' | 'costumeName'>): string {
    if (/Mod(_\d+)?$/i.test(entry.code) || !entry.costumeName) {
        return normaliseKey(entry.code);
    }
    return normaliseKey(entry.costumeName);
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
