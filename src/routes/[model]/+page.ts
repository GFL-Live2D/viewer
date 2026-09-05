import type { EntryGenerator, PageLoad } from './$types';
import { loadModelRoute, modelEntries } from './modelRoute';

export const prerender = true;

export const entries: EntryGenerator = modelEntries;

export const load: PageLoad = async ({ params }) => loadModelRoute(params.model);
