import { json } from '@sveltejs/kit';
import { getGunModelVariants } from '$lib/server/live2d';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const modelId = url.searchParams.get('modelId');

    if (!modelId) {
        return json([], { status: 400 });
    }

    const variants = await getGunModelVariants(modelId);
    return json(variants);
};
