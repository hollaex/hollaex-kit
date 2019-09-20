var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import AreaSeries from "./AreaSeries";
import SVGComponent from "./SVGComponent";
import { strokeDashTypes } from "../utils";

var AlternatingFillAreaSeries = function (_Component) {
	_inherits(AlternatingFillAreaSeries, _Component);

	function AlternatingFillAreaSeries(props) {
		_classCallCheck(this, AlternatingFillAreaSeries);

		var _this = _possibleConstructorReturn(this, (AlternatingFillAreaSeries.__proto__ || Object.getPrototypeOf(AlternatingFillAreaSeries)).call(this, props));

		_this.renderClip = _this.renderClip.bind(_this);
		_this.topClip = _this.topClip.bind(_this);
		_this.bottomClip = _this.bottomClip.bind(_this);
		_this.baseAt = _this.baseAt.bind(_this);

		var id1 = String(Math.round(Math.random() * 10000 * 10000));
		_this.clipPathId1 = "alternating-area-clip-" + id1;

		var id2 = String(Math.round(Math.random() * 10000 * 10000));
		_this.clipPathId2 = "alternating-area-clip-" + id2;
		return _this;
	}

	_createClass(AlternatingFillAreaSeries, [{
		key: "topClip",
		value: function topClip(ctx, moreProps) {
			var chartConfig = moreProps.chartConfig;
			var baseAt = this.props.baseAt;
			var yScale = chartConfig.yScale,
			    width = chartConfig.width;


			ctx.beginPath();
			ctx.rect(0, 0, width, yScale(baseAt));
			ctx.clip();
		}
	}, {
		key: "bottomClip",
		value: function bottomClip(ctx, moreProps) {
			var chartConfig = moreProps.chartConfig;
			var baseAt = this.props.baseAt;
			var yScale = chartConfig.yScale,
			    width = chartConfig.width,
			    height = chartConfig.height;


			ctx.beginPath();
			ctx.rect(0, yScale(baseAt), width, height - yScale(baseAt));
			ctx.clip();
		}
	}, {
		key: "renderClip",
		value: function renderClip(moreProps) {
			var chartConfig = moreProps.chartConfig;
			var baseAt = this.props.baseAt;
			var yScale = chartConfig.yScale,
			    width = chartConfig.width,
			    height = chartConfig.height;


			return React.createElement(
				"defs",
				null,
				React.createElement(
					"clipPath",
					{ id: this.clipPathId1 },
					React.createElement("rect", {
						x: 0,
						y: 0,
						width: width,
						height: yScale(baseAt)
					})
				),
				React.createElement(
					"clipPath",
					{ id: this.clipPathId2 },
					React.createElement("rect", {
						x: 0,
						y: yScale(baseAt),
						width: width,
						height: height - yScale(baseAt)
					})
				)
			);
		}
	}, {
		key: "baseAt",
		value: function baseAt(yScale) {
			return yScale(this.props.baseAt);
		}
	}, {
		key: "render",
		value: function render() {
			var _props = this.props,
			    className = _props.className,
			    yAccessor = _props.yAccessor,
			    interpolation = _props.interpolation;
			var _props2 = this.props,
			    stroke = _props2.stroke,
			    strokeWidth = _props2.strokeWidth,
			    strokeOpacity = _props2.strokeOpacity,
			    strokeDasharray = _props2.strokeDasharray,
			    fill = _props2.fill,
			    fillOpacity = _props2.fillOpacity;


			var style1 = { "clipPath": "url(#" + this.clipPathId1 + ")" };
			var style2 = { "clipPath": "url(#" + this.clipPathId2 + ")" };

			return React.createElement(
				"g",
				{ className: className },
				React.createElement(
					SVGComponent,
					null,
					this.renderClip
				),
				React.createElement(AreaSeries, {
					style: style1,
					canvasClip: this.topClip,

					yAccessor: yAccessor,
					interpolation: interpolation,
					baseAt: this.baseAt,

					fill: fill.top,
					opacity: fillOpacity.top,
					stroke: stroke.top,
					strokeOpacity: strokeOpacity.top,
					strokeDasharray: strokeDasharray.top,
					strokeWidth: strokeWidth.top
				}),
				React.createElement(AreaSeries, {
					style: style2,
					canvasClip: this.bottomClip,

					yAccessor: yAccessor,
					interpolation: interpolation,
					baseAt: this.baseAt,

					fill: fill.bottom,
					opacity: fillOpacity.bottom,
					stroke: stroke.bottom,
					strokeOpacity: strokeOpacity.bottom,
					strokeDasharray: strokeDasharray.bottom,
					strokeWidth: strokeWidth.bottom
				})
			);
		}
	}]);

	return AlternatingFillAreaSeries;
}(Component);

AlternatingFillAreaSeries.propTypes = {
	stroke: PropTypes.shape({
		top: PropTypes.string,
		bottom: PropTypes.string
	}),

	strokeWidth: PropTypes.shape({
		top: PropTypes.number,
		bottom: PropTypes.number
	}),
	strokeOpacity: PropTypes.shape({
		top: PropTypes.number,
		bottom: PropTypes.number
	}),
	fill: PropTypes.shape({
		top: PropTypes.string,
		bottom: PropTypes.string
	}),
	fillOpacity: PropTypes.shape({
		top: PropTypes.number,
		bottom: PropTypes.number
	}),
	strokeDasharray: PropTypes.shape({
		top: PropTypes.oneOf(strokeDashTypes),
		bottom: PropTypes.oneOf(strokeDashTypes)
	}).isRequired,

	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,

	baseAt: PropTypes.number.isRequired,

	interpolation: PropTypes.func
};

AlternatingFillAreaSeries.defaultProps = {
	stroke: {
		top: "#38C172",
		bottom: "#E3342F"
	},
	strokeWidth: {
		top: 2,
		bottom: 2
	},
	strokeOpacity: {
		top: 1,
		bottom: 1
	},
	fill: {
		top: "#A2F5BF",
		bottom: "#EF5753"
	},
	fillOpacity: {
		top: 0.5,
		bottom: 0.5
	},
	strokeDasharray: {
		top: "Solid",
		bottom: "Solid"
	},
	className: "react-stockcharts-alternating-area"
};

export default AlternatingFillAreaSeries;
//# sourceMappingURL=AlternatingFillAreaSeries.js.map