<script lang="ts">
    import { selectedCharacterEntry, selectedModel, selectedVariant, uiState, modelNames } from '$lib/stores/gun-page';
    import GunNameDisplay from '$lib/components/GunNameDisplay.svelte';
    import { Check, Link, SlidersHorizontal } from '@lucide/svelte';

    let isCopied = $state(false);
    let copiedTimeout: ReturnType<typeof setTimeout> | undefined = $state(undefined);

    // Derived display name, use modelNames store for proper display
    let selectedModelName = $derived.by(() => {
        const entry = $selectedCharacterEntry;
        if (!entry) return '';
        return $modelNames[entry.id] || entry.code || entry.id || '';
    });

    let currentDisplayVariant = $derived.by(() => {
        const variant = $selectedVariant;
        if (!variant) return '';
        const v = variant.toLowerCase();
        if (v === 'destroy') return 'damaged';
        return variant;
    });

    async function handleCopyLink() {
        const entry = $selectedCharacterEntry;
        if (!entry) return;

        const origin = `${window.location.protocol}//${window.location.host}`;
        const params = new URLSearchParams({ model: entry.code.toLowerCase() });
        if (currentDisplayVariant && currentDisplayVariant !== 'normal') {
            params.set('variant', currentDisplayVariant);
        }

        try {
            await navigator.clipboard.writeText(`${origin}/?${params.toString()}`);
            isCopied = true;
            clearTimeout(copiedTimeout);
            copiedTimeout = setTimeout(() => {
                isCopied = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    }

    function toggleParametersPanel() {
        uiState.update((s) => ({ ...s, isParametersPanelOpen: !s.isParametersPanelOpen }));
    }
</script>

<!-- Header Info with refined styling -->
<div class="group @container relative flex flex-col overflow-hidden select-text">
    <!-- Main content -->
    <div class="relative flex-1 px-4 pt-4 md:pb-4 2xl:p-6">
        <!-- Title and metadata -->
        <div class="space-y-4">
            <!-- Model name section with controls -->
            <div class="flex items-start gap-0">
                <!-- Title (Center area, wraps) -->
                <h2
                    class="text-foreground flex min-w-0 flex-1 flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight @max-sm:gap-2 @max-sm:text-lg @max-xs:text-base"
                >
                    <span class="min-w-0">
                        <GunNameDisplay
                            name={selectedModelName || $selectedCharacterEntry?.code || $selectedModel || 'Select Model'}
                            iconSize="h-6 w-6 ml-1"
                            iconColor="#F05A1C"
                        />
                    </span>

                    <!-- Copy Link Button (Inline with title, centered vertically) -->
                    <button
                        onclick={handleCopyLink}
                        class="text-foreground-tertiary hover:text-foreground bg-background-secondary/50 hover:bg-background-tertiary flex h-8 w-8 flex-shrink-0 items-center justify-center self-center rounded-lg transition-all duration-200 active:scale-95"
                        title="Copy direct link"
                        aria-label="Copy direct link"
                    >
                        {#if isCopied}
                            <Check class="h-4 w-4 text-emerald-500" />
                        {:else}
                            <Link class="h-4 w-4" />
                        {/if}
                    </button>
                </h2>

                <!-- Toggle Panel Button (Top Right, desktop only) -->
                <button
                    onclick={toggleParametersPanel}
                    class="group/btn border-border bg-background-secondary/80 hover:border-accent hover:bg-accent/10 hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border backdrop-blur-sm transition-all duration-300 active:scale-95 2xl:flex"
                    title="Toggle parameters and parts panel"
                >
                    <SlidersHorizontal
                        class="text-foreground-secondary group-hover/btn:text-foreground h-5 w-5 transition-all duration-300"
                    />
                </button>
            </div>

            <!-- Metadata section -->
            <div class="text-md space-y-2.5">
                {#if $selectedCharacterEntry?.costumeName}
                    <div class="text-accent flex min-w-0 gap-3">
                        <div
                            class="my-0.5 w-0.5 shrink-0 self-stretch"
                            style="background: linear-gradient(to bottom, var(--color-accent-secondary), var(--color-accent));"
                        ></div>
                        <span class="min-w-0 py-0.5 text-lg leading-tight font-bold @max-sm:text-base @max-xs:text-sm"
                            >{$selectedCharacterEntry.costumeName}</span
                        >
                    </div>
                {/if}
                <div class="text-foreground-secondary flex gap-3">
                    <div class="my-0.5 w-0.5 shrink-0 self-stretch" style="background: var(--text-tertiary);"></div>
                    <span class="py-0.5 leading-tight font-medium tracking-wide capitalize"
                        >{currentDisplayVariant || 'Normal'}</span
                    >
                </div>
                {#if $selectedCharacterEntry?.code}
                    <div class="text-foreground-tertiary flex gap-3">
                        <div class="my-0.5 w-0.5 shrink-0 self-stretch" style="background: var(--text-tertiary);"></div>
                        <span class="py-0.5 font-mono text-sm leading-tight font-medium tracking-widest uppercase"
                            >{$selectedCharacterEntry.code}</span
                        >
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
