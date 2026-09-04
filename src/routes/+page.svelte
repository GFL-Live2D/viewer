<script lang="ts">
    import type { PageData } from './$types';
    import GunPage from '$lib/components/GunPage.svelte';
    import GunViewer from '$lib/components/GunViewer.svelte';
    import DataError from '$lib/components/DataError.svelte';

    let { data } = $props<{ data: PageData }>();
</script>

{#if data.assetsMissing}
    <DataError />
{:else if data.only}
    <GunViewer
        model={data.model}
        variant={data.variant}
        motionData={data.motionData}
        voiceData={data.voiceData}
        assetBaseUrl={data.assetBaseUrl}
        transparent={data.transparent}
    />
{:else}
    <GunPage
        models={data.models}
        aliases={data.aliases}
        motionData={data.motionData}
        voiceData={data.voiceData}
        modelSearchTerms={data.modelSearchTerms}
        variantsByModel={data.variantsByModel}
        assetBaseUrl={data.assetBaseUrl}
        hideUIOnLoad={data.hideUIOnLoad}
        subdomainMode={data.subdomainMode}
        subdomain={data.subdomain}
        subdomainModel={data.subdomainModel}
    />
{/if}
