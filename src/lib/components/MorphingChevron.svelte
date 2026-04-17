<script lang="ts">
    import { Spring } from 'svelte/motion';
    import { untrack } from 'svelte';

    interface Props {
        class?: string;
        pointsRight?: boolean;
    }

    let { class: className, pointsRight = false }: Props = $props();

    // Spring animation for chevron pointing
    // Left (<): [15, 9, 15]
    // Right (>): [9, 15, 9]
    // untrack() to avoid warning about reading signal in constructor
    const chevronCoords = new Spring(
        untrack(() => (pointsRight ? [9, 15, 9] : [15, 9, 15])),
        {
            stiffness: 0.1,
            damping: 0.5,
        },
    );

    $effect(() => {
        chevronCoords.target = pointsRight ? [9, 15, 9] : [15, 9, 15];
    });
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={className}
>
    <polyline points="{chevronCoords.current[0]} 18 {chevronCoords.current[1]} 12 {chevronCoords.current[2]} 6" />
</svg>
