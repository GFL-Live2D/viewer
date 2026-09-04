import type { Live2DModelIndex } from '$lib/server/live2d';
import { shareLabel } from '$lib/modelResolve';

export interface ShareContext {
    protocol: string;
    host: string;
    subdomainMode: boolean;
    subdomain: string;
    apex?: string;
    variant: string;
    hideUI: boolean;
}

export interface EmbedContext {
    protocol: string;
    host: string;
    subdomainMode: boolean;
    subdomain: string;
    apex?: string;
    variant: string;
    transparent?: boolean;
}

// A proxy may hide the browser's hostname from the server, so the apex is trusted over it
export function apexHost(host: string, subdomain: string, apex = ''): string {
    if (subdomain) return host.slice(host.indexOf('.') + 1);
    if (apex && host !== apex && host.endsWith(`.${apex}`)) return apex;
    return host;
}

export { shareLabel };

// Embeds pin their model with ?only, valueless when the hostname already names one
export function buildEmbedLink(entry: Live2DModelIndex, ctx: EmbedContext): string {
    const params = new URLSearchParams();
    if (ctx.variant && ctx.variant !== 'normal') params.set('variant', ctx.variant);
    if (ctx.transparent) params.set('transparent', '1');
    const rest = params.toString();

    if (ctx.subdomainMode) {
        const host = `${shareLabel(entry)}.${apexHost(ctx.host, ctx.subdomain, ctx.apex)}`;
        return `${ctx.protocol}//${host}/?only${rest ? `&${rest}` : ''}`;
    }

    return `${ctx.protocol}//${ctx.host}/?only=${entry.code.toLowerCase()}${rest ? `&${rest}` : ''}`;
}

export function buildShareLink(entry: Live2DModelIndex, ctx: ShareContext): string {
    const params = new URLSearchParams();
    if (ctx.variant && ctx.variant !== 'normal') params.set('variant', ctx.variant);
    if (ctx.hideUI) params.set('ui', '0');

    if (ctx.subdomainMode) {
        const label = shareLabel(entry);
        const query = params.toString();
        return `${ctx.protocol}//${label}.${apexHost(ctx.host, ctx.subdomain, ctx.apex)}/${query ? `?${query}` : ''}`;
    }

    params.set('model', entry.code.toLowerCase());
    return `${ctx.protocol}//${ctx.host}/?${params.toString()}`;
}
