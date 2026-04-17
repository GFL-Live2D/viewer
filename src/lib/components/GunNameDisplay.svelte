<script lang="ts">
    let {
        name = '',
        iconSize = 'h-4 w-4',
        iconColor = 'currentColor',
    } = $props<{ name: string; iconSize?: string; iconColor?: string }>();

    let displayText = $derived.by(() => {
        return name.replace(' MOD3', '');
    });

    let hasMod3 = $derived(name.endsWith(' MOD3'));
</script>

<span class="inline-flex items-center gap-1">
    {displayText}
    {#if hasMod3}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-33.4462 -60.7808 66.82 60.81"
            class="inline-block {iconSize}"
            style="color: {iconColor};"
        >
            <path
                d="m0-20.9 3.9598 3.9598-3.9598 3.9598-3.9598-3.9598zm22.981-10.9602-4.879 4.879 5.5154 5.5154-11.5966 11.5966-6.0811-6.0811-4.9497 4.9497 11.0309 11.0309 21.3546-21.496zm-45.8205-.1414 4.9497 4.9497-5.5861 5.5861 11.5258 11.5258 6.0104-6.0104 4.9497 4.9497-11.0309 11.0309-21.4253-21.4253zm22.8395-28.7792-21.3546 21.3546 14.8492 14.8492 4.9497-4.9497-9.9702-9.9702 11.5258-11.5258 11.5258 11.5258-9.9702 9.9702 4.9497 4.9497 14.8492-14.8492z"
                fill="currentColor"
            />
        </svg>
    {/if}
</span>
