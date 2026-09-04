import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loadGunData, loadSingleModelData } from '$lib/server/gun';
import { findModelByName } from '$lib/server/live2d';
import { requestedVariant } from '$lib/variantQuery';

export const load: PageServerLoad = async ({ url, locals }) => {
    const params = url.searchParams;
    const onlyQuery = params.get('only');

    // ?only= serves the viewer alone, so the model resolves here and the panels never load
    if (onlyQuery !== null) {
        // A bare ?only lets the subdomain name the model, keeping the pretty host in embeds
        const target = onlyQuery || (locals.subdomainMode ? locals.subdomain : '');
        if (!target) error(400, '?only needs a model, or a subdomain to take one from');

        const model = await findModelByName(target);
        if (!model) error(404, `No model matches "${target}"`);

        const data = await loadSingleModelData(model);
        if (data.assetsMissing) return { assetsMissing: true, only: true };

        const requested = requestedVariant(params);
        const variant =
            data.variants.find((v) => v.toLowerCase() === requested.toLowerCase()) ||
            data.variants.find((v) => v.toLowerCase() === 'normal') ||
            data.variants[0] ||
            'normal';

        return {
            ...data,
            only: true,
            variant,
            transparent: params.get('transparent') === '1',
        };
    }

    let subdomainModel = null;
    if (locals.subdomainMode && locals.subdomain && !params.get('model')) {
        subdomainModel = await findModelByName(locals.subdomain);
        // Unmatched names are not ours, so the caller can route them elsewhere
        if (!subdomainModel) error(404, 'No model for this subdomain');
    }

    return {
        only: false,
        hideUIOnLoad: params.get('ui') === '0',
        subdomainMode: locals.subdomainMode,
        subdomain: locals.subdomain,
        subdomainModel,
        ...(await loadGunData()),
    };
};
