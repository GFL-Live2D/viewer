import type { Live2DModelIndex } from '$lib/model-data/live2d';
import { displayVariant, pathSlug, shareLabel, shareQueryLabel } from '$lib/modelResolve';

// Where the viewer is served from
interface Origin {
    protocol: string;
    host: string;
    subdomainMode: boolean;
    subdomain: string;
    apex?: string;
}

// What the URL asks the viewer to show
interface Selection {
    model?: Live2DModelIndex;
    variant?: string;
    hideUI?: boolean;
    transparent?: boolean;
    only?: boolean;
    carry?: URLSearchParams;
    readable?: boolean;
}

export type ShareContext = Origin & Pick<Selection, 'variant' | 'hideUI'>;
export type EmbedContext = Origin & Pick<Selection, 'variant' | 'transparent' | 'readable'>;

// A proxy may hide the browser's hostname from the server, so the apex is trusted over it
export function apexHost(host: string, subdomain: string, apex = ''): string {
    if (subdomain) return host.slice(host.indexOf('.') + 1);
    if (apex && host !== apex && host.endsWith(`.${apex}`)) return apex;
    return host;
}

export { shareLabel };

// In subdomain mode the model rides in the hostname, so the origin differs per model
function viewerOrigin(entry: Live2DModelIndex, ctx: Origin): string {
    if (!ctx.subdomainMode) return `${ctx.protocol}//${ctx.host}`;

    const apex = apexHost(ctx.host, ctx.subdomain, ctx.apex);
    return `${ctx.protocol}//${shareLabel(entry)}.${apex}`;
}

// The query every viewer URL shares. URLSearchParams always writes key=value, so the variant and
// the flags are appended bare, and a readable query trades + back for the space it encoded.
export function buildQuery(opts: Selection): string {
    const params = new URLSearchParams();
    if (opts.model) params.set('model', shareQueryLabel(opts.model));
    if (opts.hideUI) params.set('ui', '0');

    // A valueless key is a variant, which is rewritten from state rather than carried over
    for (const [key, value] of opts.carry ?? []) {
        if (value && !params.has(key)) params.append(key, value);
    }

    const bare: string[] = [];
    if (opts.only) bare.push('only');
    if (opts.variant && opts.variant !== 'normal') bare.push(displayVariant(opts.variant));
    if (opts.transparent) bare.push('transparent');

    const encoded = opts.readable
        ? params.toString().replace(/\+/g, ' ')
        : params.toString();

    return [encoded, ...bare].filter(Boolean).join('&');
}

// Wiki titles match the mapped display name with underscores for spaces
export function buildWikiLink(name: string | undefined | null, subpage = ''): string | null {
    if (!name) return null;

    // MOD3 units share the base gun page, and the wiki drops the Gr prefix
    const title = name
        .trim()
        .replace(/[ _]MOD3$/i, '')
        .replace(/^Gr[ _]/i, '')
        .replace(/ /g, '_');
    if (!title) return null;

    const path = subpage ? `${title}/${subpage}` : title;
    return `https://iopwiki.com/wiki/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
}

// Keeps the panels, so the model is named with ?model rather than ?only
export function buildPanelEmbedLink(entry: Live2DModelIndex, ctx: EmbedContext): string {
    const query = buildQuery({
        model: ctx.subdomainMode ? undefined : entry,
        variant: ctx.variant,
        transparent: ctx.transparent,
        readable: ctx.readable,
    });

    return `${viewerOrigin(entry, ctx)}/${query ? `?${query}` : ''}`;
}

// Prerendered path, which serves the model alone and is already transparent. A subdomain already
// names the model, so there it stays on the root and only tags itself with ?only.
export function buildPathEmbedLink(entry: Live2DModelIndex, ctx: EmbedContext): string {
    if (ctx.subdomainMode) {
        const query = buildQuery({
            only: true,
            variant: ctx.variant,
            transparent: ctx.transparent,
        });
        return `${viewerOrigin(entry, ctx)}/?${query}`;
    }

    const variant = ctx.variant && ctx.variant !== 'normal' ? displayVariant(ctx.variant) : '';
    return `${ctx.protocol}//${ctx.host}/${pathSlug(entry.code)}${variant ? `/${variant}` : ''}`;
}

export function buildShareLink(entry: Live2DModelIndex, ctx: ShareContext): string {
    const query = buildQuery({
        model: ctx.subdomainMode ? undefined : entry,
        variant: ctx.variant,
        hideUI: ctx.hideUI,
    });

    return `${viewerOrigin(entry, ctx)}/${query ? `?${query}` : ''}`;
}
