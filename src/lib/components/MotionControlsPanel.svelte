<script lang="ts">
    import {
        controller,
        isCaptionDetached,
        modelNames,
        selectedCharacterEntry,
        uiState,
    } from '$lib/stores/gun-page';
    import { buildWikiLink } from '$lib/shareLinks';
    import MotionGrid from '$lib/components/MotionGrid.svelte';
    import DetachableCaption from '$lib/components/DetachableCaption.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import { Label } from '$lib/components/ui/label';
    import { ExternalLink, SlidersHorizontal } from '@lucide/svelte';

    let {
        onPlayMotion,
        onReset,
    }: {
        onPlayMotion: (groupName: string, variantIndex: number) => void;
        onReset: () => void;
    } = $props();

    let quotesUrl = $derived.by(() => {
        const entry = $selectedCharacterEntry;
        if (!entry) return null;

        return buildWikiLink($modelNames[entry.id] || entry.gunName, 'Quotes');
    });

    function toggleParametersPanel() {
        uiState.update((s) => ({ ...s, isParametersPanelOpen: !s.isParametersPanelOpen }));
    }
</script>

<!-- Motion Buttons Grid -->
{#if $controller?.state.motionGroups?.length}
    <div class="overflow-y-auto px-6 py-4">
        <div class="mb-3 flex items-center justify-between">
            <h3 class="subtitle text-foreground-secondary text-lg font-semibold tracking-wide">Motions</h3>
            <button
                onclick={toggleParametersPanel}
                class="group/btn border-border bg-background-tertiary hover:border-accent hover:bg-background-secondary hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border transition-all duration-300 active:scale-95 2xl:flex"
                title="Toggle parameters and parts panel"
            >
                <SlidersHorizontal
                    class="text-foreground-secondary group-hover/btn:text-foreground h-5 w-5 transition-all duration-300"
                />
            </button>
        </div>
        <p class="text-foreground-tertiary text-xs">
            Only one motion can play at a time. You must wait for it to finish or reset the model before playing
            another.
        </p>
        <Separator class="bg-border my-2" />
        <MotionGrid controller={$controller} {onPlayMotion} />

        <div class="mt-6">
            <div class="mb-3 flex items-center gap-2">
                <h3 class="subtitle text-foreground-secondary text-lg font-semibold tracking-wide">Voice</h3>
                {#if quotesUrl}
                    <a
                        href={quotesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-foreground-tertiary hover:text-foreground transition-colors"
                        title="Open quotes in Wiki"
                        aria-label="Open quotes in Wiki"
                    >
                        <ExternalLink class="h-4 w-4 shrink-0" />
                    </a>
                {/if}
            </div>
            <div class="flex flex-col space-y-2">
                <div class="flex items-center space-x-2">
                    <Checkbox
                        id="force-lipsync"
                        checked={$controller.state.forceLipSync}
                        onCheckedChange={(checked: boolean) => $controller?.setForceLipSync(checked)}
                    />
                    <Label
                        for="force-lipsync"
                        class="text-foreground-secondary text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Force lip sync
                    </Label>
                </div>
                <div class="flex items-center space-x-2">
                    <Checkbox id="render-captions-canvas" bind:checked={$controller.state.renderCaptionsOnCanvas} />
                    <Label
                        for="render-captions-canvas"
                        class="text-foreground-secondary text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Render captions on canvas
                    </Label>
                </div>
            </div>

            {#if $controller}
                {@const unmappedVoicelines = $controller.getUnmappedVoicelines()}
                {#if unmappedVoicelines.length > 0}
                    <div class="mt-4">
                        <h4 class="text-foreground-tertiary text-xs font-medium mb-2">Voicelines</h4>
                        <div class="grid grid-cols-2 gap-2">
                            {#each unmappedVoicelines as voiceline}
                                {@const isPlaying = $controller.state.showProgressBar && $controller.state.caption === voiceline.caption}
                                <button
                                    onclick={() => $controller.playAudioOnly(voiceline.motionId)}
                                    class="border-border rounded border px-3 py-2 text-xs font-medium transition {isPlaying
                                        ? 'border-accent bg-accent text-white shadow-lg'
                                        : 'bg-background-secondary/30 text-foreground-secondary hover:border-accent hover:bg-background-tertiary hover:text-foreground'}"
                                    title={voiceline.caption}
                                >
                                    <span class="block truncate">{voiceline.voice_key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
{/if}

<!-- Bottom Controls: Animation Progress -->
<div class="mt-auto p-6">
    <!-- Animation Progress & Caption -->
    <DetachableCaption
        showProgressBar={$controller?.state.showProgressBar ?? false}
        motionProgress={$controller?.state.motionProgress ?? 0}
        caption={$controller?.state.caption ?? null}
        onDetachedChange={(detached) => isCaptionDetached.set(detached)}
    />
</div>
