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

    // Load all variants for all models server-side
    const variantsByModel: Record<string, string[]> = {};
    const variantPromises = models.map(async (model) => {
        variantsByModel[model.directory] = await getGunModelVariants(model.directory);
    });
    await Promise.all(variantPromises);

    // Pre-filtered by model/variant using STC 5037's is_hurt flag; motion filenames collide across variants.
    const motionDataByModel: Record<string, Record<string, Record<number, any>>> = {};
    const voiceDataByModel: Record<string, Record<string, Record<number, any>>> = {};

    for (const model of models) {
        motionDataByModel[model.id] = {};
        voiceDataByModel[model.id] = {};

        const variantNames = variantsByModel[model.directory] || [];
        for (const variant of variantNames) {
            motionDataByModel[model.id][variant] = {};
            voiceDataByModel[model.id][variant] = {};
        }

        for (const motionId of model.motions || []) {
            const motion = motions[motionId];
            if (!motion) continue;

            const variant = motion.is_hurt ? 'destroy' : 'normal';
            if (!motionDataByModel[model.id][variant]) continue;

            motionDataByModel[model.id][variant][motionId] = motion;
            if (voice[motionId]) {
                voiceDataByModel[model.id][variant][motionId] = voice[motionId];
            }
        }
    }

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
