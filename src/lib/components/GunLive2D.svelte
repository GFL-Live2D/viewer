<script lang="ts">
    import { Live2DController, ModelLoadingState, ZOOM_MIN, ZOOM_MAX } from '$lib/live2d/Live2DController.svelte';
    import CanvasOverlay from '$lib/components/CanvasOverlay.svelte';
    import ErrorOverlay from '$lib/components/ErrorOverlay.svelte';

    // Props (runes mode)
    let {
        characterEntry,
        variant,
        motionData = undefined,
        voiceData = undefined,
        normalVoiceData = undefined,
        assetBaseUrl = '/assets',
        overlayInsets = { left: null, right: null, bottom: null },
        controller = $bindable<Live2DController | undefined>(),
        canvas = $bindable<HTMLCanvasElement | undefined>(),
        isBgMoveMode = false, // Received from parent
        isInitializing = false, // Initializing state during controller recreation
        displayOnly = false, // Embed mode: focus tracking and hitbox motions only
    } = $props();

    // Multi-touch drag tracking: cache active pointers to avoid resetting on second finger
    const activePointers = new Map<number, { x: number; y: number }>();

    // Reactive Load: Reload whenever characterEntry or variant changes
    // Guard against infinite loops by checking signature
    let lastLoadedSignature = '';

    let awaitingData = $derived(!!characterEntry && !!variant && !motionData);

    // Motion data arrives from its own fetch, so loading waits for it to land
    $effect(() => {
        if (controller && characterEntry && variant && motionData) {
            const signature = `${characterEntry.id}-${variant}`;
            if (signature !== lastLoadedSignature) {
                lastLoadedSignature = signature;
                load();
            }
        }
    });

    // Background manipulation owns pinch gestures while its move mode is active.
    $effect(() => {
        controller?.setPinchZoomEnabled(!isBgMoveMode && !displayOnly);
    });

    $effect(() => {
        if (controller && controller.state.loading === ModelLoadingState.READY) {
            controller.toggleHitboxDebug(controller.state.showHitboxDebug);
        }
    });

    $effect(() => {
        if (controller && controller.state.loading === ModelLoadingState.READY) {
            const alwaysFocus = controller.state.isAlwaysFocus ?? false;
            controller.setAlwaysFocus(alwaysFocus);
        }
    });

    async function load(shouldResetZoom: boolean = true) {
        if (!controller || !characterEntry) return;
        await controller.loadCharacter(
            characterEntry,
            variant,
            motionData,
            voiceData,
            shouldResetZoom,
            assetBaseUrl,
            normalVoiceData,
        );
    }

    function getMidpoint(pointers: Map<number, { x: number; y: number }>) {
        if (pointers.size === 0) return { x: 0, y: 0 };
        let x = 0,
            y = 0;
        pointers.forEach((p) => {
            x += p.x;
            y += p.y;
        });
        return { x: x / pointers.size, y: y / pointers.size };
    }

    function onMouseDown(e: PointerEvent) {
        if (!controller) return;

        // Middle Click: Always drag (force=true, always enabled)
        if (e.button === 1) {
            if (displayOnly) return;
            e.preventDefault();
            const wasEmpty = activePointers.size === 0;
            // Only track primary pointer for drag (secondary pointers reserved for gestures)
            if (e.isPrimary) {
                activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

                // Only call startDrag once when first pointer touches down
                if (wasEmpty) {
                    const midpoint = getMidpoint(activePointers);
                    controller.startDrag(midpoint.x, midpoint.y, true);
                }
            }
            (e.target as Element).setPointerCapture(e.pointerId);
            return;
        }

        // Left Click: Works in moveMode key (drag) or normal mode (look at cursor)
        if (e.button === 0) {
            // If background move mode is enabled, let the event bubble to parent
            if (isBgMoveMode) return;

            e.preventDefault();
            // Only track primary pointer for drag (secondary pointers reserved for gestures)
            if (e.isPrimary) {
                const wasEmpty = activePointers.size === 0;
                activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

                // Only call startDrag once when first pointer touches down
                if (wasEmpty) {
                    const midpoint = getMidpoint(activePointers);
                    // startDrag will automatically ignore the drag if not in moveMode (isDragging=false)
                    // but we still want to track the pointer for handleDrag -> processMove (look)
                    controller.startDrag(midpoint.x, midpoint.y, false);
                }
            }
            (e.target as Element).setPointerCapture(e.pointerId);
        }
    }

    function onMouseMove(e: PointerEvent) {
        if (!controller || activePointers.size === 0) return;

        // Only update drag if this is a tracked pointer (primary only)
        if (!activePointers.has(e.pointerId)) return;

        // Update cached position for primary pointer
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        // Drag uses primary pointer position only
        const pointer = activePointers.get(e.pointerId);
        if (pointer) {
            controller.handleDrag(pointer.x, pointer.y);
        }
    }

    function onMouseUp(e: PointerEvent) {
        if (!controller) return;

        // Only process if this was a tracked drag pointer
        if (!activePointers.has(e.pointerId)) return;

        // Remove this pointer from drag cache
        activePointers.delete(e.pointerId);

        // Only call endDrag when all pointers are released
        if (activePointers.size === 0) {
            controller.endDrag();
        }

        // Release pointer capture if held
        try {
            (e.target as Element).releasePointerCapture(e.pointerId);
        } catch (ex) {
            // Already released or not captured
        }
    }

    function onWheel(e: WheelEvent) {
        // Page scroll belongs to the embedding document when zoom is locked
        if (displayOnly) return;
        if (isBgMoveMode) return; // Allow event to bubble / be handled by window listener
        if (!controller) return;

        // Wheel input is already continuous, so apply it directly without spring lag.
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1 : -1;
        const newZoom = controller.getCurrentZoom() + delta;
        controller.setZoom(newZoom, { hard: true });
    }

    // Public Methods
    export const reload = (resetZoom: boolean = true) => load(resetZoom);
    export const getController = () => controller;
</script>

<canvas
    bind:this={canvas}
    class="fixed top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 touch-none"
    class:opacity-100={controller?.state.loading === ModelLoadingState.READY}
    class:opacity-0={controller?.state.loading !== ModelLoadingState.READY}
    class:transition-opacity={true}
    class:duration-300={true}
    onpointerdown={onMouseDown}
    onpointermove={onMouseMove}
    onpointerup={onMouseUp}
    onpointerleave={onMouseUp}
    onwheel={onWheel}
></canvas>

<!-- Loading Overlay -->
{#if controller?.state.loading === ModelLoadingState.LOADING || isInitializing || awaitingData}
    <CanvasOverlay
        leftInset={overlayInsets.left}
        rightInset={overlayInsets.right}
        bottomInset={overlayInsets.bottom}
    >
        <div class="text-center">
            <img src="/gfloading.gif" alt="" class="mx-auto mb-4 h-24 w-24" />
            <p class="text-foreground-secondary font-medium">{characterEntry?.code}</p>
            {#if isInitializing}
                <p class="text-foreground-tertiary mt-2 text-sm">Initializing model</p>
            {:else if controller.state.loadingStep}
                <p class="text-foreground-tertiary mt-2 text-sm">{controller.state.loadingStep}</p>
            {/if}
        </div>
    </CanvasOverlay>
{/if}

<!-- Error Overlay -->
{#if controller?.state.loading === ModelLoadingState.ERROR}
    <ErrorOverlay
        message={controller.state.error}
        onRetry={() => reload()}
        leftInset={overlayInsets.left}
        rightInset={overlayInsets.right}
        bottomInset={overlayInsets.bottom}
    />
{/if}
