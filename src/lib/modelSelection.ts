import type { Live2DModelIndex } from '$lib/server/live2d';
import { buildShareLink } from '$lib/shareLinks';

// "destroy" is the internal name for what the UI and share links call "damaged"
export function displayVariant(variant: string): string {
    return variant.toLowerCase() === 'destroy' ? 'damaged' : variant;
}

export function internalVariant(variant: string): string {
    return variant.toLowerCase() === 'damaged' ? 'destroy' : variant;
}

// The variant a swap button switches to, undefined when the model has only one
export function otherVariantOf(
    entry: Live2DModelIndex | null,
    currentVariant: string,
    variantsByModel: Record<string, string[]>,
): string | undefined {
    if (!entry) return undefined;
    return (variantsByModel[entry.directory] ?? []).find((v) => v !== currentVariant);
}

export interface CopyLinkOptions {
    subdomainMode: boolean;
    subdomain: string;
    variant: string;
    hideUI: boolean;
}

// Resolves false when the clipboard is unavailable, so callers can skip the copied indicator
export async function copyShareLink(
    entry: Live2DModelIndex | null,
    opts: CopyLinkOptions,
): Promise<boolean> {
    if (!entry) return false;

    const link = buildShareLink(entry, {
        protocol: window.location.protocol,
        host: window.location.host,
        ...opts,
    });

    try {
        await navigator.clipboard.writeText(link);
        return true;
    } catch (err) {
        console.error('Failed to copy link:', err);
        return false;
    }
}
