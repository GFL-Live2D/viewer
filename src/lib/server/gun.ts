import { getGunModelIndex, getAliases, getModelMotionAndVoiceData, getGunModelVariants } from '$lib/server/live2d';
import { env } from '$env/dynamic/public';

export async function loadGunData() {
    const [models, aliases] = await Promise.all([getGunModelIndex(), getAliases()]);

    // Collect all unique motion IDs from all models to hydrate motion/voice data
    const allMotionIds = new Set<number>();
    for (const model of models) {
        for (const id of model.motions || []) {
            allMotionIds.add(id);
        }
    }

    // Pre-compute model search terms
    const modelSearchTerms: Record<string, string> = {};
    for (const model of models) {
        const gunName = (model.gunName || '').toLowerCase();
        const code = model.code.toLowerCase();
        const baseCode = code.replace(/_\d+$/, '');

        const associatedAliases = Object.entries(aliases)
            .filter(([_, target]) => {
                const t = target.toLowerCase();
                return t === gunName || t === code || t === baseCode;
            })
            .map(([alias]) => alias);

        modelSearchTerms[model.id] = associatedAliases.join(' ');
    }

    // Load motion and voice data server-side (stays in memory, only serializes what's needed)
    const { motions, voice } = await getModelMotionAndVoiceData(Array.from(allMotionIds));

    // Pre-filter motion/voice data by model ID to avoid client-side filtering
    const motionDataByModel: Record<string, Record<number, any>> = {};
    const voiceDataByModel: Record<string, Record<number, any>> = {};

    for (const model of models) {
        motionDataByModel[model.id] = {};
        voiceDataByModel[model.id] = {};

        for (const motionId of model.motions || []) {
            if (motions[motionId]) {
                motionDataByModel[model.id][motionId] = motions[motionId];
            }
            if (voice[motionId]) {
                voiceDataByModel[model.id][motionId] = voice[motionId];
            }
        }
    }

    // Load all variants for all models server-side
    const variantsByModel: Record<string, string[]> = {};
    const variantPromises = models.map(async (model) => {
        variantsByModel[model.directory] = await getGunModelVariants(model.directory);
    });
    await Promise.all(variantPromises);

    return {
        models,
        aliases,
        motionData: motionDataByModel,
        voiceData: voiceDataByModel,
        modelSearchTerms,
        variantsByModel,
        assetBaseUrl: env.PUBLIC_ASSET_BASE_URL || '/assets',
    };
}
