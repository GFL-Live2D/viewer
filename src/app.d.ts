declare global {
    namespace App {}
}

declare module 'stats.js' {
    export default class Stats {
        dom: HTMLElement;
        showPanel(i: number): void;
        update(): void;
    }
}

interface Window {
    PIXI: typeof import('pixi.js');
}

export {};
