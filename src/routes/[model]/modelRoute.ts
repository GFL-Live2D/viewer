import { error } from '@sveltejs/kit';
import { findModelByName, getGunModelIndex, getGunModelVariants } from '$lib/model-data/live2d';
import { displayVariant, internalVariant, modelSlugs } from '$lib/modelResolve';
import { resolveVariant } from '$lib/model-data/variantPick';

// Motion and voice rows live beside the model on the CDN, so only names resolve here
export async function loadModelRoute(modelParam: string, variantParam?: string) {
    const model = await findModelByName(modelParam);
    if (!model) error(404, `No model matches "${modelParam}"`);

    const variants = await getGunModelVariants(model.directory);
    const requested = variantParam ? internalVariant(variantParam) : 'normal';

    if (variantParam && !variants.some((v) => v.toLowerCase() === requested.toLowerCase())) {
        error(404, `"${modelParam}" has no ${variantParam} variant`);
    }

    return {
        model,
        variants,
        only: true,
        variant: resolveVariant(variants, requested),
    };
}

export async function modelEntries() {
    const models = await getGunModelIndex();
    return models.flatMap((m) => modelSlugs(m).map((model) => ({ model })));
}

export async function modelVariantEntries() {
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
}
