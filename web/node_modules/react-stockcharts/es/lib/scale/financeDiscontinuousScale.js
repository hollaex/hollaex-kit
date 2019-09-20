var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { set, map } from "d3-collection";
import { ascending } from "d3-array";
import { scaleLinear } from "d3-scale";

import { isDefined, isNotDefined, head, last } from "../utils";
import { levelDefinition } from "./levels";

var MAX_LEVEL = levelDefinition.length - 1;

export default function financeDiscontinuousScale(index, futureProvider) {
	var backingLinearScale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : scaleLinear();


	if (isNotDefined(index)) throw new Error("Use the discontinuousTimeScaleProvider to create financeDiscontinuousScale");

	function scale(x) {
		return backingLinearScale(x);
	}
	scale.invert = function (x) {
		var inverted = backingLinearScale.invert(x);
		return Math.round(inverted * 10000) / 10000;
	};
	scale.domain = function (x) {
		if (!arguments.length) return backingLinearScale.domain();
		backingLinearScale.domain(x);
		return scale;
	};
	scale.range = function (x) {
		if (!arguments.length) return backingLinearScale.range();
		backingLinearScale.range(x);
		return scale;
	};
	scale.rangeRound = function (x) {
		return backingLinearScale.range(x);
	};
	scale.clamp = function (x) {
		if (!arguments.length) return backingLinearScale.clamp();
		backingLinearScale.clamp(x);
		return scale;
	};
	scale.interpolate = function (x) {
		if (!arguments.length) return backingLinearScale.interpolate();
		backingLinearScale.interpolate(x);
		return scale;
	};
	scale.ticks = function (m, flexTicks) {
		var backingTicks = backingLinearScale.ticks(m);
		var ticksMap = map();

		var _backingLinearScale$d = backingLinearScale.domain(),
		    _backingLinearScale$d2 = _slicedToArray(_backingLinearScale$d, 2),
		    domainStart = _backingLinearScale$d2[0],
		    domainEnd = _backingLinearScale$d2[1];

		var start = Math.max(Math.ceil(domainStart), head(index).index) + Math.abs(head(index).index);
		var end = Math.min(Math.floor(domainEnd), last(index).index) + Math.abs(head(index).index);

		if (Math.floor(domainEnd) > end) {
			// console.log(end, domainEnd, index);
		}

		var desiredTickCount = Math.ceil((end - start) / (domainEnd - domainStart) * backingTicks.length);

		for (var i = MAX_LEVEL; i >= 0; i--) {
			var ticksAtLevel = ticksMap.get(i);
			var temp = isNotDefined(ticksAtLevel) ? [] : ticksAtLevel.slice();

			for (var j = start; j <= end; j++) {
				if (index[j].level === i) {
					temp.push(index[j]);
				}
			}

			ticksMap.set(i, temp);
		}

		var unsortedTicks = [];
		for (var _i = MAX_LEVEL; _i >= 0; _i--) {
			if (ticksMap.get(_i).length + unsortedTicks.length > desiredTickCount * 1.5) break;
			unsortedTicks = unsortedTicks.concat(ticksMap.get(_i).map(function (d) {
				return d.index;
			}));
		}

		var ticks = unsortedTicks.sort(ascending);

		// console.log(backingTicks.length, desiredTickCount, ticks, ticksMap);

		if (!flexTicks && end - start > ticks.length) {
			var ticksSet = set(ticks);

			var d = Math.abs(head(index).index);

			// ignore ticks within this distance
			var distance = Math.ceil((backingTicks.length > 0 ? (last(backingTicks) - head(backingTicks)) / backingTicks.length / 4 : 1) * 1.5);

			for (var _i2 = 0; _i2 < ticks.length - 1; _i2++) {
				for (var _j = _i2 + 1; _j < ticks.length; _j++) {
					if (ticks[_j] - ticks[_i2] <= distance) {
						ticksSet.remove(index[ticks[_i2] + d].level >= index[ticks[_j] + d].level ? ticks[_j] : ticks[_i2]);
					}
				}
			}

			var tickValues = ticksSet.values().map(function (d) {
				return parseInt(d, 10);
			});

			// console.log(ticks.length, tickValues, level);
			// console.log(ticks, tickValues, distance);

			return tickValues;
		}

		return ticks;
	};
	scale.tickFormat = function () {
		return function (x) {
			var d = Math.abs(head(index).index);
			var _index$Math$floor = index[Math.floor(x + d)],
			    format = _index$Math$floor.format,
			    date = _index$Math$floor.date;

			return format(date);
		};
	};
	scale.value = function (x) {
		var d = Math.abs(head(index).index);
		if (isDefined(index[Math.floor(x + d)])) {
			var date = index[Math.floor(x + d)].date;

			return date;
		}
	};
	scale.nice = function (m) {
		backingLinearScale.nice(m);
		return scale;
	};
	scale.index = function (x) {
		if (!arguments.length) return index;
		index = x;
		return scale;
	};
	scale.copy = function () {
		return financeDiscontinuousScale(index, futureProvider, backingLinearScale.copy());
	};
	return scale;
}
//# sourceMappingURL=financeDiscontinuousScale.js.map