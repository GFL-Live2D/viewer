import type { EntryGenerator, PageLoad } from './$types';
import { loadModelRoute, modelVariantEntries } from '../modelRoute';

export const prerender = true;

export const entries: EntryGenerator = modelVariantEntries;

export const load: PageLoad = async ({ params }) => loadModelRoute(params.model, params.variant);
