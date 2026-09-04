<script lang="ts">
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import { slide } from 'svelte/transition';
    import { cn, type WithoutChild } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...restProps
    }: WithoutChild<AccordionPrimitive.ContentProps> = $props();

    let sliding = $state(false);
</script>

<!-- forceMount so the height comes from the transition, not a CSS variable the server renders as 0px -->
<AccordionPrimitive.Content bind:ref data-slot="accordion-content" forceMount {...restProps}>
    {#snippet child({ props, open })}
        {#if open}
            <!-- Clipping is only needed while sliding; leaving it on would crop the focus ring of
                 controls sitting against the bottom edge -->
            <div
                {...props}
                class="text-sm {sliding ? 'overflow-hidden' : ''}"
                transition:slide={{ duration: 200 }}
                onintrostart={() => (sliding = true)}
                onintroend={() => (sliding = false)}
                onoutrostart={() => (sliding = true)}
            >
                <div class={cn('pt-0 pb-4', className)}>
                    {@render children?.()}
                </div>
            </div>
        {/if}
    {/snippet}
</AccordionPrimitive.Content>
