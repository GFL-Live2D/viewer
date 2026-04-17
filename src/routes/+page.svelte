<script lang="ts">
    import type { PageData } from './$types';
    import GunPage from '$lib/components/GunPage.svelte';

    let { data } = $props<{ data: PageData }>();
</script>

<GunPage
    models={data.models}
    aliases={data.aliases}
    motionData={data.motionData}
    voiceData={data.voiceData}
    modelSearchTerms={data.modelSearchTerms}
    variantsByModel={data.variantsByModel}
    assetBaseUrl={data.assetBaseUrl}
    hideUIOnLoad={data.hideUIOnLoad}
/>
