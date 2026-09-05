import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

// Bundles Live2DController without SvelteKit, for use as a plain ES module.
// The svelte plugin stays because the controller holds its state in a $state rune.
// PixiJS and the Live2D engine are bundled in; only the Cubism Core script and the
// model assets are fetched at runtime.
export default defineConfig({
    plugins: [svelte()],
    define: {
        global: 'window',
    },
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/lib/live2d/Live2DController.svelte.ts'),
            formats: ['es'],
            fileName: () => 'viewer.js',
        },
        outDir: resolve(import.meta.dirname, 'dist'),
        emptyOutDir: true,
        minify: true,
    },
});
