var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";
import StackedBarSeries, { drawOnCanvasHelper, svgHelper, identityStack } from "./StackedBarSeries";

var GroupedBarSeries = function (_Component) {
	_inherits(GroupedBarSeries, _Component);

	function GroupedBarSeries(props) {
		_classCallCheck(this, GroupedBarSeries);

		var _this = _possibleConstructorReturn(this, (GroupedBarSeries.__proto__ || Object.getPrototypeOf(GroupedBarSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(GroupedBarSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var xAccessor = moreProps.xAccessor;


			drawOnCanvasHelper(ctx, this.props, moreProps, xAccessor, identityStack, postProcessor);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var xAccessor = moreProps.xAccessor;


			return React.createElement(
				"g",
				{ className: "react-stockcharts-grouped-bar-series" },
				svgHelper(this.props, moreProps, xAccessor, identityStack, postProcessor)
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

	return GroupedBarSeries;
}(Component);

GroupedBarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
	direction: PropTypes.oneOf(["up", "down"]).isRequired,
	stroke: PropTypes.bool.isRequired,
	widthRatio: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	yAccessor: PropTypes.arrayOf(PropTypes.func)
};

GroupedBarSeries.defaultProps = _extends({}, StackedBarSeries.defaultProps, {
	widthRatio: 0.8,
	spaceBetweenBar: 5
});

function postProcessor(array) {
	return array.map(function (each) {
		return _extends({}, each, {
			x: each.x + each.offset - each.groupOffset,
			width: each.groupWidth
		});
	});
}

export default GroupedBarSeries;
//# sourceMappingURL=GroupedBarSeries.js.map