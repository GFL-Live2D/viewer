import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [svelte()],
    define: {
        global: 'window',
    },
    resolve: {
        alias: {
            'untitled-pixi-live2d-engine/cubism': resolve(
                import.meta.dirname,
                'src/lib/live2d/engineGlobal.ts',
            ),
            'untitled-pixi-live2d-engine': resolve(
                import.meta.dirname,
                'src/lib/live2d/engineGlobal.ts',
            ),
        },
    },
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/lib/live2d/Live2DController.svelte.ts'),
            formats: ['iife'],
            name: 'GflLive2D',
            fileName: () => 'viewer.external.js',
        },
        outDir: resolve(import.meta.dirname, 'dist'),
        emptyOutDir: false,
        minify: true,
        rolldownOptions: {
            // pixi.js/gif has no browser global, so it is bundled rather than externalised
            external: ['pixi.js'],
            output: {
                comments: { legal: true },
                globals: {
                    'pixi.js': 'PIXI',
                },
            },
        },
    },
});
