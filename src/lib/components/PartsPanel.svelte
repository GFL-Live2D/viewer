<script lang="ts">
    import { ModelLoadingState } from '$lib/live2d/Live2DController.svelte';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import { controller } from '$lib/stores/gun-page';

    function hoverPart(id: string | null) {
        if (!$controller?.state.highlightHoveredPart) return;
        $controller?.highlightPart(id);
    }

    function setHighlightEnabled(enabled: boolean) {
        if (!$controller) return;
        $controller.state.highlightHoveredPart = enabled;
        if (!enabled) $controller.clearPartHighlight();
    }
</script>

<!-- PARTS SECTION: Bottom 1/3 -->
<div class="flex h-full flex-col overflow-hidden">
    <div class="border-border border-b p-4">
        <div class="flex items-center justify-between gap-2">
            <h3 class="subtitle text-foreground-secondary text-lg font-semibold tracking-wide">Parts</h3>
            <button
                onclick={() => $controller?.resetPartOpacities()}
                class="border-border bg-background-tertiary text-foreground-secondary hover:bg-background-secondary hover:text-foreground hover:border-accent rounded border px-2 py-2 text-xs font-medium transition"
                title="Reset all opacities to default"
            >
                Reset
            </button>
        </div>
        <label class="mt-3 flex cursor-pointer items-center gap-3">
            <Checkbox
                checked={$controller?.state.highlightHoveredPart ?? true}
                onCheckedChange={setHighlightEnabled}
            />
            <span class="text-foreground text-sm">Highlight part on label hover</span>
        </label>
    </div>

    {#if $controller?.state.loading === ModelLoadingState.READY}
        <div class="custom-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {#each $controller?.state.parts ?? [] as part (part.id)}
                <div class="flex flex-col gap-1">
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="flex items-center gap-2"
                        onmouseenter={() => hoverPart(part.id)}
                        onmouseleave={() => hoverPart(null)}
                        onfocusin={() => hoverPart(part.id)}
                        onfocusout={() => hoverPart(null)}
                    >
                        <label
                            for="part-opacity-{part.index}"
                            class="user-select-none text-foreground-secondary min-w-0 flex-1 truncate text-xs"
                            title={part.id}
                        >
                            {part.id}
                        </label>
                        <span class="user-select-none text-foreground-tertiary shrink-0 font-mono text-xs"
                            >{(part.opacity * 100).toFixed(0)}%</span
                        >
                    </div>
                    <input
                        id="part-opacity-{part.index}"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={part.opacity}
                        oninput={(e) => $controller?.setPartOpacity(part.id, parseFloat(e.currentTarget.value))}
                        class="range-slider w-full cursor-pointer appearance-none bg-transparent"
                    />
                </div>
            {/each}
        </div>
    {/if}
</div>
