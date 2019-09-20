var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import LineSeries from "./LineSeries";
// import AreaSeries from "./AreaSeries";
import StraightLine from "./StraightLine";
import SVGComponent from "./SVGComponent";
import { strokeDashTypes } from "../utils";

var RSISeries = function (_Component) {
	_inherits(RSISeries, _Component);

	function RSISeries(props) {
		_classCallCheck(this, RSISeries);

		var _this = _possibleConstructorReturn(this, (RSISeries.__proto__ || Object.getPrototypeOf(RSISeries)).call(this, props));

		_this.renderClip = _this.renderClip.bind(_this);
		_this.topAndBottomClip = _this.topAndBottomClip.bind(_this);
		_this.mainClip = _this.mainClip.bind(_this);

		var id1 = String(Math.round(Math.random() * 10000 * 10000));
		_this.clipPathId1 = "rsi-clip-" + id1;

		var id2 = String(Math.round(Math.random() * 10000 * 10000));
		_this.clipPathId2 = "rsi-clip-" + id2;
		return _this;
	}

	_createClass(RSISeries, [{
		key: "topAndBottomClip",
		value: function topAndBottomClip(ctx, moreProps) {
			var chartConfig = moreProps.chartConfig;
			var _props = this.props,
			    overSold = _props.overSold,
			    overBought = _props.overBought;
			var yScale = chartConfig.yScale,
			    width = chartConfig.width;


			ctx.beginPath();
			ctx.rect(0, yScale(overSold), width, yScale(overBought) - yScale(overSold));
			ctx.clip();
		}
	}, {
		key: "mainClip",
		value: function mainClip(ctx, moreProps) {
			var chartConfig = moreProps.chartConfig;
			var _props2 = this.props,
			    overSold = _props2.overSold,
			    overBought = _props2.overBought;
			var yScale = chartConfig.yScale,
			    width = chartConfig.width,
			    height = chartConfig.height;


			ctx.beginPath();
			ctx.rect(0, 0, width, yScale(overSold));
			ctx.rect(0, yScale(overBought), width, height - yScale(overBought));
			ctx.clip();
		}
	}, {
		key: "renderClip",
		value: function renderClip(moreProps) {
			var chartConfig = moreProps.chartConfig;
			var _props3 = this.props,
			    overSold = _props3.overSold,
			    overBought = _props3.overBought;
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
						y: yScale(overSold),
						width: width,
						height: yScale(overBought) - yScale(overSold)
					})
				),
				React.createElement(
					"clipPath",
					{ id: this.clipPathId2 },
					React.createElement("rect", {
						x: 0,
						y: 0,
						width: width,
						height: yScale(overSold)
					}),
					React.createElement("rect", {
						x: 0,
						y: yScale(overBought),
						width: width,
						height: height - yScale(overBought)
					})
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _props4 = this.props,
			    className = _props4.className,
			    stroke = _props4.stroke,
			    opacity = _props4.opacity,
			    strokeDasharray = _props4.strokeDasharray,
			    strokeWidth = _props4.strokeWidth;
			var yAccessor = this.props.yAccessor;
			var _props5 = this.props,
			    overSold = _props5.overSold,
			    middle = _props5.middle,
			    overBought = _props5.overBought;


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
				React.createElement(StraightLine, {
					stroke: stroke.top,
					opacity: opacity.top,
					yValue: overSold,
					strokeDasharray: strokeDasharray.top,
					strokeWidth: strokeWidth.top
				}),
				React.createElement(StraightLine, {
					stroke: stroke.middle,
					opacity: opacity.middle,
					yValue: middle,
					strokeDasharray: strokeDasharray.middle,
					strokeWidth: strokeWidth.middle
				}),
				React.createElement(StraightLine, {
					stroke: stroke.bottom,
					opacity: opacity.bottom,
					yValue: overBought,
					strokeDasharray: strokeDasharray.bottom,
					strokeWidth: strokeWidth.bottom
				}),
				React.createElement(LineSeries, {
					style: style1,
					canvasClip: this.topAndBottomClip,

					className: className,
					yAccessor: yAccessor,
					stroke: stroke.insideThreshold || stroke.line,
					strokeWidth: strokeWidth.insideThreshold,
					strokeDasharray: strokeDasharray.line
				}),
				React.createElement(LineSeries, {
					style: style2,
					canvasClip: this.mainClip
					/* baseAt={yScale => yScale(middle)} */
					, className: className,
					yAccessor: yAccessor,
					stroke: stroke.outsideThreshold || stroke.line,
					strokeWidth: strokeWidth.outsideThreshold,
					strokeDasharray: strokeDasharray.line
					/* fill={stroke.outsideThreshold || stroke.line} */
				})
			);
		}
	}]);

	return RSISeries;
}(Component);

RSISeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.shape({
		top: PropTypes.string.isRequired,
		middle: PropTypes.string.isRequired,
		bottom: PropTypes.string.isRequired,
		outsideThreshold: PropTypes.string.isRequired,
		insideThreshold: PropTypes.string.isRequired
	}).isRequired,
	opacity: PropTypes.shape({
		top: PropTypes.number.isRequired,
		middle: PropTypes.number.isRequired,
		bottom: PropTypes.number.isRequired
	}).isRequired,
	strokeDasharray: PropTypes.shape({
		line: PropTypes.oneOf(strokeDashTypes),
		top: PropTypes.oneOf(strokeDashTypes),
		middle: PropTypes.oneOf(strokeDashTypes),
		bottom: PropTypes.oneOf(strokeDashTypes)
	}).isRequired,
	strokeWidth: PropTypes.shape({
		outsideThreshold: PropTypes.number.isRequired,
		insideThreshold: PropTypes.number.isRequired,
		top: PropTypes.number.isRequired,
		middle: PropTypes.number.isRequired,
		bottom: PropTypes.number.isRequired
	}).isRequired,
	overSold: PropTypes.number.isRequired,
	middle: PropTypes.number.isRequired,
	overBought: PropTypes.number.isRequired
};

RSISeries.defaultProps = {
	className: "react-stockcharts-rsi-series",
	stroke: {
		line: "#000000",
		top: "#B8C2CC",
		middle: "#8795A1",
		bottom: "#B8C2CC",
		outsideThreshold: "#b300b3",
		insideThreshold: "#ffccff"
	},
	opacity: {
		top: 1,
		middle: 1,
		bottom: 1
	},
	strokeDasharray: {
		line: "Solid",
		top: "ShortDash",
		middle: "ShortDash",
		bottom: "ShortDash"
	},
	strokeWidth: {
		outsideThreshold: 1,
		insideThreshold: 1,
		top: 1,
		middle: 1,
		bottom: 1
	},
	overSold: 70,
	middle: 50,
	overBought: 30
};

export default RSISeries;
//# sourceMappingURL=RSISeries.js.map