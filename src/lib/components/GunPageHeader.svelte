<script lang="ts">
    import * as Accordion from '$lib/components/ui/accordion';
    import { selectedCharacterEntry, selectedVariant } from '$lib/stores/gun-page';
    import { Check, Copy, ImageDown, MousePointerClick } from '@lucide/svelte';

    let { baseHost } = $props<{
        baseHost: string;
    }>();

    let copied = $state(false);
    let copyTimeout: ReturnType<typeof setTimeout> | undefined;

    let embedUrl = $derived.by(() => {
        const model = $selectedCharacterEntry?.code.toLowerCase() ?? 'pa-15';
        const params = new URLSearchParams({ model });
        const v = ($selectedVariant ?? '').toLowerCase();
        const displayVariant = v === 'destroy' ? 'damaged' : v;
        if (displayVariant && displayVariant !== 'normal') {
            params.set('variant', displayVariant);
        }
        params.set('ui', '0');
        return `https://${baseHost}/?${params.toString()}`;
    });

    let embedSnippet = $derived(
        `<iframe src="${embedUrl}"\n        width="100%" height="600" frameborder="0"></iframe>`,
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
        <h1 class="text-foreground text-xl font-bold tracking-tight">GFL Live2D Model Browser</h1>
        <p class="text-foreground-secondary text-xs">(ver. beta)</p>
        <p class="text-foreground-secondary mt-2 flex items-center gap-2 text-sm">
            <MousePointerClick class="h-4 w-4 shrink-0" /> Middle click to move, scroll to zoom. Touch or hold left click
            for tracking focus.
        </p>
        <p class="text-foreground-secondary flex items-center gap-2 text-sm">
            <ImageDown class="h-4 w-4 shrink-0" /> Drop in or paste any image to set as background.<br />Drag right
            click to move background.
        </p>
        <Accordion.Root class="hidden w-full 2xl:block" type="multiple">
            <Accordion.Item value="shortcuts" class="border-b-0">
                <Accordion.Trigger class="text-foreground-tertiary hover:text-foreground pb-0 text-sm">
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
        <Accordion.Root class="w-full" type="multiple">
            <Accordion.Item value="access">
                <Accordion.Trigger class="text-foreground-tertiary hover:text-foreground pt-4 pb-0 text-sm">
                    Direct Access
                </Accordion.Trigger>
                <Accordion.Content class="text-foreground-tertiary pt-2 pb-0 text-sm">
                    <p class="mb-2">
                        Access models directly by URL query using the following.
                    </p>
                    <ul class="list-inside list-disc space-y-1">
                        <li>Gun name: <code class="bg-background-tertiary rounded px-1">{baseHost}/?model=pa-15</code></li>
                        <li>
                            Costume code: <code class="bg-background-tertiary rounded px-1">{baseHost}/?model=pa15_5802</code>
                        </li>
                        <li>
                            With variant: <code class="bg-background-tertiary rounded px-1">{baseHost}/?model=pa-15&variant=damaged</code>
                        </li>
                        <li>
                            Hide UI on load: append <code class="bg-background-tertiary rounded px-1">&ui=0</code> (hover near the bottom of the window to reveal controls)
                        </li>
                    </ul>
                    <p class="mt-3 mb-1 font-medium text-foreground-secondary">Embedding</p>
                    <p class="mb-2">
                        The viewer is iframe-friendly. Snippet below reflects the currently selected model:
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
                        <pre class="overflow-x-auto pr-8 text-xs"><code>{embedSnippet}</code></pre>
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    </div>
</div>
