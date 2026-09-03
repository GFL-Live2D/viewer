<script lang="ts">
    import { onDestroy, untrack } from 'svelte';
    import { browser } from '$app/environment';
    import { Info, ImageUp, ChevronDown } from '@lucide/svelte';

    import MorphingChevron from '$lib/components/MorphingChevron.svelte';
    import GunLive2D from '$lib/components/GunLive2D.svelte';
    import CanvasOverlay from '$lib/components/CanvasOverlay.svelte';
    import BackgroundManager from '$lib/components/BackgroundManager.svelte';
    import ViewportControls from '$lib/components/ViewportControls.svelte';
    import PanelControls from '$lib/components/PanelControls.svelte';
    import GunPageHeader from '$lib/components/GunPageHeader.svelte';
    import ModelFilters from '$lib/components/ModelFilters.svelte';
    import ModelList from '$lib/components/ModelList.svelte';
    import ModelInfoPanel from '$lib/components/ModelInfoPanel.svelte';
    import MotionControlsPanel from '$lib/components/MotionControlsPanel.svelte';
    import ParametersPanel from '$lib/components/ParametersPanel.svelte';
    import PartsPanel from '$lib/components/PartsPanel.svelte';
    import RevealButton from '$lib/components/RevealButton.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import TabbedPanel from '$lib/components/TabbedPanel.svelte';
    import ResizeHandle from '$lib/components/ResizeHandle.svelte';
    import { Live2DController, ModelLoadingState } from '$lib/live2d/Live2DController.svelte';
    import names from '$lib/data/names.json';
    import censorRules from '$lib/data/censor.json';
    import * as Resizable from '$lib/components/ui/resizable';
    import * as Popover from '$lib/components/ui/popover';
    import * as Accordion from '$lib/components/ui/accordion';

    import {
        selectedModel,
        selectedVariant,
        selectedCharacterEntry,
        searchQuery,
        sortBy,
        filterDuplicates,
        decensor,
        filteredModels as storeFilteredModels,
        modelNames,
        variantsByModel,
        controller as storeController,
        uiState,
        viewerPreferences,
    } from '$lib/stores/gun-page';
    import type { Live2DModelIndex } from '$lib/server/live2d.ts';

    let {
        models,
        motionData,
        voiceData,
        modelSearchTerms,
        variantsByModel: variantsByModelProp,
        assetBaseUrl,
        hideUIOnLoad = false,
    } = $props<{
        models: Live2DModelIndex[];
        aliases: Record<string, string>;
        motionData: Record<string, Record<string, Record<number, any>>>;
        voiceData: Record<string, Record<string, Record<number, any>>>;
        modelSearchTerms: Record<string, string>;
        variantsByModel: Record<string, string[]>;
        assetBaseUrl: string;
        hideUIOnLoad?: boolean;
    }>();

    // Derived from uiState store for local access
    let isLeftPanelOpen = $derived($uiState.isLeftPanelOpen);
    let isAllPanelsExpanded = $derived($uiState.isAllPanelsExpanded);
    let isParametersPanelOpen = $derived($uiState.isParametersPanelOpen);

    // UI visibility state: controls opacity of panels and speed dials.
    // Resolved server-side from ?ui=0 so SSR ships the hidden layout; no flash on hydration.
    let hideUI = $state(hideUIOnLoad);

    // Loading state during controller initialization (before loadCharacter starts)
    let isInitializing = $state(false);

    // Button visibility timer (separate from panel logic)
    let buttonFadeTimer: NodeJS.Timeout | undefined = undefined;

    // Background Manager bindings
    let bgZoom = $state(0);
    let bgHasImage = $state(false);
    let bgManager = $state<BackgroundManager | undefined>();

    // Background State for Live2D Controller sync
    let backgroundImage = $state('');
    let bgX = $state(0);
    let bgY = $state(0);
    let bgScale = $state(1);

    // Sync background to controller
    $effect(() => {
        if (controller) {
            controller.setBackground(backgroundImage);
        }
    });

    $effect(() => {
        if (controller && backgroundImage) {
            controller.updateBackground(bgX, bgY, bgScale);
        }
    });

    let isCopied = $state(false);

    // Base host for share-link examples (current origin)
    let baseHost = $derived.by(() => {
        if (typeof window === 'undefined') return '';
        return window.location.host;
    });

    // State synced with store (selectedModel, selectedVariant, etc. imported from store)

    // Initialize model names and variants in store from props
    $effect(() => {
        if (models.length > 0) {
            const nameMap: Record<string, string> = {};
            for (const model of models) {
                const nameData = (names as any)[model.id];
                nameMap[model.id] = nameData?.en_name || model.gunName || model.code;
            }
            modelNames.set(nameMap);
        }
    });

    $effect(() => {
        variantsByModel.set(variantsByModelProp);
    });

    // Control Panel State (Right Panel)
    let isBgMoveMode = $state(false); // Managed by BackgroundManager

    // State synced with store (followParameterValues, currentParameters, sliderValues, currentParts, partOpacities imported)

    // Read-only status from GunLive2D
    // Data now accessed directly from controller.state.*

    // Controller Ownership State
    let controller = $state<Live2DController>();
    let canvas = $state<HTMLCanvasElement>();
    let controllerKey = $state(0); // Used to force re-render/reset if needed

    // Mobile/Tablet Tabbed Panel State
    let activeTab = $state<'info' | 'motions' | 'params' | 'parts'>('info');
    let isTabPanelOpen = $state(true); // For tablet collapse
    let drawerHeight = $state(45); // Mobile drawer height as percentage (40-85%)
    let dragStartY = $state(0);
    let dragStartHeight = $state(0);

    // Track window width for responsive positioning (SSR-safe)
    let isDesktopWidth = $state(false);

    // Mobile Info Accordion State (expanded by default)
    let mobileInfoAccordionValue = $state<string | undefined>('model-info');

    $effect(() => {
        if (browser) {
            const updateWidth = () => {
                isDesktopWidth = window.innerWidth >= 1800;
            };
            updateWidth();
            window.addEventListener('resize', updateWidth);
            return () => window.removeEventListener('resize', updateWidth);
        }
    });

    // Note: modelSearchTerms passed as prop, already computed server-side

    // Compute filteredModels from store state and props
    let filteredModels = $derived.by(() => {
        const seenDirectories = new Set<string>();

        return models
            .map((m: Live2DModelIndex) => ({
                ...m,
                displayName: m.gunName || String($modelNames[m.id] ?? m.code ?? m.id).replace(/_/g, ' '),
            }))
            .filter((m: Live2DModelIndex & { displayName: string }) => {
                if ($filterDuplicates) {
                    // Filter out Mod_\d+ entries
                    if (/Mod_\d+/i.test(m.code)) {
                        return false;
                    }
                    // Filter out entries with duplicate directories
                    if (seenDirectories.has(m.directory)) {
                        return false;
                    }
                }

                seenDirectories.add(m.directory);

                const query = $searchQuery.toLowerCase();
                const nameMatch = m.displayName.toLowerCase().includes(query);
                const codeMatch = m.code.toLowerCase().includes(query);
                const costumeMatch = (m.costumeName || '').toLowerCase().includes(query);
                const aliasMatch = (modelSearchTerms[m.id] || '').toLowerCase().includes(query);

                return nameMatch || codeMatch || costumeMatch || aliasMatch;
            })
            .sort((a: Live2DModelIndex & { displayName: string }, b: Live2DModelIndex & { displayName: string }) => {
                if ($sortBy === 'gun') {
                    return a.displayName.localeCompare(b.displayName);
                } else if ($sortBy === 'name') {
                    return (a.costumeName || '').localeCompare(b.costumeName || '');
                } else {
                    const idA = parseInt(a.id.match(/\d+$/)?.[0] || '0');
                    const idB = parseInt(b.id.match(/\d+$/)?.[0] || '0');
                    return idA - idB;
                }
            });
    });

    let selectedModelName = $derived($modelNames[$selectedModel] ?? $selectedModel?.replace(/_/g, ' ') ?? '');

    // Motion and voice data pre-filtered server-side by model ID and variant
    let filteredMotionData = $derived(
        $selectedCharacterEntry ? motionData[$selectedCharacterEntry.id]?.[$selectedVariant] : undefined,
    );
    let filteredVoiceData = $derived(
        $selectedCharacterEntry ? voiceData[$selectedCharacterEntry.id]?.[$selectedVariant] : undefined,
    );

    // Lifecycle: create controller when canvas is available
    $effect(() => {
        if (canvas && !controller) {
            controller = new Live2DController(canvas);

            const prefs = untrack(() => $viewerPreferences);
            controller.state.renderCaptionsOnCanvas = prefs.renderCaptionsOnCanvas;
            controller.state.followParameterValues = prefs.followParameterValues;
            controller.state.focusWeight = prefs.focusWeight;
            controller.state.isAlwaysFocus = prefs.isAlwaysFocus;
            controller.state.showHitboxDebug = prefs.showHitboxDebug;
            controller.state.useCustomInitialPositioning = prefs.useCustomInitialPositioning;
        }
    });

    $effect(() => {
        if (!controller) return;
        const { renderCaptionsOnCanvas, followParameterValues, focusWeight, isAlwaysFocus, showHitboxDebug, useCustomInitialPositioning } = controller.state;
        viewerPreferences.set({
            renderCaptionsOnCanvas,
            followParameterValues,
            focusWeight,
            isAlwaysFocus,
            showHitboxDebug,
            useCustomInitialPositioning,
        });
    });

    // Sync to store for component access
    $effect(() => {
        storeController.set(controller);
        storeFilteredModels.set(filteredModels);
    });

    onDestroy(() => {
        if (controller) controller.cleanup();
        clearTimeout(buttonFadeTimer);
    });

    function getDisplayVariant(variant: string) {
        if (!variant) return '';
        const v = variant.toLowerCase();
        if (v === 'destroy') return 'damaged';
        return variant;
    }

    function getInternalVariant(variant: string) {
        if (!variant) return '';
        const v = variant.toLowerCase();
        if (v === 'damaged') return 'destroy';
        return variant;
    }

    let currentDisplayVariant = $derived(getDisplayVariant($selectedVariant));

    let pageTitle = $derived.by(() => {
        const entry = $selectedCharacterEntry;
        if (!entry) return 'Live2D Viewer';

        // Name resolution: try derived store, fallback to manual lookup for SSR/init
        let n = selectedModelName;
        // If selectedModelName is derived from store, it might be empty initially in some contexts if store isn't set yet,
        // so we manually look it up if needed.
        if ((!n || n === '') && entry) {
            const nameData = (names as any)[entry.id];
            n = nameData?.en_name || entry.gunName || entry.code;
            n = String(n).replace(/_/g, ' ');
        }

        const c = entry.costumeName;

        // Variant suffix
        const v = currentDisplayVariant === 'normal' ? '' : currentDisplayVariant;

        let t = n;
        if (c) t += `: ${c}`;
        if (v) {
            // Capitalize first letter of variant for title
            const vCap = v.charAt(0).toUpperCase() + v.slice(1);
            t += ` (${vCap})`;
        }

        return t;
    });

    function handleCopyLink() {
        if (!$selectedCharacterEntry) return;

        const code = $selectedCharacterEntry.code.toLowerCase();
        const origin = `${window.location.protocol}//${window.location.host}`;

        const params = new URLSearchParams({ model: code });
        if (currentDisplayVariant && currentDisplayVariant !== 'normal') {
            params.set('variant', currentDisplayVariant);
        }

        navigator.clipboard.writeText(`${origin}/?${params.toString()}`);
        isCopied = true;
        setTimeout(() => (isCopied = false), 2000);
    }

    // Turn off always-focus when variant changes, and reset slider/parts tracking
    $effect(() => {
        $selectedVariant;
        resetUIState();
    });

    // Apply censoring when variant loads or censoring toggle changes
    $effect(() => {
        $selectedVariant;
        $decensor;
        if (controller?.state.loading === ModelLoadingState.READY) {
            setTimeout(() => {
                applyDecensor();
                // Reposition model if side panel is open on tablet
                const isTablet = window.innerWidth >= 768 && window.innerWidth < 1800;
                if (isTablet && isLeftPanelOpen && !hideUI) {
                    controller?.fitModelToScreen({ x: 200 });
                }
            }, 50);
        }
    });

    // Clear initializing state when controller is ready to load
    $effect(() => {
        if (controller && isInitializing) {
            isInitializing = false;
        }
    });

    function selectModelVariant(modelId: string, variant: string = 'normal') {
        isInitializing = true;
        resetModel();
        selectedModel.set(modelId);
        selectedVariant.set(variant);
        const entry = models.find((m: Live2DModelIndex) => m.id === modelId);
        selectedCharacterEntry.set(entry ?? null);
    }

    function playMotion(groupName: string, variantIndex: number) {
        if (controller) {
            controller.playMotionGroup(groupName, variantIndex);
        }
    }

    function applyDecensor() {
        if (!$selectedCharacterEntry || !controller) return;

        if ($decensor) {
            // Reset all parts to visible
            controller.resetPartOpacities();
        } else {
            const modelCode = $selectedCharacterEntry.code || $selectedCharacterEntry.id;
            const rules = (censorRules as any)[modelCode];

            if (!rules || !rules[$selectedVariant]) return;

            const partsToCensor = rules[$selectedVariant];
            if (!Array.isArray(partsToCensor)) return;

            // Set censored parts to transparent
            partsToCensor.forEach((partId: string) => {
                controller?.setPartOpacity(partId, 0);
            });
        }
    }

    function resetModel() {
        if (controller) {
            controller.cleanup();
            controller = undefined;
            controllerKey++;
        }
    }

    function scrollToSelection(modelId: string) {
        setTimeout(() => {
            const el = document.getElementById(`model-list-item-${modelId}`);
            el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 100);
    }

    $effect(() => {
        if (!hideUI && $selectedModel) {
            scrollToSelection($selectedModel);
        }
    });

    $effect(() => {
        // Init: resolve model+variant from ?model=&variant= query, else fall back to random
        if (models.length > 0 && !$selectedModel) {
            let initialModel: Live2DModelIndex | undefined;
            let queryVariant = '';

            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const modelQuery = params.get('model')?.toLowerCase();
                if (modelQuery) {
                    initialModel = models.find(
                        (m: Live2DModelIndex) =>
                            m.code.toLowerCase() === modelQuery ||
                            m.code.toLowerCase().replace(/_\d+$/, '') === modelQuery ||
                            m.directory.toLowerCase() === modelQuery,
                    );
                }
                queryVariant = getInternalVariant(params.get('variant') ?? '');
            }

            if (!initialModel) {
                initialModel = models[Math.floor(Math.random() * models.length)];
            }

            if (initialModel) {
                // Determine default variant (?variant= first, then legacy bare-key query, then 'normal')
                const variants = $variantsByModel[initialModel.directory] ?? [];
                let targetVariant = '';

                if (queryVariant) {
                    targetVariant =
                        variants.find((v) => v.toLowerCase() === queryVariant.toLowerCase()) || '';
                }

                if (!targetVariant && typeof window !== 'undefined') {
                    const params = new URLSearchParams(window.location.search);
                    for (const [key, value] of params) {
                        if (key === 'model' || key === 'variant') continue;
                        const searchKey = getInternalVariant(key);
                        const searchValue = getInternalVariant(value);

                        const match = variants.find(
                            (v) =>
                                v.toLowerCase() === searchKey.toLowerCase() ||
                                v.toLowerCase() === searchValue.toLowerCase(),
                        );
                        if (match) {
                            targetVariant = match;
                            break;
                        }
                    }
                }

                if (!targetVariant) {
                    targetVariant =
                        variants.length > 1
                            ? variants.find((v: string) => v.toLowerCase() === 'normal') || variants[0]
                            : variants[0] || 'normal';
                }

                selectModelVariant(initialModel.id, targetVariant);
                scrollToSelection(initialModel.id);
            }
        }
    });

    // Reset UI state (parameters, parts, animations)
    function resetUIState() {
        if (controller) {
            controller.stopAllMotions();
        }
    }

    // Reset handler exposed to UI
    function handleReset() {
        resetUIState();
        resetModel();
    }

    // Toggle UI visibility
    function handleRevealToggle() {
        hideUI = !hideUI;
    }

    // Background upload handler for mobile/tablet
    function handleBgUpload(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file && bgManager) {
            bgManager.loadAndSetBackgroundImage(file);
        }
        // Reset input so same file can be selected again
        target.value = '';
    }

    // Keyboard shortcuts
    function handleKeyboardShortcuts(e: KeyboardEvent) {
        // Only trigger if not typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        switch (e.key.toLowerCase()) {
            case 'm':
                e.preventDefault();
                controller?.setMoveMode(!controller.state.isMoveMode);
                if (controller?.state.isMoveMode) isBgMoveMode = false;
                break;
            case 'e':
                e.preventDefault();
                const currentFocus = controller?.state.isAlwaysFocus ?? false;
                controller?.setAlwaysFocus(!currentFocus);
                break;
        }
    }

    // Panel toggle function
    function togglePanel() {
        uiState.update((s) => ({ ...s, isLeftPanelOpen: !s.isLeftPanelOpen }));
    }

    // Mobile drawer resize handlers
    function handleDragStart(e: PointerEvent) {
        dragStartY = e.clientY;
        dragStartHeight = drawerHeight;
    }

    function handleDrag(e: PointerEvent) {
        const deltaY = dragStartY - e.clientY; // Negative = drag down
        const viewportHeight = window.innerHeight;
        const deltaPercent = (deltaY / viewportHeight) * 100;
        const newHeight = dragStartHeight + deltaPercent;

        // Clamp between 5% and 100% (allow full expansion)
        drawerHeight = Math.max(5, Math.min(100, newHeight));
    }

    function handleDragEnd() {
        // Could save to localStorage here if needed
    }

    function handleDoubleClick() {
        // Toggle between 45% and 75%
        drawerHeight = drawerHeight > 60 ? 45 : 75;
    }

    function toggleTabPanel() {
        isTabPanelOpen = !isTabPanelOpen;
    }
</script>

<svelte:window onkeydown={handleKeyboardShortcuts} />

<svelte:head>
    <title>{pageTitle}</title>
    <link rel="preload" as="image" href="/gfloading.gif" />
    <style>
        :global(body) {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: var(--color-background);
        }
    </style>
</svelte:head>

<!-- Root Container: Full Screen, Stacked Layout -->
<div class="bg-background fixed inset-0 h-full w-full overflow-hidden" role="application">
    <!-- Background Manager (handles image, drag/drop, paste, zoom, pan) -->
    <BackgroundManager
        bind:this={bgManager}
        bind:isBgMoveMode
        bind:zoom={bgZoom}
        bind:hasImage={bgHasImage}
        bind:backgroundImage
        bind:bgX
        bind:bgY
        bind:bgScale
    />
    <!-- LAYER 1: Canvas (Fixed Background) -->
    <div class="absolute inset-0 isolate z-0">
        {#if $selectedCharacterEntry}
            {#key controllerKey}
                <GunLive2D
                    characterEntry={$selectedCharacterEntry}
                    variant={$selectedVariant}
                    motionData={filteredMotionData}
                    voiceData={filteredVoiceData}
                    {assetBaseUrl}
                    bind:controller
                    bind:canvas
                    {isBgMoveMode}
                    {isInitializing}
                />
            {/key}
        {/if}

        <!-- Initial Loading GIF (before model selection) -->
        {#if !$selectedCharacterEntry}
            <CanvasOverlay>
                <div class="text-center">
                    <img src="/gfloading.gif" alt="Loading..." class="mx-auto mb-4 h-24 w-24" />
                    <p class="text-foreground-secondary font-medium">Select a model to begin</p>
                </div>
            </CanvasOverlay>
        {/if}
    </div>

    <!-- LAYER 2: UI Overlay -->
    <div class="pointer-events-none absolute inset-0 z-10 flex justify-between">
        <!-- DESKTOP/TABLET LAYOUT (md+) -->
        <div class="hidden w-full justify-between md:flex">
            <!-- LEFT PANEL WRAPPER (desktop 2xl+: 600px, tablet md-xl: 400px) -->
            <!-- Outer div handles transform (slide), inner div handles opacity -->
            <div
                class="absolute top-0 bottom-0 left-0 z-20 flex w-[400px] flex-col transition-transform duration-600 ease-in-out 2xl:w-[600px]"
                class:-translate-x-full={!isLeftPanelOpen}
            >
                <!-- Content Container (Handles Opacity) -->
                <div
                    class="border-border bg-background-secondary/95 flex h-full w-full flex-col overflow-hidden border-r transition-opacity duration-600 ease-in-out"
                    style="opacity: {hideUI ? 0 : 1}; pointer-events: {hideUI ? 'none' : 'auto'};"
                    inert={!isLeftPanelOpen}
                >
                    {#if isDesktopWidth}
                        <!-- Desktop: Regular list -->
                        <GunPageHeader {baseHost} />
                        <ModelFilters />
                        <ModelList {models} onSelectModel={selectModelVariant} formatVariant={getDisplayVariant} />
                    {:else}
                        <!-- Tablet: Tabbed content -->
                        <TabbedPanel bind:activeTab>
                            {#if activeTab === 'info'}
                                <div class="custom-scrollbar flex h-full flex-col overflow-hidden">
                                    <GunPageHeader {baseHost} />
                                    <ModelFilters />
                                    <ModelList
                                        {models}
                                        onSelectModel={selectModelVariant}
                                        formatVariant={getDisplayVariant}
                                        isMobileTablet={true}
                                    />
                                </div>
                            {:else if activeTab === 'motions'}
                                <div class="custom-scrollbar flex h-full flex-col overflow-y-auto">
                                    <div class="border-border bg-background-secondary/50 border-b">
                                        <ModelInfoPanel />
                                    </div>
                                    <div class="grid grid-cols-2 gap-2 px-4 pt-3 pb-3">
                                        <button
                                            onclick={handleReset}
                                            class="border-border bg-background-secondary/30 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground rounded border px-3 py-2 text-xs font-medium transition"
                                        >
                                            Reset Model
                                        </button>
                                        <button
                                            onclick={() => {
                                                if (controller) {
                                                    controller.state.showHitboxDebug =
                                                        !controller.state.showHitboxDebug;
                                                }
                                            }}
                                            class="border-border bg-background-secondary/30 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground rounded border px-3 py-2 text-xs font-medium transition {controller
                                                ?.state.showHitboxDebug
                                                ? 'border-accent text-accent'
                                                : ''}"
                                        >
                                            {controller?.state.showHitboxDebug ? 'Hide Hitboxes' : 'Show Hitboxes'}
                                        </button>
                                    </div>
                                    <hr class="border-border" />
                                    <MotionControlsPanel onPlayMotion={playMotion} onReset={handleReset} />
                                </div>
                            {:else if activeTab === 'params'}
                                <div class="h-full overflow-hidden">
                                    <ParametersPanel />
                                </div>
                            {:else if activeTab === 'parts'}
                                <div class="h-full overflow-hidden">
                                    <PartsPanel />
                                </div>
                            {/if}
                        </TabbedPanel>
                    {/if}
                </div>

                <!-- LEFT SPEED DIAL: Positioned at right edge of panel (slides with panel) -->
                <div
                    class="absolute top-4 left-full z-50 ml-4 flex flex-col gap-3 transition-opacity duration-600 ease-in-out"
                    style="opacity: {hideUI ? 0 : 1}; pointer-events: {hideUI ? 'none' : 'auto'};"
                >
                    <!-- Theme Toggle (tablet+) -->
                    <div class="hidden md:block">
                        <ThemeToggle />
                    </div>

                    <!-- Panel toggle chevron (tablet only, md-xl) - matches desktop styling -->
                    <button
                        onclick={togglePanel}
                        class="border-border bg-background-secondary/95 text-foreground-tertiary hover:border-accent hover:bg-accent/20 hover:text-accent hidden h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition md:flex 2xl:hidden"
                        title={isLeftPanelOpen ? 'Collapse list' : 'Expand list'}
                        aria-label={isLeftPanelOpen ? 'Collapse model list panel' : 'Expand model list panel'}
                        aria-pressed={isLeftPanelOpen}
                    >
                        <MorphingChevron class="h-5 w-5" pointsRight={!isLeftPanelOpen} />
                    </button>

                    <!-- Viewport Controls (chevron hidden on tablet, shown on desktop only) -->
                    <ViewportControls hideChevronOnTablet={true} bind:isBgMoveMode />
                </div>
            </div>

            <!-- PANELS PARENT CONTAINER (desktop only, 2xl+) -->
            <!-- Outer div handles transform (slide), inner div handles opacity -->
            <div
                class="absolute top-0 right-0 bottom-0 z-20 hidden transition-transform ease-in-out select-none 2xl:flex {hideUI
                    ? 'translate-x-full'
                    : isAllPanelsExpanded
                      ? 'translate-x-0'
                      : isParametersPanelOpen
                        ? 'translate-x-[600px]'
                        : 'translate-x-[300px]'}"
                style="transition-duration: {isParametersPanelOpen ? 600 : 300}ms;"
            >
                <!-- RIGHT SPEED DIAL: Positioned relative to right panel edge (desktop only) -->
                <div class="absolute top-4 right-full z-50 mr-4 flex flex-col gap-3" style="pointer-events: auto;">
                    <!-- HideUI Button (always visible) -->
                    <RevealButton
                        isVisible={!hideUI}
                        enableFlash={hideUIOnLoad}
                        onToggle={handleRevealToggle}
                        variant="desktop"
                    />

                    <!-- BG Controls (hideable) -->
                    <PanelControls {bgHasImage} bind:isBgMoveMode bind:bgZoom {bgManager} {hideUI} />
                </div>

                <!-- Content Wrapper (Handles Opacity) -->
                <div
                    class="flex h-full w-full transition-opacity duration-600 ease-in-out"
                    style="opacity: {hideUI ? 0 : 1}; pointer-events: {hideUI ? 'none' : 'auto'};"
                    inert={hideUI || !isAllPanelsExpanded}
                >
                    <!-- PANEL A: Parameters and Parts (slides within parent) -->
                    <div
                        class="transition-width overflow-hidden duration-300 ease-in-out {isParametersPanelOpen
                            ? 'w-[300px]'
                            : 'w-0'}"
                        inert={hideUI || !isParametersPanelOpen}
                    >
                        <div
                            id="panel-a"
                            class="border-border bg-background-secondary/95 flex h-full w-[300px] flex-col border-l"
                        >
                            <!-- PARAMETERS SECTION: Top 2/3 -->
                            <Resizable.PaneGroup direction="vertical" class="h-full w-full">
                                <!-- PARAMETERS SECTION: Top 2/3 (Default 65%) -->
                                <Resizable.Pane defaultSize={65}>
                                    <ParametersPanel />
                                </Resizable.Pane>

                                <Resizable.Handle withHandle />

                                <!-- PARTS SECTION: Bottom 1/3 (Default 35%) -->
                                <Resizable.Pane defaultSize={35}>
                                    <PartsPanel />
                                </Resizable.Pane>
                            </Resizable.PaneGroup>
                        </div>
                    </div>

                    <!-- PANEL B: Original Controls (slides within parent) -->
                    <div
                        id="panel-b"
                        class="custom-scrollbar border-border bg-background-secondary/95 flex w-[300px] flex-col overflow-y-auto border-l"
                        inert={hideUI}
                    >
                        <!-- Model Info (collapsible on mobile) -->
                        <!-- Model Info -->
                        <div class="border-border bg-background-secondary/50 border-b">
                            <ModelInfoPanel />
                        </div>

                        <!-- Utility Buttons (Desktop) -->
                        <div class="grid grid-cols-2 gap-2 px-4 pt-3 pb-3">
                            <button
                                onclick={handleReset}
                                class="border-border bg-background-secondary/30 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground rounded border px-3 py-2 text-xs font-medium transition"
                            >
                                Reset Model
                            </button>
                            <button
                                onclick={() => {
                                    if (controller) {
                                        controller.state.showHitboxDebug = !controller.state.showHitboxDebug;
                                    }
                                }}
                                class="border-border bg-background-secondary/30 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground rounded border px-3 py-2 text-xs font-medium transition {controller
                                    ?.state.showHitboxDebug
                                    ? 'border-accent text-accent'
                                    : ''}"
                            >
                                {controller?.state.showHitboxDebug ? 'Hide Hitboxes' : 'Show Hitboxes'}
                            </button>
                        </div>

                        <hr class="border-border" />

                        <MotionControlsPanel onPlayMotion={playMotion} onReset={handleReset} />
                    </div>
                </div>
            </div>
        </div>
        <!-- /DESKTOP/TABLET LAYOUT -->

        <!-- SPEED DIALS (Mobile/Tablet only, hidden on desktop) -->
        <div class="pointer-events-none 2xl:hidden">
            <!-- Top left: Theme Toggle + Viewport Controls (mobile only) -->
            <div
                class="pointer-events-auto fixed top-4 left-4 z-20 flex flex-col gap-3 transition-opacity duration-600 md:hidden"
                style="opacity: {hideUI ? 0 : 1}; pointer-events: {hideUI ? 'none' : 'auto'};"
            >
                <ThemeToggle />
                <ViewportControls hideChevronOnTablet={false} hideMobileChevron={true} bind:isBgMoveMode />
            </div>

            <!-- Top right: HideUI + BG controls -->
            <div class="pointer-events-auto fixed top-4 right-4 z-20 flex flex-col gap-3">
                <!-- HideUI button (always visible, manages its own fade) -->
                <RevealButton isVisible={!hideUI} enableFlash={hideUIOnLoad} onToggle={handleRevealToggle} />

                <!-- BG controls wrapper (affected by hideUI) -->
                <div class="flex flex-col gap-3">
                    <!-- ImageUp button (mobile/tablet only, always visible) -->
                    <button
                        onclick={() => document.getElementById('bg-upload-input')?.click()}
                        class="border-border bg-background-secondary/95 text-foreground-tertiary hover:border-accent hover:bg-accent/10 hover:text-foreground flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition-all duration-300 2xl:hidden {hideUI
                            ? 'pointer-events-none opacity-0'
                            : ''}"
                        title="Upload background image"
                    >
                        <ImageUp class="h-5 w-5" />
                    </button>
                    <!-- Hidden file input for background upload -->
                    <input
                        id="bg-upload-input"
                        type="file"
                        accept="image/*"
                        onchange={handleBgUpload}
                        class="hidden"
                        aria-label="Select background image file"
                    />

                    <!-- BG controls (mobile/tablet, only when image loaded) -->
                    {#if bgHasImage}
                        <div class="flex flex-col gap-3 2xl:hidden">
                            <PanelControls {bgHasImage} bind:isBgMoveMode bind:bgZoom {bgManager} {hideUI} />
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- MOBILE LAYOUT (bottom drawer, sm only) -->
        <div
            class="absolute inset-x-0 bottom-0 z-30 flex transition-opacity duration-600 md:hidden"
            style="height: {drawerHeight}vh; opacity: {hideUI ? 0 : 1}; pointer-events: {hideUI ? 'none' : 'auto'};"
        >
            <div class="relative flex w-full flex-col">
                <!-- Info Popover Button (floating above drawer) -->
                <Popover.Root>
                    <Popover.Trigger
                        class="border-border bg-background-secondary/95 text-foreground-tertiary hover:text-foreground fixed right-4 z-35 flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition md:hidden"
                        style="bottom: calc({drawerHeight}vh + 1rem); opacity: {hideUI ? 0 : 1}; pointer-events: {hideUI
                            ? 'none'
                            : 'auto'};"
                    >
                        <Info class="h-5 w-5" />
                    </Popover.Trigger>
                    <Popover.Content
                        class="border-border bg-background-secondary/95 max-h-[70vh] w-96 overflow-y-auto border"
                        side="top"
                    >
                        <GunPageHeader {baseHost} />
                    </Popover.Content>
                </Popover.Root>

                <ResizeHandle
                    onDragStart={handleDragStart}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    onDoubleClick={handleDoubleClick}
                />
                <TabbedPanel bind:activeTab>
                    {#if activeTab === 'info'}
                        <div class="custom-scrollbar flex h-full flex-col overflow-hidden">
                            <ModelFilters />
                            <ModelList
                                {models}
                                onSelectModel={selectModelVariant}
                                formatVariant={getDisplayVariant}
                                isMobileTablet={true}
                            />
                        </div>
                    {:else if activeTab === 'motions'}
                        <div class="custom-scrollbar flex h-full flex-col overflow-y-auto">
                            <!-- Model Info (collapsible on mobile) -->
                            <Accordion.Root type="single" class="w-full" bind:value={mobileInfoAccordionValue}>
                                <Accordion.Item value="model-info" class="border-0">
                                    <!-- Utility Buttons (always visible, chevron inline on mobile) -->
                                    <div class="grid grid-cols-3 gap-2 px-4 pt-4 md:grid-cols-2">
                                        <!-- Accordion trigger (mobile only, 3rd column) -->
                                        <Accordion.Trigger
                                            class="border-border bg-background-secondary/30 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground flex h-10 items-center justify-center rounded border px-3 text-xs font-medium transition hover:no-underline md:hidden [&>svg:last-child]:hidden"
                                        >
                                            {mobileInfoAccordionValue === 'model-info' ? 'Hide Info' : 'Show Info'}
                                        </Accordion.Trigger>
                                        <button
                                            onclick={handleReset}
                                            class="border-border bg-background-secondary/30 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground h-10 rounded border px-3 py-2 text-xs font-medium transition"
                                        >
                                            Reset Model
                                        </button>
                                        <button
                                            onclick={() => {
                                                if (controller) {
                                                    controller.state.showHitboxDebug =
                                                        !controller.state.showHitboxDebug;
                                                }
                                            }}
                                            class="border-border bg-background-secondary/30 text-foreground-secondary hover:bg-background-tertiary hover:text-foreground h-10 rounded border px-3 py-2 text-xs font-medium transition {controller
                                                ?.state.showHitboxDebug
                                                ? 'border-accent text-accent'
                                                : ''}"
                                        >
                                            {controller?.state.showHitboxDebug ? 'Hide Hitboxes' : 'Show Hitboxes'}
                                        </button>
                                    </div>

                                    <Accordion.Content class="pb-0">
                                        <ModelInfoPanel />
                                    </Accordion.Content>
                                </Accordion.Item>
                            </Accordion.Root>

                            <hr class="border-border mt-4" />
                            <MotionControlsPanel onPlayMotion={playMotion} onReset={handleReset} />
                        </div>
                    {:else if activeTab === 'params'}
                        <div class="h-full overflow-hidden">
                            <ParametersPanel />
                        </div>
                    {:else if activeTab === 'parts'}
                        <div class="h-full overflow-hidden">
                            <PartsPanel />
                        </div>
                    {/if}
                </TabbedPanel>
            </div>
        </div>
    </div>
</div>

<style>
    /* CSS Containment: Isolate panel repaints (performance) */
    #panel-a,
    #panel-b {
        contain: layout style paint;
    }

    /* Custom Scrollbar for panels */
    :global(.custom-scrollbar::-webkit-scrollbar) {
        width: 6px;
    }
    :global(.custom-scrollbar::-webkit-scrollbar-track) {
        background: transparent;
    }
    :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
        background: var(--color-background-tertiary);
        border-radius: 3px;
    }
    :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) {
        background: var(--color-foreground-tertiary);
    }

    /* Non-selectable labels */
    :global(.user-select-none) {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        pointer-events: none;
    }

    /* Stats.js performance monitor position at top center */
    :global(#stats) {
        display: none;
        position: fixed !important;
        top: 0 !important;
        left: 50% !important;
        right: auto !important;
        bottom: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        transform: translateX(-50%) !important;
        z-index: 9999 !important;
    }
</style>
