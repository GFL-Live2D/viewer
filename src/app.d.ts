declare global {
    namespace App {
        interface Locals {
            subdomain: string;
            subdomainMode: boolean;
        }
    }
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
