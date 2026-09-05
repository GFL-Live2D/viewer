<script lang="ts">
    import * as Accordion from '$lib/components/ui/accordion';
    import {
        selectedCharacterEntry,
        selectedVariant,
        subdomainMode,
        subdomain,
    } from '$lib/stores/gun-page';
    import { apexHost as toApexHost, buildPanelEmbedLink, buildPathEmbedLink } from '$lib/shareLinks';
    import { env } from '$lib/publicEnv';
    import type { Live2DModelIndex } from '$lib/model-data/live2d';
    import { Check, Copy, ImageDown, MousePointerClick } from '@lucide/svelte';

    let { baseHost } = $props<{
        baseHost: string;
    }>();

    let apexHost = $derived(toApexHost(baseHost, $subdomain, env.PUBLIC_DOMAIN ?? ''));

    let copied = $state(false);
    let copyTimeout: ReturnType<typeof setTimeout> | undefined;

    let embedPanels = $state(false);
    let openSections = $state(['about']);
    let openShortcuts = $state<string[]>([]);
    let openAccess = $state<string[]>([]);


    // The collapse animates to a height measured before it runs, so nested content has to fold first
    $effect(() => {
        if (!openSections.includes('about')) {
            openShortcuts = [];
            openAccess = [];
        }
    });

    // Falls back to a sample model so the snippet reads sensibly before a selection
    let embedUrl = $derived.by(() => {
        const entry = $selectedCharacterEntry ?? { code: 'pa-15' };
        const v = ($selectedVariant ?? '').toLowerCase();

        const ctx = {
            protocol: typeof window === 'undefined' ? 'https:' : window.location.protocol,
            host: baseHost,
            subdomainMode: $subdomainMode,
            subdomain: $subdomain,
            apex: env.PUBLIC_DOMAIN ?? '',
            variant: v === 'destroy' ? 'damaged' : v,
            transparent: true,
            readable: true,
        };

        return embedPanels
            ? buildPanelEmbedLink(entry as Live2DModelIndex, ctx)
            : buildPathEmbedLink(entry as Live2DModelIndex, ctx);
    });

    // Browsers paint an opaque iframe background, so a see-through embed has to clear it too
    let embedSnippet = $derived(
        `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0"` +
            ` style="background: transparent"></iframe>`,
    );

    async function copyEmbed() {
        try {
            await navigator.clipboard.writeText(embedSnippet);
            copied = true;
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => (copied = false), 2000);
        } catch (err) {
            console.error('Failed to copy embed:', err);
        }
    }
</script>

<div class="flex items-center justify-between p-4">
    <div class="w-full">
        <Accordion.Root type="multiple" bind:value={openSections} class="w-full">
            <Accordion.Item value="about" class="border-b-0">
                <Accordion.Trigger class="items-center py-0 hover:no-underline">
                    <div>
                        <h1 class="text-foreground text-xl font-bold tracking-tight">GFL Live2D Model Browser</h1>
                        <p class="text-foreground-secondary text-xs">(ver. beta)</p>
                    </div>
                </Accordion.Trigger>
                <Accordion.Content class="pb-0">
                    <p class="text-foreground-secondary mt-2 flex items-center gap-2 text-sm">
                        <MousePointerClick class="h-4 w-4 shrink-0" /> Middle click to move, scroll to zoom. Touch or hold left click
                        for tracking focus.
                    </p>
                    <p class="text-foreground-secondary flex items-center gap-2 text-sm">
                        <ImageDown class="h-4 w-4 shrink-0" /> Drop in or paste any image to set as background.<br />Drag right
                        click to move background.
                    </p>
                    <a
                        href="https://github.com/GFL-Live2D/viewer"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-foreground-secondary hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                    >
                        <svg
                            class="h-4 w-4 shrink-0"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            />
                        </svg>
                        <span class="underline underline-offset-2">Go to GFL-Live2D/viewer for reporting issues or contributing.</span>
                    </a>
                    <Accordion.Root class="hidden w-full 2xl:block" type="multiple" bind:value={openShortcuts}>
                    <Accordion.Item value="shortcuts" class="border-b-0">
                        <Accordion.Trigger class="text-foreground-tertiary hover:text-foreground mt-2 py-2 text-sm">
                            Keyboard Shortcuts
                        </Accordion.Trigger>
                        <Accordion.Content class="text-foreground-tertiary pt-2 pb-0 text-sm">
                            <p class="text-foreground-secondary mb-1 font-medium">Canvas Controls</p>
                            <ul class="mb-2 ml-2 list-none space-y-1">
                                <li><code class="bg-background-tertiary rounded px-1">M</code> Toggle move mode</li>
                                <li><code class="bg-background-tertiary rounded px-1">E</code> Toggle focus tracking</li>
                                <li><code class="bg-background-tertiary rounded px-1">Middle Click</code> Drag canvas</li>
                                <li><code class="bg-background-tertiary rounded px-1">Scroll</code> Zoom in/out</li>
                            </ul>
                            <p class="text-foreground-secondary mb-1 font-medium">Background</p>
                            <ul class="ml-2 list-none space-y-1">
                                <li>
                                    <code class="bg-background-tertiary rounded px-1">Right Click Drag</code> Move background
                                </li>
                                <li><code class="bg-background-tertiary rounded px-1">0</code> Reset background position</li>
                                <li><code class="bg-background-tertiary rounded px-1">Ctrl+V</code> Paste image URL</li>
                            </ul>
                        </Accordion.Content>
                    </Accordion.Item>
                    </Accordion.Root>
                    <Accordion.Root class="w-full" type="multiple" bind:value={openAccess}>
                    <Accordion.Item value="access">
                        <Accordion.Trigger class="text-foreground-tertiary hover:text-foreground mt-2 py-2 text-sm">
                            Direct Access
                        </Accordion.Trigger>
                        <Accordion.Content class="text-foreground-tertiary pt-2 pb-0 text-sm">
                            <p class="mb-2">
                                {$subdomainMode
                                    ? 'Access models directly by subdomain using the following.'
                                    : 'Access models directly by URL query using the following.'}
                            </p>
                            {#if $subdomainMode}
                                <ul class="list-inside list-disc space-y-1">
                                    <li>Gun name: <code class="bg-background-tertiary rounded px-1">pa15.{apexHost}</code></li>
                                    <li>
                                        Costume code: <code class="bg-background-tertiary rounded px-1">pa155802.{apexHost}</code>
                                    </li>
                                    <li>
                                        With variant: <code class="bg-background-tertiary rounded px-1">pa15.{apexHost}/?variant=damaged</code>
                                    </li>
                                    <li>
                                        Hide UI on load: append <code class="bg-background-tertiary rounded px-1">?ui=0</code> (hover near the top right corner to reveal controls)
                                    </li>
                                </ul>
                            {:else}
                                <ul class="list-inside list-disc space-y-1">
                                    <li>Gun name: <code class="bg-background-tertiary rounded px-1">{baseHost}/?model=pa-15</code></li>
                                    <li>
                                        Costume code: <code class="bg-background-tertiary rounded px-1">{baseHost}/?model=pa15_5802</code>
                                    </li>
                                    <li>
                                        With variant: <code class="bg-background-tertiary rounded px-1">{baseHost}/?model=pa-15&variant=damaged</code>
                                    </li>
                                    <li>
                                        Hide UI on load: append <code class="bg-background-tertiary rounded px-1">&ui=0</code> (hover near the top right corner to reveal controls)
                                    </li>
                                </ul>
                            {/if}
                            <p class="mt-3 mb-1 font-medium text-foreground-secondary">Embedding</p>
                            <label class="mb-2 flex items-center gap-2">
                                <input type="checkbox" bind:checked={embedPanels} class="accent-accent" />
                                Include control panel
                            </label>
                            <p class="mb-2">
                                {#if embedPanels}
                                    The full viewer, with the model list and control panels. Snippet below reflects the
                                    currently selected model:
                                {:else}
                                    Serves the model on its own with only focus tracking, interactive motions and voicelines. Snippet below reflects the currently selected model:
                                {/if}
                            </p>
                            <div class="bg-background-tertiary relative rounded p-2">
                                <button
                                    type="button"
                                    onclick={copyEmbed}
                                    aria-label="Copy embed snippet"
                                    title="Copy embed snippet"
                                    class="text-foreground-tertiary hover:text-foreground hover:bg-background-secondary absolute top-1 right-1 rounded p-1 transition-colors"
                                >
                                    {#if copied}
                                        <Check class="h-3.5 w-3.5" />
                                    {:else}
                                        <Copy class="h-3.5 w-3.5" />
                                    {/if}
                                </button>
                                <pre class="pr-8 text-xs break-words whitespace-pre-wrap"><code>{embedSnippet}</code></pre>
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                    </Accordion.Root>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    </div>
</div>
