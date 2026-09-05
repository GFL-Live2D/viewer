<script lang="ts">
    import type { PageData } from './$types';
    import SingleModelPage from '$lib/components/SingleModelPage.svelte';

    let { data } = $props<{ data: PageData }>();
</script>

<SingleModelPage {data} />
