import live2dData from '$lib/data/live2d.json';
import namesData from '$lib/data/names.json';
import motionsData from '$lib/data/motions.json';
import voiceData from '$lib/data/voice.json';
import aliasesData from '$lib/data/aliases.json';
import variantsData from '$lib/data/variants.json';
import costumesData from '$lib/data/costumes.json';
import nameOverrides from '$lib/data/name-overrides.json';
import { resolveModel } from '$lib/modelResolve';

export interface Live2DModelIndex {
    id: string; // Unique ID: code_liveid (e.g. "G11Mod_1602_G11MOD")
    code: string; // e.g. G11Mod_1602
    directory: string; // e.g. g11_1602
    motions: number[]; // List of motion IDs
    gunName?: string; // Display name from STC 5005 (e.g. "G11 MOD")
    costumeName?: string; // Costume name from costumes.json
}

// Interfaces for motion and voice data
export interface MotionData {
    id: number;
    type: number;
    motion_name: string;
    touch_area: string;
    hold_time: string;
    probability: number;
    voice: string;
    text: string;
    expression: string;
    face_motion: string;
    name: string;
    camera: number;
    is_hurt: number;
    level: number;
    is_interrupt: number;
    delay: number;
}

export interface VoiceData {
    char_code: string;
    voice_key: string;
    caption: string;
}

function applyNameOverride(name: string): string {
    return (nameOverrides as Record<string, string>)[name] ?? name;
}

export async function getGunModelIndex(): Promise<Live2DModelIndex[]> {
    const gunNames = namesData as Record<string, { en_name: string; code: string }>;
    const costumes = costumesData as Record<string, string>;

    // Map fields and add gun display names
    // live2d.json is already filtered by the sync script to only include valid models
    return live2dData.map((entry) => {
        const fitGun = entry.fit_gun;
        // MOD variants prefix the base gun id with a leading '2' (e.g. 205 -> 20205)
        let gunInfo = fitGun && gunNames[fitGun] ? gunNames[fitGun] : null;
        if (!gunInfo && fitGun) {
            const baseId = String(Number(String(fitGun).replace(/^2/, '')));
            gunInfo = gunNames[baseId] ?? null;
        }

        // Try costume lookup using directory first, then fall back to code-based lookup
        let costumeName = costumes[entry.directory.toLowerCase()];
        if (!costumeName) {
            costumeName = costumes[entry.code.toLowerCase()];
        }
        if (!costumeName) {
            const withoutMod = entry.code.toLowerCase().replace(/mod(?=_\d)/i, '');
            if (withoutMod !== entry.code.toLowerCase()) {
                costumeName = costumes[withoutMod];
            }
        }

        // Display name from STC 5005
        const rawName = applyNameOverride(gunInfo?.en_name ?? '');
        const name = rawName + (/Mod$|Mod_\d+$/i.test(entry.code) ? ' MOD3' : '');

        return {
            id: `${entry.code}_${entry.id}`, // Unique ID
            code: entry.code,
            directory: entry.directory,
            motions: entry.motions,
            gunName: name,
            costumeName: applyNameOverride(costumeName || 'Neural Upgrade'),
        };
    });
}

export async function getAliases(): Promise<Record<string, string>> {
    return aliasesData;
}

export async function getGunModelVariants(modelId: string): Promise<string[]> {
    const variants = (variantsData as Record<string, string[]>)[modelId];
    return variants || [];
}

export async function findModelByName(name: string): Promise<Live2DModelIndex | null> {
    const [models, aliases] = await Promise.all([getGunModelIndex(), getAliases()]);
    return resolveModel(models, name, aliases);
}

async function loadAllMotionData(): Promise<MotionData[]> {
    return motionsData as MotionData[];
}

interface RawVoiceData {
    id: number;
    char_code: string;
    voice_key: string;
    caption: string;
}

async function loadAllVoiceData(): Promise<Record<number, VoiceData>> {
    const data = voiceData as RawVoiceData[];
    const cache: Record<number, VoiceData> = {};

    for (const entry of data) {
        if (entry.id) {
            cache[entry.id] = {
                char_code: entry.char_code || '',
                voice_key: entry.voice_key || '',
                caption: entry.caption || '',
            };
        }
    }
    return cache;
}

export async function getModelMotionAndVoiceData(motionIds: number[]): Promise<{
    motions: Record<number, MotionData>;
    voice: Record<number, VoiceData>;
}> {
    if (motionIds.length === 0) {
        return { motions: {}, voice: {} };
    }

    const [allMotions, allVoice] = await Promise.all([loadAllMotionData(), loadAllVoiceData()]);

    const motions: Record<number, MotionData> = {};
    const voice: Record<number, VoiceData> = {};

    const idSet = new Set(motionIds);

    for (const motion of allMotions) {
        if (idSet.has(motion.id)) {
            motions[motion.id] = motion;
            if (allVoice[motion.id]) {
                voice[motion.id] = allVoice[motion.id];
            }
        }
    }

    return { motions, voice };
}
