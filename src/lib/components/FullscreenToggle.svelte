<script lang="ts">
    import { Maximize, Minimize } from '@lucide/svelte';
    import SpeedDrawButton from '$lib/components/SpeedDrawButton.svelte';

    let isFullscreen = $state(false);

    // Fullscreen can also be left via Esc or F11, so track the event rather than the click
    $effect(() => {
        const sync = () => (isFullscreen = !!document.fullscreenElement);
        sync();
        document.addEventListener('fullscreenchange', sync);
        return () => document.removeEventListener('fullscreenchange', sync);
    });

    async function toggle() {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error('Fullscreen request failed:', err);
        }
    }
</script>

<SpeedDrawButton
    onclick={toggle}
    title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    ariaLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    ariaPressed={isFullscreen}
>
    {#if isFullscreen}
        <Minimize class="h-5 w-5" />
    {:else}
        <Maximize class="h-5 w-5" />
    {/if}
</SpeedDrawButton>
