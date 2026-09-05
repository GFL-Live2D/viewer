// Stands in for untitled-pixi-live2d-engine in the external build, where the engine is
// already on the page as PIXI.live2d. Dynamic imports of an external are not rewritten to
// globals, so the specifier is aliased here instead.
const engine = (globalThis as any).PIXI?.live2d ?? {};

export const { Live2DModel, Live2DPlugin, configureCubismSDK, HitAreaFrames } = engine;
