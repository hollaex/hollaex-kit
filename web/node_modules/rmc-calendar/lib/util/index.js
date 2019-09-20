'use strict';

exports.__esModule = true;
exports.shallowEqual = shallowEqual;
var mergeDateTime = exports.mergeDateTime = function mergeDateTime(date, time) {
    date = date || new Date();
    if (!time) return date;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
};
var formatDate = exports.formatDate = function formatDate(date, format, locale) {
    var week = locale && locale.week;
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'w+': week && week[date.getDay()],
        'S': date.getMilliseconds()
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};
var hasOwnProperty = Object.prototype.hasOwnProperty;
function is(x, y) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}
function shallowEqual(objA, objB) {
    var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (is(objA, objB)) {
        return true;
    }
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    for (var i = 0; i < keysA.length; i++) {
        if (exclude.indexOf(keysA[i]) >= 0) continue;
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}