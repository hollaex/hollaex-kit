/* tslint:disable:no-bitwise */
import { SWIPE, DIRECTION_NONE, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_UP, DIRECTION_DOWN } from './config';
function _calcTriangleDistance(x, y) {
    return Math.sqrt(x * x + y * y);
}
function _calcAngle(x, y) {
    var radian = Math.atan2(y, x);
    return 180 / (Math.PI / radian);
}
export function now() {
    return Date.now();
}
export function calcMutliFingerStatus(touches) {
    if (touches.length < 2) {
        return;
    }
    var _touches$ = touches[0],
        x1 = _touches$.x,
        y1 = _touches$.y;
    var _touches$2 = touches[1],
        x2 = _touches$2.x,
        y2 = _touches$2.y;

    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    return {
        x: deltaX,
        y: deltaY,
        z: _calcTriangleDistance(deltaX, deltaY),
        angle: _calcAngle(deltaX, deltaY)
    };
}
export function calcMoveStatus(startTouches, touches, time) {
    var _startTouches$ = startTouches[0],
        x1 = _startTouches$.x,
        y1 = _startTouches$.y;
    var _touches$3 = touches[0],
        x2 = _touches$3.x,
        y2 = _touches$3.y;

    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var deltaZ = _calcTriangleDistance(deltaX, deltaY);
    return {
        x: deltaX,
        y: deltaY,
        z: deltaZ,
        time: time,
        velocity: deltaZ / time,
        angle: _calcAngle(deltaX, deltaY)
    };
}
export function calcRotation(startMutliFingerStatus, mutliFingerStatus) {
    var startAngle = startMutliFingerStatus.angle;
    var angle = mutliFingerStatus.angle;

    return angle - startAngle;
}
export function getEventName(prefix, status) {
    return prefix + status[0].toUpperCase() + status.slice(1);
}
export function shouldTriggerSwipe(delta, velocity) {
    return Math.abs(delta) >= SWIPE.threshold && Math.abs(velocity) > SWIPE.velocity;
}
export function shouldTriggerDirection(direction, directionSetting) {
    if (directionSetting & direction) {
        return true;
    }
    return false;
}
/**
 * @private
 * get the direction between two points
 * Note: will change next version
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
export function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }
    if (Math.abs(x) >= Math.abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}
/**
 * @private
 * get the direction between tow points when touch moving
 * Note: will change next version
 * @param {Object} point1 coordinate point, include x & y attributes
 * @param {Object} point2 coordinate point, include x & y attributes
 * @return {Number} direction
 */
export function getMovingDirection(point1, point2) {
    var x1 = point1.x,
        y1 = point1.y;
    var x2 = point2.x,
        y2 = point2.y;

    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    if (deltaX === 0 && deltaY === 0) {
        return DIRECTION_NONE;
    }
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        return deltaX < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return deltaY < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}
export function getDirectionEventName(direction) {
    var name = void 0;
    switch (direction) {
        case DIRECTION_NONE:
            break;
        case DIRECTION_LEFT:
            name = 'left';
            break;
        case DIRECTION_RIGHT:
            name = 'right';
            break;
        case DIRECTION_UP:
            name = 'up';
            break;
        case DIRECTION_DOWN:
            name = 'down';
            break;
        default:
    }
    return name;
}