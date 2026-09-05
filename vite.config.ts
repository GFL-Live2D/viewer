import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// sync_assets_r2.py --copy populates this, and without it there is nothing to serve from /assets
const selfHosted = existsSync(resolve(import.meta.dirname, 'static/assets/models'));

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    // publicEnv reads these off import.meta.env, which Vite gates behind a prefix allowlist
    envPrefix: ['VITE_', 'PUBLIC_'],
    define: {
        global: 'window',
        'import.meta.env.VITE_BUILD_TARGET': JSON.stringify(process.env.BUILD_TARGET ?? ''),
        'import.meta.env.VITE_SELF_HOSTED_ASSETS': JSON.stringify(selfHosted),
    },
    assetsInclude: ['**/*.moc', '**/*.mtn', '**/*.model3.json', '**/*.motion3.json'],
    server: {
        watch: {
            ignored: ['static/assets/**'],
        },
    },
    build: {
        minify: true,
    },
});
