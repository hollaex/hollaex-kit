var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";

var Annotate = function (_Component) {
	_inherits(Annotate, _Component);

	function Annotate(props) {
		_classCallCheck(this, Annotate);

		var _this = _possibleConstructorReturn(this, (Annotate.__proto__ || Object.getPrototypeOf(Annotate)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		return _this;
	}

	_createClass(Annotate, [{
		key: "render",
		value: function render() {
			return React.createElement(GenericChartComponent, {
				svgDraw: this.renderSVG,
				drawOn: ["pan"]
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData;
			var _props = this.props,
			    className = _props.className,
			    usingProps = _props.usingProps,
			    Annotation = _props.with;

			var data = helper(this.props, plotData);

			return React.createElement(
				"g",
				{ className: "react-stockcharts-enable-interaction " + className },
				data.map(function (d, idx) {
					return React.createElement(Annotation, _extends({ key: idx
					}, usingProps, {
						xScale: xScale,
						yScale: yScale,
						xAccessor: xAccessor,
						plotData: plotData,
						datum: d }));
				})
			);
		}
	}]);

	return Annotate;
}(Component);

Annotate.propTypes = {
	className: PropTypes.string,
	with: PropTypes.func,
	when: PropTypes.func,
	usingProps: PropTypes.object
};

Annotate.defaultProps = {
	className: "react-stockcharts-annotate react-stockcharts-default-cursor"
};

function helper(_ref, plotData) {
	var when = _ref.when;

	return plotData.filter(when);
}

export default Annotate;
//# sourceMappingURL=Annotate.js.map