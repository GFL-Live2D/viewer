<script lang="ts">
    import { Activity, Settings2, Funnel, ListChevronsUpDown, HeartPulse, HeartHandshake } from '@lucide/svelte';
    import * as Accordion from '$lib/components/ui/accordion';
    import * as Select from '$lib/components/ui/select';
    import * as ToggleGroup from '$lib/components/ui/toggle-group';
    import { Input } from '$lib/components/ui/input';
    import { searchQuery, sortBy, filterDuplicates, decensor } from '$lib/stores/gun-page';
</script>

<Accordion.Root type="single" class="border-border w-full border-t">
    <Accordion.Item value="filters">
        <div class="flex items-center gap-2 p-4">
            <Input
                type="text"
                placeholder="Search for a model..."
                value={$searchQuery}
                onchange={(e) => searchQuery.set(e.currentTarget.value)}
                oninput={(e) => searchQuery.set(e.currentTarget.value)}
                class="bg-background-tertiary text-foreground placeholder-theme-tertiary border-border focus:border-border h-10 w-full rounded-lg border px-4 py-2 text-sm transition focus:outline-none"
            />
            <div>
                <Select.Root
                    type="single"
                    value={$sortBy}
                    onValueChange={(v) => sortBy.set(v as 'gun' | 'id' | 'name')}
                >
                    <Select.Trigger size="lg" class="border-border bg-background-tertiary text-foreground w-full">
                        {$sortBy === 'gun' ? 'Gun' : $sortBy === 'name' ? 'Costume' : 'ID'}
                    </Select.Trigger>
                    <Select.Content class="border-border bg-background-tertiary text-foreground w-full min-w-0">
                        <Select.Item value="gun">Gun</Select.Item>
                        <Select.Item value="name">Costume</Select.Item>
                        <Select.Item value="id">ID</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>
            <Accordion.Trigger
                class="border-border bg-background-tertiary text-foreground-tertiary hover:text-foreground flex h-10 w-10 items-center justify-center rounded-lg border transition [&>svg:last-child]:hidden"
                title="Toggle filters"
            >
                <Settings2 class="h-5 w-5" />
            </Accordion.Trigger>
        </div>
        <Accordion.Content class="px-4 pb-4">
            <ToggleGroup.Root
                type="multiple"
                value={[$filterDuplicates ? 'filter-duplicates' : '', $decensor ? 'decensor' : ''].filter(Boolean)}
                onValueChange={(values) => {
                    filterDuplicates.set(values.includes('filter-duplicates'));
                    decensor.set(values.includes('decensor'));
                }}
                spacing={2}
                class="flex w-full flex-wrap gap-2"
            >
                <ToggleGroup.Item
                    value="filter-duplicates"
                    class="group border-border bg-background-tertiary text-foreground-secondary hover:bg-background-secondary data-[state=on]:border-border data-[state=on]:bg-background-tertiary data-[state=on]:text-foreground hover:text-foreground
					min-w-[150px] flex-grow rounded-lg border px-3 py-2
					text-xs font-medium
					transition"
                >
                    <div class="flex items-center justify-center gap-2">
                        {#if $filterDuplicates}
                            <Funnel class="text-accent shrink-0" />
                        {:else}
                            <ListChevronsUpDown class="text-foreground-secondary shrink-0" />
                        {/if}
                        <span>Filter duplicates</span>
                    </div>
                </ToggleGroup.Item>
                <ToggleGroup.Item
                    value="decensor"
                    class="group border-border bg-background-tertiary text-foreground-secondary hover:bg-background-secondary data-[state=on]:border-border data-[state=on]:bg-background-tertiary data-[state=on]:text-foreground hover:text-foreground min-w-[150px]
					flex-grow rounded-lg border px-3 py-2 text-xs
					font-medium transition"
                >
                    <div class="flex items-center justify-center gap-2">
                        {#if $decensor}
                            <HeartHandshake class="text-foreground shrink-0" />
                        {:else}
                            <HeartPulse class="text-pink-500/90 shrink-0" />
                        {/if}
                        <span>Use decensored models</span>
                    </div>
                </ToggleGroup.Item>
                <ToggleGroup.Item
                    value="perf-monitor"
                    class="group border-border bg-background-tertiary text-foreground-secondary hover:bg-background-secondary data-[state=on]:border-border data-[state=on]:bg-background-tertiary hover:text-foreground min-w-[80px]
					flex-grow rounded-lg border px-3 py-2 text-xs
					font-medium transition"
                    onclick={() => {
                        const statsEl = document.getElementById('stats');
                        if (statsEl) {
                            statsEl.style.display = statsEl.style.display === 'block' ? 'none' : 'block';
                        }
                    }}
                >
                    <div class="flex items-center justify-center gap-2 group-data-[state=on]:text-white">
                        <Activity class="shrink-0 group-data-[state=on]:stroke-yellow-500" />
                        <span>Performance monitor</span>
                    </div>
                </ToggleGroup.Item>
            </ToggleGroup.Root>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>
