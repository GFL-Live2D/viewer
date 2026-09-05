import { getGunModelIndex, getAliases, getModelMotionAndVoiceData, getGunModelVariants } from '$lib/model-data/live2d';
import type { Live2DModelIndex, MotionData, VoiceData } from '$lib/model-data/live2d';
import { env, PUBLIC_MIRROR_URL } from '$lib/publicEnv';
import { base } from '$app/paths';

// A static build has no server to serve static/assets, so it falls back to the mirror
const STATIC_BUILD = import.meta.env.VITE_BUILD_TARGET === 'static';

function assetBaseUrl(): string {
    if (env.PUBLIC_CDN_URL) return env.PUBLIC_CDN_URL;
    return STATIC_BUILD ? PUBLIC_MIRROR_URL : '/assets';
}

function assetsConfigured(): boolean {
    return Boolean(env.PUBLIC_CDN_URL) || STATIC_BUILD || import.meta.env.DEV;
}

export async function loadGunData() {
    if (!assetsConfigured()) return { assetsMissing: true };

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
        assetsMissing: false,
        models,
        aliases,
        motionData: motionDataByModel,
        voiceData: voiceDataByModel,
        modelSearchTerms,
        variantsByModel,
        assetBaseUrl: assetBaseUrl(),
    };
}

interface SplitModelData {
    variants: string[];
    motionData: Record<string, Record<number, MotionData>>;
    voiceData: Record<string, Record<number, VoiceData>>;
}

// One model renders from its own generated file, so the full motion table never ships
export async function loadSingleModelData(
    model: Live2DModelIndex,
    fetcher: typeof fetch = fetch,
) {
    if (!assetsConfigured()) return { assetsMissing: true as const };

    const res = await fetcher(`${base}/model-data/${model.id}.json`);
    if (!res.ok) throw new Error(`No data file for ${model.id}`);
    const { variants, motionData, voiceData } = (await res.json()) as SplitModelData;

    return {
        assetsMissing: false as const,
        model,
        variants,
        motionData,
        voiceData,
        assetBaseUrl: assetBaseUrl(),
    };
}
