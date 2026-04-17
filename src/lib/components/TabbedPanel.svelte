<script lang="ts">
    import { Info, Zap, SlidersHorizontal, Eye } from '@lucide/svelte';
    import * as Tabs from '$lib/components/ui/tabs';

    let {
        activeTab = $bindable('info'),
        children,
    } = $props<{
        activeTab?: 'info' | 'motions' | 'params' | 'parts';
        children?: any;
    }>();

    const tabs = [
        { id: 'info' as const, label: 'Models', icon: Info },
        { id: 'motions' as const, label: 'Motions', icon: Zap },
        { id: 'params' as const, label: 'Parameters', icon: SlidersHorizontal },
        { id: 'parts' as const, label: 'Parts', icon: Eye },
    ];
</script>

<div class="bg-background-secondary/95 flex h-full w-full flex-col overflow-hidden">
    <Tabs.Root bind:value={activeTab} class="flex h-full flex-col gap-0">
        <!-- Tab Bar -->
        <Tabs.List class="border-border bg-background-secondary flex h-auto w-full rounded-none p-0 md:border-b">
            {#each tabs as tab}
                <Tabs.Trigger
                    value={tab.id}
                    class="hover:bg-background-tertiary/50 data-[state=active]:border-accent data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=inactive]:bg-background-secondary data-[state=inactive]:text-foreground-secondary flex flex-1 items-center justify-center gap-1.5 rounded-none border-b-2 border-transparent px-2 py-2.5 transition-all duration-200"
                >
                    <tab.icon class="h-4 w-4" />
                    <span class="text-xs font-medium">{tab.label}</span>
                </Tabs.Trigger>
            {/each}
        </Tabs.List>

        <!-- Tab Content -->
        <div class="flex-1 overflow-hidden">
            {@render children?.()}
        </div>
    </Tabs.Root>
</div>
