"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = closest;
function closest(el, selector) {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    var p = el;
    while (p) {
        if (matchesSelector.call(p, selector)) {
            return p;
        }
        p = p.parentElement;
    }
    return null;
}
module.exports = exports["default"];