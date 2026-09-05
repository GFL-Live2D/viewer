// Spring integrator driven externally by update() from a render tick.
// Velocity is derived from the previous value rather than stored, which keeps
// the simulation stable when frame deltas vary.
export class Spring {
    current: number;
    target: number;
    stiffness: number;
    damping: number;
    precision: number;

    private last: number;

    constructor(
        value: number,
        opts: { stiffness?: number; damping?: number; precision?: number } = {},
    ) {
        this.current = value;
        this.target = value;
        this.last = value;
        this.stiffness = opts.stiffness ?? 0.15;
        this.damping = opts.damping ?? 0.8;
        this.precision = opts.precision ?? 0.01;
    }

    set(value: number, options?: { instant?: boolean }) {
        this.target = value;
        if (options?.instant) {
            this.current = value;
            this.last = value;
        }
    }

    // dt is elapsed time in 60fps frames, matching Pixi ticker.deltaTime.
    // Clamped so a backgrounded tab cannot resume with a huge impulse.
    update(dt = 1) {
        if (this.current === this.target && this.last === this.current) return;

        const step = Math.min(dt, 2);
        const delta = this.target - this.current;
        const velocity = (this.current - this.last) / (step || 1);
        const acceleration = this.stiffness * delta - this.damping * velocity;
        const d = (velocity + acceleration) * step;

        this.last = this.current;
        if (Math.abs(d) < this.precision && Math.abs(delta) < this.precision) {
            this.current = this.target;
            this.last = this.target;
        } else {
            this.current += d;
        }
    }
}
