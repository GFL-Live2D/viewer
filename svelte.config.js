import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Static builds prerender, which forbids reading the query or host in load and during SSR.
// Anything derived from those has to happen in a component, guarded by `building`.
const static_ = process.env.BUILD_TARGET === 'static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess()],
    kit: {
        adapter: static_
            // GitHub Pages serves 404.html for unmatched paths, letting the client router resolve them
            ? adapterStatic({ fallback: '404.html', strict: false })
            : adapterNode(),
        paths: {
            base: process.env.BASE_PATH ?? '',
            relative: true,
        },
    },
};

export default config;
