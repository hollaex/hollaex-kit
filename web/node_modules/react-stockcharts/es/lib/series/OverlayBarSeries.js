var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { merge } from "d3-array";

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { drawOnCanvas2, getBarsSVG2 } from "./StackedBarSeries";
import { isDefined, isNotDefined, first, functor, plotDataLengthBarWidth } from "../utils";

var OverlayBarSeries = function (_Component) {
	_inherits(OverlayBarSeries, _Component);

	function OverlayBarSeries(props) {
		_classCallCheck(this, OverlayBarSeries);

		var _this = _possibleConstructorReturn(this, (OverlayBarSeries.__proto__ || Object.getPrototypeOf(OverlayBarSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(OverlayBarSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var yAccessor = this.props.yAccessor;

			var bars = getBars(this.props, moreProps, yAccessor);

			drawOnCanvas2(this.props, ctx, bars);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var yAccessor = this.props.yAccessor;


			var bars = getBars(this.props, moreProps, yAccessor);
			return React.createElement(
				"g",
				{ className: "react-stockcharts-bar-series" },
				getBarsSVG2(this.props, bars)
			);
		}
	}, {
		key: "render",
		value: function render() {
			var clip = this.props.clip;


			return React.createElement(GenericChartComponent, {
				svgDraw: this.renderSVG,
				canvasToDraw: getAxisCanvas,
				canvasDraw: this.drawOnCanvas,
				clip: clip,
				drawOn: ["pan"]
			});
		}
	}]);

	return OverlayBarSeries;
}(Component);

OverlayBarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
	direction: PropTypes.oneOf(["up", "down"]).isRequired,
	stroke: PropTypes.bool.isRequired,
	widthRatio: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	xAccessor: PropTypes.func,
	yAccessor: PropTypes.arrayOf(PropTypes.func),
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
	clip: PropTypes.bool.isRequired
};

OverlayBarSeries.defaultProps = {
	baseAt: function baseAt(xScale, yScale /* , d*/) {
		return first(yScale.range());
	},
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	widthRatio: 0.5,
	width: plotDataLengthBarWidth,
	clip: true
};

function getBars(props, moreProps, yAccessor) {
	var xScale = moreProps.xScale,
	    xAccessor = moreProps.xAccessor,
	    yScale = moreProps.chartConfig.yScale,
	    plotData = moreProps.plotData;
	var baseAt = props.baseAt,
	    className = props.className,
	    fill = props.fill,
	    stroke = props.stroke;


	var getClassName = functor(className);
	var getFill = functor(fill);
	var getBase = functor(baseAt);
	var widthFunctor = functor(props.width);

	var width = widthFunctor(props, moreProps);
	var offset = Math.floor(0.5 * width);

	// console.log(xScale.domain(), yScale.domain());

	var bars = plotData.map(function (d) {
		// eslint-disable-next-line prefer-const
		var innerBars = yAccessor.map(function (eachYAccessor, i) {
			var yValue = eachYAccessor(d);
			if (isNotDefined(yValue)) return undefined;

			var xValue = xAccessor(d);
			var x = Math.round(xScale(xValue)) - offset;
			var y = yScale(yValue);
			// console.log(yValue, y, xValue, x)
			return {
				width: offset * 2,
				x: x,
				y: y,
				className: getClassName(d, i),
				stroke: stroke ? getFill(d, i) : "none",
				fill: getFill(d, i),
				i: i
			};
		}).filter(function (yValue) {
			return isDefined(yValue);
		});

		var b = getBase(xScale, yScale, d);
		var h = void 0;
		for (var i = innerBars.length - 1; i >= 0; i--) {
			h = b - innerBars[i].y;
			if (h < 0) {
				innerBars[i].y = b;
				h = -1 * h;
			}
			innerBars[i].height = h;
			b = innerBars[i].y;
		}
		return innerBars;
	});

	return merge(bars);
}

export default OverlayBarSeries;
//# sourceMappingURL=OverlayBarSeries.js.map