// Unknown names fall back to normal so a bad request still renders
export function resolveVariant(variants: string[], requested: string): string {
    return (
        variants.find((v) => v.toLowerCase() === requested.toLowerCase()) ||
        variants.find((v) => v.toLowerCase() === 'normal') ||
        variants[0] ||
        'normal'
    );
}
