import type { Handle, HandleServerError } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import { parseTheme, routeTheme } from '$lib/theme';

export const handleError: HandleServerError = ({ error, event }) => {
    console.error('[viewer error]', event.url.pathname, error);
    return { message: 'Internal Error' };
};

// Leftmost label of the host, minus the port. Apex and bare hosts yield ''.
const extractSubdomain = (host: string): string => {
    const parts = host.split(':')[0].split('.');

    if (parts[parts.length - 1] === 'localhost') {
        return parts.length > 1 ? parts[0] : '';
    }
    return parts.length > 2 ? parts[0] : '';
};

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.subdomainMode = env.SUBDOMAIN_MODE === '1';
    event.locals.subdomain = event.locals.subdomainMode
        ? extractSubdomain(event.request.headers.get('host') ?? '')
        : '';

    // A prerendered page is one file for every query string, so only the route's theme is baked in
    const queryTheme = building ? null : parseTheme(event.url.searchParams.get('theme'));
    const initial = queryTheme ?? routeTheme(event.route.id);
    const response = await resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace('%theme%', initial ? ` data-theme="${initial}"` : ''),
    });

    // The viewer is meant to be embeddable
    response.headers.set('Content-Security-Policy', 'frame-ancestors *;');
    response.headers.delete('X-Frame-Options');

    return response;
};
