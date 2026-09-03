<script lang="ts">
    import { uiState, controller } from '$lib/stores/gun-page';
    import MorphingChevron from '$lib/components/MorphingChevron.svelte';
    import { Move, Plus, Minus, RotateCcw, ImageUp, Trash2 } from '@lucide/svelte';
    import type BackgroundManager from '$lib/components/BackgroundManager.svelte';

    let {
        bgHasImage = false,
        isBgMoveMode = $bindable(false),
        bgZoom = $bindable(0),
        bgManager,
        hideUI = false,
    }: {
        bgHasImage?: boolean;
        isBgMoveMode?: boolean;
        bgZoom?: number;
        bgManager?: BackgroundManager;
        hideUI?: boolean;
    } = $props();

    let isAllPanelsExpanded = $derived($uiState.isAllPanelsExpanded);

    function togglePanels() {
        uiState.update((s) => ({ ...s, isAllPanelsExpanded: !s.isAllPanelsExpanded }));
    }

    function toggleBgMoveMode() {
        isBgMoveMode = !isBgMoveMode;
        if (isBgMoveMode) {
            $controller?.setMoveMode(false);
        }
    }

    function setBackgroundZoom(value: number, smooth = false) {
        bgManager?.setZoom(value, { smooth });
    }

    function adjustBackgroundZoom(delta: number) {
        const current = bgManager?.getCurrentZoom() ?? bgZoom;
        setBackgroundZoom(Math.max(-10, Math.min(10, current + delta)));
    }
</script>

<button
    onclick={togglePanels}
    class="border-border bg-background-secondary/95 text-foreground-tertiary hover:border-accent hover:text-foreground hidden h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition-all duration-300 2xl:flex {hideUI
        ? 'pointer-events-none opacity-0'
        : ''}"
    title={isAllPanelsExpanded ? 'Collapse panels' : 'Expand panels'}
>
    <MorphingChevron class="h-5 w-5" pointsRight={isAllPanelsExpanded} />
</button>

{#if bgHasImage}
    <div class="flex flex-col gap-3 transition-opacity duration-300 {hideUI ? 'pointer-events-none opacity-0' : ''}">
        <button
            onclick={toggleBgMoveMode}
            class="border-border flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition {isBgMoveMode
                ? 'border-accent bg-accent hover:bg-accent-secondary text-white'
                : 'bg-background-secondary text-foreground-tertiary hover:border-accent hover:text-foreground'}"
            title={isBgMoveMode ? 'Disable background drag' : 'Enable background drag'}
        >
            <Move class="h-5 w-5" />
        </button>
        <button
            onclick={() => bgManager?.reset()}
            class="border-border bg-background-secondary text-foreground-tertiary hover:border-accent hover:text-foreground flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition"
            title="Reset background"
        >
            <RotateCcw class="h-5 w-5" />
        </button>
        <div
            class="border-border bg-background-secondary flex h-full w-10 flex-col items-center justify-center gap-1 rounded-lg border py-3 shadow-lg"
        >
            <button
                onclick={() => adjustBackgroundZoom(1)}
                class="hover:bg-accent/10 hover:text-foreground mb-2 flex h-6 w-6 items-center justify-center rounded transition"
                title="Increase background zoom"
            >
                <Plus class="text-foreground-tertiary h-4 w-4" />
            </button>
            <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={bgZoom}
                oninput={(e) => setBackgroundZoom(parseFloat(e.currentTarget.value), true)}
                class="zoom-slider bg-background-tertiary accent-accent h-40 w-1 cursor-pointer appearance-none rounded-lg"
                style="writing-mode: vertical-lr; direction: rtl;"
                title="Background zoom level"
            />
            <button
                onclick={() => adjustBackgroundZoom(-1)}
                class="hover:bg-accent/10 hover:text-foreground mt-2 flex h-6 w-6 items-center justify-center rounded transition"
                title="Decrease background zoom"
            >
                <Minus class="text-foreground-tertiary h-4 w-4" />
            </button>
        </div>
        <button
            onclick={() => bgManager?.clear()}
            class="border-border bg-background-secondary text-foreground-tertiary hover:border-accent hover:text-foreground flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition"
            title="Clear background"
        >
            <Trash2 class="h-5 w-5" />
        </button>
    </div>
{/if}
