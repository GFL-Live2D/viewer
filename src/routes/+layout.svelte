<script lang="ts">
    import './layout.css';
    import { theme } from '$lib/stores/theme';
    import { onMount } from 'svelte';

    let { children } = $props();

    onMount(() => {
        document.documentElement.dataset.theme = $theme;
    });
</script>

<div class="app">
    {@render children()}
</div>

<style>
    :global(body, html) {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    .app {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
