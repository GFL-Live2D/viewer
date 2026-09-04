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
    } from '$lib/stores/gun-page';
    import type { Live2DModelIndex } from '$lib/server/live2d';

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
    // Store references to the list item elements directly
    let listItemRefs = $state<Record<string, HTMLElement | undefined>>({});
    let scrollingContainers = $state<Record<string, boolean>>({});
    let hoveredModel = $state<string | null>(null);

    let scrollContainer = $state<HTMLElement | undefined>(undefined);
    let showTopIndicator = $state(false);
    let showBottomIndicator = $state(false);
    let resizeObserver: ResizeObserver | undefined;

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

        // Calculate the current visual offset of the element from the top of the container
        const relativeOffset = elRect.top - containerRect.top;

        // Current scroll position
        const currentScroll = scrollContainer.scrollTop;

        // Target: We want the element's relative offset to be (containerHeight/2 - elHeight/2)
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
            // Element likely filtered out
            showTopIndicator = false;
            showBottomIndicator = false;
            return;
        }

        const containerRect = scrollContainer.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        // Check Top: Element is strictly above the container's visual top edge
        showTopIndicator = elRect.bottom < containerRect.top + 5;

        // Check Bottom: Element is strictly below the container's visual bottom edge
        showBottomIndicator = elRect.top > containerRect.bottom - 5;
    }

    // Check on scroll
    function onScroll() {
        checkScrollPosition();
    }

    // Scroll to top whenever the search query changes, so new results are visible
    $effect(() => {
        $searchQuery;
        scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Auto-scroll when selection changes
    $effect(() => {
        if ($selectedModel) {
            // Small delay to ensure render
            setTimeout(() => {
                scrollToSelected();
                checkScrollPosition();
            }, 100);
        }
    });

    // Check updates for models list or re-checks
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
        // Also listen to window resize as backup
        window.addEventListener('resize', checkScrollPosition);
    });

    onDestroy(() => {
        if (resizeObserver) resizeObserver.disconnect();
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', checkScrollPosition);
        }
    });

    // Check for overflow when container refs update and set CSS variable for animation distance
    $effect(() => {
        for (const [modelId, el] of Object.entries(containerRefs)) {
            if (el) {
                const hasOverflow = el.scrollWidth > el.clientWidth;
                scrollingContainers[modelId] = hasOverflow;

                // Set CSS variable for the actual overflow distance plus padding buffer
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
        class="custom-scrollbar border-border flex-1 overflow-y-scroll border-t p-4"
    >
        <div class="space-y-3">
            {#each $filteredModels as model (model.id)}
                <div
                    bind:this={listItemRefs[model.id]}
                    id={`model-list-item-${model.id}`}
                    class="flex overflow-hidden rounded border transition-colors duration-200 {$selectedModel ===
                    model.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-background-secondary/50 hover:border-accent hover:bg-accent/20'}"
                >
                    <div class="border-border bg-background-tertiary/50 flex shrink-0 items-center border-r px-2 py-3">
                        <span class="margin-auto text-foreground-tertiary w-8 text-center font-mono text-xs"
                            >{model.id.match(/\d+$/)}</span
                        >
                    </div>

                    <button
                        onclick={() => selectModelInternal(model.id, undefined, model.directory)}
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
                                <div class="flex shrink-0 items-center px-3 py-3">
                                    <div class="text-foreground-secondary text-xs font-semibold">
                                        <TextScroller text={model.costumeName} />
                                    </div>
                                </div>
                                <div class="bg-border h-4 w-px"></div>
                                <div class="flex min-w-0 flex-1 items-center px-3 py-3">
                                    <span class="text-foreground-secondary text-xs font-semibold"
                                        ><GunNameDisplay name={$modelNames[model.id]} /></span
                                    >
                                </div>
                            {:else}
                                <div class="flex shrink-0 items-center px-3 py-3">
                                    <span class="text-foreground-secondary text-xs font-semibold"
                                        ><GunNameDisplay name={$modelNames[model.id]} /></span
                                    >
                                </div>
                                <div class="bg-border h-4 w-px"></div>
                                <div class="flex min-w-0 flex-1 items-center px-3 py-3">
                                    <div class="text-foreground-secondary text-xs font-semibold">
                                        <TextScroller text={model.costumeName} />
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </button>

                    {#if !isMobileTablet && ($variantsByModel[model.directory]?.length ?? 0) > 0}
                        <div
                            class="border-border bg-background-tertiary/50 grid grow gap-px border-l"
                            style="grid-template-columns: repeat({$variantsByModel[model.directory].length}, 1fr);"
                        >
                            {#each $variantsByModel[model.directory] as variant}
                                <button
                                    onclick={() => selectModelInternal(model.id, variant)}
                                    class="flex items-center justify-center p-2 transition-all duration-300 {$selectedModel ===
                                        model.id && $selectedVariant === variant
                                        ? 'bg-accent text-foreground font-bold shadow-inner'
                                        : 'bg-background-secondary/30 text-foreground-tertiary hover:bg-background-tertiary hover:text-foreground-secondary'}"
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
