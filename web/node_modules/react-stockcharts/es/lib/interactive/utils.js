var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { isNotDefined, isDefined, mapObject, find } from "../utils";

export function getValueFromOverride(override, index, key, defaultValue) {
	if (isDefined(override) && override.index === index) return override[key];
	return defaultValue;
}

export function terminate() {
	this.setState({
		current: null,
		override: null
	});
}

export function saveNodeType(type) {
	var _this = this;

	return function (node) {
		if (isNotDefined(node) && isDefined(_this.nodes[type])) {
			delete _this.nodes[type];
		} else {
			_this.nodes[type] = node;
		}
		// console.error(this.nodes)
	};
}
export function isHoverForInteractiveType(interactiveType) {
	return function (moreProps) {
		// this has to be function as it is bound to this

		if (isDefined(this.nodes)) {
			var selecedNodes = this.nodes.map(function (node) {
				return node.isHover(moreProps);
			});
			var interactive = this.props[interactiveType].map(function (t, idx) {
				return _extends({}, t, {
					selected: selecedNodes[idx]
				});
			});
			return interactive;
		}
	};
}

export function isHover(moreProps) {
	var hovering = mapObject(this.nodes, function (node) {
		return node.isHover(moreProps);
	}).reduce(function (a, b) {
		return a || b;
	});
	return hovering;
}

function getMouseXY(moreProps, _ref) {
	var _ref2 = _slicedToArray(_ref, 2),
	    ox = _ref2[0],
	    oy = _ref2[1];

	if (Array.isArray(moreProps.mouseXY)) {
		var _moreProps$mouseXY = _slicedToArray(moreProps.mouseXY, 2),
		    x = _moreProps$mouseXY[0],
		    y = _moreProps$mouseXY[1];

		var mouseXY = [x - ox, y - oy];
		return mouseXY;
	}
	return moreProps.mouseXY;
}

export function getMorePropsForChart(moreProps, chartId) {
	var chartConfigList = moreProps.chartConfig;

	var chartConfig = find(chartConfigList, function (each) {
		return each.id === chartId;
	});

	var origin = chartConfig.origin;

	var mouseXY = getMouseXY(moreProps, origin);
	return _extends({}, moreProps, {
		chartConfig: chartConfig,
		mouseXY: mouseXY
	});
}

export function getSelected(interactives) {
	var selected = interactives.map(function (each) {
		var objects = each.objects.filter(function (obj) {
			return obj.selected;
		});
		return _extends({}, each, {
			objects: objects
		});
	}).filter(function (each) {
		return each.objects.length > 0;
	});
	return selected;
}
//# sourceMappingURL=utils.js.map