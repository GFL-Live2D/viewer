import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

// Bundles Live2DController without SvelteKit, for use as a plain ES module.
export default defineConfig({
    plugins: [
        svelte(),
        dts({
            include: ['src/lib/live2d/**'],
            rollupTypes: true,
            tsconfigPath: resolve(import.meta.dirname, 'tsconfig.json'),
            entryRoot: resolve(import.meta.dirname, 'src/lib/live2d'),
            beforeWriteFile: (filePath, content) => ({
                filePath: filePath.replace(/Live2DController\.svelte\.d\.ts$/, 'viewer.d.ts'),
                content,
            }),
        }),
    ],
    define: {
        global: 'window',
    },
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/lib/live2d/Live2DController.svelte.ts'),
            formats: ['es', 'iife'],
            name: 'GflLive2D',
            fileName: (format) => (format === 'iife' ? 'viewer.global.js' : 'viewer.js'),
        },
        outDir: resolve(import.meta.dirname, 'dist'),
        emptyOutDir: true,
        minify: true,
        rolldownOptions: {
            output: {
                comments: { legal: true },
            },
        },
    },
});
