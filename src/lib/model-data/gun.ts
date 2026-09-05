// Every page loads the index here and fetches one model's motions separately.
// The full motion table is ~1.8 MiB across 238 models, too big to inline in any payload.
import { getGunModelIndex, getAliases, getGunModelVariants } from '$lib/model-data/live2d';
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

interface SplitModelData {
    variants: string[];
    motionData: Record<string, Record<number, MotionData>>;
    voiceData: Record<string, Record<number, VoiceData>>;
}

// Files come from split-model-data.ts. Callers must handle the load being async
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
