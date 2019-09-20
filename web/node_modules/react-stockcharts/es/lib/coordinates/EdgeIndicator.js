var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";

import { drawOnCanvas as _drawOnCanvas, renderSVG as _renderSVG } from "./EdgeCoordinateV3";
import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { first, last, isDefined, functor, noop, strokeDashTypes } from "../utils";

var EdgeIndicator = function (_Component) {
	_inherits(EdgeIndicator, _Component);

	function EdgeIndicator(props) {
		_classCallCheck(this, EdgeIndicator);

		var _this = _possibleConstructorReturn(this, (EdgeIndicator.__proto__ || Object.getPrototypeOf(EdgeIndicator)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(EdgeIndicator, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var edge = helper(this.props, moreProps);
			var props = _extends({}, this.props, edge);
			_drawOnCanvas(ctx, props);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var edge = helper(this.props, moreProps);
			var props = _extends({}, this.props, edge);
			return _renderSVG(props);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(GenericChartComponent, {
				edgeClip: true,
				clip: false,
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}]);

	return EdgeIndicator;
}(Component);

EdgeIndicator.propTypes = {
	yAccessor: PropTypes.func,

	type: PropTypes.oneOf(["horizontal"]),
	className: PropTypes.string,
	fill: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
	lineStroke: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
	textFill: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
	itemType: PropTypes.oneOf(["first", "last"]).isRequired,
	orient: PropTypes.oneOf(["left", "right"]),
	edgeAt: PropTypes.oneOf(["left", "right"]),
	displayFormat: PropTypes.func,
	rectHeight: PropTypes.number,
	rectWidth: PropTypes.number,
	arrowWidth: PropTypes.number,
	lineStrokeDasharray: PropTypes.oneOf(strokeDashTypes)
};

EdgeIndicator.defaultProps = {
	className: "react-stockcharts-edgeindicator",

	type: "horizontal",
	orient: "left",
	edgeAt: "left",
	textFill: "#FFFFFF",
	displayFormat: format(".2f"),
	yAxisPad: 0,
	rectHeight: 20,
	rectWidth: 50,
	arrowWidth: 10,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	dx: 0,
	hideLine: false,
	fill: "#8a8a8a",
	opacity: 1,

	stroke: noop,
	strokeOpacity: 1,
	strokeWidth: 3,
	lineStroke: "#000000",
	lineOpacity: 0.3,
	lineStrokeDasharray: "ShortDash"
};

function helper(props, moreProps) {
	var itemType = props.itemType,
	    yAccessor = props.yAccessor;
	var plotData = moreProps.plotData;


	var item = itemType === "first" ? first(plotData, yAccessor) : last(plotData, yAccessor);

	// var currentItem = ChartDataUtil.getCurrentItemForChartNew(currentItems, forChart);
	var edge = isDefined(item) ? getEdge(props, moreProps, item) : null;

	return edge;
}

function getEdge(props, moreProps, item) {
	var edgeType = props.type,
	    displayFormat = props.displayFormat,
	    edgeAt = props.edgeAt,
	    yAxisPad = props.yAxisPad,
	    orient = props.orient,
	    lineStroke = props.lineStroke;
	var yAccessor = props.yAccessor,
	    fill = props.fill,
	    textFill = props.textFill,
	    rectHeight = props.rectHeight,
	    rectWidth = props.rectWidth,
	    arrowWidth = props.arrowWidth;
	var fontFamily = props.fontFamily,
	    fontSize = props.fontSize;
	var stroke = props.stroke;
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    xAccessor = moreProps.xAccessor,
	    width = moreProps.width;


	var yValue = yAccessor(item),
	    xValue = xAccessor(item);

	var x1 = Math.round(xScale(xValue)),
	    y1 = Math.round(yScale(yValue));

	var left = 0,
	    right = width;

	var edgeX = edgeAt === "left" ? left - yAxisPad : right + yAxisPad;

	return {
		// ...props,
		coordinate: displayFormat(yValue),
		show: true,
		type: edgeType,
		orient: orient,
		edgeAt: edgeX,
		fill: functor(fill)(item),
		lineStroke: functor(lineStroke)(item),
		stroke: functor(stroke)(item),
		fontFamily: fontFamily, fontSize: fontSize,
		textFill: functor(textFill)(item),
		rectHeight: rectHeight, rectWidth: rectWidth, arrowWidth: arrowWidth,
		x1: x1,
		y1: y1,
		x2: right,
		y2: y1
	};
}

export default EdgeIndicator;
//# sourceMappingURL=EdgeIndicator.js.map