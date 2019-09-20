var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { nest as d3Nest } from "d3-collection";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { hexToRGBA, functor } from "../utils";

var ScatterSeries = function (_Component) {
	_inherits(ScatterSeries, _Component);

	function ScatterSeries(props) {
		_classCallCheck(this, ScatterSeries);

		var _this = _possibleConstructorReturn(this, (ScatterSeries.__proto__ || Object.getPrototypeOf(ScatterSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(ScatterSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var xAccessor = moreProps.xAccessor;


			var points = helper(this.props, moreProps, xAccessor);

			_drawOnCanvas(ctx, this.props, points);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props = this.props,
			    className = _props.className,
			    markerProps = _props.markerProps;
			var xAccessor = moreProps.xAccessor;


			var points = helper(this.props, moreProps, xAccessor);

			return React.createElement(
				"g",
				{ className: className },
				points.map(function (point, idx) {
					var Marker = point.marker;

					return React.createElement(Marker, _extends({ key: idx }, markerProps, { point: point }));
				})
			);
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

	return ScatterSeries;
}(Component);

ScatterSeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	marker: PropTypes.func,
	markerProvider: PropTypes.func,
	markerProps: PropTypes.object
};

ScatterSeries.defaultProps = {
	className: "react-stockcharts-scatter"
};

function helper(props, moreProps, xAccessor) {
	var yAccessor = props.yAccessor,
	    markerProvider = props.markerProvider,
	    markerProps = props.markerProps;
	var Marker = props.marker;
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    plotData = moreProps.plotData;


	if (!(markerProvider || Marker)) throw new Error("required prop, either marker or markerProvider missing");

	return plotData.map(function (d) {

		if (markerProvider) Marker = markerProvider(d);

		var mProps = _extends({}, Marker.defaultProps, markerProps);

		var fill = functor(mProps.fill);
		var stroke = functor(mProps.stroke);

		return {
			x: xScale(xAccessor(d)),
			y: yScale(yAccessor(d)),
			fill: hexToRGBA(fill(d), mProps.opacity),
			stroke: stroke(d),
			datum: d,
			marker: Marker
		};
	});
}

function _drawOnCanvas(ctx, props, points) {
	var markerProps = props.markerProps;


	var nest = d3Nest().key(function (d) {
		return d.fill;
	}).key(function (d) {
		return d.stroke;
	}).entries(points);

	nest.forEach(function (fillGroup) {
		var fillKey = fillGroup.key,
		    fillValues = fillGroup.values;


		if (fillKey !== "none") {
			ctx.fillStyle = fillKey;
		}

		fillValues.forEach(function (strokeGroup) {
			// var { key: strokeKey, values: strokeValues } = strokeGroup;
			var strokeValues = strokeGroup.values;


			strokeValues.forEach(function (point) {
				var marker = point.marker;

				marker.drawOnCanvas(_extends({}, marker.defaultProps, markerProps, { fill: fillKey }), point, ctx);
			});
		});
	});
}

export default ScatterSeries;
//# sourceMappingURL=ScatterSeries.js.map