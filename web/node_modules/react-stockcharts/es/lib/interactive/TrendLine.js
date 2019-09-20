var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop, strokeDashTypes } from "../utils";

import { getValueFromOverride, terminate, saveNodeType, isHoverForInteractiveType } from "./utils";

import EachTrendLine from "./wrapper/EachTrendLine";
import StraightLine from "./components/StraightLine";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

var TrendLine = function (_Component) {
	_inherits(TrendLine, _Component);

	function TrendLine(props) {
		_classCallCheck(this, TrendLine);

		var _this = _possibleConstructorReturn(this, (TrendLine.__proto__ || Object.getPrototypeOf(TrendLine)).call(this, props));

		_this.handleStart = _this.handleStart.bind(_this);
		_this.handleEnd = _this.handleEnd.bind(_this);
		_this.handleDrawLine = _this.handleDrawLine.bind(_this);
		_this.handleDragLine = _this.handleDragLine.bind(_this);
		_this.handleDragLineComplete = _this.handleDragLineComplete.bind(_this);

		_this.terminate = terminate.bind(_this);
		_this.saveNodeType = saveNodeType.bind(_this);

		_this.getSelectionState = isHoverForInteractiveType("trends").bind(_this);

		_this.state = {};
		_this.nodes = [];
		return _this;
	}

	_createClass(TrendLine, [{
		key: "handleDragLine",
		value: function handleDragLine(index, newXYValue) {
			this.setState({
				override: _extends({
					index: index
				}, newXYValue)
			});
		}
	}, {
		key: "handleDragLineComplete",
		value: function handleDragLineComplete(moreProps) {
			var _this2 = this;

			var override = this.state.override;

			if (isDefined(override)) {
				var trends = this.props.trends;

				var newTrends = trends.map(function (each, idx) {
					return idx === override.index ? _extends({}, each, {
						start: [override.x1Value, override.y1Value],
						end: [override.x2Value, override.y2Value],
						selected: true
					}) : _extends({}, each, {
						selected: false
					});
				});

				this.setState({
					override: null
				}, function () {
					_this2.props.onComplete(newTrends, moreProps);
				});
			}
		}
	}, {
		key: "handleDrawLine",
		value: function handleDrawLine(xyValue) {
			var current = this.state.current;

			if (isDefined(current) && isDefined(current.start)) {
				this.mouseMoved = true;
				this.setState({
					current: {
						start: current.start,
						end: xyValue
					}
				});
			}
		}
	}, {
		key: "handleStart",
		value: function handleStart(xyValue, moreProps, e) {
			var _this3 = this;

			var current = this.state.current;


			if (isNotDefined(current) || isNotDefined(current.start)) {
				this.mouseMoved = false;

				this.setState({
					current: {
						start: xyValue,
						end: null
					}
				}, function () {
					_this3.props.onStart(moreProps, e);
				});
			}
		}
	}, {
		key: "handleEnd",
		value: function handleEnd(xyValue, moreProps, e) {
			var _this4 = this;

			var current = this.state.current;
			var _props = this.props,
			    trends = _props.trends,
			    appearance = _props.appearance,
			    type = _props.type;


			if (this.mouseMoved && isDefined(current) && isDefined(current.start)) {
				var newTrends = [].concat(_toConsumableArray(trends.map(function (d) {
					return _extends({}, d, { selected: false });
				})), [{
					start: current.start,
					end: xyValue,
					selected: true,
					appearance: appearance,
					type: type
				}]);
				this.setState({
					current: null,
					trends: newTrends
				}, function () {
					_this4.props.onComplete(newTrends, moreProps, e);
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var appearance = this.props.appearance;
			var _props2 = this.props,
			    enabled = _props2.enabled,
			    snap = _props2.snap,
			    shouldDisableSnap = _props2.shouldDisableSnap,
			    snapTo = _props2.snapTo,
			    type = _props2.type;
			var _props3 = this.props,
			    currentPositionRadius = _props3.currentPositionRadius,
			    currentPositionStroke = _props3.currentPositionStroke;
			var _props4 = this.props,
			    currentPositionstrokeOpacity = _props4.currentPositionstrokeOpacity,
			    currentPositionStrokeWidth = _props4.currentPositionStrokeWidth;
			var _props5 = this.props,
			    hoverText = _props5.hoverText,
			    trends = _props5.trends;
			var _state = this.state,
			    current = _state.current,
			    override = _state.override;


			var tempLine = isDefined(current) && isDefined(current.end) ? React.createElement(StraightLine, { type: type,
				noHover: true,
				x1Value: current.start[0],
				y1Value: current.start[1],
				x2Value: current.end[0],
				y2Value: current.end[1],
				stroke: appearance.stroke,
				strokeWidth: appearance.strokeWidth,
				strokeOpacity: appearance.strokeOpacity }) : null;

			return React.createElement(
				"g",
				null,
				trends.map(function (each, idx) {
					var eachAppearance = isDefined(each.appearance) ? _extends({}, appearance, each.appearance) : appearance;

					var hoverTextWithDefault = _extends({}, TrendLine.defaultProps.hoverText, hoverText);

					return React.createElement(EachTrendLine, { key: idx,
						ref: _this5.saveNodeType(idx),
						index: idx,
						type: each.type,
						selected: each.selected,
						x1Value: getValueFromOverride(override, idx, "x1Value", each.start[0]),
						y1Value: getValueFromOverride(override, idx, "y1Value", each.start[1]),
						x2Value: getValueFromOverride(override, idx, "x2Value", each.end[0]),
						y2Value: getValueFromOverride(override, idx, "y2Value", each.end[1]),
						stroke: eachAppearance.stroke,
						strokeWidth: eachAppearance.strokeWidth,
						strokeOpacity: eachAppearance.strokeOpacity,
						strokeDasharray: eachAppearance.strokeDasharray,
						edgeStroke: eachAppearance.edgeStroke,
						edgeFill: eachAppearance.edgeFill,
						edgeStrokeWidth: eachAppearance.edgeStrokeWidth,
						r: eachAppearance.r,
						hoverText: hoverTextWithDefault,
						onDrag: _this5.handleDragLine,
						onDragComplete: _this5.handleDragLineComplete,
						edgeInteractiveCursor: "react-stockcharts-move-cursor",
						lineInteractiveCursor: "react-stockcharts-move-cursor"
					});
				}),
				tempLine,
				React.createElement(MouseLocationIndicator, {
					enabled: enabled,
					snap: snap,
					shouldDisableSnap: shouldDisableSnap,
					snapTo: snapTo,
					r: currentPositionRadius,
					stroke: currentPositionStroke,
					strokeOpacity: currentPositionstrokeOpacity,
					strokeWidth: currentPositionStrokeWidth,
					onMouseDown: this.handleStart,
					onClick: this.handleEnd,
					onMouseMove: this.handleDrawLine
				})
			);
		}
	}]);

	return TrendLine;
}(Component);

TrendLine.propTypes = {
	snap: PropTypes.bool.isRequired,
	enabled: PropTypes.bool.isRequired,
	snapTo: PropTypes.func,
	shouldDisableSnap: PropTypes.func.isRequired,

	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionstrokeOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,
	type: PropTypes.oneOf(["XLINE", // extends from -Infinity to +Infinity
	"RAY", // extends to +/-Infinity in one direction
	"LINE"] // extends between the set bounds
	),
	hoverText: PropTypes.object.isRequired,

	trends: PropTypes.array.isRequired,

	appearance: PropTypes.shape({
		stroke: PropTypes.string.isRequired,
		strokeOpacity: PropTypes.number.isRequired,
		strokeWidth: PropTypes.number.isRequired,
		strokeDasharray: PropTypes.oneOf(strokeDashTypes),
		edgeStrokeWidth: PropTypes.number.isRequired,
		edgeFill: PropTypes.string.isRequired,
		edgeStroke: PropTypes.string.isRequired
	}).isRequired
};

TrendLine.defaultProps = {
	type: "XLINE",

	onStart: noop,
	onComplete: noop,
	onSelect: noop,

	currentPositionStroke: "#000000",
	currentPositionstrokeOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 0,

	shouldDisableSnap: function shouldDisableSnap(e) {
		return e.button === 2 || e.shiftKey;
	},
	hoverText: _extends({}, HoverTextNearMouse.defaultProps, {
		enable: true,
		bgHeight: "auto",
		bgWidth: "auto",
		text: "Click to select object",
		selectedText: ""
	}),
	trends: [],

	appearance: {
		stroke: "#000000",
		strokeOpacity: 1,
		strokeWidth: 1,
		strokeDasharray: "Solid",
		edgeStrokeWidth: 1,
		edgeFill: "#FFFFFF",
		edgeStroke: "#000000",
		r: 6
	}
};

export default TrendLine;
//# sourceMappingURL=TrendLine.js.map