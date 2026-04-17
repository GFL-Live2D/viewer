<script lang="ts">
    import { cn } from '$lib/utils.js';

    let {
        onclick,
        title,
        ariaLabel,
        ariaPressed = undefined,
        isActive = false,
        children,
        class: className,
        ...restProps
    }: {
        onclick?: () => void;
        title?: string;
        ariaLabel?: string;
        ariaPressed?: boolean;
        isActive?: boolean;
        children?: any;
        class?: string;
    } = $props();
</script>

<button
    {onclick}
    {title}
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
    data-state={isActive ? 'on' : 'off'}
    class={cn(
        'border-border speed-draw-button flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition',
        isActive ? 'border-accent bg-accent text-white' : 'bg-background-secondary/95 text-foreground-tertiary',
        className,
    )}
    {...restProps}
>
    {@render children?.()}
</button>
