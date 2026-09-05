<script lang="ts">
    import TextScroller from '$lib/components/TextScroller.svelte';
    import GunNameDisplay from '$lib/components/GunNameDisplay.svelte';
    import {
        filteredModels,
        selectedModel,
        selectedVariant,
        variantsByModel,
        modelNames,
        sortBy,
        preferredVariantKind,
        searchQuery,
        listDensity,
    } from '$lib/stores/gun-page';
    import type { Live2DModelIndex } from '$lib/model-data/live2d';

    let {
        models = [],
        onSelectModel = (modelId: string, variant: string) => {},
        formatVariant = (v: string) => v,
        isMobileTablet = false,
    } = $props<{
        models: Live2DModelIndex[];
        onSelectModel: (modelId: string, variant: string) => void;
        formatVariant?: (variant: string) => string;
        isMobileTablet?: boolean;
    }>();

    import { onMount, onDestroy } from 'svelte';

    let containerRefs = $state<Record<string, HTMLElement | undefined>>({});
    let listItemRefs = $state<Record<string, HTMLElement | undefined>>({});
    let scrollingContainers = $state<Record<string, boolean>>({});
    let hoveredModel = $state<string | null>(null);

    let scrollContainer = $state<HTMLElement | undefined>(undefined);
    let showTopIndicator = $state(false);
    let showBottomIndicator = $state(false);
    let resizeObserver: ResizeObserver | undefined;

    // Roving tabindex: the list is one tab stop and arrow keys move within it, so tabbing past
    // the list does not mean stepping through every row.
    let focusRow = $state(0);
    let focusCol = $state(0);

    // Column 0 is the name button, the rest are that row's variant cells
    function rowLength(index: number): number {
        const model = $filteredModels[index];
        if (!model || isMobileTablet) return 1;
        return 1 + ($variantsByModel[model.directory]?.length ?? 0);
    }

    // Entering the list lands on the selected model rather than the top of the list
    let tabStopRow = $derived.by(() => {
        if (focusRow > 0) return Math.min(focusRow, $filteredModels.length - 1);
        const selected = $filteredModels.findIndex((m) => m.id === $selectedModel);
        return selected >= 0 ? selected : 0;
    });

    function isTabStop(row: number, col: number): boolean {
        return row === tabStopRow && col === Math.min(focusCol, rowLength(tabStopRow) - 1);
    }

    function focusCell(row: number, col: number) {
        focusRow = row;
        focusCol = col;
        const model = $filteredModels[row];
        if (!model) return;
        const cell = listItemRefs[model.id]?.querySelectorAll<HTMLElement>('button')[col];
        cell?.focus();
        cell?.scrollIntoView({ block: 'nearest' });
    }

    function handleGridKeydown(e: KeyboardEvent, row: number, col: number) {
        const lastRow = $filteredModels.length - 1;
        let next: [number, number] | null = null;

        if (e.key === 'ArrowDown') next = [Math.min(row + 1, lastRow), col];
        else if (e.key === 'ArrowUp') next = [Math.max(row - 1, 0), col];
        else if (e.key === 'ArrowRight') next = [row, Math.min(col + 1, rowLength(row) - 1)];
        else if (e.key === 'ArrowLeft') next = [row, Math.max(col - 1, 0)];
        else if (e.key === 'Home') next = [0, 0];
        else if (e.key === 'End') next = [lastRow, 0];
        else return;

        e.preventDefault();
        const [r, c] = next;
        focusCell(r, Math.min(c, rowLength(r) - 1));
    }

    function selectModelInternal(modelId: string, variant?: string, directory?: string) {
        const finalVariant =
            variant ??
            (() => {
                if (directory) {
                    const variants = $variantsByModel[directory] ?? [];
                    if (variants.length > 0) {
                        const preferred = $preferredVariantKind;
                        return (
                            variants.find((v) => formatVariant(v).toLowerCase() === preferred) ||
                            variants.find((v) => v.toLowerCase() === 'normal') ||
                            variants[0]
                        );
                    }
                }
                return 'normal';
            })();

        onSelectModel(modelId, finalVariant);
    }

    function scrollToSelected() {
        if (!$selectedModel || !scrollContainer) return;

        const el = listItemRefs[$selectedModel];
        if (!el) return;

        const containerRect = scrollContainer.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        const relativeOffset = elRect.top - containerRect.top;

        const currentScroll = scrollContainer.scrollTop;

        const targetRelativeOffset = (scrollContainer.clientHeight / 2) - (el.offsetHeight / 2);
        const scrollDelta = relativeOffset - targetRelativeOffset;

        scrollContainer.scrollTo({
            top: currentScroll + scrollDelta,
            behavior: 'smooth',
        });
    }

    function checkScrollPosition() {
        if (!scrollContainer || !$selectedModel) {
            showTopIndicator = false;
            showBottomIndicator = false;
            return;
        }

        const el = listItemRefs[$selectedModel];
        if (!el) {
            showTopIndicator = false;
            showBottomIndicator = false;
            return;
        }

        const containerRect = scrollContainer.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        showTopIndicator = elRect.bottom < containerRect.top + 5;

        showBottomIndicator = elRect.top > containerRect.bottom - 5;
    }

    function onScroll() {
        checkScrollPosition();
    }

    // Scroll to top whenever the search query changes, so new results are visible
    $effect(() => {
        $searchQuery;
        scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
    });

    $effect(() => {
        if ($selectedModel) {
            setTimeout(() => {
                scrollToSelected();
                checkScrollPosition();
            }, 100);
        }
    });

    $effect(() => {
        $filteredModels;
        setTimeout(checkScrollPosition, 100);
    });

    onMount(() => {
        if (typeof ResizeObserver !== 'undefined' && scrollContainer) {
            resizeObserver = new ResizeObserver(() => {
                checkScrollPosition();
            });
            resizeObserver.observe(scrollContainer);
        }
        window.addEventListener('resize', checkScrollPosition);
    });

    onDestroy(() => {
        if (resizeObserver) resizeObserver.disconnect();
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', checkScrollPosition);
        }
    });

    $effect(() => {
        for (const [modelId, el] of Object.entries(containerRefs)) {
            if (el) {
                const hasOverflow = el.scrollWidth > el.clientWidth;
                scrollingContainers[modelId] = hasOverflow;

                if (hasOverflow) {
                    const overflowDistance = el.scrollWidth - el.clientWidth;
                    const firstChild = el.children[0] as HTMLElement;
                    let paddingBuffer = 0;
                    if (firstChild) {
                        paddingBuffer = parseFloat(window.getComputedStyle(firstChild).paddingRight) || 0;
                    }
                    const totalDistance = overflowDistance + paddingBuffer;
                    el.style.setProperty('--overflow-distance', `${totalDistance}px`);
                }
            }
        }
    });

    import { fade } from 'svelte/transition';
    import { ChevronUp, ChevronDown } from '@lucide/svelte';
</script>

<div class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
    {#if showTopIndicator}
        <button
            onclick={scrollToSelected}
            transition:fade={{ duration: 200 }}
            class="from-accent/40 via-accent/10 hover:from-accent/50 pointer-events-auto absolute top-0 right-0 left-0 z-10 flex h-24 w-full cursor-pointer flex-col items-center justify-start bg-gradient-to-b to-transparent pt-2"
        >
            <ChevronUp class="text-accent-foreground/80 h-5 w-5 animate-bounce drop-shadow-md" />
        </button>
    {/if}

    <div
        bind:this={scrollContainer}
        onscroll={onScroll}
        data-density={$listDensity ?? 'auto'}
        class="model-list custom-scrollbar border-border flex-1 overflow-y-scroll border-t"
    >
        <div class="model-list-rows">
            {#each $filteredModels as model, rowIndex (model.id)}
                <div
                    bind:this={listItemRefs[model.id]}
                    id={`model-list-item-${model.id}`}
                    class="model-row flex transition-colors duration-200"
                    class:is-selected={$selectedModel === model.id}
                >
                    <div class="model-row-id border-border bg-background-tertiary/50 flex shrink-0 items-center border-r px-2">
                        <span class="model-row-id-text margin-auto text-foreground-tertiary font-mono text-xs"
                            >{model.id.match(/\d+$/)}</span
                        >
                    </div>

                    <button
                        onclick={() => selectModelInternal(model.id, undefined, model.directory)}
                        onkeydown={(e) => handleGridKeydown(e, rowIndex, 0)}
                        onfocus={() => ((focusRow = rowIndex), (focusCol = 0))}
                        tabindex={isTabStop(rowIndex, 0) ? 0 : -1}
                        class="overflow-hidden bg-transparent transition-colors {$selectedModel === model.id
                            ? 'hover:bg-accent-hover/30'
                            : 'hover:bg-background-tertiary/20'}"
                        style={isMobileTablet ? 'width: 100%;' : 'width: 320px;'}
                    >
                        <div
                            role="presentation"
                            bind:this={containerRefs[model.id]}
                            onmouseenter={() => (hoveredModel = model.id)}
                            onmouseleave={() => (hoveredModel = null)}
                            class:animate-scroll={scrollingContainers[model.id] && hoveredModel === model.id}
                            style="display: flex; align-items: center; will-change: transform; white-space: nowrap; transition: transform 0.3s ease-in-out;"
                        >
                            {#if $sortBy === 'name'}
                                <div class="model-cell flex shrink-0 items-center px-3">
                                    <div class="text-foreground-secondary text-xs font-semibold">
                                        <TextScroller text={model.costumeName} />
                                    </div>
                                </div>
                                <div class="bg-border h-4 w-px"></div>
                                <div class="model-cell flex min-w-0 flex-1 items-center px-3">
                                    <span class="text-foreground-secondary text-xs font-semibold"
                                        ><GunNameDisplay name={$modelNames[model.id]} /></span
                                    >
                                </div>
                            {:else}
                                <div class="model-cell flex shrink-0 items-center px-3">
                                    <span class="text-foreground-secondary text-xs font-semibold"
                                        ><GunNameDisplay name={$modelNames[model.id]} /></span
                                    >
                                </div>
                                <div class="bg-border h-4 w-px"></div>
                                <div class="model-cell flex min-w-0 flex-1 items-center px-3">
                                    <div class="text-foreground-secondary text-xs font-semibold">
                                        <TextScroller text={model.costumeName} />
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </button>

                    {#if !isMobileTablet && ($variantsByModel[model.directory]?.length ?? 0) > 0}
                        <div
                            class="border-border bg-background-tertiary/50 grid grow border-l"
                            style="grid-template-columns: repeat({$variantsByModel[model.directory].length}, 1fr);"
                        >
                            {#each $variantsByModel[model.directory] as variant, variantIndex}
                                <button
                                    onclick={() => selectModelInternal(model.id, variant)}
                                    onkeydown={(e) => handleGridKeydown(e, rowIndex, variantIndex + 1)}
                                    onfocus={() => ((focusRow = rowIndex), (focusCol = variantIndex + 1))}
                                    tabindex={isTabStop(rowIndex, variantIndex + 1) ? 0 : -1}
                                    class="variant-cell border-border flex items-center justify-center px-2 not-first:border-l transition-all duration-300 {$selectedModel ===
                                        model.id && $selectedVariant === variant
                                        ? 'bg-accent text-foreground font-bold shadow-inner'
                                        : 'bg-background-secondary/30 text-foreground-tertiary hover:bg-accent/40 hover:text-foreground'}"
                                    title={formatVariant(variant)}
                                >
                                    <span class="truncate text-[10px] tracking-wider uppercase"
                                        >{formatVariant(variant)}</span
                                    >
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    {#if showBottomIndicator}
        <button
            onclick={scrollToSelected}
            transition:fade={{ duration: 200 }}
            class="from-accent/40 via-accent/10 hover:from-accent/50 pointer-events-auto absolute right-0 bottom-0 left-0 z-10 flex h-24 w-full cursor-pointer flex-col items-center justify-end bg-gradient-to-t to-transparent pb-2"
        >
            <ChevronDown class="text-accent-foreground/80 h-5 w-5 animate-bounce drop-shadow-md" />
        </button>
    {/if}
</div>

<style>
    :global(.animate-scroll) {
        transform: translateX(calc(-1 * var(--overflow-distance)));
    }
</style>
