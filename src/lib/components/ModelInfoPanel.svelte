<script lang="ts">
    import {
        selectedCharacterEntry,
        selectedModel,
        selectedVariant,
        modelNames,
        variantsByModel,
    } from '$lib/stores/gun-page';
    import GunNameDisplay from '$lib/components/GunNameDisplay.svelte';
    import { Check, Link, ArrowLeftRight } from '@lucide/svelte';
    import fitty, { type FittyInstance } from 'fitty';

    let { onSwapVariant = (modelId: string, variant: string) => {} } = $props<{
        onSwapVariant?: (modelId: string, variant: string) => void;
    }>();

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

    function formatVariant(variant: string) {
        const v = variant.toLowerCase();
        return v === 'destroy' ? 'damaged' : v;
    }

    let otherVariant = $derived.by(() => {
        const entry = $selectedCharacterEntry;
        if (!entry) return undefined;
        const variants = $variantsByModel[entry.directory] ?? [];
        return variants.find((v) => v !== $selectedVariant);
    });

    function handleSwapVariant() {
        const entry = $selectedCharacterEntry;
        if (!entry || !otherVariant) return;
        onSwapVariant(entry.id, otherVariant);
    }

    // Auto-fit costume name to one line via fitty (handles resize + mutation observation itself).
    let costumeNameEl = $state<HTMLSpanElement | undefined>();
    let fittyInstance: FittyInstance | undefined;

    $effect(() => {
        if (!costumeNameEl) return;
        fittyInstance = fitty(costumeNameEl, { minSize: 10, maxSize: 18, multiLine: false });
        return () => fittyInstance?.unsubscribe();
    });

    $effect(() => {
        // Re-fit whenever the costume name text changes.
        $selectedCharacterEntry?.costumeName;
        fittyInstance?.fit();
    });
</script>

<!-- Header Info with refined styling -->
<div class="group @container relative flex flex-col overflow-hidden select-text">
    <!-- Main content -->
    <div class="relative flex-1 p-4">
        <!-- Title and metadata -->
        <div class="space-y-3">
            <!-- Model name section with controls -->
            <div class="flex items-start gap-0">
                <!-- Title (Center area, wraps) -->
                <h2
                    class="text-foreground flex min-w-0 flex-1 flex-wrap items-center gap-3 font-semibold tracking-tight"
                    style="font-size: clamp(1.25rem, 6cqw + 0.5rem, 2.25rem);"
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
                        class="text-foreground-tertiary hover:text-foreground bg-background-secondary/50 hover:bg-background-tertiary flex h-9 w-9 flex-shrink-0 items-center justify-center self-center rounded-lg transition-all duration-200 active:scale-95"
                        title="Copy direct link"
                        aria-label="Copy direct link"
                    >
                        {#if isCopied}
                            <Check class="h-5 w-5 text-emerald-500" />
                        {:else}
                            <Link class="h-5 w-5" />
                        {/if}
                    </button>
                </h2>
            </div>

            <!-- Metadata section -->
            <div class="text-md space-y-2.5">
                {#if $selectedCharacterEntry?.costumeName}
                    <div class="text-accent flex min-w-0 gap-3">
                        <div class="flex w-4 shrink-0 justify-center self-stretch">
                            <div
                                class="my-0.5 w-0.5"
                                style="background: linear-gradient(to bottom, var(--color-accent-secondary), var(--color-accent));"
                            ></div>
                        </div>
                        <div class="min-w-0 flex-1 overflow-hidden">
                            <span
                                bind:this={costumeNameEl}
                                class="block py-0.5 leading-tight font-bold whitespace-nowrap"
                                >{$selectedCharacterEntry.costumeName}</span
                            >
                        </div>
                    </div>
                {/if}
                {#if $selectedCharacterEntry?.code}
                    <div class="text-foreground-tertiary flex gap-3">
                        <div class="flex w-4 shrink-0 justify-center self-stretch">
                            <div class="my-0.5 w-0.5" style="background: var(--text-tertiary);"></div>
                        </div>
                        <span class="py-0.5 font-mono text-sm leading-tight font-medium tracking-widest uppercase"
                            >{$selectedCharacterEntry.code}</span
                        >
                    </div>
                {/if}
                {#if otherVariant}
                    <button
                        onclick={handleSwapVariant}
                        class="text-foreground-secondary hover:text-foreground hover:bg-background-tertiary -my-0.5 flex items-center gap-3 rounded py-0.5 pr-1.5 transition-colors"
                        title="Switch to {formatVariant(otherVariant)}"
                        aria-label="Switch variant"
                    >
                        <div class="flex w-4 shrink-0 justify-center">
                            <ArrowLeftRight class="h-3.5 w-3.5" />
                        </div>
                        <span class="py-0.5 leading-tight font-medium tracking-wide capitalize"
                            >{currentDisplayVariant || 'Normal'}</span
                        >
                    </button>
                {:else}
                    <div class="text-foreground-secondary flex gap-3">
                        <div class="w-4 shrink-0"></div>
                        <span class="py-0.5 leading-tight font-medium tracking-wide capitalize"
                            >{currentDisplayVariant || 'Normal'}</span
                        >
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
