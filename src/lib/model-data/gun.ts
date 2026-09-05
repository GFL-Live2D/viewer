// Every page loads the index here and fetches one model's motions separately.
// The full motion table is ~1.8 MiB across 238 models, too big to inline in any payload.
import { getGunModelIndex, getAliases, getGunModelVariants } from '$lib/model-data/live2d';
import type { Live2DModelIndex, MotionData, VoiceData } from '$lib/model-data/live2d';
import { env, PUBLIC_MIRROR_URL } from '$lib/publicEnv';
import { building } from '$app/environment';

// A static build has no server to serve static/assets, so it falls back to the mirror
const STATIC_BUILD = import.meta.env.VITE_BUILD_TARGET === 'static';
const SELF_HOSTED_ASSETS = import.meta.env.VITE_SELF_HOSTED_ASSETS === true;

function assetBaseUrl(): string {
    if (env.PUBLIC_CDN_URL) return env.PUBLIC_CDN_URL;
    return STATIC_BUILD ? PUBLIC_MIRROR_URL : '/assets';
}

// A node deploy reads PUBLIC_CDN_URL from its own process.env, which the build cannot see,
// so prerendering defers the verdict to the server or the client
function assetsConfigured(): boolean {
    if (building && !STATIC_BUILD) return true;
    return Boolean(env.PUBLIC_CDN_URL) || STATIC_BUILD || SELF_HOSTED_ASSETS;
}

export async function loadGunData() {
    if (!assetsConfigured()) return { assetsMissing: true };

    const [models, aliases] = await Promise.all([getGunModelIndex(), getAliases()]);

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

    // The list renders every model's variant buttons, so all of them are needed up front
    const variantsByModel: Record<string, string[]> = {};
    const variantPromises = models.map(async (model) => {
        variantsByModel[model.directory] = await getGunModelVariants(model.directory);
    });
    await Promise.all(variantPromises);

    return {
        assetsMissing: false,
        models,
        aliases,
        modelSearchTerms,
        variantsByModel,
        assetBaseUrl: assetBaseUrl(),
    };
}

interface VariantData {
    entry: { id: number; code: string; directory: string; motions: number[] };
    variant: string;
    motionData: Record<number, MotionData>;
    voiceData: Record<number, VoiceData>;
}

// One file per variant, written beside the model by sync_assets_r2.py.
// Callers must handle the load being async.
export async function loadSingleModelData(
    model: Live2DModelIndex,
    fetcher: typeof fetch = fetch,
) {
    if (!assetsConfigured()) return { assetsMissing: true as const };

    const baseUrl = assetBaseUrl();
    const variants = await getGunModelVariants(model.directory);

    const motionData: Record<string, Record<number, MotionData>> = {};
    const voiceData: Record<string, Record<number, VoiceData>> = {};

    await Promise.all(
        variants.map(async (variant) => {
            const url = `${baseUrl}/models/${model.directory}/${variant}/${model.directory}.data.json`;
            const res = await fetcher(url);
            if (!res.ok) throw new Error(`No data file for ${model.directory}/${variant}`);
            const payload = (await res.json()) as VariantData;
            motionData[variant] = payload.motionData;
            voiceData[variant] = payload.voiceData;
        }),
    );

    return {
        assetsMissing: false as const,
        model,
        variants,
        motionData,
        voiceData,
        assetBaseUrl: baseUrl,
    };
}
