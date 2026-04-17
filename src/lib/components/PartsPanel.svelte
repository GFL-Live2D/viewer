<script lang="ts">
    import { ModelLoadingState } from '$lib/live2d/Live2DController.svelte';
    import { controller } from '$lib/stores/gun-page';
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
    </div>

    {#if $controller?.state.loading === ModelLoadingState.READY}
        <div class="custom-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {#each $controller?.state.parts ?? [] as part (part.id)}
                <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between gap-2">
                        <label
                            for="part-opacity-{part.index}"
                            class="user-select-none text-foreground-secondary truncate text-xs"
                            title={part.id}
                        >
                            {part.id}
                        </label>
                        <span class="user-select-none text-foreground-tertiary font-mono text-xs"
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
