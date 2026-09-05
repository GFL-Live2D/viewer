const vars = import.meta.env as Record<string, string | undefined>;

export const env = {
    PUBLIC_CDN_URL: vars.PUBLIC_CDN_URL,
    PUBLIC_DOMAIN: vars.PUBLIC_DOMAIN,
    PUBLIC_SUBDOMAIN_MODE: vars.PUBLIC_SUBDOMAIN_MODE,
};

// Pinned to a commit so a push to the mirror cannot change a deployed build
export const PUBLIC_MIRROR_URL =
    'https://rawcdn.githack.com/GFL-Live2D/dump/e4975ef964681576c87066bdc19e5fcec18938a1';
