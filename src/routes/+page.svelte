<script lang="ts">
    import { building } from '$app/environment';
    import { page } from '$app/state';
    import type { PageData } from './$types';
    import GunPage from '$lib/components/GunPage.svelte';
    import OnlyModel from '$lib/components/OnlyModel.svelte';
    import DataError from '$lib/components/DataError.svelte';
    import { modelSubdomain } from '$lib/subdomain';
    import { resolveModel } from '$lib/modelResolve';

    let { data } = $props<{ data: PageData }>();

    // Prerendering forbids reading the query, so the built shell renders as the dashboard
    const params = $derived(building ? new URLSearchParams() : page.url.searchParams);
    const subdomain = $derived(building ? '' : modelSubdomain(page.url.host));
    const onlyQuery = $derived(params.get('only'));

    const subdomainModel = $derived(
        subdomain && !params.get('model')
            ? resolveModel(data.models ?? [], subdomain, data.aliases)
            : null,
    );
</script>

{#if data.assetsMissing}
    <DataError />
{:else if onlyQuery !== null}
    <OnlyModel
        models={data.models}
        aliases={data.aliases}
        assetBaseUrl={data.assetBaseUrl}
        target={onlyQuery || subdomain}
        {params}
    />
{:else}
    <GunPage
        models={data.models}
        aliases={data.aliases}
        modelSearchTerms={data.modelSearchTerms}
        variantsByModel={data.variantsByModel}
        assetBaseUrl={data.assetBaseUrl}
        hideUIOnLoad={params.get('ui') === '0'}
        subdomainMode={data.subdomainMode}
        {subdomain}
        {subdomainModel}
    />
{/if}
