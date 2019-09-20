'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
var IS_IOS = exports.IS_IOS = canUseDOM && /iphone|ipad|ipod/i.test(window.navigator.userAgent);