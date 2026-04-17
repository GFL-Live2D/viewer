<script lang="ts">
    import { theme } from '$lib/stores/theme';
    import SpeedDrawButton from '$lib/components/SpeedDrawButton.svelte';
</script>

<SpeedDrawButton
    onclick={() => theme.toggle()}
    title="Toggle theme"
    ariaLabel="Toggle between Sangvis Ferri (dark) and Paradeus (light) themes"
>
    {#if $theme === 'sangvis'}
        <img src="/sangvis.png" alt="Sangvis Ferri" class="h-5 w-5 object-contain" />
    {:else}
        <img src="/paradeus.png" alt="Paradeus" class="h-5 w-5 object-contain" />
    {/if}
</SpeedDrawButton>
