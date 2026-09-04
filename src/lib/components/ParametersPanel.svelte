<script lang="ts">
    import { TriangleAlert, X } from '@lucide/svelte';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import { Separator } from '$lib/components/ui/separator';
    import { ModelLoadingState } from '$lib/live2d/Live2DController.svelte';
    import { controller } from '$lib/stores/gun-page';

    // Setup parameter polling when follow is enabled
    $effect(() => {
        if (!$controller || !$controller.state.followParameterValues) return;
        if ($controller.state.loading !== ModelLoadingState.READY) return;

        const updateParams = () => {
            $controller?.refreshParametersState();
        };

        $controller.app.ticker.add(updateParams);
        return () => {
            $controller?.app?.ticker.remove(updateParams);
        };
    });
</script>

<!-- PARAMETERS SECTION: Top 2/3 -->
<div class="flex h-full flex-col overflow-hidden">
    <div class="border-border border-b p-4">
        <div class="flex items-center gap-2">
            <h3 class="subtitle text-foreground-secondary flex-1 text-lg font-semibold tracking-wide">Parameters</h3>
            <button
                onclick={() => $controller?.pauseMotions()}
                class="border-border bg-background-tertiary text-foreground-secondary hover:bg-background-secondary hover:text-foreground hover:border-accent shrink-0 rounded border px-2 py-2 text-xs font-medium transition"
                title="Stop motions, resume by playing a motion from button or hitbox"
            >
                Stop
            </button>
            <button
                onclick={() => $controller?.setFrozen(!$controller.state.isFrozen)}
                class="border-border shrink-0 rounded border px-2 py-2 text-xs font-medium transition {$controller?.state
                    .isFrozen
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'bg-background-tertiary text-foreground-secondary hover:bg-background-secondary hover:text-foreground hover:border-accent'}"
                title="Suspend breath, physics, pose and gaze so manual values hold still"
                aria-pressed={$controller?.state.isFrozen ?? false}
            >
                Freeze
            </button>
        </div>
        <label class="mt-3 flex cursor-pointer items-center gap-3">
            <Checkbox
                checked={$controller?.state.followParameterValues ?? false}
                onCheckedChange={(checked) => $controller?.setFollowParameters(checked)}
            />
            <span class="text-foreground text-sm">Follow animation</span>
        </label>

        <label class="mt-3 flex cursor-pointer items-center gap-3">
            <Checkbox
                checked={$controller?.state.useCustomInitialPositioning ?? true}
                onCheckedChange={(checked) => {
                    if ($controller) $controller.state.useCustomInitialPositioning = checked;
                }}
            />
            <span class="text-foreground text-sm">Custom initial positioning</span>
        </label>

        <!-- Focus Strength Slider -->
        <div class="mt-4 flex flex-col gap-1">
            <div class="flex items-center justify-between">
                <label for="focus-slider" class="text-foreground-secondary text-xs">Look Focus Strength</label>
                <span class="text-foreground-tertiary font-mono text-xs">{$controller?.state.focusWeight ?? 3}</span>
            </div>
            <input
                id="focus-slider"
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={$controller?.state.focusWeight ?? 3}
                oninput={(e) => $controller?.setFocusWeight(parseFloat(e.currentTarget.value))}
                class="range-slider w-full cursor-pointer appearance-none bg-transparent"
                title="Adjust the sensitivity of the model's gaze tracking"
            />
        </div>
    </div>

    {#if $controller?.state.loading === ModelLoadingState.READY}
        <div class="custom-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            <!-- Fixed height so swapping the hint for the button does not shift the list below -->
            <div class="flex h-9 shrink-0 items-center">
                {#if ($controller?.state.overriddenParams.length ?? 0) > 0}
                    <button
                        onclick={() => $controller?.releaseAllParameters()}
                        class="border-border bg-background-tertiary text-foreground-secondary hover:bg-background-secondary hover:text-foreground hover:border-accent h-full w-full rounded border px-3 text-xs font-medium transition"
                    >
                        Release all ({$controller?.state.overriddenParams.length})
                    </button>
                {:else}
                    <p class="text-foreground-tertiary text-xs">
                        Moving a slider pins that parameter, holding it against any animation until released.
                    </p>
                {/if}
            </div>
            <Separator class="bg-border my-2" />
            {#each $controller?.state.parameters ?? [] as param (param.index)}
                <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex min-w-0 flex-1 items-center gap-1">
                            <label
                                for="param-slider-{param.index}"
                                class="user-select-none text-foreground-secondary truncate text-xs {param.missing
                                    ? 'text-amber-500'
                                    : ''}"
                                title={param.name}
                            >
                                {param.name}
                            </label>
                            {#if param.missing}
                                <TriangleAlert class="h-3 w-3 flex-shrink-0 text-amber-500" />
                            {/if}
                        </div>
                        {#if $controller?.state.overriddenParams.includes(param.index)}
                            <button
                                onclick={() => $controller?.releaseParameter(param.index)}
                                class="text-accent flex shrink-0 items-center gap-1 font-mono text-xs"
                                title="Release to animation control"
                                aria-label="Release {param.name} to animation control"
                            >
                                <X class="h-3 w-3" />
                                {param.value.toFixed(2)}
                            </button>
                        {:else}
                            <span class="user-select-none text-foreground-tertiary shrink-0 font-mono text-xs"
                                >{param.value.toFixed(2)}</span
                            >
                        {/if}
                    </div>
                    <input
                        id="param-slider-{param.index}"
                        type="range"
                        min={param.min}
                        max={param.max}
                        step="0.01"
                        value={param.value}
                        oninput={(e) => $controller?.setParameterValue(param.name, parseFloat(e.currentTarget.value))}
                        class="range-slider w-full cursor-pointer appearance-none bg-transparent"
                    />
                </div>
            {/each}
        </div>
    {/if}
</div>
