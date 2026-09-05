import type { PageLoad } from './$types';
import { loadGunData } from '$lib/model-data/gun';
import { subdomainMode } from '$lib/subdomain';

// Prerendering forbids reading the query here, so the component resolves it after hydration
export const prerender = true;

export const load: PageLoad = async () => {
    return {
        subdomainMode,
        ...(await loadGunData()),
    };
};
