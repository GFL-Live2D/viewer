<script lang="ts">
    import { Maximize2, Minimize2 } from '@lucide/svelte';
    import { onMount, onDestroy } from 'svelte';
    import { fly, fade } from 'svelte/transition';

    let {
        caption = null,
        showProgressBar = false,
        motionProgress = 0,
        onDetachedChange,
    } = $props<{
        caption: string | null;
        showProgressBar: boolean;
        motionProgress: number;
        onDetachedChange?: (isDetached: boolean) => void;
    }>();

    let isDetached = $state(false);
    let panelRef: HTMLDivElement | null = $state(null);
    let portalContainer: HTMLDivElement | null = null;

    // Position and size tracked for the panel
    // Default size and position (centered-ish)
    let pos = $state({ x: 0, y: 0 });
    let size = $state({ width: 400, height: 'auto' as number | 'auto' });

    // Dragging state
    let isDragging = $state(false);
    let dragOffset = { x: 0, y: 0 };

    onMount(async () => {
        // Create portal container at body level
        portalContainer = document.createElement('div');
        portalContainer.id = 'detachable-caption-portal';
        document.body.appendChild(portalContainer);

        window.addEventListener('pointerup', handleGlobalPointerUp);
        window.addEventListener('pointermove', handleGlobalPointerMove);
    });

    onDestroy(() => {
        if (isDetached) onDetachedChange?.(false);
        if (typeof window !== 'undefined') {
            window.removeEventListener('pointerup', handleGlobalPointerUp);
            window.removeEventListener('pointermove', handleGlobalPointerMove);
        }
        if (portalContainer && portalContainer.parentNode) {
            portalContainer.parentNode.removeChild(portalContainer);
        }
    });

    function handleGlobalPointerUp() {
        isDragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }

    function handleGlobalPointerMove(e: PointerEvent) {
        if (isDragging) {
            let newX = e.clientX - dragOffset.x;
            let newY = e.clientY - dragOffset.y;

            // Hard clamp to window bounds
            const maxX = window.innerWidth - (panelRef?.offsetWidth || 400);
            const maxY = window.innerHeight - (panelRef?.offsetHeight || 100);

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            pos.x = newX;
            pos.y = newY;
        }
    }

    function startDrag(e: PointerEvent) {
        // Safe check for panel ref
        if (!panelRef) return;

        const target = e.target as HTMLElement;
        if (target.closest('.no-drag')) return;

        // Check if we are clicking on the resize handle area (right edge or bottom right corner)
        // Native resize handles are usually around 15-20px, we use 30px to be safe and comfortable
        const rect = panelRef.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // If within 30px of right edge, ignore drag (let browser handle resize)
        if (offsetX > rect.width - 30) return;

        // Also check bottom edge for corner resizing
        if (offsetY > rect.height - 30) return;

        isDragging = true;
        // Calculate offset from top-left of the panel
        dragOffset.x = e.clientX - pos.x;
        dragOffset.y = e.clientY - pos.y;

        document.body.style.userSelect = 'none';

        // Capture pointer on the panel to ensure smooth dragging even if mouse leaves element
        panelRef.setPointerCapture(e.pointerId);
    }

    function detach() {
        // Set initial position to center-bottom of screen
        const startWidth = 400;
        const startX = (window.innerWidth - startWidth) / 2;
        const startY = window.innerHeight - 200; // 200px from bottom

        pos = { x: startX, y: startY };
        size = { width: startWidth, height: 'auto' };
        isDetached = true;
        onDetachedChange?.(true);
    }

    function attach() {
        isDetached = false;
        onDetachedChange?.(false);
    }

    // Portal action to move element to body
    function portal(node: HTMLElement) {
        if (portalContainer) {
            portalContainer.appendChild(node);
        }
        return {
            destroy() {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            },
        };
    }
</script>

<!-- Inline (attached) version -->
{#if !isDetached}
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
        <div
            class="border-border bg-background-tertiary/50 group relative mb-4 rounded-lg border px-4 py-3"
            transition:fade={{ duration: 150 }}
        >
            <button
                onclick={detach}
                class="hover:bg-background-secondary text-foreground-tertiary hover:text-foreground absolute top-2 right-2 rounded-md p-1.5 transition-all"
                title="Detach caption"
            >
                <Maximize2 class="h-3.5 w-3.5" />
            </button>
            <p class="text-foreground-secondary pr-6 text-sm leading-relaxed font-medium">
                {#each caption.split('<>') as line, i (i)}
                    {line}{#if i < caption.split('<>').length - 1}<br />{/if}
                {/each}
            </p>
        </div>
    {/if}
{:else}
    <!-- Placeholder when detached -->
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

    <!-- Attach button placeholder -->
    <div
        class="border-border bg-background-tertiary/20 mb-4 rounded-lg border border-dashed px-4 py-3"
        transition:fade={{ duration: 150 }}
    >
        <div class="flex items-center justify-between">
            <span class="text-foreground-tertiary text-xs font-medium italic">Detached</span>
            <button
                onclick={attach}
                class="hover:bg-background-secondary text-foreground-tertiary hover:text-foreground rounded-md p-1.5 transition-colors"
                title="Reattach caption"
            >
                <Minimize2 class="h-3.5 w-3.5" />
            </button>
        </div>
    </div>
{/if}

<!-- Floating detached panel (portaled to body) -->
{#if isDetached && caption}
    <div
        use:portal
        bind:this={panelRef}
        onpointerdown={startDrag}
        class="detachable-panel border-border/40 bg-background/80 fixed z-50 flex flex-col rounded-xl border pt-1 pr-8 pb-1 pl-1 shadow-2xl ring-1 ring-white/5 select-none"
        style="left: {pos.x}px; top: {pos.y}px; width: {size.width}px; resize: horizontal; overflow: hidden; min-width: 200px; max-width: 100vw;"
    >
        <!-- Content -->
        <div class="p-3">
            <p class="text-foreground-secondary cursor-default text-base leading-relaxed font-medium drop-shadow-sm">
                {#each caption.split('<>') as line, i (i)}
                    {line}{#if i < caption.split('<>').length - 1}<br />{/if}
                {/each}
            </p>
        </div>

        <!-- Floating Attach Button (Top Right) -->
        <button
            onclick={attach}
            class="hover:bg-background-tertiary text-foreground-tertiary hover:text-foreground no-drag absolute top-2 right-2 z-10 cursor-pointer rounded-md p-1.5 transition-colors"
            title="Reattach"
        >
            <Minimize2 class="h-4 w-4" />
        </button>
    </div>
{/if}

<style>
    /* Any additional specific styles if tailwind isn't enough */
    .detachable-panel {
        /* Hardware acceleration for smooth dragging */
        transform: translate3d(0, 0, 0);
        will-change: left, top, width;
    }
</style>
