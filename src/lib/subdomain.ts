import { env } from '$lib/publicEnv';

// A static build has one origin and no wildcard DNS, so hostnames can never name a model
const STATIC_BUILD = import.meta.env.VITE_BUILD_TARGET === 'static';

export const subdomainMode = !STATIC_BUILD && env.PUBLIC_SUBDOMAIN_MODE === '1';

// Leftmost label of the host, minus the port. Apex and bare hosts yield ''.
export function extractSubdomain(host: string): string {
    const parts = host.split(':')[0].split('.');

    if (parts[parts.length - 1] === 'localhost') {
        return parts.length > 1 ? parts[0] : '';
    }
    return parts.length > 2 ? parts[0] : '';
}

// Gallery hosts are an ecclesiastes convention, so they never name a model
const RESERVED = new Set(['gfl', 'live2d', 'l2d', 'gun', 'www']);

export function modelSubdomain(host: string): string {
    if (!subdomainMode) return '';
    const label = extractSubdomain(host);
    return RESERVED.has(label) ? '' : label;
}
