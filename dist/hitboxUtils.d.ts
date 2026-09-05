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
export declare function extractHitAreas(modelJson: any): HitAreaDefinition[];
/**
 * Get debug information about hit areas in a loaded model
 */
export declare function getHitAreaDebugInfo(model: any): HitAreaDebugInfo[];
/**
 * Test if a point hits any area in the model
 */
export declare function testHit(model: any, x: number, y: number): string[];
/**
 * Test if a specific area is hit
 */
export declare function testAreaHit(model: any, areaName: string, x: number, y: number): boolean;
/**
 * Get all available hit areas in the model
 */
export declare function getAvailableHitAreas(model: any): string[];
/**
 * Log complete hitbox diagnostic information
 */
export declare function logHitboxDiagnostics(model: any, modelJson: any, verbose?: boolean): void;
