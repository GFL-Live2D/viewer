<script lang="ts">
    import { cn } from '$lib/utils.js';

    let {
        onclick,
        title,
        ariaLabel,
        children,
        class: className,
        ...restProps
    }: {
        onclick?: () => void;
        title?: string;
        ariaLabel?: string;
        children?: any;
        class?: string;
    } = $props();
</script>

<button
    {onclick}
    {title}
    aria-label={ariaLabel}
    class={cn('speed-draw-icon-button flex h-6 w-6 items-center justify-center rounded transition', className)}
    {...restProps}
>
    {@render children?.()}
</button>
