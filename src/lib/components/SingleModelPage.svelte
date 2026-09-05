<script lang="ts">
    import GunViewer from '$lib/components/GunViewer.svelte';
    import DataError from '$lib/components/DataError.svelte';
    import { loadSingleModelData } from '$lib/model-data/gun';

    let { data } = $props();

    let loaded = $state<{ id: string; motionData: any; voiceData: any; assetBaseUrl: string } | null>(
        null,
    );
    let loadFailed = $state(false);

    $effect(() => {
        const model = data.model;
        if (!model) return;

        let stale = false;
        loadSingleModelData(model)
            .then((result) => {
                if (stale) return;
                if (result.assetsMissing) {
                    loadFailed = true;
                    return;
                }
                loaded = {
                    id: model.id,
                    motionData: result.motionData,
                    voiceData: result.voiceData,
                    assetBaseUrl: result.assetBaseUrl,
                };
            })
            .catch(() => {
                if (!stale) loadFailed = true;
            });

        return () => {
            stale = true;
        };
    });

    const ready = $derived(loaded?.id === data.model?.id ? loaded : null);

    const name = $derived(data.model?.gunName || data.model?.code || '');
    const costume = $derived(data.model?.costumeName);
    const label = $derived(costume && costume !== name ? `${name} (${costume})` : name);
    const damaged = $derived(data.variant?.toLowerCase() === 'destroy');
    const title = $derived(
        `${label}${damaged ? ' Damaged' : ''} Live2D Model | GFL Live2D Viewer`,
    );
    const description = $derived(
        `Browser-based Live2D viewer for ${label} from Girls' Frontline. Play motions and voice lines, with focus tracking, zoom, and pan.`,
    );
</script>

<svelte:head>
    {#if !loadFailed}
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

{#if loadFailed}
    <DataError />
{:else if ready}
    <GunViewer
        model={data.model}
        variant={data.variant}
        motionData={ready.motionData}
        voiceData={ready.voiceData}
        assetBaseUrl={ready.assetBaseUrl}
        transparent
    />
{/if}
