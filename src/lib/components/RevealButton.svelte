<script lang="ts">
    import { PanelBottomOpen, SquareDashed, PanelLeftRightDashed, PanelLeftDashed } from '@lucide/svelte';
    import { onMount } from 'svelte';

    let {
        isVisible = true,
        enableFlash = true,
        variant = 'responsive',
        onToggle = () => {},
    } = $props<{
        isVisible: boolean;
        enableFlash?: boolean;
        variant?: 'responsive' | 'desktop';
        onToggle: () => void;
    }>();

    let isHidden = $state(false);
    let isFlashing = $state(false);
    let isHovered = $state(false);
    let fadeTimer: NodeJS.Timeout;

    function resetButtonFadeTimer() {
        clearTimeout(fadeTimer);
        isHidden = false;

        // Don't auto-hide if currently hovering OR if UI is fully visible
        if (isHovered || isVisible) return;

        fadeTimer = setTimeout(() => {
            isHidden = true;
        }, 3000);
    }

    function handleClick() {
        onToggle();
        // Timer will be reset by effect when isVisible changes
    }

    function handleMouseEnter() {
        isHovered = true;
        resetButtonFadeTimer();
    }

    function handleMouseLeave() {
        isHovered = false;
        resetButtonFadeTimer();
    }

    function handleTouchStart(e: TouchEvent) {
        // e.preventDefault();
        resetButtonFadeTimer();
    }

    // React to visibility changes
    $effect(() => {
        // Always ensure button is visible on state change
        isHidden = false;
        resetButtonFadeTimer();
        return () => clearTimeout(fadeTimer);
    });

    onMount(() => {
        // Sequence:
        // 1. Wait 1.5s
        // 2. Flash (1s)
        // 3. Wait 2s (sit there)
        // 4. Slide out (if applicable)
        const introTimer = setTimeout(() => {
            // Abort if user is already interacting
            if (isHovered) return;

            if (enableFlash) {
                isFlashing = true;
            }

            // Clear flash state after animation
            setTimeout(() => {
                isFlashing = false;
            }, 1100);

            // Set final hide if not interrupted
            // Total delay from now: 1s (anim) + 2s (sit) = 3s
            setTimeout(() => {
                resetButtonFadeTimer();
            }, 3000);
        }, 1500);

        return () => clearTimeout(introTimer);
    });
</script>

<!-- Wrapper acts as the persistent "location" anchor and hit target -->
<div
    role="presentation"
    class="pointer-events-auto relative flex h-10 w-10 items-center justify-center"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    ontouchstart={handleTouchStart}
>
    <button
        onclick={handleClick}
        class="border-border bg-background-secondary/95 text-foreground-secondary hover:border-accent hover:bg-accent/10 hover:text-foreground relative flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition-all duration-500"
        class:flash={isFlashing}
        class:opacity-0={isHidden}
        class:pointer-events-none={isHidden}
        title={isVisible ? 'Hide panels' : 'Show panels'}
        aria-label={isVisible ? 'Hide panels' : 'Show panels'}
    >
        {#if isVisible}
            <SquareDashed class="h-5 w-5" />
        {:else if variant === 'responsive'}
            <!-- Mobile (< md) -->
            <PanelBottomOpen class="block h-5 w-5 md:hidden" />

            <!-- Tablet (md+) -->
            <PanelLeftDashed class="hidden h-5 w-5 md:block" />
        {:else if variant === 'desktop'}
            <!-- Desktop Only -->
            <PanelLeftRightDashed class="h-5 w-5" />
        {/if}
    </button>
</div>

<style>
    /* Flash animation */
    .flash {
        animation: flash-glow 1s cubic-bezier(0.22, 1, 0.36, 1);
    }

    @keyframes flash-glow {
        0% {
            box-shadow: 0 0 0 0 var(--color-accent);
            transform: scale(1);
            background-color: var(--color-background-secondary);
            border-color: var(--color-border);
        }
        30% {
            box-shadow: 0 0 20px 5px var(--color-accent);
            transform: scale(1.15);
            background-color: var(--color-background-tertiary);
            border-color: var(--color-foreground);
            color: var(--color-foreground);
        }
        100% {
            box-shadow: 0 0 0 0 var(--color-accent);
            transform: scale(1);
            background-color: var(--color-background-secondary);
            border-color: var(--color-border);
        }
    }
</style>
