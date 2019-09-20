"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = isWindow;
/* eslint no-eq-null: 0 */
/* eslint eqeqeq: 0 */
/* tslint:disable:triple-equals */
function isWindow(obj) {
    return obj != null && obj == obj.window;
}
module.exports = exports['default'];