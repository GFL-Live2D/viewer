<script lang="ts">
    import CanvasOverlay from '$lib/components/CanvasOverlay.svelte';

    let {
        message,
        onRetry = null,
        leftInset = null,
        rightInset = null,
        bottomInset = null,
    } = $props<{
        message: string;
        onRetry?: (() => void) | null;
        leftInset?: number | null;
        rightInset?: number | null;
        bottomInset?: number | null;
    }>();
</script>

<CanvasOverlay
    bg="bg-background"
    pointerEvents="pointer-events-auto"
    {leftInset}
    {rightInset}
    {bottomInset}
>
    <div class="max-w-md text-center">
        <h2 class="mb-2 text-2xl font-bold text-red-400">Error</h2>
        <p class="text-foreground-tertiary mb-6 text-sm">{message}</p>
        {#if onRetry}
            <button
                onclick={onRetry}
                class="bg-accent hover:bg-accent-hover rounded px-4 py-2 text-white">Retry</button
            >
        {/if}
    </div>
</CanvasOverlay>
