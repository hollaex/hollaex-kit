var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { drawOnCanvas as _drawOnCanvas, renderSVG as _renderSVG } from "./EdgeCoordinateV3";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

import { isNotDefined } from "../utils";

var MouseCoordinateY = function (_Component) {
	_inherits(MouseCoordinateY, _Component);

	function MouseCoordinateY(props) {
		_classCallCheck(this, MouseCoordinateY);

		var _this = _possibleConstructorReturn(this, (MouseCoordinateY.__proto__ || Object.getPrototypeOf(MouseCoordinateY)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(MouseCoordinateY, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var props = helper(this.props, moreProps);
			if (isNotDefined(props)) return null;

			_drawOnCanvas(ctx, props);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var props = helper(this.props, moreProps);
			if (isNotDefined(props)) return null;

			return _renderSVG(props);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(GenericChartComponent, {
				clip: false,
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: getMouseCanvas,
				drawOn: ["mousemove", "pan", "drag"]
			});
		}
	}]);

	return MouseCoordinateY;
}(Component);

MouseCoordinateY.propTypes = {
	displayFormat: PropTypes.func.isRequired,
	yAxisPad: PropTypes.number,
	rectWidth: PropTypes.number,
	rectHeight: PropTypes.number,
	orient: PropTypes.oneOf(["bottom", "top", "left", "right"]),
	at: PropTypes.oneOf(["bottom", "top", "left", "right"]),
	dx: PropTypes.number,
	fill: PropTypes.string,
	opacity: PropTypes.number,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	textFill: PropTypes.string
};

MouseCoordinateY.defaultProps = {
	yAxisPad: 0,
	rectWidth: 50,
	rectHeight: 20,
	orient: "left",
	at: "left",
	dx: 0,
	arrowWidth: 10,
	fill: "#525252",
	opacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",

	// stroke: "#684F1D",
	strokeOpacity: 1,
	strokeWidth: 1
};

function helper(props, moreProps) {
	var chartId = moreProps.chartId;
	var currentCharts = moreProps.currentCharts,
	    mouseXY = moreProps.mouseXY;


	if (isNotDefined(mouseXY)) return null;
	if (currentCharts.indexOf(chartId) < 0) return null;

	var show = moreProps.show;

	if (!show) return null;

	var y = mouseXY[1];
	var yScale = moreProps.chartConfig.yScale;
	var displayFormat = props.displayFormat;


	var coordinate = displayFormat(yScale.invert(y));

	return getYCoordinate(y, coordinate, props, moreProps);
}

export function getYCoordinate(y, displayValue, props, moreProps) {
	var width = moreProps.width;
	var orient = props.orient,
	    at = props.at,
	    rectWidth = props.rectWidth,
	    rectHeight = props.rectHeight,
	    dx = props.dx;
	var fill = props.fill,
	    opacity = props.opacity,
	    fontFamily = props.fontFamily,
	    fontSize = props.fontSize,
	    textFill = props.textFill,
	    arrowWidth = props.arrowWidth;
	var stroke = props.stroke,
	    strokeOpacity = props.strokeOpacity,
	    strokeWidth = props.strokeWidth;


	var x1 = 0,
	    x2 = width;
	var edgeAt = at === "right" ? width : 0;

	var type = "horizontal";
	var hideLine = true;

	var coordinateProps = {
		coordinate: displayValue,
		show: true,
		type: type,
		orient: orient,
		edgeAt: edgeAt,
		hideLine: hideLine,
		fill: fill,
		opacity: opacity,

		fontFamily: fontFamily,
		fontSize: fontSize,
		textFill: textFill,

		stroke: stroke,
		strokeOpacity: strokeOpacity,
		strokeWidth: strokeWidth,

		rectWidth: rectWidth,
		rectHeight: rectHeight,

		arrowWidth: arrowWidth,
		dx: dx,
		x1: x1,
		x2: x2,
		y1: y,
		y2: y
	};
	return coordinateProps;
}

export default MouseCoordinateY;
//# sourceMappingURL=MouseCoordinateY.js.map