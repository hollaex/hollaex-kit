var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { hexToRGBA, isNotDefined, identity } from "../utils";

function tickTransform_svg_axisX(scale, tick) {
	return [Math.round(scale(tick)), 0];
}

function tickTransform_svg_axisY(scale, tick) {
	return [0, Math.round(scale(tick))];
}

var Tick = function (_Component) {
	_inherits(Tick, _Component);

	function Tick() {
		_classCallCheck(this, Tick);

		return _possibleConstructorReturn(this, (Tick.__proto__ || Object.getPrototypeOf(Tick)).apply(this, arguments));
	}

	_createClass(Tick, [{
		key: "render",
		value: function render() {
			var _props = this.props,
			    transform = _props.transform,
			    tickStroke = _props.tickStroke,
			    tickStrokeOpacity = _props.tickStrokeOpacity,
			    textAnchor = _props.textAnchor,
			    fontSize = _props.fontSize,
			    fontFamily = _props.fontFamily;
			var _props2 = this.props,
			    x = _props2.x,
			    y = _props2.y,
			    x2 = _props2.x2,
			    y2 = _props2.y2,
			    dy = _props2.dy;

			return React.createElement(
				"g",
				{ className: "tick", transform: "translate(" + transform[0] + ", " + transform[1] + ")" },
				React.createElement("line", { shapeRendering: "crispEdges", opacity: tickStrokeOpacity, stroke: tickStroke, x2: x2, y2: y2 }),
				React.createElement(
					"text",
					{
						dy: dy, x: x, y: y,
						fill: tickStroke,
						fontSize: fontSize,
						fontFamily: fontFamily,
						textAnchor: textAnchor },
					this.props.children
				)
			);
		}
	}]);

	return Tick;
}(Component);

Tick.propTypes = {
	transform: PropTypes.arrayOf(Number),
	tickStroke: PropTypes.string,
	tickStrokeOpacity: PropTypes.number,
	textAnchor: PropTypes.string,
	fontSize: PropTypes.number,
	fontFamily: PropTypes.string,
	x: PropTypes.number,
	y: PropTypes.number,
	x2: PropTypes.number,
	y2: PropTypes.number,
	dy: PropTypes.string,
	children: PropTypes.node.isRequired
};

Tick.drawOnCanvasStatic = function (tick, ctx, result) {
	var scale = result.scale,
	    tickTransform = result.tickTransform,
	    canvas_dy = result.canvas_dy,
	    x = result.x,
	    y = result.y,
	    x2 = result.x2,
	    y2 = result.y2,
	    format = result.format;


	var origin = tickTransform(scale, tick);

	ctx.beginPath();

	ctx.moveTo(origin[0], origin[1]);
	ctx.lineTo(origin[0] + x2, origin[1] + y2);
	ctx.stroke();

	ctx.fillText(format(tick), origin[0] + x, origin[1] + y + canvas_dy);
};

var AxisTicks = function (_Component2) {
	_inherits(AxisTicks, _Component2);

	function AxisTicks() {
		_classCallCheck(this, AxisTicks);

		return _possibleConstructorReturn(this, (AxisTicks.__proto__ || Object.getPrototypeOf(AxisTicks)).apply(this, arguments));
	}

	_createClass(AxisTicks, [{
		key: "render",
		value: function render() {
			var result = AxisTicks.helper(this.props, this.props.scale);
			var ticks = result.ticks,
			    scale = result.scale,
			    tickTransform = result.tickTransform,
			    tickStroke = result.tickStroke,
			    tickStrokeOpacity = result.tickStrokeOpacity,
			    dy = result.dy,
			    x = result.x,
			    y = result.y,
			    x2 = result.x2,
			    y2 = result.y2,
			    textAnchor = result.textAnchor,
			    fontSize = result.fontSize,
			    fontFamily = result.fontFamily,
			    format = result.format;


			return React.createElement(
				"g",
				null,
				ticks.map(function (tick, idx) {
					return React.createElement(
						Tick,
						{ key: idx, transform: tickTransform(scale, tick),
							tickStroke: tickStroke, tickStrokeOpacity: tickStrokeOpacity,
							dy: dy, x: x, y: y,
							x2: x2, y2: y2, textAnchor: textAnchor,
							fontSize: fontSize, fontFamily: fontFamily },
						format(tick)
					);
				})
			);
		}
	}]);

	return AxisTicks;
}(Component);

AxisTicks.propTypes = {
	orient: PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
	innerTickSize: PropTypes.number,
	tickFormat: PropTypes.func,
	tickPadding: PropTypes.number,
	ticks: PropTypes.array,
	tickValues: PropTypes.array,
	scale: PropTypes.func.isRequired,
	tickStroke: PropTypes.string,
	tickStrokeOpacity: PropTypes.number
};

AxisTicks.defaultProps = {
	innerTickSize: 5,
	tickPadding: 6,
	ticks: [10],
	tickStroke: "#000",
	tickStrokeOpacity: 1
};

AxisTicks.helper = function (props, scale) {
	var orient = props.orient,
	    innerTickSize = props.innerTickSize,
	    tickFormat = props.tickFormat,
	    tickPadding = props.tickPadding,
	    fontSize = props.fontSize,
	    fontFamily = props.fontFamily;
	var tickArguments = props.ticks,
	    tickValues = props.tickValues,
	    tickStroke = props.tickStroke,
	    tickStrokeOpacity = props.tickStrokeOpacity;


	var ticks = isNotDefined(tickValues) ? scale.ticks ? scale.ticks.apply(scale, _toConsumableArray(tickArguments)) : scale.domain() : tickValues;

	var baseFormat = scale.tickFormat ? scale.tickFormat.apply(scale, _toConsumableArray(tickArguments)) : identity;

	var format = isNotDefined(tickFormat) ? baseFormat : function (d) {
		return baseFormat(d) ? tickFormat(d) : "";
	};

	var sign = orient === "top" || orient === "left" ? -1 : 1;
	var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

	var tickTransform = void 0,
	    x = void 0,
	    y = void 0,
	    x2 = void 0,
	    y2 = void 0,
	    dy = void 0,
	    canvas_dy = void 0,
	    textAnchor = void 0;

	if (orient === "bottom" || orient === "top") {
		tickTransform = tickTransform_svg_axisX;
		x2 = 0;
		y2 = sign * innerTickSize;
		x = 0;
		y = sign * tickSpacing;
		dy = sign < 0 ? "0em" : ".71em";
		canvas_dy = sign < 0 ? 0 : fontSize * .71;
		textAnchor = "middle";
	} else {
		tickTransform = tickTransform_svg_axisY;
		x2 = sign * innerTickSize;
		y2 = 0;
		x = sign * tickSpacing;
		y = 0;
		dy = ".32em";
		canvas_dy = fontSize * .32;
		textAnchor = sign < 0 ? "end" : "start";
	}
	return { ticks: ticks, scale: scale, tickTransform: tickTransform, tickStroke: tickStroke, tickStrokeOpacity: tickStrokeOpacity, dy: dy, canvas_dy: canvas_dy, x: x, y: y, x2: x2, y2: y2, textAnchor: textAnchor, fontSize: fontSize, fontFamily: fontFamily, format: format };
};

AxisTicks.drawOnCanvasStatic = function (props, ctx, xScale, yScale) {
	props = _extends({}, AxisTicks.defaultProps, props);

	var _props3 = props,
	    orient = _props3.orient;

	var xAxis = orient === "bottom" || orient === "top";

	var result = AxisTicks.helper(props, xAxis ? xScale : yScale);

	var tickStroke = result.tickStroke,
	    tickStrokeOpacity = result.tickStrokeOpacity,
	    textAnchor = result.textAnchor,
	    fontSize = result.fontSize,
	    fontFamily = result.fontFamily;


	ctx.strokeStyle = hexToRGBA(tickStroke, tickStrokeOpacity);

	ctx.font = fontSize + "px " + fontFamily;
	ctx.fillStyle = tickStroke;
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;
	// ctx.textBaseline = 'middle';

	result.ticks.forEach(function (tick) {
		Tick.drawOnCanvasStatic(tick, ctx, result);
	});
};

export default AxisTicks;
//# sourceMappingURL=AxisTicks.js.map