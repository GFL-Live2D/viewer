<script lang="ts">
    let {
        bg = 'bg-background/80',
        pointerEvents = 'pointer-events-none',
        children,
    }: {
        bg?: string;
        pointerEvents?: string;
        children: import('svelte').Snippet;
    } = $props();
</script>

<div class="{bg} {pointerEvents} fixed inset-0 z-50 flex items-center justify-center md:left-[400px] 2xl:left-0">
    {@render children()}
</div>
