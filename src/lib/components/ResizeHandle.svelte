<script lang="ts">
    import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
    let { onDragStart, onDrag, onDragEnd, onDoubleClick } = $props<{
        onDragStart?: (e: PointerEvent) => void;
        onDrag?: (e: PointerEvent) => void;
        onDragEnd?: (e: PointerEvent) => void;
        onDoubleClick?: () => void;
    }>();

    let isDragging = $state(false);

    function handlePointerDown(e: PointerEvent) {
        isDragging = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        onDragStart?.(e);

        const handlePointerMove = (e: PointerEvent) => {
            if (!isDragging) return;
            onDrag?.(e);
        };

        const handlePointerUp = (e: PointerEvent) => {
            isDragging = false;
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            onDragEnd?.(e);
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    }

    function handleDoubleClick() {
        onDoubleClick?.();
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
    class="before:bg-background-secondary/95 hover:before:bg-background-secondary relative flex h-6 cursor-ns-resize items-center justify-center select-none before:absolute before:inset-x-0 before:bottom-0 before:h-1/2 before:transition-colors"
    class:before:bg-accent={isDragging}
    onpointerdown={handlePointerDown}
    ondblclick={handleDoubleClick}
    role="separator"
    aria-valuenow={50}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="Resize panel"
    tabindex="0"
>
    <div class="border-accent bg-background-secondary relative z-10 flex h-5 w-12 items-center justify-center rounded-full border">
        <EllipsisVertical class="text-accent size-5 rotate-90" />
    </div>
</div>

<style>
    div[role='separator'] {
        touch-action: none;
    }
</style>
