var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { hexToRGBA, isDefined, isNotDefined, strokeDashTypes, getStrokeDasharray } from "../utils";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

var StraightLine = function (_Component) {
	_inherits(StraightLine, _Component);

	function StraightLine(props) {
		_classCallCheck(this, StraightLine);

		var _this = _possibleConstructorReturn(this, (StraightLine.__proto__ || Object.getPrototypeOf(StraightLine)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(StraightLine, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props = this.props,
			    type = _props.type,
			    stroke = _props.stroke,
			    strokeWidth = _props.strokeWidth,
			    opacity = _props.opacity,
			    strokeDasharray = _props.strokeDasharray;
			var _props2 = this.props,
			    yValue = _props2.yValue,
			    xValue = _props2.xValue;
			var xScale = moreProps.xScale;
			var _moreProps$chartConfi = moreProps.chartConfig,
			    yScale = _moreProps$chartConfi.yScale,
			    width = _moreProps$chartConfi.width,
			    height = _moreProps$chartConfi.height;


			ctx.beginPath();

			ctx.strokeStyle = hexToRGBA(stroke, opacity);
			ctx.lineWidth = strokeWidth;

			var _getLineCoordinates = getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height),
			    x1 = _getLineCoordinates.x1,
			    y1 = _getLineCoordinates.y1,
			    x2 = _getLineCoordinates.x2,
			    y2 = _getLineCoordinates.y2;

			ctx.setLineDash(getStrokeDasharray(strokeDasharray).split(","));
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(GenericChartComponent, {
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var width = moreProps.width,
			    height = moreProps.height;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale;
			var className = this.props.className;
			var _props3 = this.props,
			    type = _props3.type,
			    stroke = _props3.stroke,
			    strokeWidth = _props3.strokeWidth,
			    opacity = _props3.opacity,
			    strokeDasharray = _props3.strokeDasharray;
			var _props4 = this.props,
			    yValue = _props4.yValue,
			    xValue = _props4.xValue;


			var lineCoordinates = getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height);

			return React.createElement("line", _extends({
				className: className,
				strokeDasharray: getStrokeDasharray(strokeDasharray),
				stroke: stroke,
				strokeWidth: strokeWidth,
				strokeOpacity: opacity
			}, lineCoordinates));
		}
	}]);

	return StraightLine;
}(Component);

function getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height) {
	return type === "horizontal" ? { x1: 0, y1: Math.round(yScale(yValue)), x2: width, y2: Math.round(yScale(yValue)) } : { x1: Math.round(xScale(xValue)), y1: 0, x2: Math.round(xScale(xValue)), y2: height };
}

StraightLine.propTypes = {
	className: PropTypes.string,
	type: PropTypes.oneOf(["vertical", "horizontal"]),
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
	opacity: PropTypes.number.isRequired,
	yValue: function yValue(props, propName /* , componentName */) {
		if (props.type === "vertical" && isDefined(props[propName])) return new Error("Do not define `yValue` when type is `vertical`, define the `xValue` prop");
		if (props.type === "horizontal" && isNotDefined(props[propName])) return new Error("when type = `horizontal` `yValue` is required");
		// if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `yValue` accepts a number");
	},
	xValue: function xValue(props, propName /* , componentName */) {
		if (props.type === "horizontal" && isDefined(props[propName])) return new Error("Do not define `xValue` when type is `horizontal`, define the `yValue` prop");
		if (props.type === "vertical" && isNotDefined(props[propName])) return new Error("when type = `vertical` `xValue` is required");
		// if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `xValue` accepts a number");
	}
};

StraightLine.defaultProps = {
	className: "line ",
	type: "horizontal",
	stroke: "#000000",
	opacity: 0.5,
	strokeWidth: 1,
	strokeDasharray: "Solid"
};

export default StraightLine;
//# sourceMappingURL=StraightLine.js.map