<script lang="ts">
    import type { Live2DController } from '$lib/live2d/Live2DController.svelte';

    let { controller = $bindable<Live2DController>(), onPlayMotion } = $props<{
        controller: Live2DController;
        onPlayMotion: (group: string, index: number) => void;
    }>();
</script>

{#if controller?.state.motionGroups?.length}
    <div class="grid grid-cols-2 gap-2">
        {#each controller.state.motionGroups as group}
            {#each controller.getMotionVariants(group) || [] as variant}
                <button
                    onclick={() => onPlayMotion(group, variant.index)}
                    class="border-border rounded border px-3 py-2 text-xs font-medium transition {controller.state
                        .currentMotionGroup === group &&
                    controller.state.currentMotionIndex === variant.index &&
                    controller.state.isMotionPlaying
                        ? 'border-accent bg-accent text-white shadow-lg'
                        : controller.state.groupAudioState?.[`${group}:${variant.index}`]
                          ? 'bg-accent/10 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
                          : 'bg-background-secondary/30 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'}"
                    title={variant.label}
                >
                    <span class="block truncate">{variant.label}</span>
                </button>
            {/each}
        {/each}
    </div>
{/if}
