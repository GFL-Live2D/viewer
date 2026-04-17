<script lang="ts">
    let {
        showProgressBar = false,
        motionProgress = 0,
        caption = null,
    } = $props<{
        showProgressBar: boolean;
        motionProgress: number;
        caption: string | null;
    }>();
</script>

{#if showProgressBar}
    <div class="mb-4">
        <div class="mb-2 flex items-center justify-between">
            <div class="text-foreground-tertiary text-xs font-medium">Animation Progress</div>
            <span class="text-foreground-tertiary text-xs">{Math.round(motionProgress * 100)}%</span>
        </div>
        <div class="bg-background-tertiary h-2 w-full overflow-hidden rounded-full">
            <div
                class="bg-accent h-full transition-all duration-75"
                style="width: {(motionProgress || 0) * 100}%"
            ></div>
        </div>
    </div>
{/if}

{#if caption}
    <div class="border-border bg-background-tertiary/50 mb-4 rounded-lg border px-4 py-3">
        <p class="text-foreground-secondary text-sm leading-relaxed">
            {#each caption.split('<>') as line, i (i)}
                {line}{#if i < caption.split('<>').length - 1}<br />{/if}
            {/each}
        </p>
    </div>
{/if}
