<script lang="ts">
    let {
        isBgMoveMode = $bindable(false),
        zoom = $bindable(0),
        hasImage = $bindable(false),
        backgroundImage = $bindable(''),
        bgX = $bindable(0),
        bgY = $bindable(0),
        bgScale = $bindable(1),
    } = $props<{
        isBgMoveMode: boolean;
        zoom?: number;
        hasImage?: boolean;
        backgroundImage?: string;
        bgX?: number;
        bgY?: number;
        bgScale?: number;
    }>();

    // Internal state for base scale
    let bgBaseScale = $state(1);
    let isDraggingBg = $state(false);

    // Sync derived bgScale
    $effect(() => {
        bgScale = bgBaseScale * Math.pow(1.1, zoom);
    });

    // Effect to update hasImage prop
    $effect(() => {
        hasImage = !!backgroundImage;
    });

    export function reset() {
        bgX = 0;
        bgY = 0;
        zoom = 0;
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    }

    export function loadAndSetBackgroundImage(blob: Blob) {
        if (!blob.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            if (typeof evt.target?.result === 'string') {
                const img = new Image();
                img.onload = () => {
                    backgroundImage = evt.target!.result as string;

                    const screenW = window.innerWidth;
                    const screenH = window.innerHeight;
                    const scaleW = screenW / img.width;
                    const scaleH = screenH / img.height;

                    bgBaseScale = Math.min(scaleW, scaleH);
                    zoom = 0;
                    bgX = 0;
                    bgY = 0;
                };
                img.src = evt.target.result as string;
            }
        };
        reader.readAsDataURL(blob);
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer?.files?.length) {
            const file = e.dataTransfer.files[0];
            loadAndSetBackgroundImage(file);
        }
    }

    async function handleWindowPaste(e: ClipboardEvent) {
        if (!e.clipboardData) return;

        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const blob = items[i].getAsFile();
                if (blob) {
                    loadAndSetBackgroundImage(blob);
                    return;
                }
            }
        }

        const text = e.clipboardData.getData('text');
        if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
            if (/\.(jpg|jpeg|png|webp|gif)$/i.test(text)) {
                try {
                    const resp = await fetch(text);
                    const blob = await resp.blob();
                    if (blob.type.startsWith('image/')) {
                        loadAndSetBackgroundImage(blob);
                    }
                } catch (err) {
                    // Silently fail
                }
            }
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (!backgroundImage) return;
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        switch (e.key) {
            case '0':
                reset();
                break;
        }
    }

    function handleWindowMouseDown(e: MouseEvent) {
        if (!backgroundImage) return;

        if (e.button === 2 || (e.button === 0 && isBgMoveMode)) {
            isDraggingBg = true;
        }
    }

    function handleWindowMouseMove(e: MouseEvent) {
        if (isDraggingBg) {
            bgX += e.movementX;
            bgY += e.movementY;
        }
    }

    function handleWindowMouseUp() {
        if (isDraggingBg) {
            isDraggingBg = false;
        }
    }

    // Touch support for drag
    $effect(() => {
        const opts = { passive: false };
        window.addEventListener('touchstart', handleWindowTouchStart, opts);
        window.addEventListener('touchmove', handleWindowTouchMove, opts);
        window.addEventListener('touchend', handleWindowTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleWindowTouchStart, opts as any);
            window.removeEventListener('touchmove', handleWindowTouchMove, opts as any);
            window.removeEventListener('touchend', handleWindowTouchEnd);
        };
    });

    let touchStartX = 0;
    let touchStartY = 0;

    function handleWindowTouchStart(e: TouchEvent) {
        if (!backgroundImage) return;

        // Check if target is interactive (button, input, link, etc.)
        const target = e.target as HTMLElement;
        if (target.closest('button, a, input, textarea, [role="button"], .interactive')) {
            return;
        }

        // Two finger touch or move mode
        if (e.touches.length === 2 || (e.touches.length === 1 && isBgMoveMode)) {
            // e.preventDefault(); // Don't block all touch immediately
        }

        if (isBgMoveMode && e.touches.length === 1) {
            if (e.cancelable) e.preventDefault();
            isDraggingBg = true;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }

    function handleWindowTouchMove(e: TouchEvent) {
        if (isDraggingBg && e.touches.length > 0) {
            if (e.cancelable) e.preventDefault();
            const clientX = e.touches[0].clientX;
            const clientY = e.touches[0].clientY;

            const dx = clientX - touchStartX;
            const dy = clientY - touchStartY;

            bgX += dx;
            bgY += dy;

            touchStartX = clientX;
            touchStartY = clientY;
        }
    }

    function handleWindowTouchEnd() {
        if (isDraggingBg) {
            isDraggingBg = false;
        }
    }

    function handleContextMenu(e: MouseEvent) {
        if (isDraggingBg || isBgMoveMode) {
            e.preventDefault();
        }
    }

    function handleWindowWheel(e: WheelEvent) {
        if (!backgroundImage) return;

        if (isBgMoveMode) {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.5 : -0.5;
            zoom = Math.max(-20, Math.min(20, zoom + delta));
        }
    }
</script>

<svelte:window
    ondragover={handleDragOver}
    ondrop={handleDrop}
    onkeydown={handleKeydown}
    onmousedown={handleWindowMouseDown}
    onmousemove={handleWindowMouseMove}
    onmouseup={handleWindowMouseUp}
    oncontextmenu={handleContextMenu}
    onwheel={handleWindowWheel}
    onpaste={handleWindowPaste}
/>
