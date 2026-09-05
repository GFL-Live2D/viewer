<script lang="ts">
    import GunViewer from '$lib/components/GunViewer.svelte';
    import DataError from '$lib/components/DataError.svelte';

    let { data } = $props();
</script>

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
