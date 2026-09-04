export type SortBy = 'gun' | 'id' | 'name';

export const SORT_BY_STORAGE_KEY = 'gun-page-sort-by';

const SORT_BY_VALUES: SortBy[] = ['gun', 'id', 'name'];
const SORT_BY_DEFAULT: SortBy = SORT_BY_VALUES[0];

// Stored values are user-editable, so an unknown one falls back rather than reaching the sort
export function parseSortBy(value: string | undefined | null): SortBy {
    return SORT_BY_VALUES.includes(value as SortBy) ? (value as SortBy) : SORT_BY_DEFAULT;
}
