import { env as dynamic } from '$env/dynamic/public';

const vars = import.meta.env as Record<string, string | undefined>;

// With adapter-node the dynamic values are the server's own process.env, so a deploy can be
// repointed without a rebuild. A static build has no server and falls back to what it baked.
function read(name: string): string | undefined {
    return dynamic[name] || vars[name];
}

export const env = {
    get PUBLIC_CDN_URL() {
        return read('PUBLIC_CDN_URL');
    },
    get PUBLIC_DOMAIN() {
        return read('PUBLIC_DOMAIN');
    },
    get PUBLIC_SUBDOMAIN_MODE() {
        return read('PUBLIC_SUBDOMAIN_MODE');
    },
};

// Pinned to a commit so a push to the mirror cannot change a deployed build
export const PUBLIC_MIRROR_URL =
    'https://rawcdn.githack.com/GFL-Live2D/dump/0f4144f4bec65c788b5696e35643e4e657d36b0d';
