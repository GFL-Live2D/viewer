import type { Handle, HandleServerError } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

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

    const response = await resolve(event);

    // The viewer is meant to be embeddable
    response.headers.set('Content-Security-Policy', 'frame-ancestors *;');
    response.headers.delete('X-Frame-Options');

    return response;
};
