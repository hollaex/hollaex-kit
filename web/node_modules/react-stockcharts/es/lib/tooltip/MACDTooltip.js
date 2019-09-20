var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { format } from "d3-format";
import React, { Component } from "react";
import PropTypes from "prop-types";

import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";
import { functor } from "../utils";

var MACDTooltip = function (_Component) {
	_inherits(MACDTooltip, _Component);

	function MACDTooltip(props) {
		_classCallCheck(this, MACDTooltip);

		var _this = _possibleConstructorReturn(this, (MACDTooltip.__proto__ || Object.getPrototypeOf(MACDTooltip)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		return _this;
	}

	_createClass(MACDTooltip, [{
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props = this.props,
			    onClick = _props.onClick,
			    fontFamily = _props.fontFamily,
			    fontSize = _props.fontSize,
			    displayFormat = _props.displayFormat,
			    className = _props.className;
			var _props2 = this.props,
			    yAccessor = _props2.yAccessor,
			    options = _props2.options,
			    appearance = _props2.appearance,
			    labelFill = _props2.labelFill;
			var displayValuesFor = this.props.displayValuesFor;
			var _moreProps$chartConfi = moreProps.chartConfig,
			    width = _moreProps$chartConfi.width,
			    height = _moreProps$chartConfi.height;


			var currentItem = displayValuesFor(this.props, moreProps);
			var macdValue = currentItem && yAccessor(currentItem);

			var macd = macdValue && macdValue.macd && displayFormat(macdValue.macd) || "n/a";
			var signal = macdValue && macdValue.signal && displayFormat(macdValue.signal) || "n/a";
			var divergence = macdValue && macdValue.divergence && displayFormat(macdValue.divergence) || "n/a";

			var originProp = this.props.origin;

			var origin = functor(originProp);

			var _origin = origin(width, height),
			    _origin2 = _slicedToArray(_origin, 2),
			    x = _origin2[0],
			    y = _origin2[1];

			return React.createElement(
				"g",
				{ className: className, transform: "translate(" + x + ", " + y + ")", onClick: onClick },
				React.createElement(
					ToolTipText,
					{ x: 0, y: 0,
						fontFamily: fontFamily, fontSize: fontSize },
					React.createElement(
						ToolTipTSpanLabel,
						{ fill: labelFill },
						"MACD ("
					),
					React.createElement(
						"tspan",
						{ fill: appearance.stroke.macd },
						options.slow
					),
					React.createElement(
						ToolTipTSpanLabel,
						{ fill: labelFill },
						", "
					),
					React.createElement(
						"tspan",
						{ fill: appearance.stroke.macd },
						options.fast
					),
					React.createElement(
						ToolTipTSpanLabel,
						{ fill: labelFill },
						"): "
					),
					React.createElement(
						"tspan",
						{ fill: appearance.stroke.macd },
						macd
					),
					React.createElement(
						ToolTipTSpanLabel,
						{ fill: labelFill },
						" Signal ("
					),
					React.createElement(
						"tspan",
						{ fill: appearance.stroke.signal },
						options.signal
					),
					React.createElement(
						ToolTipTSpanLabel,
						{ fill: labelFill },
						"): "
					),
					React.createElement(
						"tspan",
						{ fill: appearance.stroke.signal },
						signal
					),
					React.createElement(
						ToolTipTSpanLabel,
						{ fill: labelFill },
						" Divergence: "
					),
					React.createElement(
						"tspan",
						{ fill: appearance.fill.divergence },
						divergence
					)
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(GenericChartComponent, {
				clip: false,
				svgDraw: this.renderSVG,
				drawOn: ["mousemove"]
			});
		}
	}]);

	return MACDTooltip;
}(Component);

MACDTooltip.propTypes = {
	origin: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
	className: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	labelFill: PropTypes.string,

	yAccessor: PropTypes.func.isRequired,
	options: PropTypes.shape({
		slow: PropTypes.number.isRequired,
		fast: PropTypes.number.isRequired,
		signal: PropTypes.number.isRequired
	}).isRequired,
	appearance: PropTypes.shape({
		stroke: {
			macd: PropTypes.string.isRequired,
			signal: PropTypes.string.isRequired
		}.isRequired,
		fill: PropTypes.shape({
			divergence: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	displayFormat: PropTypes.func.isRequired,
	displayValuesFor: PropTypes.func,
	onClick: PropTypes.func
};

MACDTooltip.defaultProps = {
	origin: [0, 0],
	displayFormat: format(".2f"),
	displayValuesFor: displayValuesFor,
	className: "react-stockcharts-tooltip"
};

export default MACDTooltip;
// export default MACDTooltip;
//# sourceMappingURL=MACDTooltip.js.map