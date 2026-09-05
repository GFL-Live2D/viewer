import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { loadSingleModelData } from '$lib/model-data/gun';
import { findModelByName, getGunModelIndex } from '$lib/model-data/live2d';
import { modelSlugs } from '$lib/modelResolve';
import { resolveVariant } from '$lib/model-data/variantPick';

export const prerender = true;

export const entries: EntryGenerator = async () => {
    const models = await getGunModelIndex();
    return models.flatMap((m) => modelSlugs(m).map((model) => ({ model })));
};

export const load: PageLoad = async ({ params, fetch }) => {
    const model = await findModelByName(params.model);
    if (!model) error(404, `No model matches "${params.model}"`);

    const data = await loadSingleModelData(model, fetch);
    if (data.assetsMissing) return { assetsMissing: true, only: true };

    return {
        ...data,
        only: true,
        variant: resolveVariant(data.variants, 'normal'),
        transparent: false,
    };
};
