<script lang="ts">
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
    import { cn, type WithoutChild } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        level = 3,
        children,
        ...restProps
    }: WithoutChild<AccordionPrimitive.TriggerProps> & {
        level?: AccordionPrimitive.HeaderProps['level'];
    } = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
    <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        bind:ref
        class={cn(
            'focus-visible:outline-accent flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:outline-2 focus-visible:-outline-offset-1 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
            className,
        )}
        {...restProps}
    >
        {@render children?.()}
        <ChevronDownIcon
            class="text-foreground-secondary pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
        />
    </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
