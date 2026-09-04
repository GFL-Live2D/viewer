import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loadGunData } from '$lib/server/gun';
import { findModelByName } from '$lib/server/live2d';

export const load: PageServerLoad = async ({ url, locals }) => {
    const hasModelQuery = Boolean(url.searchParams.get('model'));
    let subdomainModel = null;

    if (locals.subdomainMode && locals.subdomain && !hasModelQuery) {
        subdomainModel = await findModelByName(locals.subdomain);
        // Unmatched names are not ours, so the caller can route them elsewhere
        if (!subdomainModel) error(404, 'No model for this subdomain');
    }

    return {
        hideUIOnLoad: url.searchParams.get('ui') === '0',
        subdomainMode: locals.subdomainMode,
        subdomain: locals.subdomain,
        subdomainModel,
        ...(await loadGunData()),
    };
};
