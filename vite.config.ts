import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    define: {
        global: 'window',
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
