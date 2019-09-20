var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";

var StochasticSeries = function (_Component) {
	_inherits(StochasticSeries, _Component);

	function StochasticSeries(props) {
		_classCallCheck(this, StochasticSeries);

		var _this = _possibleConstructorReturn(this, (StochasticSeries.__proto__ || Object.getPrototypeOf(StochasticSeries)).call(this, props));

		_this.yAccessorForD = _this.yAccessorForD.bind(_this);
		_this.yAccessorForK = _this.yAccessorForK.bind(_this);
		return _this;
	}

	_createClass(StochasticSeries, [{
		key: "yAccessorForD",
		value: function yAccessorForD(d) {
			var yAccessor = this.props.yAccessor;

			return yAccessor(d) && yAccessor(d).D;
		}
	}, {
		key: "yAccessorForK",
		value: function yAccessorForK(d) {
			var yAccessor = this.props.yAccessor;

			return yAccessor(d) && yAccessor(d).K;
		}
	}, {
		key: "render",
		value: function render() {
			var _props = this.props,
			    className = _props.className,
			    stroke = _props.stroke,
			    refLineOpacity = _props.refLineOpacity;
			var _props2 = this.props,
			    overSold = _props2.overSold,
			    middle = _props2.middle,
			    overBought = _props2.overBought;

			return React.createElement(
				"g",
				{ className: className },
				React.createElement(LineSeries, { yAccessor: this.yAccessorForD,
					stroke: stroke.dLine,
					fill: "none" }),
				React.createElement(LineSeries, { yAccessor: this.yAccessorForK,
					stroke: stroke.kLine,
					fill: "none" }),
				React.createElement(StraightLine, {
					stroke: stroke.top,
					opacity: refLineOpacity,
					yValue: overSold }),
				React.createElement(StraightLine, {
					stroke: stroke.middle,
					opacity: refLineOpacity,
					yValue: middle }),
				React.createElement(StraightLine, {
					stroke: stroke.bottom,
					opacity: refLineOpacity,
					yValue: overBought })
			);
		}
	}]);

	return StochasticSeries;
}(Component);

StochasticSeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.shape({
		top: PropTypes.string.isRequired,
		middle: PropTypes.string.isRequired,
		bottom: PropTypes.string.isRequired,
		dLine: PropTypes.string.isRequired,
		kLine: PropTypes.string.isRequired
	}).isRequired,
	overSold: PropTypes.number.isRequired,
	middle: PropTypes.number.isRequired,
	overBought: PropTypes.number.isRequired,
	refLineOpacity: PropTypes.number.isRequired
};

StochasticSeries.defaultProps = {
	className: "react-stockcharts-stochastic-series",
	stroke: {
		top: "#964B00",
		middle: "#000000",
		bottom: "#964B00",
		dLine: "#EA2BFF",
		kLine: "#74D400"
	},
	overSold: 80,
	middle: 50,
	overBought: 20,
	refLineOpacity: 0.3
};

export default StochasticSeries;
//# sourceMappingURL=StochasticSeries.js.map