<script lang="ts">
    import { SlidersHorizontal } from '@lucide/svelte';

    let { modelName, modelCode, costumeName, variant, onToggleParameters } = $props<{
        modelName: string;
        modelCode?: string;
        costumeName?: string;
        variant: string;
        onToggleParameters: () => void;
    }>();
</script>

<div class="flex items-center justify-between gap-3 border-b border-neutral-700 p-6">
    <div>
        <h2 class="text-2xl font-bold text-neutral-100 capitalize">
            {modelName || 'Select Model'}
        </h2>
        {#if modelCode}
            <p class="mt-1 font-mono text-xs text-neutral-500">{modelCode}</p>
        {/if}
        {#if costumeName}
            <p class="mt-1 text-xs text-neutral-500">{costumeName}</p>
        {/if}
        <p class="mt-1 text-neutral-400 capitalize">Variant: {variant || 'None'}</p>
    </div>
    <button
        onclick={onToggleParameters}
        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-400 transition hover:bg-neutral-700 hover:text-neutral-100"
        title="Toggle parameters and parts panel"
    >
        <SlidersHorizontal class="h-5 w-5" />
    </button>
</div>
