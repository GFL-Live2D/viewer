<script lang="ts">
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
    class="bg-background-secondary/95 hover:bg-background-secondary flex h-3 cursor-ns-resize items-center justify-center transition-colors select-none"
    class:bg-accent={isDragging}
    onpointerdown={handlePointerDown}
    ondblclick={handleDoubleClick}
    role="separator"
    aria-valuenow={50}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="Resize panel"
    tabindex="0"
>
    <!-- Visual grip indicator -->
    <div class="bg-accent h-1 w-12 rounded-full"></div>
</div>

<style>
    div[role='separator'] {
        touch-action: none;
    }
</style>
