var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import { isDefined, functor } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

var BollingerBandTooltip = function (_Component) {
	_inherits(BollingerBandTooltip, _Component);

	function BollingerBandTooltip(props) {
		_classCallCheck(this, BollingerBandTooltip);

		var _this = _possibleConstructorReturn(this, (BollingerBandTooltip.__proto__ || Object.getPrototypeOf(BollingerBandTooltip)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		return _this;
	}

	_createClass(BollingerBandTooltip, [{
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props = this.props,
			    onClick = _props.onClick,
			    displayFormat = _props.displayFormat,
			    yAccessor = _props.yAccessor,
			    options = _props.options,
			    textFill = _props.textFill,
			    labelFill = _props.labelFill;
			var displayValuesFor = this.props.displayValuesFor;
			var _moreProps$chartConfi = moreProps.chartConfig,
			    width = _moreProps$chartConfi.width,
			    height = _moreProps$chartConfi.height;


			var currentItem = displayValuesFor(this.props, moreProps);

			var top = void 0,
			    middle = void 0,
			    bottom = void 0;
			top = middle = bottom = "n/a";

			if (isDefined(currentItem) && isDefined(yAccessor(currentItem))) {
				var item = yAccessor(currentItem);
				top = displayFormat(item.top);
				middle = displayFormat(item.middle);
				bottom = displayFormat(item.bottom);
			}

			var originProp = this.props.origin;

			var origin = functor(originProp);

			var _origin = origin(width, height),
			    _origin2 = _slicedToArray(_origin, 2),
			    x = _origin2[0],
			    y = _origin2[1];

			var sourcePath = options.sourcePath,
			    windowSize = options.windowSize,
			    multiplier = options.multiplier,
			    movingAverageType = options.movingAverageType;

			var tooltipLabel = "BB(" + sourcePath + ", " + windowSize + ", " + multiplier + ", " + movingAverageType + "): ";
			var tooltipValue = top + ", " + middle + ", " + bottom;
			return React.createElement(
				"g",
				{ transform: "translate(" + x + ", " + y + ")",
					className: this.props.className, onClick: onClick },
				React.createElement(
					ToolTipText,
					{ x: 0, y: 0,
						fontFamily: this.props.fontFamily, fontSize: this.props.fontSize },
					React.createElement(
						ToolTipTSpanLabel,
						{ fill: labelFill },
						tooltipLabel
					),
					React.createElement(
						"tspan",
						{ fill: textFill },
						tooltipValue
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

	return BollingerBandTooltip;
}(Component);

BollingerBandTooltip.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	displayValuesFor: PropTypes.func,
	displayFormat: PropTypes.func.isRequired,
	origin: PropTypes.array.isRequired,
	onClick: PropTypes.func,
	options: PropTypes.shape({
		sourcePath: PropTypes.string.isRequired,
		windowSize: PropTypes.number.isRequired,
		multiplier: PropTypes.number.isRequired,
		movingAverageType: PropTypes.string.isRequired
	}).isRequired,
	textFill: PropTypes.string,
	labelFill: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number
};

BollingerBandTooltip.defaultProps = {
	className: "react-stockcharts-tooltip react-stockcharts-bollingerband-tooltip",
	displayFormat: format(".2f"),
	displayValuesFor: displayValuesFor,
	origin: [0, 10]
};

export default BollingerBandTooltip;
//# sourceMappingURL=BollingerBandTooltip.js.map