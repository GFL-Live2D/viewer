<script lang="ts">
    import { Activity, Settings2, Funnel, ListChevronsUpDown, HeartPulse, HeartHandshake, Dices, ExternalLink, Rows3, Table } from '@lucide/svelte';
    import * as Accordion from '$lib/components/ui/accordion';
    import * as Select from '$lib/components/ui/select';
    import { Input } from '$lib/components/ui/input';
    import { toggleVariants } from '$lib/components/ui/toggle/index.js';
    import { cn } from '$lib/utils.js';
    import { buildWikiLink } from '$lib/shareLinks';
    import {
        searchQuery,
        sortBy,
        filterDuplicates,
        decensor,
        filteredModels,
        selectedModel,
        variantsByModel,
        selectedCharacterEntry,
        modelNames,
        listDensity,
        controller,
    } from '$lib/stores/gun-page';

    let { onSelectModel = (modelId: string, variant: string) => {} } = $props<{
        onSelectModel?: (modelId: string, variant: string) => void;
    }>();

    const filterButtonClass =
        'border-border bg-background-tertiary text-foreground-secondary hover:border-accent hover:bg-background-secondary hover:text-foreground flex-grow basis-0 rounded-lg border px-3 py-2 text-xs font-medium transition';

    let showPerfMonitor = $state(false);

    function togglePerfMonitor() {
        showPerfMonitor = !showPerfMonitor;
        $controller?.setPerfMonitor(showPerfMonitor);
    }

    function pickRandom() {
        const pool = $filteredModels.filter((m) => m.id !== $selectedModel);
        const choices = pool.length > 0 ? pool : $filteredModels;
        if (choices.length === 0) return;

        const model = choices[Math.floor(Math.random() * choices.length)];
        const variants = $variantsByModel[model.directory] ?? [];
        const variant = variants[Math.floor(Math.random() * variants.length)] || 'normal';

        onSelectModel(model.id, variant);
    }

    let wikiUrl = $derived.by(() => {
        const entry = $selectedCharacterEntry;
        if (!entry) return null;

        return buildWikiLink($modelNames[entry.id] || entry.gunName);
    });

    // An unset density is resolved by CSS, which publishes the result as --density
    function toggleDensity(e: MouseEvent) {
        const current = getComputedStyle(e.currentTarget as HTMLElement).getPropertyValue('--density');
        listDensity.set(current.trim() === 'table' ? 'list' : 'table');
    }
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
                class="bg-background-tertiary text-foreground placeholder-theme-tertiary border-border hover:border-accent hover:bg-background-secondary focus:border-accent focus:bg-background-secondary h-10 w-full rounded-lg border px-4 py-2 text-sm transition focus:outline-none"
            />
            <div>
                <Select.Root
                    type="single"
                    value={$sortBy}
                    onValueChange={(v) => sortBy.set(v as 'gun' | 'id' | 'name')}
                >
                    <Select.Trigger
                        size="lg"
                        class="border-border bg-background-tertiary text-foreground hover:border-accent hover:bg-background-secondary w-full"
                    >
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
                class="border-border bg-background-tertiary text-foreground-tertiary hover:border-accent hover:bg-background-secondary hover:text-foreground flex h-10 w-10 items-center justify-center rounded-lg border transition [&>svg:last-child]:hidden"
                title="More options"
            >
                <Settings2 class="h-5 w-5" />
            </Accordion.Trigger>
        </div>
        <Accordion.Content class="px-4 pb-4">
            <div class="flex w-full flex-wrap gap-2">
                <button
                    type="button"
                    onclick={() => filterDuplicates.set(!$filterDuplicates)}
                    aria-pressed={$filterDuplicates}
                    class={cn(toggleVariants(), filterButtonClass, 'min-w-[150px]')}
                >
                    <div class="flex items-center justify-center gap-2">
                        {#if $filterDuplicates}
                            <Funnel class="text-accent shrink-0" />
                        {:else}
                            <ListChevronsUpDown class="text-foreground-secondary shrink-0" />
                        {/if}
                        <span>Filter duplicates</span>
                    </div>
                </button>
                <button
                    type="button"
                    onclick={() => decensor.set(!$decensor)}
                    aria-pressed={$decensor}
                    class={cn(toggleVariants(), filterButtonClass, 'min-w-[150px]')}
                >
                    <div class="flex items-center justify-center gap-2">
                        {#if $decensor}
                            <HeartHandshake class="text-foreground shrink-0" />
                        {:else}
                            <HeartPulse class="text-pink-500/90 shrink-0" />
                        {/if}
                        <span>Use decensored models</span>
                    </div>
                </button>
                <button
                    type="button"
                    onclick={togglePerfMonitor}
                    aria-pressed={showPerfMonitor}
                    class={cn(toggleVariants(), filterButtonClass, 'min-w-[80px]')}
                >
                    <div class="flex items-center justify-center gap-2">
                        <Activity class="shrink-0 {showPerfMonitor ? 'stroke-yellow-500' : ''}" />
                        <span>Performance monitor</span>
                    </div>
                </button>
            </div>
            <div class="mt-2 flex w-full flex-wrap gap-2">
                <button
                    type="button"
                    onclick={toggleDensity}
                    data-density={$listDensity ?? 'auto'}
                    class={cn(
                        toggleVariants(),
                        filterButtonClass,
                        'density-toggle',
                        'min-w-[110px]',
                    )}
                >
                    <div class="flex items-center justify-center gap-2">
                        <span class="density-label-table flex items-center gap-2">
                            <Table class="shrink-0" />
                            <span>Table view</span>
                        </span>
                        <span class="density-label-list flex items-center gap-2">
                            <Rows3 class="shrink-0" />
                            <span>List view</span>
                        </span>
                    </div>
                </button>
                <button type="button" onclick={pickRandom} class={cn(
                        toggleVariants(),
                        filterButtonClass,
                        'min-w-[110px]',
                    )}>
                    <div class="flex items-center justify-center gap-2">
                        <Dices class="shrink-0" strokeWidth={1.75} />
                        <span>Random</span>
                    </div>
                </button>
                <a
                    href={wikiUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!wikiUrl}
                    class={cn(
                        toggleVariants(),
                        filterButtonClass,
                        'min-w-[110px]',
                    )}
                    class:pointer-events-none={!wikiUrl}
                    class:opacity-50={!wikiUrl}
                >
                    <div class="flex items-center justify-center gap-2">
                        <ExternalLink class="shrink-0 text-yellow-500" />
                        <span>Open in Wiki</span>
                    </div>
                </a>
            </div>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>
