<script lang="ts">
    let {
        text = '',
        delay = 2000,
        duration = 3000,
    } = $props<{
        text: string;
        delay?: number;
        duration?: number;
    }>();

    let container = $state<HTMLDivElement>();
    let inner = $state<HTMLElement>();
    let isOverflow = $state(false);

    function checkOverflow() {
        if (!container || !inner) return;
        isOverflow = inner.scrollWidth > container.clientWidth;
    }

    $effect(() => {
        text;
        setTimeout(checkOverflow, 0);
    });

    $effect(() => {
        if (container) {
            const observer = new ResizeObserver(checkOverflow);
            observer.observe(container);
            return () => observer.disconnect();
        }
    });
</script>

<div bind:this={container} class="text-foreground overflow-hidden text-left text-xs whitespace-nowrap">
    {#if isOverflow && text}
        <div
            bind:this={inner}
            class="inline-block"
            style="animation: scroll-text {duration}ms ease-in-out {delay}ms infinite alternate;"
        >
            {text}
            <span class="inline-block w-4"></span>
            {text}
        </div>
    {:else}
        <span bind:this={inner} class="block text-left">{text}</span>
    {/if}
</div>

<style>
    @keyframes scroll-text {
        0% {
            transform: translateX(0);
        }
        50% {
            transform: translateX(calc(-50% - 1rem));
        }
        100% {
            transform: translateX(0);
        }
    }
</style>
