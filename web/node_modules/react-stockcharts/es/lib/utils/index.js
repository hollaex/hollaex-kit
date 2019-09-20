var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { scaleOrdinal, schemeCategory10 } from "d3-scale";
import { bisector } from "d3-array";
import noop from "./noop";
import identity from "./identity";

export { default as rebind } from "./rebind";
export { default as zipper } from "./zipper";
export { default as merge } from "./merge";
export { default as slidingWindow } from "./slidingWindow";
export { default as identity } from "./identity";
export { default as noop } from "./noop";
export { default as shallowEqual } from "./shallowEqual";
export { default as mappedSlidingWindow } from "./mappedSlidingWindow";
export { default as accumulatingWindow } from "./accumulatingWindow";
export { default as PureComponent } from "./PureComponent";

export * from "./barWidth";
export * from "./strokeDasharray";

export function getLogger(prefix) {
	var logger = noop;
	if (process.env.NODE_ENV !== "production") {
		logger = require("debug")("react-stockcharts:" + prefix);
	}
	return logger;
}

export function sign(x) {
	return (x > 0) - (x < 0);
}

export var yes = function yes() {
	return true;
};

export function path() {
	var loc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	var key = Array.isArray(loc) ? loc : [loc];
	var length = key.length;

	return function (obj, defaultValue) {
		if (length === 0) return isDefined(obj) ? obj : defaultValue;

		var index = 0;
		while (obj != null && index < length) {
			obj = obj[key[index++]];
		}
		return index === length ? obj : defaultValue;
	};
}

export function functor(v) {
	return typeof v === "function" ? v : function () {
		return v;
	};
}

export function createVerticalLinearGradient(stops) {
	return function (moreProps, ctx) {
		var height = moreProps.chartConfig.height;


		var grd = ctx.createLinearGradient(0, height, 0, 0);
		stops.forEach(function (each) {
			grd.addColorStop(each.stop, each.color);
		});

		return grd;
	};
}

export function getClosestItemIndexes2(array, value, accessor) {
	var left = bisector(accessor).left(array, value);
	left = Math.max(left - 1, 0);
	var right = Math.min(left + 1, array.length - 1);

	var item = accessor(array[left]);
	if (item >= value && item <= value) right = left;

	return { left: left, right: right };
}

export function degrees(radians) {
	return radians * 180 / Math.PI;
}

export function radians(degrees) {
	return degrees * Math.PI / 180;
}

export function getClosestValue(inputValue, currentValue) {
	var values = isArray(inputValue) ? inputValue : [inputValue];

	var diff = values.map(function (each) {
		return each - currentValue;
	}).reduce(function (diff1, diff2) {
		return Math.abs(diff1) < Math.abs(diff2) ? diff1 : diff2;
	});
	return currentValue + diff;
}

export function find(list, predicate) {
	var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

	for (var i = 0; i < list.length; ++i) {
		if (predicate.call(context, list[i], i, list)) {
			return list[i];
		}
	}
	return undefined;
}

export function d3Window(node) {
	var d3win = node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
	return d3win;
}

export var MOUSEENTER = "mouseenter.interaction";
export var MOUSELEAVE = "mouseleave.interaction";
export var MOUSEMOVE = "mousemove.pan";
export var MOUSEUP = "mouseup.pan";
export var TOUCHMOVE = "touchmove.pan";
export var TOUCHEND = "touchend.pan touchcancel.pan";

export function getTouchProps(touch) {
	if (!touch) return {};
	return {
		pageX: touch.pageX,
		pageY: touch.pageY,
		clientX: touch.clientX,
		clientY: touch.clientY
	};
}

export function getClosestItemIndexes(array, value, accessor, log) {
	var lo = 0,
	    hi = array.length - 1;
	while (hi - lo > 1) {
		var mid = Math.round((lo + hi) / 2);
		if (accessor(array[mid]) <= value) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	// for Date object === does not work, so using the <= in combination with >=
	// the same code works for both dates and numbers
	if (accessor(array[lo]).valueOf() === value.valueOf()) hi = lo;
	if (accessor(array[hi]).valueOf() === value.valueOf()) lo = hi;

	if (accessor(array[lo]) < value && accessor(array[hi]) < value) lo = hi;
	if (accessor(array[lo]) > value && accessor(array[hi]) > value) hi = lo;

	if (log) {}
	// console.log(lo, accessor(array[lo]), value, accessor(array[hi]), hi);
	// console.log(accessor(array[lo]), lo, value, accessor(array[lo]) >= value);
	// console.log(value, hi, accessor(array[hi]), accessor(array[lo]) <= value);

	// var left = value > accessor(array[lo]) ? lo : lo;
	// var right = gte(value, accessor(array[hi])) ? Math.min(hi + 1, array.length - 1) : hi;

	// console.log(value, accessor(array[left]), accessor(array[right]));
	return { left: lo, right: hi };
}

export function getClosestItem(array, value, accessor, log) {
	var _getClosestItemIndexe = getClosestItemIndexes(array, value, accessor, log),
	    left = _getClosestItemIndexe.left,
	    right = _getClosestItemIndexe.right;

	if (left === right) {
		return array[left];
	}

	var closest = Math.abs(accessor(array[left]) - value) < Math.abs(accessor(array[right]) - value) ? array[left] : array[right];
	if (log) {
		console.log(array[left], array[right], closest, left, right);
	}
	return closest;
}

export var overlayColors = scaleOrdinal(schemeCategory10);

export function head(array, accessor) {
	if (accessor && array) {
		var value = void 0;
		for (var i = 0; i < array.length; i++) {
			value = array[i];
			if (isDefined(accessor(value))) return value;
		}
		return undefined;
	}
	return array ? array[0] : undefined;
}

export function tail(array, accessor) {
	if (accessor && array) {
		return array.map(accessor).slice(1);
	}
	return array ? array.slice(1) : undefined;
}

export var first = head;

export function last(array, accessor) {
	if (accessor && array) {
		var value = void 0;
		for (var i = array.length - 1; i >= 0; i--) {
			value = array[i];
			if (isDefined(accessor(value))) return value;
		}
		return undefined;
	}
	var length = array ? array.length : 0;
	return length ? array[length - 1] : undefined;
}

export function isDefined(d) {
	return d !== null && typeof d != "undefined";
}

export function isNotDefined(d) {
	return !isDefined(d);
}

export function isObject(d) {
	return isDefined(d) && (typeof d === "undefined" ? "undefined" : _typeof(d)) === "object" && !Array.isArray(d);
}

export var isArray = Array.isArray;

export function touchPosition(touch, e) {
	var container = e.target,
	    rect = container.getBoundingClientRect(),
	    x = touch.clientX - rect.left - container.clientLeft,
	    y = touch.clientY - rect.top - container.clientTop,
	    xy = [Math.round(x), Math.round(y)];
	return xy;
}

export function mousePosition(e, defaultRect) {
	var container = e.currentTarget;
	var rect = defaultRect || container.getBoundingClientRect(),
	    x = e.clientX - rect.left - container.clientLeft,
	    y = e.clientY - rect.top - container.clientTop,
	    xy = [Math.round(x), Math.round(y)];
	return xy;
}

export function clearCanvas(canvasList, ratio) {
	canvasList.forEach(function (each) {
		each.setTransform(1, 0, 0, 1, 0, 0);
		each.clearRect(-1, -1, each.canvas.width + 2, each.canvas.height + 2);
		each.scale(ratio, ratio);
	});
}

export function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export function hexToRGBA(inputHex, opacity) {
	var hex = inputHex.replace("#", "");
	if (inputHex.indexOf("#") > -1 && (hex.length === 3 || hex.length === 6)) {

		var multiplier = hex.length === 3 ? 1 : 2;

		var r = parseInt(hex.substring(0, 1 * multiplier), 16);
		var g = parseInt(hex.substring(1 * multiplier, 2 * multiplier), 16);
		var b = parseInt(hex.substring(2 * multiplier, 3 * multiplier), 16);

		var result = "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";

		return result;
	}
	return inputHex;
}

export function toObject(array) {
	var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;

	return array.reduce(function (returnObj, a) {
		var _iteratee = iteratee(a),
		    _iteratee2 = _slicedToArray(_iteratee, 2),
		    key = _iteratee2[0],
		    value = _iteratee2[1];

		return _extends({}, returnObj, _defineProperty({}, key, value));
	}, {});
}

// copied from https://github.com/lodash/lodash/blob/master/mapValue.js
export function mapValue(object, iteratee) {
	object = Object(object);
	// eslint-disable-next-line prefer-const
	var result = {};

	Object.keys(object).forEach(function (key) {
		var mappedValue = iteratee(object[key], key, object);

		if (isDefined(mappedValue)) {
			result[key] = mappedValue;
		}
	});
	return result;
}

// copied from https://github.com/lodash/lodash/blob/master/mapObject.js
export function mapObject() {
	var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;

	var props = Object.keys(object);

	// eslint-disable-next-line prefer-const
	var result = new Array(props.length);

	props.forEach(function (key, index) {
		result[index] = iteratee(object[key], key, object);
	});
	return result;
}

export function replaceAtIndex(array, index, value) {
	if (isDefined(array) && array.length > index) {
		return array.slice(0, index).concat(value).concat(array.slice(index + 1));
	}
	return array;
}

// copied from https://github.com/lodash/lodash/blob/master/forOwn.js
export function forOwn(obj, iteratee) {
	var object = Object(obj);
	Object.keys(object).forEach(function (key) {
		return iteratee(object[key], key, object);
	});
}
//# sourceMappingURL=index.js.map