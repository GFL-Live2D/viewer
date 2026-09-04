import type { Live2DModelIndex } from '$lib/server/live2d';
import { shareLabel } from '$lib/modelResolve';

export interface ShareContext {
    protocol: string;
    host: string;
    subdomainMode: boolean;
    subdomain: string;
    variant: string;
    hideUI: boolean;
}

export function apexHost(host: string, subdomain: string): string {
    return subdomain ? host.slice(host.indexOf('.') + 1) : host;
}

export { shareLabel };

export function buildShareLink(entry: Live2DModelIndex, ctx: ShareContext): string {
    const params = new URLSearchParams();
    if (ctx.variant && ctx.variant !== 'normal') params.set('variant', ctx.variant);
    if (ctx.hideUI) params.set('ui', '0');

    if (ctx.subdomainMode) {
        const label = shareLabel(entry);
        const query = params.toString();
        return `${ctx.protocol}//${label}.${apexHost(ctx.host, ctx.subdomain)}/${query ? `?${query}` : ''}`;
    }

    params.set('model', entry.code.toLowerCase());
    return `${ctx.protocol}//${ctx.host}/?${params.toString()}`;
}
