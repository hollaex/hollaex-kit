var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { area as d3Area } from "d3-shape";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { hexToRGBA, isDefined, first, functor } from "../utils";

var AreaOnlySeries = function (_Component) {
	_inherits(AreaOnlySeries, _Component);

	function AreaOnlySeries(props) {
		_classCallCheck(this, AreaOnlySeries);

		var _this = _possibleConstructorReturn(this, (AreaOnlySeries.__proto__ || Object.getPrototypeOf(AreaOnlySeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(AreaOnlySeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props = this.props,
			    yAccessor = _props.yAccessor,
			    defined = _props.defined,
			    base = _props.base,
			    canvasGradient = _props.canvasGradient;
			var _props2 = this.props,
			    fill = _props2.fill,
			    stroke = _props2.stroke,
			    opacity = _props2.opacity,
			    interpolation = _props2.interpolation,
			    canvasClip = _props2.canvasClip;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData,
			    xAccessor = moreProps.xAccessor;


			if (canvasClip) {
				ctx.save();
				canvasClip(ctx, moreProps);
			}

			if (canvasGradient != null) {
				ctx.fillStyle = canvasGradient(moreProps, ctx);
			} else {
				ctx.fillStyle = hexToRGBA(fill, opacity);
			}
			ctx.strokeStyle = stroke;

			ctx.beginPath();
			var newBase = functor(base);
			var areaSeries = d3Area().defined(function (d) {
				return defined(yAccessor(d));
			}).x(function (d) {
				return Math.round(xScale(xAccessor(d)));
			}).y0(function (d) {
				return newBase(yScale, d, moreProps);
			}).y1(function (d) {
				return Math.round(yScale(yAccessor(d)));
			}).context(ctx);

			if (isDefined(interpolation)) {
				areaSeries.curve(interpolation);
			}
			areaSeries(plotData);
			ctx.fill();

			if (canvasClip) {
				ctx.restore();
			}
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props3 = this.props,
			    yAccessor = _props3.yAccessor,
			    defined = _props3.defined,
			    base = _props3.base,
			    style = _props3.style;
			var _props4 = this.props,
			    stroke = _props4.stroke,
			    fill = _props4.fill,
			    className = _props4.className,
			    opacity = _props4.opacity,
			    interpolation = _props4.interpolation;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData,
			    xAccessor = moreProps.xAccessor;


			var newBase = functor(base);
			var areaSeries = d3Area().defined(function (d) {
				return defined(yAccessor(d));
			}).x(function (d) {
				return Math.round(xScale(xAccessor(d)));
			}).y0(function (d) {
				return newBase(yScale, d, moreProps);
			}).y1(function (d) {
				return Math.round(yScale(yAccessor(d)));
			});

			if (isDefined(interpolation)) {
				areaSeries.curve(interpolation);
			}

			var d = areaSeries(plotData);
			var newClassName = className.concat(isDefined(stroke) ? "" : " line-stroke");
			return React.createElement("path", {
				style: style,
				d: d,
				stroke: stroke,
				fill: hexToRGBA(fill, opacity),
				className: newClassName

			});
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
	}]);

	return AreaOnlySeries;
}(Component);

AreaOnlySeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.string,
	fill: PropTypes.string,
	opacity: PropTypes.number,
	defined: PropTypes.func,
	base: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
	interpolation: PropTypes.func,
	canvasClip: PropTypes.func,
	style: PropTypes.object,
	canvasGradient: PropTypes.func
};

AreaOnlySeries.defaultProps = {
	className: "line ",
	fill: "none",
	opacity: 1,
	defined: function defined(d) {
		return !isNaN(d);
	},
	base: function base(yScale /* , d, moreProps */) {
		return first(yScale.range());
	}
};

export default AreaOnlySeries;
//# sourceMappingURL=AreaOnlySeries.js.map