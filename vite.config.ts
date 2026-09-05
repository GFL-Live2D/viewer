import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    // publicEnv reads these off import.meta.env, which Vite gates behind a prefix allowlist
    envPrefix: ['VITE_', 'PUBLIC_'],
    define: {
        global: 'window',
        'import.meta.env.VITE_BUILD_TARGET': JSON.stringify(process.env.BUILD_TARGET ?? ''),
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
