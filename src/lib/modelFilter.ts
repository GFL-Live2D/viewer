import Fuse from 'fuse.js';
import names from '$lib/data/names.json';
import type { Live2DModelIndex } from '$lib/model-data/live2d';
import type { SortBy } from '$lib/sortBy';

export type SearchableModel = Live2DModelIndex & {
    displayName: string;
    numericId: string;
    aliasTerms: string;
};

export function buildModelNames(models: Live2DModelIndex[]): Record<string, string> {
    const nameMap: Record<string, string> = {};
    for (const model of models) {
        const nameData = (names as Record<string, { en_name?: string } | undefined>)[model.id];
        nameMap[model.id] = nameData?.en_name || model.gunName || model.code;
    }
    return nameMap;
}

export type FilterOptions = {
    models: Live2DModelIndex[];
    modelNames: Record<string, string>;
    modelSearchTerms: Record<string, string>;
    filterDuplicates: boolean;
    searchQuery: string;
    sortBy: SortBy;
};

export function filterModels({
    models,
    modelNames,
    modelSearchTerms,
    filterDuplicates,
    searchQuery,
    sortBy,
}: FilterOptions): SearchableModel[] {
    const seenDirectories = new Set<string>();

    const candidates: SearchableModel[] = models
        .map((m) => ({
            ...m,
            displayName: m.gunName || String(modelNames[m.id] ?? m.code ?? m.id).replace(/_/g, ' '),
            numericId: m.id.match(/\d+$/)?.[0] || '',
            aliasTerms: modelSearchTerms[m.id] || '',
        }))
        .filter((m) => {
            if (!filterDuplicates) return true;
            if (/Mod_\d+/i.test(m.code)) return false;
            if (seenDirectories.has(m.directory)) return false;
            seenDirectories.add(m.directory);
            return true;
        });

    const query = searchQuery.trim();
    if (!query) {
        return candidates.sort((a, b) => {
            if (sortBy === 'gun') {
                return a.displayName.localeCompare(b.displayName);
            } else if (sortBy === 'name') {
                return (a.costumeName || '').localeCompare(b.costumeName || '');
            } else {
                return parseInt(a.numericId || '0') - parseInt(b.numericId || '0');
            }
        });
    }

    // Sort-mode dropdown doubles as search priority, so its favoured field outranks
    const weights: Record<'numericId' | 'displayName' | 'code' | 'costumeName' | 'aliasTerms', number> = {
        numericId: sortBy === 'id' ? 3 : 1,
        displayName: sortBy === 'gun' ? 3 : 1,
        costumeName: sortBy === 'name' ? 3 : 1,
        code: 1,
        aliasTerms: 1,
    };

    const fuse = new Fuse(candidates, {
        keys: Object.entries(weights).map(([name, weight]) => ({ name, weight })),
        threshold: 0.35,
        ignoreLocation: true,
    });

    return fuse.search(query).map((result) => result.item);
}
