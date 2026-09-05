<script lang="ts">
    import GunViewer from '$lib/components/GunViewer.svelte';
    import DataError from '$lib/components/DataError.svelte';

    let { data } = $props();

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
    {#if !data.assetsMissing}
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

{#if data.assetsMissing}
    <DataError />
{:else}
    <GunViewer
        model={data.model}
        variant={data.variant}
        motionData={data.motionData}
        voiceData={data.voiceData}
        assetBaseUrl={data.assetBaseUrl}
        transparent={data.transparent}
    />
{/if}
