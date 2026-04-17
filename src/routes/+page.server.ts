import type { PageServerLoad } from './$types';
import { loadGunData } from '$lib/server/gun';

export const load: PageServerLoad = async ({ url }) => {
    return {
        hideUIOnLoad: url.searchParams.get('ui') === '0',
        ...(await loadGunData()),
    };
};
