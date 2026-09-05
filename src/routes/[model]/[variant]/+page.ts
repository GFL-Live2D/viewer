import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { loadSingleModelData } from '$lib/model-data/gun';
import { findModelByName, getGunModelIndex, getGunModelVariants } from '$lib/model-data/live2d';
import { displayVariant, internalVariant, modelSlugs } from '$lib/modelResolve';
import { resolveVariant } from '$lib/model-data/variantPick';

export const prerender = true;

export const entries: EntryGenerator = async () => {
    const models = await getGunModelIndex();
    const paths = await Promise.all(
        models.map(async (m) => {
            const variants = await getGunModelVariants(m.directory);
            return modelSlugs(m).flatMap((model) =>
                variants.map((v) => ({ model, variant: displayVariant(v) })),
            );
        }),
    );
    return paths.flat();
};

export const load: PageLoad = async ({ params, fetch }) => {
    const model = await findModelByName(params.model);
    if (!model) error(404, `No model matches "${params.model}"`);

    const data = await loadSingleModelData(model, fetch);
    if (data.assetsMissing) return { assetsMissing: true, only: true };

    const requested = internalVariant(params.variant);
    if (!data.variants.some((v) => v.toLowerCase() === requested.toLowerCase())) {
        error(404, `"${params.model}" has no ${params.variant} variant`);
    }

    return {
        ...data,
        only: true,
        variant: resolveVariant(data.variants, requested),
        transparent: false,
    };
};
