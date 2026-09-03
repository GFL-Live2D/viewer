<script lang="ts">
    let {
        bg = 'bg-background/80',
        pointerEvents = 'pointer-events-none',
        leftInset = null,
        rightInset = null,
        bottomInset = null,
        children,
    }: {
        bg?: string;
        pointerEvents?: string;
        leftInset?: number | null;
        rightInset?: number | null;
        bottomInset?: number | null;
        children: import('svelte').Snippet;
    } = $props();

    // Null insets leave the CSS breakpoint defaults in place, which is what SSR renders with.
    let overrides = $derived(
        [
            leftInset === null ? '' : `--overlay-left:${leftInset}px;`,
            rightInset === null ? '' : `--overlay-right:${rightInset}px;`,
            bottomInset === null ? '' : `--overlay-bottom:${bottomInset}px;`,
        ].join(''),
    );
</script>

<div class="canvas-overlay {bg} {pointerEvents} fixed top-0 z-50 flex items-center justify-center" style={overrides}>
    {@render children()}
</div>

<style>
    /* Defaults mirror the panel layout at each breakpoint so the server-rendered overlay is
       already centred in the visible canvas area. JS overrides these once panels move. */
    .canvas-overlay {
        left: var(--overlay-left, 0px);
        right: var(--overlay-right, 0px);
        bottom: var(--overlay-bottom, 45vh);
    }

    @media (min-width: 768px) {
        .canvas-overlay {
            left: var(--overlay-left, 400px);
            bottom: var(--overlay-bottom, 0px);
        }
    }

    @media (min-width: 1800px) {
        .canvas-overlay {
            left: var(--overlay-left, 600px);
            right: var(--overlay-right, 600px);
        }
    }
</style>
