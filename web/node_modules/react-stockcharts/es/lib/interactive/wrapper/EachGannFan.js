var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop } from "../../utils";
import { getXValue } from "../../utils/ChartDataUtil";
import { saveNodeType, isHover } from "../utils";

import ClickableCircle from "../components/ClickableCircle";
import GannFan from "../components/GannFan";
import HoverTextNearMouse from "../components/HoverTextNearMouse";

var EachGannFan = function (_Component) {
	_inherits(EachGannFan, _Component);

	function EachGannFan(props) {
		_classCallCheck(this, EachGannFan);

		var _this = _possibleConstructorReturn(this, (EachGannFan.__proto__ || Object.getPrototypeOf(EachGannFan)).call(this, props));

		_this.handleLine1Edge1Drag = _this.handleLine1Edge1Drag.bind(_this);
		_this.handleLine1Edge2Drag = _this.handleLine1Edge2Drag.bind(_this);

		_this.handleDragStart = _this.handleDragStart.bind(_this);
		_this.handleFanDrag = _this.handleFanDrag.bind(_this);

		_this.handleChannelHeightChange = _this.handleChannelHeightChange.bind(_this);

		_this.handleHover = _this.handleHover.bind(_this);
		_this.getEdgeCircle = _this.getEdgeCircle.bind(_this);

		_this.isHover = isHover.bind(_this);
		_this.saveNodeType = saveNodeType.bind(_this);
		_this.nodes = {};

		_this.state = {
			hover: false
		};
		return _this;
	}

	_createClass(EachGannFan, [{
		key: "handleHover",
		value: function handleHover(moreProps) {
			if (this.state.hover !== moreProps.hovering) {
				this.setState({
					hover: moreProps.hovering
				});
			}
		}
	}, {
		key: "handleDragStart",
		value: function handleDragStart() {
			var _props = this.props,
			    startXY = _props.startXY,
			    endXY = _props.endXY,
			    dy = _props.dy;


			this.dragStart = {
				startXY: startXY, endXY: endXY, dy: dy
			};
		}
	}, {
		key: "handleFanDrag",
		value: function handleFanDrag(moreProps) {
			var _props2 = this.props,
			    index = _props2.index,
			    onDrag = _props2.onDrag;
			var _dragStart = this.dragStart,
			    startXY = _dragStart.startXY,
			    endXY = _dragStart.endXY;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    xAccessor = moreProps.xAccessor,
			    fullData = moreProps.fullData;
			var startPos = moreProps.startPos,
			    mouseXY = moreProps.mouseXY;


			var x1 = xScale(startXY[0]);
			var y1 = yScale(startXY[1]);
			var x2 = xScale(endXY[0]);
			var y2 = yScale(endXY[1]);

			var dx = startPos[0] - mouseXY[0];
			var dy = startPos[1] - mouseXY[1];

			var newX1Value = getXValue(xScale, xAccessor, [x1 - dx, y1 - dy], fullData);
			var newY1Value = yScale.invert(y1 - dy);
			var newX2Value = getXValue(xScale, xAccessor, [x2 - dx, y2 - dy], fullData);
			var newY2Value = yScale.invert(y2 - dy);

			// const newDy = newY2Value - endXY[1] + this.dragStart.dy;

			onDrag(index, {
				startXY: [newX1Value, newY1Value],
				endXY: [newX2Value, newY2Value],
				dy: this.dragStart.dy
			});
		}
	}, {
		key: "handleLine1Edge1Drag",
		value: function handleLine1Edge1Drag(moreProps) {
			var _props3 = this.props,
			    index = _props3.index,
			    onDrag = _props3.onDrag;
			var startXY = this.dragStart.startXY;
			var startPos = moreProps.startPos,
			    mouseXY = moreProps.mouseXY,
			    xAccessor = moreProps.xAccessor,
			    xScale = moreProps.xScale,
			    fullData = moreProps.fullData,
			    yScale = moreProps.chartConfig.yScale;


			var dx = startPos[0] - mouseXY[0];
			var dy = startPos[1] - mouseXY[1];

			var x1 = xScale(startXY[0]);
			var y1 = yScale(startXY[1]);

			var newX1Value = getXValue(xScale, xAccessor, [x1 - dx, y1 - dy], fullData);
			var newY1Value = yScale.invert(y1 - dy);

			onDrag(index, {
				startXY: [newX1Value, newY1Value],
				endXY: this.dragStart.endXY,
				dy: this.dragStart.dy
			});
		}
	}, {
		key: "handleLine1Edge2Drag",
		value: function handleLine1Edge2Drag(moreProps) {
			var _props4 = this.props,
			    index = _props4.index,
			    onDrag = _props4.onDrag;
			var endXY = this.dragStart.endXY;
			var startPos = moreProps.startPos,
			    mouseXY = moreProps.mouseXY,
			    xAccessor = moreProps.xAccessor,
			    xScale = moreProps.xScale,
			    fullData = moreProps.fullData,
			    yScale = moreProps.chartConfig.yScale;


			var dx = startPos[0] - mouseXY[0];
			var dy = startPos[1] - mouseXY[1];

			var x1 = xScale(endXY[0]);
			var y1 = yScale(endXY[1]);

			var newX1Value = getXValue(xScale, xAccessor, [x1 - dx, y1 - dy], fullData);
			var newY1Value = yScale.invert(y1 - dy);

			onDrag(index, {
				startXY: this.dragStart.startXY,
				endXY: [newX1Value, newY1Value],
				dy: this.dragStart.dy
			});
		}
	}, {
		key: "handleChannelHeightChange",
		value: function handleChannelHeightChange(moreProps) {
			var _props5 = this.props,
			    index = _props5.index,
			    onDrag = _props5.onDrag;
			var _dragStart2 = this.dragStart,
			    startXY = _dragStart2.startXY,
			    endXY = _dragStart2.endXY;
			var yScale = moreProps.chartConfig.yScale;
			var startPos = moreProps.startPos,
			    mouseXY = moreProps.mouseXY;


			var y2 = yScale(endXY[1]);

			var dy = startPos[1] - mouseXY[1];

			var newY2Value = yScale.invert(y2 - dy);

			var newDy = newY2Value - endXY[1] + this.dragStart.dy;

			onDrag(index, {
				startXY: startXY,
				endXY: endXY,
				dy: newDy
			});
		}
	}, {
		key: "getEdgeCircle",
		value: function getEdgeCircle(_ref) {
			var xy = _ref.xy,
			    dragHandler = _ref.dragHandler,
			    cursor = _ref.cursor,
			    fill = _ref.fill,
			    edge = _ref.edge;
			var hover = this.state.hover;
			var _props6 = this.props,
			    selected = _props6.selected,
			    appearance = _props6.appearance;
			var edgeStroke = appearance.edgeStroke,
			    edgeStrokeWidth = appearance.edgeStrokeWidth,
			    r = appearance.r;
			var onDragComplete = this.props.onDragComplete;


			return React.createElement(ClickableCircle, {
				ref: this.saveNodeType(edge),
				show: selected || hover,
				cx: xy[0],
				cy: xy[1],
				r: r,
				fill: fill,
				stroke: edgeStroke,
				strokeWidth: edgeStrokeWidth,
				interactiveCursorClass: cursor,

				onDragStart: this.handleDragStart,
				onDrag: dragHandler,
				onDragComplete: onDragComplete });
		}
	}, {
		key: "render",
		value: function render() {
			var _props7 = this.props,
			    startXY = _props7.startXY,
			    endXY = _props7.endXY;
			var _props8 = this.props,
			    interactive = _props8.interactive,
			    appearance = _props8.appearance;
			var edgeFill = appearance.edgeFill,
			    stroke = appearance.stroke,
			    strokeWidth = appearance.strokeWidth,
			    strokeOpacity = appearance.strokeOpacity,
			    fill = appearance.fill,
			    fillOpacity = appearance.fillOpacity;
			var fontFamily = appearance.fontFamily,
			    fontSize = appearance.fontSize,
			    fontFill = appearance.fontFill;
			var _props9 = this.props,
			    hoverText = _props9.hoverText,
			    selected = _props9.selected;
			var onDragComplete = this.props.onDragComplete;
			var hover = this.state.hover;

			var hoverTextEnabled = hoverText.enable,
			    restHoverTextProps = _objectWithoutProperties(hoverText, ["enable"]);

			var hoverHandler = interactive ? { onHover: this.handleHover, onUnHover: this.handleHover } : {};

			var line1Edge = isDefined(startXY) && isDefined(endXY) ? React.createElement(
				"g",
				null,
				this.getEdgeCircle({
					xy: startXY,
					dragHandler: this.handleLine1Edge1Drag,
					cursor: "react-stockcharts-move-cursor",
					fill: edgeFill,
					edge: "edge1"
				}),
				this.getEdgeCircle({
					xy: endXY,
					dragHandler: this.handleLine1Edge2Drag,
					cursor: "react-stockcharts-move-cursor",
					fill: edgeFill,
					edge: "edge2"
				})
			) : null;

			return React.createElement(
				"g",
				null,
				React.createElement(GannFan, _extends({
					ref: this.saveNodeType("fan"),
					selected: hover || selected

				}, hoverHandler, {

					startXY: startXY,
					endXY: endXY,
					stroke: stroke,
					strokeWidth: hover || selected ? strokeWidth + 1 : strokeWidth,
					fill: fill,
					strokeOpacity: strokeOpacity,
					fillOpacity: fillOpacity,
					fontFamily: fontFamily,
					fontSize: fontSize,
					fontFill: fontFill,
					interactiveCursorClass: "react-stockcharts-move-cursor",

					onDragStart: this.handleDragStart,
					onDrag: this.handleFanDrag,
					onDragComplete: onDragComplete
				})),
				line1Edge,
				React.createElement(HoverTextNearMouse, _extends({
					show: hoverTextEnabled && hover && !selected
				}, restHoverTextProps))
			);
		}
	}]);

	return EachGannFan;
}(Component);

EachGannFan.propTypes = {
	startXY: PropTypes.arrayOf(PropTypes.number).isRequired,
	endXY: PropTypes.arrayOf(PropTypes.number).isRequired,
	dy: PropTypes.number,

	interactive: PropTypes.bool.isRequired,
	selected: PropTypes.bool.isRequired,

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

	index: PropTypes.number,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired
};

EachGannFan.defaultProps = {
	yDisplayFormat: function yDisplayFormat(d) {
		return d.toFixed(2);
	},
	interactive: true,
	selected: false,

	appearance: {
		stroke: "#000000",
		fillOpacity: 0.2,
		strokeOpacity: 1,
		strokeWidth: 1,
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		edgeStrokeWidth: 1,
		r: 5,
		fill: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f"],
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 10,
		fontFill: "#000000"
	},

	onDrag: noop,
	onDragComplete: noop,

	hoverText: _extends({}, HoverTextNearMouse.defaultProps, {
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object"
	})
};

export default EachGannFan;
//# sourceMappingURL=EachGannFan.js.map