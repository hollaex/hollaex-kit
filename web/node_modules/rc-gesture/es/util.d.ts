export declare function now(): number;
export declare function calcMutliFingerStatus(touches: any): {
    x: number;
    y: number;
    z: number;
    angle: number;
} | undefined;
export declare function calcMoveStatus(startTouches: any, touches: any, time: any): {
    x: number;
    y: number;
    z: number;
    time: any;
    velocity: number;
    angle: number;
};
export declare function calcRotation(startMutliFingerStatus: any, mutliFingerStatus: any): number;
export declare function getEventName(prefix: any, status: any): any;
export declare function shouldTriggerSwipe(delta: any, velocity: any): boolean;
export declare function shouldTriggerDirection(direction: any, directionSetting: any): boolean;
/**
 * @private
 * get the direction between two points
 * Note: will change next version
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
export declare function getDirection(x: any, y: any): 1 | 2 | 4 | 8 | 16;
/**
 * @private
 * get the direction between tow points when touch moving
 * Note: will change next version
 * @param {Object} point1 coordinate point, include x & y attributes
 * @param {Object} point2 coordinate point, include x & y attributes
 * @return {Number} direction
 */
export declare function getMovingDirection(point1: any, point2: any): 1 | 2 | 4 | 8 | 16;
export declare function getDirectionEventName(direction: any): any;
