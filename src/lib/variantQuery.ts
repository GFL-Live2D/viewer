import { internalVariant } from '$lib/modelResolve';

// Params that carry their own meaning and so never name a variant
const RESERVED = new Set(['model', 'only', 'variant', 'ui', 'transparent']);

// Variant names double as bare query keys, so ?damaged reads the same as ?variant=damaged
export function requestedVariant(params: URLSearchParams): string {
    const named = params.get('variant');
    if (named) return internalVariant(named);

    for (const [key, value] of params) {
        if (RESERVED.has(key)) continue;
        // A bare key carries no value, so the key itself names the variant
        if (!value) return internalVariant(key);
    }

    return '';
}
