import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { loadGunData, loadSingleModelData } from '$lib/model-data/gun';
import { findModelByName } from '$lib/model-data/live2d';
import { requestedVariant } from '$lib/variantQuery';
import { modelSubdomain, subdomainMode } from '$lib/subdomain';
import { resolveVariant } from '$lib/model-data/variantPick';

// Query params drive this route, so a prerender would freeze one set of them
export const prerender = false;

export const load: PageLoad = async ({ url, fetch }) => {
    const params = url.searchParams;
    const onlyQuery = params.get('only');
    const subdomain = modelSubdomain(url.host);

    // ?only= serves the viewer alone, so the model resolves here and the panels never load
    if (onlyQuery !== null) {
        // A bare ?only lets the subdomain name the model, keeping the pretty host in embeds
        const target = onlyQuery || subdomain;
        if (!target) error(400, '?only needs a model, or a subdomain to take one from');

        const model = await findModelByName(target);
        if (!model) error(404, `No model matches "${target}"`);

        const data = await loadSingleModelData(model, fetch);
        if (data.assetsMissing) return { assetsMissing: true, only: true };

        return {
            ...data,
            only: true,
            variant: resolveVariant(data.variants, requestedVariant(params)),
            transparent: params.get('transparent') === '1',
        };
    }

    let subdomainModel = null;
    if (subdomain && !params.get('model')) {
        subdomainModel = await findModelByName(subdomain);
        // Unmatched names are not ours, so the caller can route them elsewhere
        if (!subdomainModel) error(404, 'No model for this subdomain');
    }

    return {
        only: false,
        hideUIOnLoad: params.get('ui') === '0',
        subdomainMode,
        subdomain,
        subdomainModel,
        ...(await loadGunData()),
    };
};
