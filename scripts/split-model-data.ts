// Emits one motion/voice file per model so a single-model page fetches only its own data.
// Run before a build; output is gitignored.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import live2dData from '../src/lib/data/live2d.json' with { type: 'json' };
import motionsData from '../src/lib/data/motions.json' with { type: 'json' };
import voiceRows from '../src/lib/data/voice.json' with { type: 'json' };
import variantsData from '../src/lib/data/variants.json' with { type: 'json' };

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../static/model-data');

const motionById = new Map<number, (typeof motionsData)[number]>();
for (const m of motionsData) motionById.set(m.id, m);

const voiceById = new Map<number, { char_code: string; voice_key: string; caption: string }>();
for (const v of voiceRows as { id: number; char_code?: string; voice_key?: string; caption?: string }[]) {
    if (!v.id) continue;
    voiceById.set(v.id, {
        char_code: v.char_code || '',
        voice_key: v.voice_key || '',
        caption: v.caption || '',
    });
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let written = 0;
let bytes = 0;

for (const entry of live2dData) {
    const variants = (variantsData as Record<string, string[]>)[entry.directory] ?? [];
    const motionData: Record<string, Record<number, unknown>> = {};
    const voiceData: Record<string, Record<number, unknown>> = {};
    for (const v of variants) {
        motionData[v] = {};
        voiceData[v] = {};
    }

    for (const id of entry.motions ?? []) {
        const motion = motionById.get(id);
        if (!motion) continue;

        const variant = motion.is_hurt ? 'destroy' : 'normal';
        if (!motionData[variant]) continue;

        motionData[variant][id] = motion;
        const voice = voiceById.get(id);
        if (voice) voiceData[variant][id] = voice;
    }

    const json = JSON.stringify({ variants, motionData, voiceData });
    writeFileSync(resolve(OUT, `${entry.code}_${entry.id}.json`), json);
    written += 1;
    bytes += json.length;
}

console.log(`model-data: ${written} files, ${(bytes / 1024 / 1024).toFixed(1)} MiB total`);
