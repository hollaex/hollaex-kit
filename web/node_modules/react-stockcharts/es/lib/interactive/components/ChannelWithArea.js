var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { path as d3Path } from "d3-path";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";
import { generateLine, isHovering } from "./StraightLine";

import { isDefined, isNotDefined, noop, hexToRGBA } from "../../utils";

var ChannelWithArea = function (_Component) {
	_inherits(ChannelWithArea, _Component);

	function ChannelWithArea(props) {
		_classCallCheck(this, ChannelWithArea);

		var _this = _possibleConstructorReturn(this, (ChannelWithArea.__proto__ || Object.getPrototypeOf(ChannelWithArea)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(ChannelWithArea, [{
		key: "isHover",
		value: function isHover(moreProps) {
			var _props = this.props,
			    tolerance = _props.tolerance,
			    onHover = _props.onHover;


			if (isDefined(onHover)) {
				var _helper = helper(this.props, moreProps),
				    lines = _helper.lines,
				    line1 = _helper.line1,
				    line2 = _helper.line2;

				if (isDefined(line1) && isDefined(line2)) {
					var mouseXY = moreProps.mouseXY,
					    xScale = moreProps.xScale,
					    yScale = moreProps.chartConfig.yScale;


					var line1Hovering = isHovering({
						x1Value: lines.line1.x1,
						y1Value: lines.line1.y1,
						x2Value: lines.line1.x2,
						y2Value: lines.line1.y2,
						type: "LINE",
						mouseXY: mouseXY,
						tolerance: tolerance,
						xScale: xScale,
						yScale: yScale
					});
					var line2Hovering = isHovering({
						x1Value: lines.line2.x1,
						y1Value: lines.line2.y1,
						x2Value: lines.line2.x2,
						y2Value: lines.line2.y2,
						type: "LINE",
						mouseXY: mouseXY,
						tolerance: tolerance,
						xScale: xScale,
						yScale: yScale
					});

					return line1Hovering || line2Hovering;
				}
			}
			return false;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props2 = this.props,
			    stroke = _props2.stroke,
			    strokeWidth = _props2.strokeWidth,
			    fillOpacity = _props2.fillOpacity,
			    strokeOpacity = _props2.strokeOpacity,
			    fill = _props2.fill;

			var _helper2 = helper(this.props, moreProps),
			    line1 = _helper2.line1,
			    line2 = _helper2.line2;

			if (isDefined(line1)) {
				var x1 = line1.x1,
				    y1 = line1.y1,
				    x2 = line1.x2,
				    y2 = line1.y2;


				ctx.lineWidth = strokeWidth;
				ctx.strokeStyle = hexToRGBA(stroke, strokeOpacity);

				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
				if (isDefined(line2)) {
					var line2Y1 = line2.y1,
					    line2Y2 = line2.y2;


					ctx.beginPath();
					ctx.moveTo(x1, line2Y1);
					ctx.lineTo(x2, line2Y2);
					ctx.stroke();

					ctx.fillStyle = hexToRGBA(fill, fillOpacity);
					ctx.beginPath();
					ctx.moveTo(x1, y1);

					ctx.lineTo(x2, y2);
					ctx.lineTo(x2, line2Y2);
					ctx.lineTo(x1, line2Y1);

					ctx.closePath();
					ctx.fill();
				}
			}
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props3 = this.props,
			    stroke = _props3.stroke,
			    strokeWidth = _props3.strokeWidth,
			    fillOpacity = _props3.fillOpacity,
			    fill = _props3.fill,
			    strokeOpacity = _props3.strokeOpacity;

			var _helper3 = helper(this.props, moreProps),
			    line1 = _helper3.line1,
			    line2 = _helper3.line2;

			if (isDefined(line1)) {
				var x1 = line1.x1,
				    y1 = line1.y1,
				    x2 = line1.x2,
				    y2 = line1.y2;

				var line = isDefined(line2) ? React.createElement("line", {
					strokeWidth: strokeWidth,
					stroke: stroke,
					strokeOpacity: strokeOpacity,
					x1: x1,
					y1: line2.y1,
					x2: x2,
					y2: line2.y2
				}) : null;
				var area = isDefined(line2) ? React.createElement("path", {
					fill: fill,
					fillOpacity: fillOpacity,
					d: getPath(line1, line2)
				}) : null;

				return React.createElement(
					"g",
					null,
					React.createElement("line", {
						strokeWidth: strokeWidth,
						stroke: stroke,
						strokeOpacity: strokeOpacity,
						x1: x1,
						y1: y1,
						x2: x2,
						y2: y2
					}),
					line,
					area
				);
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props4 = this.props,
			    selected = _props4.selected,
			    interactiveCursorClass = _props4.interactiveCursorClass;
			var _props5 = this.props,
			    onDragStart = _props5.onDragStart,
			    onDrag = _props5.onDrag,
			    onDragComplete = _props5.onDragComplete,
			    onHover = _props5.onHover,
			    onUnHover = _props5.onUnHover;


			return React.createElement(GenericChartComponent, {
				isHover: this.isHover,

				svgDraw: this.renderSVG,
				canvasToDraw: getMouseCanvas,
				canvasDraw: this.drawOnCanvas,

				interactiveCursorClass: interactiveCursorClass,
				selected: selected,

				onDragStart: onDragStart,
				onDrag: onDrag,
				onDragComplete: onDragComplete,
				onHover: onHover,
				onUnHover: onUnHover,

				drawOn: ["mousemove", "mouseleave", "pan", "drag"]
			});
		}
	}]);

	return ChannelWithArea;
}(Component);

function getPath(line1, line2) {
	var ctx = d3Path();
	ctx.moveTo(line1.x1, line1.y1);
	ctx.lineTo(line1.x2, line1.y2);
	ctx.lineTo(line1.x2, line2.y2);
	ctx.lineTo(line1.x1, line2.y1);

	ctx.closePath();
	return ctx.toString();
}

function getLines(props, moreProps) {
	var startXY = props.startXY,
	    endXY = props.endXY,
	    dy = props.dy,
	    type = props.type;
	var xScale = moreProps.xScale;


	if (isNotDefined(startXY) || isNotDefined(endXY)) {
		return {};
	}
	var line1 = generateLine({
		type: type,
		start: startXY,
		end: endXY,
		xScale: xScale
	});
	var line2 = isDefined(dy) ? _extends({}, line1, {
		y1: line1.y1 + dy,
		y2: line1.y2 + dy
	}) : undefined;

	return {
		line1: line1,
		line2: line2
	};
}

function helper(props, moreProps) {
	var lines = getLines(props, moreProps);
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale;


	var x1 = xScale(lines.line1.x1);
	var y1 = yScale(lines.line1.y1);
	var x2 = xScale(lines.line1.x2);
	var y2 = yScale(lines.line1.y2);

	var line2 = isDefined(lines.line2) ? {
		x1: x1,
		y1: yScale(lines.line2.y1),
		x2: x2,
		y2: yScale(lines.line2.y2)
	} : undefined;

	return {
		lines: lines,
		line1: {
			x1: x1, y1: y1, x2: x2, y2: y2
		},
		line2: line2
	};
}

ChannelWithArea.propTypes = {
	interactiveCursorClass: PropTypes.string,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	fillOpacity: PropTypes.number.isRequired,
	strokeOpacity: PropTypes.number.isRequired,

	type: PropTypes.oneOf(["XLINE", // extends from -Infinity to +Infinity
	"RAY", // extends to +/-Infinity in one direction
	"LINE"] // extends between the set bounds
	).isRequired,

	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,

	defaultClassName: PropTypes.string,

	tolerance: PropTypes.number.isRequired,
	selected: PropTypes.bool.isRequired
};

ChannelWithArea.defaultProps = {
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,
	type: "LINE",

	strokeWidth: 1,
	tolerance: 4,
	selected: false
};

export default ChannelWithArea;
//# sourceMappingURL=ChannelWithArea.js.map