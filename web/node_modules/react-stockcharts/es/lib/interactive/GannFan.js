var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";
import { terminate, saveNodeType, isHoverForInteractiveType } from "./utils";
import EachGannFan from "./wrapper/EachGannFan";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

var GannFan = function (_Component) {
	_inherits(GannFan, _Component);

	function GannFan(props) {
		_classCallCheck(this, GannFan);

		var _this = _possibleConstructorReturn(this, (GannFan.__proto__ || Object.getPrototypeOf(GannFan)).call(this, props));

		_this.handleStart = _this.handleStart.bind(_this);
		_this.handleEnd = _this.handleEnd.bind(_this);
		_this.handleDrawFan = _this.handleDrawFan.bind(_this);
		_this.handleDragFan = _this.handleDragFan.bind(_this);
		_this.handleDragFanComplete = _this.handleDragFanComplete.bind(_this);

		_this.terminate = terminate.bind(_this);
		_this.saveNodeType = saveNodeType.bind(_this);

		_this.getSelectionState = isHoverForInteractiveType("fans").bind(_this);

		_this.nodes = [];
		_this.state = {};
		return _this;
	}

	_createClass(GannFan, [{
		key: "handleDragFan",
		value: function handleDragFan(index, newXYValue) {
			this.setState({
				override: _extends({
					index: index
				}, newXYValue)
			});
		}
	}, {
		key: "handleDragFanComplete",
		value: function handleDragFanComplete(moreProps) {
			var _this2 = this;

			var override = this.state.override;
			var fans = this.props.fans;


			if (isDefined(override)) {
				var index = override.index,
				    rest = _objectWithoutProperties(override, ["index"]);

				var newfans = fans.map(function (each, idx) {
					return idx === index ? _extends({}, each, rest, { selected: true }) : each;
				});
				this.setState({
					override: null
				}, function () {
					_this2.props.onComplete(newfans, moreProps);
				});
			}
		}
	}, {
		key: "handleDrawFan",
		value: function handleDrawFan(xyValue) {
			var current = this.state.current;


			if (isDefined(current) && isDefined(current.startXY)) {
				this.mouseMoved = true;

				this.setState({
					current: {
						startXY: current.startXY,
						endXY: xyValue
					}
				});
			}
		}
	}, {
		key: "handleStart",
		value: function handleStart(xyValue) {
			var _this3 = this;

			var current = this.state.current;


			if (isNotDefined(current) || isNotDefined(current.startXY)) {
				this.mouseMoved = false;

				this.setState({
					current: {
						startXY: xyValue,
						endXY: null
					}
				}, function () {
					_this3.props.onStart();
				});
			}
		}
	}, {
		key: "handleEnd",
		value: function handleEnd(xyValyue, moreProps, e) {
			var _this4 = this;

			var current = this.state.current;
			var _props = this.props,
			    fans = _props.fans,
			    appearance = _props.appearance;


			if (this.mouseMoved && isDefined(current) && isDefined(current.startXY)) {
				var newfans = [].concat(_toConsumableArray(fans.map(function (d) {
					return _extends({}, d, { selected: false });
				})), [_extends({}, current, { selected: true, appearance: appearance })]);
				this.setState({
					current: null
				}, function () {
					_this4.props.onComplete(newfans, moreProps, e);
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var _props2 = this.props,
			    enabled = _props2.enabled,
			    appearance = _props2.appearance;
			var _props3 = this.props,
			    currentPositionRadius = _props3.currentPositionRadius,
			    currentPositionStroke = _props3.currentPositionStroke;
			var _props4 = this.props,
			    currentPositionOpacity = _props4.currentPositionOpacity,
			    currentPositionStrokeWidth = _props4.currentPositionStrokeWidth;
			var _props5 = this.props,
			    hoverText = _props5.hoverText,
			    fans = _props5.fans;
			var _state = this.state,
			    current = _state.current,
			    override = _state.override;

			var overrideIndex = isDefined(override) ? override.index : null;

			var tempChannel = isDefined(current) && isDefined(current.endXY) ? React.createElement(EachGannFan, _extends({
				interactive: false
			}, current, {
				appearance: appearance,
				hoverText: hoverText
			})) : null;

			return React.createElement(
				"g",
				null,
				fans.map(function (each, idx) {
					var eachAppearance = isDefined(each.appearance) ? _extends({}, appearance, each.appearance) : appearance;

					return React.createElement(EachGannFan, _extends({ key: idx,
						ref: _this5.saveNodeType(idx),
						index: idx,
						selected: each.selected
					}, idx === overrideIndex ? override : each, {
						appearance: eachAppearance,
						hoverText: hoverText,
						onDrag: _this5.handleDragFan,
						onDragComplete: _this5.handleDragFanComplete
					}));
				}),
				tempChannel,
				React.createElement(MouseLocationIndicator, {
					enabled: enabled,
					snap: false,
					r: currentPositionRadius,
					stroke: currentPositionStroke,
					opacity: currentPositionOpacity,
					strokeWidth: currentPositionStrokeWidth,
					onMouseDown: this.handleStart,
					onClick: this.handleEnd,
					onMouseMove: this.handleDrawFan
				})
			);
		}
	}]);

	return GannFan;
}(Component);

GannFan.propTypes = {
	enabled: PropTypes.bool.isRequired,

	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,

	appearance: PropTypes.shape({
		stroke: PropTypes.string.isRequired,
		strokeOpacity: PropTypes.number.isRequired,
		fillOpacity: PropTypes.number.isRequired,
		strokeWidth: PropTypes.number.isRequired,
		edgeStroke: PropTypes.string.isRequired,
		edgeFill: PropTypes.string.isRequired,
		edgeStrokeWidth: PropTypes.number.isRequired,
		r: PropTypes.number.isRequired,
		fill: PropTypes.arrayOf(PropTypes.string).isRequired,
		fontFamily: PropTypes.string.isRequired,
		fontSize: PropTypes.number.isRequired,
		fontFill: PropTypes.string.isRequired
	}).isRequired,
	hoverText: PropTypes.object.isRequired,

	fans: PropTypes.array.isRequired
};

GannFan.defaultProps = {
	appearance: {
		stroke: "#000000",
		fillOpacity: 0.2,
		strokeOpacity: 1,
		strokeWidth: 1,
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		edgeStrokeWidth: 1,
		r: 5,
		fill: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf"],
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 12,
		fontFill: "#000000"
	},

	onStart: noop,
	onComplete: noop,
	onSelect: noop,

	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,

	hoverText: _extends({}, HoverTextNearMouse.defaultProps, {
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object"
	}),
	fans: []
};

export default GannFan;
//# sourceMappingURL=GannFan.js.map