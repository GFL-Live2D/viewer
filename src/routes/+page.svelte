<script lang="ts">
    import type { PageData } from './$types';
    import GunPage from '$lib/components/GunPage.svelte';
    import DataError from '$lib/components/DataError.svelte';

    let { data } = $props<{ data: PageData }>();
</script>

{#if data.assetsMissing}
    <DataError />
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
