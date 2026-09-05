<script lang="ts">
    import './layout.css';
    import { theme } from '$lib/stores/theme';
    import { parseTheme, routeTheme, themeIcon } from '$lib/theme';
    import { page } from '$app/state';

    let { children } = $props();

    let queryTheme = $derived(parseTheme(page.url.searchParams.get('theme')));

    // An embed's theme is per-URL, so only a themed page persists the choice
    $effect(() => {
        if (queryTheme && !routeTheme(page.route.id)) theme.set(queryTheme);
    });

    let active = $derived(queryTheme ?? routeTheme(page.route.id) ?? $theme);

    $effect(() => {
        document.documentElement.dataset.theme = active;
        const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (icon) icon.href = themeIcon(active);
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
