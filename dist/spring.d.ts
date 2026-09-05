export declare class Spring {
    current: number;
    target: number;
    stiffness: number;
    damping: number;
    precision: number;
    private last;
    constructor(value: number, opts?: {
        stiffness?: number;
        damping?: number;
        precision?: number;
    });
    set(value: number, options?: {
        instant?: boolean;
    }): void;
    update(dt?: number): void;
}
