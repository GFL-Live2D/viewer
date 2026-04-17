<script lang="ts">
    import { Move, Eye, Plus, Minus } from '@lucide/svelte';
    import MorphingChevron from '$lib/components/MorphingChevron.svelte';
    import SpeedDrawButton from '$lib/components/SpeedDrawButton.svelte';
    import SpeedDrawIconButton from '$lib/components/SpeedDrawIconButton.svelte';
    import { ZOOM_MIN, ZOOM_MAX } from '$lib/live2d/Live2DController.svelte';
    import { controller, uiState } from '$lib/stores/gun-page';

    let {
        hideChevronOnTablet = false,
        hideMobileChevron = false,
        isBgMoveMode = $bindable(false),
    } = $props<{
        hideChevronOnTablet?: boolean;
        hideMobileChevron?: boolean;
        isBgMoveMode?: boolean;
    }>();

    const step = 2;

    function togglePanel() {
        uiState.update((s) => ({ ...s, isLeftPanelOpen: !s.isLeftPanelOpen }));
    }

    function toggleMoveMode() {
        $controller?.setMoveMode(!$controller.state.isMoveMode);
        if ($controller?.state.isMoveMode) {
            isBgMoveMode = false;
        }
    }

    function toggleAlwaysFocus() {
        const current = $controller?.state.isAlwaysFocus ?? false;
        $controller?.setAlwaysFocus(!current);
    }

    function adjustZoom(delta: number) {
        const current = $controller?.state.scaleMultiplier ?? 0;
        // No clamping - buttons can zoom beyond slider limits
        const newZoom = current + delta;
        $controller?.setZoom(newZoom);
    }
</script>

<!-- Collapse/Expand (conditionally hidden based on props) -->
<button
    onclick={togglePanel}
    class="border-border bg-background-secondary/95 text-foreground-tertiary hover:border-accent hover:bg-accent/10 hover:text-foreground flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition {hideMobileChevron
        ? 'hidden'
        : hideChevronOnTablet
          ? 'md:hidden 2xl:flex'
          : ''}"
    title={$uiState.isLeftPanelOpen ? 'Collapse list' : 'Expand list'}
    aria-label={$uiState.isLeftPanelOpen ? 'Collapse model list panel' : 'Expand model list panel'}
    aria-pressed={$uiState.isLeftPanelOpen}
>
    <MorphingChevron class="h-5 w-5" pointsRight={!$uiState.isLeftPanelOpen} />
</button>

<!-- Move Mode -->
<SpeedDrawButton
    onclick={toggleMoveMode}
    title="Toggle Drag/Move Mode (Keyboard: M)"
    ariaLabel="Toggle canvas move mode"
    ariaPressed={$controller?.state.isMoveMode}
    isActive={$controller?.state.isMoveMode ?? false}
>
    <Move class="h-5 w-5" />
</SpeedDrawButton>

<!-- Always Focus -->
<SpeedDrawButton
    onclick={toggleAlwaysFocus}
    title="Toggle Always-On Focus Tracking (Keyboard: F)"
    ariaLabel="Toggle always-on focus tracking"
    ariaPressed={$controller?.state.isAlwaysFocus}
    isActive={$controller?.state.isAlwaysFocus ?? false}
    class="hidden md:flex"
>
    <Eye class="h-5 w-5" />
</SpeedDrawButton>

<!-- Zoom Slider -->
<div
    class="border-border bg-background-secondary/95 flex h-full w-10 flex-col items-center justify-center gap-1 rounded-lg border py-3 shadow-lg"
>
    <SpeedDrawIconButton
        onclick={() => adjustZoom(step)}
        title="Increase model zoom (Keyboard: +)"
        ariaLabel="Zoom in"
        class="mb-2"
    >
        <Plus class="text-foreground-tertiary h-4 w-4" />
    </SpeedDrawIconButton>
    <input
        type="range"
        min={ZOOM_MIN}
        max={ZOOM_MAX}
        {step}
        value={$controller?.state.scaleMultiplier ?? 0}
        oninput={(e) => $controller?.setZoom(parseFloat(e.currentTarget.value))}
        class="zoom-slider bg-background-tertiary accent-accent h-40 w-1 cursor-pointer appearance-none rounded-lg"
        style="writing-mode: vertical-lr; direction: rtl;"
        title="Model zoom level"
        aria-label="Model zoom slider"
    />
    <SpeedDrawIconButton
        onclick={() => adjustZoom(-step)}
        title="Decrease model zoom (Keyboard: -)"
        ariaLabel="Zoom out"
        class="mt-2"
    >
        <Minus class="text-foreground-tertiary h-4 w-4" />
    </SpeedDrawIconButton>
</div>
