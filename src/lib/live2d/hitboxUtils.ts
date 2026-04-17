export interface HitAreaDefinition {
    Id: string;
    Name: string;
}

export interface HitAreaDebugInfo {
    name: string;
    id: string;
    index: number;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

/**
 * Extract hit areas from model3.json data
 */
export function extractHitAreas(modelJson: any): HitAreaDefinition[] {
    const hitAreas = modelJson.HitAreas || [];
    if (!Array.isArray(hitAreas)) return [];

    return hitAreas
        .map((area: any) => ({
            Id: area.Id || '',
            Name: area.Name || '',
        }))
        .filter((area: HitAreaDefinition) => area.Id && area.Name);
}

/**
 * Get debug information about hit areas in a loaded model
 */
export function getHitAreaDebugInfo(model: any): HitAreaDebugInfo[] {
    if (!model || !model.internalModel) return [];

    const hitAreas = model.internalModel.hitAreas || {};
    const debugInfo: HitAreaDebugInfo[] = [];

    for (const [name, areaData] of Object.entries(hitAreas)) {
        const area = areaData as any;
        debugInfo.push({
            name,
            id: area.id || 'unknown',
            index: area.index ?? -1,
            bounds: getBounds(model, area.index),
        });
    }

    return debugInfo;
}

/**
 * Get bounding box for a drawable
 */
function getBounds(
    model: any,
    drawableIndex: number,
): { x: number; y: number; width: number; height: number } | undefined {
    if (!model || drawableIndex < 0) return undefined;

    try {
        const internalModel = model.internalModel;
        if (!internalModel || !internalModel.getDrawableBounds) return undefined;

        const bounds = internalModel.getDrawableBounds?.(drawableIndex);
        if (!bounds) return undefined;

        return {
            x: bounds.x || 0,
            y: bounds.y || 0,
            width: bounds.width || 0,
            height: bounds.height || 0,
        };
    } catch (err) {
        console.warn(`[Hitbox] Failed to get bounds for drawable ${drawableIndex}:`, err);
        return undefined;
    }
}

/**
 * Test if a point hits any area in the model
 */
export function testHit(model: any, x: number, y: number): string[] {
    if (!model || !model.internalModel || !model.internalModel.hitTest) {
        return [];
    }

    try {
        return model.internalModel.hitTest(x, y) || [];
    } catch (err) {
        console.warn('[Hitbox] hitTest failed:', err);
        return [];
    }
}

/**
 * Test if a specific area is hit
 */
export function testAreaHit(model: any, areaName: string, x: number, y: number): boolean {
    if (!model || !model.internalModel || !model.internalModel.isHit) {
        return false;
    }

    try {
        return model.internalModel.isHit(areaName, x, y);
    } catch (err) {
        console.warn(`[Hitbox] isHit(${areaName}) failed:`, err);
        return false;
    }
}

/**
 * Get all available hit areas in the model
 */
export function getAvailableHitAreas(model: any): string[] {
    if (!model || !model.internalModel) return [];

    const hitAreas = model.internalModel.hitAreas || {};
    return Object.keys(hitAreas);
}

/**
 * Log complete hitbox diagnostic information
 */
export function logHitboxDiagnostics(model: any, modelJson: any, verbose = false): void {
    console.group('[Hitbox Diagnostics]');

    // From model3.json
    console.group('model3.json HitAreas');
    const definedHitAreas = extractHitAreas(modelJson);
    console.table(definedHitAreas);
    console.groupEnd();

    // Loaded in model
    console.group('Loaded Hit Areas (internal)');
    const debugInfo = getHitAreaDebugInfo(model);
    if (debugInfo.length > 0) {
        console.table(debugInfo);
    } else {
        console.warn('No hit areas loaded in model');
    }
    console.groupEnd();

    if (verbose) {
        // Raw internal model data
        console.group('Raw internalModel.hitAreas');
        console.log(model.internalModel.hitAreas);
        console.groupEnd();

        // Test all hit areas
        console.group('Hit Area Test (center of model)');
        const width = model.width || 1000;
        const height = model.height || 1000;
        const cx = width / 2;
        const cy = height / 2;
        const hits = testHit(model, cx, cy);
        console.log(`Hit test at center (${cx}, ${cy}):`, hits);
        console.groupEnd();
    }

    console.groupEnd();
}
