import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const static_ = process.env.BUILD_TARGET === 'static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess()],
    kit: {
        adapter: static_
            ? adapterStatic({ fallback: 'index.html', strict: false })
            : adapterNode(),
        paths: {
            base: process.env.BASE_PATH ?? '',
            relative: true,
        },
    },
};

export default config;
