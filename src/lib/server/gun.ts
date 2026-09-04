import { getGunModelIndex, getAliases, getModelMotionAndVoiceData, getGunModelVariants } from '$lib/server/live2d';
import type { Live2DModelIndex, MotionData, VoiceData } from '$lib/server/live2d';
import { env } from '$env/dynamic/public';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

function assetsConfigured(): boolean {
    if (env.PUBLIC_CDN_URL) return true;

    const assetsDir = path.resolve('static/assets');
    return existsSync(assetsDir) && readdirSync(assetsDir).length > 0;
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
        assetBaseUrl: env.PUBLIC_CDN_URL || '/assets',
    };
}

// ?only= renders one model, so just its variants and motion/voice rows are serialised
export async function loadSingleModelData(model: Live2DModelIndex) {
    if (!assetsConfigured()) return { assetsMissing: true as const };

    const variants = await getGunModelVariants(model.directory);
    const { motions, voice } = await getModelMotionAndVoiceData(model.motions || []);

    const motionData: Record<string, Record<number, MotionData>> = {};
    const voiceData: Record<string, Record<number, VoiceData>> = {};
    for (const variant of variants) {
        motionData[variant] = {};
        voiceData[variant] = {};
    }

    for (const motionId of model.motions || []) {
        const motion = motions[motionId];
        if (!motion) continue;

        const variant = motion.is_hurt ? 'destroy' : 'normal';
        if (!motionData[variant]) continue;

        motionData[variant][motionId] = motion;
        if (voice[motionId]) voiceData[variant][motionId] = voice[motionId];
    }

    return {
        assetsMissing: false as const,
        model,
        variants,
        motionData,
        voiceData,
        assetBaseUrl: env.PUBLIC_CDN_URL || '/assets',
    };
}
