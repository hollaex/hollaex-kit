var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { forceSimulation, forceX, forceCollide } from "d3-force";
import { range as d3Range } from "d3-array";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";
import AxisZoomCapture from "./AxisZoomCapture";

import { first, last, hexToRGBA, isNotDefined, isDefined, identity, zipper, strokeDashTypes, getStrokeDasharray } from "../utils";

var Axis = function (_Component) {
	_inherits(Axis, _Component);

	function Axis(props) {
		_classCallCheck(this, Axis);

		var _this = _possibleConstructorReturn(this, (Axis.__proto__ || Object.getPrototypeOf(Axis)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.saveNode = _this.saveNode.bind(_this);
		_this.getMoreProps = _this.getMoreProps.bind(_this);
		return _this;
	}

	_createClass(Axis, [{
		key: "saveNode",
		value: function saveNode(node) {
			this.node = node;
		}
	}, {
		key: "getMoreProps",
		value: function getMoreProps() {
			return this.node.getMoreProps();
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props = this.props,
			    showDomain = _props.showDomain,
			    showTicks = _props.showTicks,
			    transform = _props.transform,
			    range = _props.range,
			    getScale = _props.getScale;


			ctx.save();
			ctx.translate(transform[0], transform[1]);

			if (showDomain) drawAxisLine(ctx, this.props, range);
			if (showTicks) {
				var tickProps = tickHelper(this.props, getScale(moreProps));
				drawTicks(ctx, tickProps);
			}

			ctx.restore();
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var className = this.props.className;
			var _props2 = this.props,
			    showDomain = _props2.showDomain,
			    showTicks = _props2.showTicks,
			    range = _props2.range,
			    getScale = _props2.getScale;


			var ticks = showTicks ? axisTicksSVG(this.props, getScale(moreProps)) : null;
			var domain = showDomain ? axisLineSVG(this.props, range) : null;

			return React.createElement(
				"g",
				{ className: className },
				ticks,
				domain
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _props3 = this.props,
			    bg = _props3.bg,
			    axisZoomCallback = _props3.axisZoomCallback,
			    className = _props3.className,
			    zoomCursorClassName = _props3.zoomCursorClassName,
			    zoomEnabled = _props3.zoomEnabled,
			    getScale = _props3.getScale,
			    inverted = _props3.inverted;
			var _props4 = this.props,
			    transform = _props4.transform,
			    getMouseDelta = _props4.getMouseDelta,
			    edgeClip = _props4.edgeClip;
			var _props5 = this.props,
			    onContextMenu = _props5.onContextMenu,
			    onDoubleClick = _props5.onDoubleClick;


			var zoomCapture = zoomEnabled ? React.createElement(AxisZoomCapture, {
				bg: bg,
				getScale: getScale,
				getMoreProps: this.getMoreProps,
				getMouseDelta: getMouseDelta,
				axisZoomCallback: axisZoomCallback,
				className: className,
				zoomCursorClassName: zoomCursorClassName,
				inverted: inverted,
				onContextMenu: onContextMenu,
				onDoubleClick: onDoubleClick
			}) : null;

			return React.createElement(
				"g",
				{ transform: "translate(" + transform[0] + ", " + transform[1] + ")" },
				zoomCapture,
				React.createElement(GenericChartComponent, { ref: this.saveNode,
					canvasToDraw: getAxisCanvas,
					clip: false,
					edgeClip: edgeClip,
					svgDraw: this.renderSVG,
					canvasDraw: this.drawOnCanvas,
					drawOn: ["pan"]
				})
			);
		}
	}]);

	return Axis;
}(Component);

Axis.propTypes = {
	innerTickSize: PropTypes.number,
	outerTickSize: PropTypes.number,
	tickFormat: PropTypes.func,
	tickPadding: PropTypes.number,
	tickSize: PropTypes.number,
	ticks: PropTypes.number,
	tickLabelFill: PropTypes.string,
	tickStroke: PropTypes.string,
	tickStrokeOpacity: PropTypes.number,
	tickStrokeWidth: PropTypes.number,
	tickStrokeDasharray: PropTypes.oneOf(strokeDashTypes),
	tickValues: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
	tickInterval: PropTypes.number,
	tickIntervalFunction: PropTypes.func,
	showDomain: PropTypes.bool,
	showTicks: PropTypes.bool,
	className: PropTypes.string,
	axisZoomCallback: PropTypes.func,
	zoomEnabled: PropTypes.bool,
	inverted: PropTypes.bool,
	zoomCursorClassName: PropTypes.string,
	transform: PropTypes.arrayOf(PropTypes.number).isRequired,
	range: PropTypes.arrayOf(PropTypes.number).isRequired,
	getMouseDelta: PropTypes.func.isRequired,
	getScale: PropTypes.func.isRequired,
	bg: PropTypes.object.isRequired,
	edgeClip: PropTypes.bool.isRequired,
	onContextMenu: PropTypes.func,
	onDoubleClick: PropTypes.func
};

Axis.defaultProps = {
	zoomEnabled: false,
	zoomCursorClassName: "",
	edgeClip: false
};

function tickHelper(props, scale) {
	var orient = props.orient,
	    innerTickSize = props.innerTickSize,
	    tickFormat = props.tickFormat,
	    tickPadding = props.tickPadding,
	    tickLabelFill = props.tickLabelFill,
	    tickStrokeWidth = props.tickStrokeWidth,
	    tickStrokeDasharray = props.tickStrokeDasharray,
	    fontSize = props.fontSize,
	    fontFamily = props.fontFamily,
	    fontWeight = props.fontWeight,
	    showTicks = props.showTicks,
	    flexTicks = props.flexTicks,
	    showTickLabel = props.showTickLabel;
	var tickArguments = props.ticks,
	    tickValuesProp = props.tickValues,
	    tickStroke = props.tickStroke,
	    tickStrokeOpacity = props.tickStrokeOpacity,
	    tickInterval = props.tickInterval,
	    tickIntervalFunction = props.tickIntervalFunction;

	// if (tickArguments) tickArguments = [tickArguments];

	var tickValues = void 0;
	if (isDefined(tickValuesProp)) {
		if (typeof tickValuesProp === "function") {
			tickValues = tickValuesProp(scale.domain());
		} else {
			tickValues = tickValuesProp;
		}
	} else if (isDefined(tickInterval)) {
		var _scale$domain = scale.domain(),
		    _scale$domain2 = _slicedToArray(_scale$domain, 2),
		    min = _scale$domain2[0],
		    max = _scale$domain2[1];

		var baseTickValues = d3Range(min, max, (max - min) / tickInterval);

		tickValues = tickIntervalFunction ? tickIntervalFunction(min, max, tickInterval) : baseTickValues;
	} else if (isDefined(scale.ticks)) {
		tickValues = scale.ticks(tickArguments, flexTicks);
	} else {
		tickValues = scale.domain();
	}

	var baseFormat = scale.tickFormat ? scale.tickFormat(tickArguments) : identity;

	var format = isNotDefined(tickFormat) ? baseFormat : function (d) {
		return tickFormat(d) || "";
	};

	var sign = orient === "top" || orient === "left" ? -1 : 1;
	var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

	var ticks = void 0,
	    dy = void 0,
	    canvas_dy = void 0,
	    textAnchor = void 0;

	if (orient === "bottom" || orient === "top") {
		dy = sign < 0 ? "0em" : ".71em";
		canvas_dy = sign < 0 ? 0 : fontSize * .71;
		textAnchor = "middle";

		ticks = tickValues.map(function (d) {
			var x = Math.round(scale(d));
			return {
				value: d,
				x1: x,
				y1: 0,
				x2: x,
				y2: sign * innerTickSize,
				labelX: x,
				labelY: sign * tickSpacing
			};
		});

		if (showTicks && flexTicks) {
			// console.log(ticks, showTicks);

			var nodes = ticks.map(function (d) {
				return { id: d.value, value: d.value, fy: d.y2, origX: d.x1 };
			});

			var simulation = forceSimulation(nodes).force("x", forceX(function (d) {
				return d.origX;
			}).strength(1)).force("collide", forceCollide(22))
			// .force("center", forceCenter())
			.stop();

			for (var i = 0; i < 100; ++i) {
				simulation.tick();
			} // console.log(nodes);

			var zip = zipper().combine(function (a, b) {
				if (Math.abs(b.x - b.origX) > 0.01) {
					return _extends({}, a, {
						x2: b.x,
						labelX: b.x
					});
				}
				return a;
			});

			ticks = zip(ticks, nodes);
		}
	} else {
		ticks = tickValues.map(function (d) {
			var y = Math.round(scale(d));
			return {
				value: d,
				x1: 0,
				y1: y,
				x2: sign * innerTickSize,
				y2: y,
				labelX: sign * tickSpacing,
				labelY: y
			};
		});

		dy = ".32em";
		canvas_dy = fontSize * .32;
		textAnchor = sign < 0 ? "end" : "start";
	}

	return {
		ticks: ticks, scale: scale, tickStroke: tickStroke,
		tickLabelFill: tickLabelFill || tickStroke,
		tickStrokeOpacity: tickStrokeOpacity,
		tickStrokeWidth: tickStrokeWidth,
		tickStrokeDasharray: tickStrokeDasharray,
		dy: dy,
		canvas_dy: canvas_dy,
		textAnchor: textAnchor,
		fontSize: fontSize,
		fontFamily: fontFamily,
		fontWeight: fontWeight,
		format: format,
		showTickLabel: showTickLabel
	};
}

/* eslint-disable react/prop-types */
function axisLineSVG(props, range) {
	var orient = props.orient,
	    outerTickSize = props.outerTickSize;
	var domainClassName = props.domainClassName,
	    fill = props.fill,
	    stroke = props.stroke,
	    strokeWidth = props.strokeWidth,
	    opacity = props.opacity;


	var sign = orient === "top" || orient === "left" ? -1 : 1;

	var d = void 0;

	if (orient === "bottom" || orient === "top") {
		d = "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize;
	} else {
		d = "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize;
	}

	return React.createElement("path", {
		className: domainClassName,
		d: d,
		fill: fill,
		opacity: opacity,
		stroke: stroke,
		strokeWidth: strokeWidth });
}
/* eslint-enable react/prop-types */

function drawAxisLine(ctx, props, range) {
	// props = { ...AxisLine.defaultProps, ...props };

	var orient = props.orient,
	    outerTickSize = props.outerTickSize,
	    stroke = props.stroke,
	    strokeWidth = props.strokeWidth,
	    opacity = props.opacity;


	var sign = orient === "top" || orient === "left" ? -1 : 1;
	var xAxis = orient === "bottom" || orient === "top";

	// var range = d3_scaleRange(xAxis ? xScale : yScale);

	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = hexToRGBA(stroke, opacity);

	ctx.beginPath();

	if (xAxis) {
		ctx.moveTo(first(range), sign * outerTickSize);
		ctx.lineTo(first(range), 0);
		ctx.lineTo(last(range), 0);
		ctx.lineTo(last(range), sign * outerTickSize);
	} else {
		ctx.moveTo(sign * outerTickSize, first(range));
		ctx.lineTo(0, first(range));
		ctx.lineTo(0, last(range));
		ctx.lineTo(sign * outerTickSize, last(range));
	}
	ctx.stroke();
}

function Tick(props) {
	var tickLabelFill = props.tickLabelFill,
	    tickStroke = props.tickStroke,
	    tickStrokeOpacity = props.tickStrokeOpacity,
	    tickStrokeDasharray = props.tickStrokeDasharray,
	    tickStrokeWidth = props.tickStrokeWidth,
	    textAnchor = props.textAnchor,
	    fontSize = props.fontSize,
	    fontFamily = props.fontFamily,
	    fontWeight = props.fontWeight;
	var x1 = props.x1,
	    y1 = props.y1,
	    x2 = props.x2,
	    y2 = props.y2,
	    labelX = props.labelX,
	    labelY = props.labelY,
	    dy = props.dy;

	return React.createElement(
		"g",
		{ className: "tick" },
		React.createElement("line", {
			shapeRendering: "crispEdges",
			opacity: tickStrokeOpacity,
			stroke: tickStroke,
			strokeWidth: tickStrokeWidth,
			strokeDasharray: getStrokeDasharray(tickStrokeDasharray),
			x1: x1, y1: y1,
			x2: x2, y2: y2 }),
		React.createElement(
			"text",
			{
				dy: dy, x: labelX, y: labelY,
				fill: tickLabelFill,
				fontSize: fontSize,
				fontWeight: fontWeight,
				fontFamily: fontFamily,
				textAnchor: textAnchor },
			props.children
		)
	);
}

Tick.propTypes = {
	children: PropTypes.string.isRequired,
	x1: PropTypes.number.isRequired,
	y1: PropTypes.number.isRequired,
	x2: PropTypes.number.isRequired,
	y2: PropTypes.number.isRequired,
	labelX: PropTypes.number.isRequired,
	labelY: PropTypes.number.isRequired,
	dy: PropTypes.string.isRequired,
	tickStroke: PropTypes.string,
	tickLabelFill: PropTypes.string,
	tickStrokeWidth: PropTypes.number,
	tickStrokeOpacity: PropTypes.number,
	tickStrokeDasharray: PropTypes.oneOf(strokeDashTypes),
	textAnchor: PropTypes.string,
	fontSize: PropTypes.number,
	fontFamily: PropTypes.string,
	fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

function axisTicksSVG(props, scale) {
	var result = tickHelper(props, scale);

	var tickLabelFill = result.tickLabelFill,
	    tickStroke = result.tickStroke,
	    tickStrokeOpacity = result.tickStrokeOpacity,
	    tickStrokeWidth = result.tickStrokeWidth,
	    tickStrokeDasharray = result.tickStrokeDasharray,
	    textAnchor = result.textAnchor;
	var fontSize = result.fontSize,
	    fontFamily = result.fontFamily,
	    fontWeight = result.fontWeight,
	    ticks = result.ticks,
	    format = result.format;
	var dy = result.dy;


	return React.createElement(
		"g",
		null,
		ticks.map(function (tick, idx) {
			return React.createElement(
				Tick,
				{ key: idx,
					tickStroke: tickStroke,
					tickLabelFill: tickLabelFill,
					tickStrokeWidth: tickStrokeWidth,
					tickStrokeOpacity: tickStrokeOpacity,
					tickStrokeDasharray: tickStrokeDasharray,
					dy: dy,
					x1: tick.x1, y1: tick.y1,
					x2: tick.x2, y2: tick.y2,
					labelX: tick.labelX, labelY: tick.labelY,
					textAnchor: textAnchor,
					fontSize: fontSize,
					fontWeight: fontWeight,
					fontFamily: fontFamily },
				format(tick.value)
			);
		})
	);
}

function drawTicks(ctx, result) {
	var tickStroke = result.tickStroke,
	    tickStrokeOpacity = result.tickStrokeOpacity,
	    tickLabelFill = result.tickLabelFill;
	var textAnchor = result.textAnchor,
	    fontSize = result.fontSize,
	    fontFamily = result.fontFamily,
	    fontWeight = result.fontWeight,
	    ticks = result.ticks,
	    showTickLabel = result.showTickLabel;


	ctx.strokeStyle = hexToRGBA(tickStroke, tickStrokeOpacity);

	ctx.fillStyle = tickStroke;
	// ctx.textBaseline = 'middle';

	ticks.forEach(function (tick) {
		drawEachTick(ctx, tick, result);
	});

	ctx.font = fontWeight + " " + fontSize + "px " + fontFamily;
	ctx.fillStyle = tickLabelFill;
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	if (showTickLabel) {
		ticks.forEach(function (tick) {
			drawEachTickLabel(ctx, tick, result);
		});
	}
}

function drawEachTick(ctx, tick, result) {
	var tickStrokeWidth = result.tickStrokeWidth,
	    tickStrokeDasharray = result.tickStrokeDasharray;


	ctx.beginPath();

	ctx.moveTo(tick.x1, tick.y1);
	ctx.lineTo(tick.x2, tick.y2);
	ctx.lineWidth = tickStrokeWidth;
	ctx.setLineDash(getStrokeDasharray(tickStrokeDasharray).split(","));
	ctx.stroke();
}

function drawEachTickLabel(ctx, tick, result) {
	var canvas_dy = result.canvas_dy,
	    format = result.format;


	ctx.beginPath();
	ctx.fillText(format(tick.value), tick.labelX, tick.labelY + canvas_dy);
}

export default Axis;
//# sourceMappingURL=Axis.js.map