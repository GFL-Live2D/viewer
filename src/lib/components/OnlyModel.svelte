<script lang="ts">
    import GunViewer from '$lib/components/GunViewer.svelte';
    import ErrorOverlay from '$lib/components/ErrorOverlay.svelte';
    import { loadSingleModelData } from '$lib/model-data/gun';
    import { resolveModel } from '$lib/modelResolve';
    import { resolveVariant } from '$lib/model-data/variantPick';
    import { flagEnabled, requestedVariant } from '$lib/variantQuery';
    import type { Live2DModelIndex } from '$lib/model-data/live2d';

    let { models, aliases, assetBaseUrl, target, params } = $props<{
        models: Live2DModelIndex[];
        aliases: Record<string, string>;
        assetBaseUrl: string;
        target: string;
        params: URLSearchParams;
    }>();

    // Embeds name one model, so a miss is an error rather than a substitution
    const model = $derived(target ? resolveModel(models, target, aliases) : null);
    const transparent = $derived(flagEnabled(params, 'transparent'));

    const resolveError = $derived(
        !target
            ? '?only needs a model, or a subdomain to take one from'
            : !model
              ? `No model matches "${target}"`
              : '',
    );

    let loaded = $state<{ id: string; variants: string[]; motionData: any; voiceData: any } | null>(
        null,
    );
    let loadError = $state('');
    let attempt = $state(0);

    $effect(() => {
        const entry = model;
        attempt;
        if (!entry) return;

        let stale = false;
        loadSingleModelData(entry)
            .then((data) => {
                if (stale) return;
                if (data.assetsMissing) {
                    loadError = 'No Live2D assets are configured for this deployment.';
                    return;
                }
                loadError = '';
                loaded = {
                    id: entry.id,
                    variants: data.variants,
                    motionData: data.motionData,
                    voiceData: data.voiceData,
                };
            })
            .catch((err) => {
                if (!stale) loadError = `Could not load data for "${entry.code}". ${err.message}`;
            });

        return () => {
            stale = true;
        };
    });

    const ready = $derived(loaded?.id === model?.id ? loaded : null);
    const variant = $derived(
        ready ? resolveVariant(ready.variants, requestedVariant(params)) : 'normal',
    );

    const name = $derived(model?.gunName || model?.code || '');
    const costume = $derived(model?.costumeName);
    const label = $derived(costume && costume !== name ? `${name} (${costume})` : name);
    const title = $derived(label ? `${label} Live2D Model | GFL Live2D Viewer` : 'GFL Live2D Viewer');
    const description = $derived(
        `Browser-based Live2D viewer for ${label} from Girls' Frontline. Play motions and voice lines, with focus tracking, zoom, and pan.`,
    );
</script>

<svelte:head>
    {#if !model}
        <title>Model Not Found | GFL Live2D Viewer</title>
        <meta name="robots" content="noindex" />
    {:else}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
    {/if}
</svelte:head>

{#if resolveError}
    <ErrorOverlay message={resolveError} />
{:else if loadError}
    <ErrorOverlay message={loadError} onRetry={() => (attempt += 1)} />
{:else if ready && model}
    <GunViewer
        {model}
        {variant}
        motionData={ready.motionData}
        voiceData={ready.voiceData}
        {assetBaseUrl}
        {transparent}
    />
{/if}
