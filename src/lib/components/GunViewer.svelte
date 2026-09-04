<script lang="ts">
    import { onDestroy } from 'svelte';
    import GunLive2D from '$lib/components/GunLive2D.svelte';
    import { Live2DController } from '$lib/live2d/Live2DController.svelte';
    import type { Live2DModelIndex } from '$lib/server/live2d';

    let {
        model,
        variant,
        motionData,
        voiceData,
        assetBaseUrl,
        transparent = false,
    } = $props<{
        model: Live2DModelIndex;
        variant: string;
        motionData: Record<string, Record<number, any>>;
        voiceData: Record<string, Record<number, any>>;
        assetBaseUrl: string;
        transparent?: boolean;
    }>();

    let controller = $state<Live2DController>();
    let canvas = $state<HTMLCanvasElement>();

    // GunLive2D binds the controller but does not own its lifecycle
    $effect(() => {
        if (canvas && !controller) {
            controller = new Live2DController(canvas);
            // Nothing here can pan or zoom, so the model tracks the frame instead
            controller.setAutoFitOnResize(true);
        }
    });

    onDestroy(() => controller?.cleanup());
</script>

<svelte:head>
    <title>{model.gunName || model.code}</title>
    {#if transparent}
        <!-- The canvas already clears to alpha 0, so only the page beneath it has to give way -->
        <style>
            html,
            body {
                background: transparent !important;
            }
        </style>
    {/if}
</svelte:head>

<div
    class="fixed inset-0 h-full w-full overflow-hidden {transparent ? '' : 'bg-background'}"
    role="application"
>
    <div class="absolute inset-0 isolate z-0">
        <GunLive2D
            characterEntry={model}
            {variant}
            motionData={motionData[variant]}
            voiceData={voiceData[variant]}
            normalVoiceData={voiceData['normal']}
            {assetBaseUrl}
            displayOnly={true}
            bind:controller
            bind:canvas
        />
    </div>
</div>
