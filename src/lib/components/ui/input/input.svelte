<script lang="ts">
    import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
    import { cn, type WithElementRef } from '$lib/utils.js';

    type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

    type Props = WithElementRef<
        Omit<HTMLInputAttributes, 'type'> &
            ({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
    >;

    let {
        ref = $bindable(null),
        value = $bindable(),
        type,
        files = $bindable(),
        class: className,
        'data-slot': dataSlot = 'input',
        ...restProps
    }: Props = $props();
</script>

{#if type === 'file'}
    <input
        bind:this={ref}
        data-slot={dataSlot}
        class={cn(
            'selection:bg-accent selection:text-foreground border-border placeholder:text-foreground-tertiary flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50',
            'focus-visible:border-accent focus-visible:ring-accent/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            className,
        )}
        type="file"
        bind:files
        bind:value
        {...restProps}
    />
{:else}
    <input
        bind:this={ref}
        data-slot={dataSlot}
        class={cn(
            'border-border bg-background selection:bg-accent selection:text-foreground placeholder:text-foreground-tertiary flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-accent focus-visible:ring-accent/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            className,
        )}
        {type}
        bind:value
        {...restProps}
    />
{/if}
