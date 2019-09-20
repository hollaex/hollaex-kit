var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { functor } from "../utils";

var BarAnnotation = function (_Component) {
	_inherits(BarAnnotation, _Component);

	function BarAnnotation(props) {
		_classCallCheck(this, BarAnnotation);

		var _this = _possibleConstructorReturn(this, (BarAnnotation.__proto__ || Object.getPrototypeOf(BarAnnotation)).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(BarAnnotation, [{
		key: "handleClick",
		value: function handleClick(e) {
			var onClick = this.props.onClick;


			if (onClick) {
				var _props = this.props,
				    xScale = _props.xScale,
				    yScale = _props.yScale,
				    datum = _props.datum;

				onClick({ xScale: xScale, yScale: yScale, datum: datum }, e);
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props,
			    className = _props2.className,
			    stroke = _props2.stroke,
			    opacity = _props2.opacity;
			var _props3 = this.props,
			    xAccessor = _props3.xAccessor,
			    xScale = _props3.xScale,
			    yScale = _props3.yScale,
			    path = _props3.path;
			var _props4 = this.props,
			    text = _props4.text,
			    textXOffset = _props4.textXOffset,
			    textYOffset = _props4.textYOffset,
			    textAnchor = _props4.textAnchor,
			    fontFamily = _props4.fontFamily,
			    fontSize = _props4.fontSize,
			    textFill = _props4.textFill,
			    textOpacity = _props4.textOpacity,
			    textRotate = _props4.textRotate;

			var _helper = helper(this.props, xAccessor, xScale, yScale),
			    x = _helper.x,
			    y = _helper.y,
			    fill = _helper.fill,
			    tooltip = _helper.tooltip;

			var _props5 = this.props,
			    textIcon = _props5.textIcon,
			    textIconFontSize = _props5.textIconFontSize,
			    textIconFill = _props5.textIconFill,
			    textIconOpacity = _props5.textIconOpacity,
			    textIconRotate = _props5.textIconRotate,
			    textIconXOffset = _props5.textIconXOffset,
			    textIconYOffset = _props5.textIconYOffset;


			return React.createElement(
				"g",
				{ className: className, onClick: this.handleClick },
				tooltip != null ? React.createElement(
					"title",
					null,
					tooltip
				) : null,
				text != null ? React.createElement(
					"text",
					{
						x: x,
						y: y,
						dx: textXOffset,
						dy: textYOffset,
						fontFamily: fontFamily,
						fontSize: fontSize,
						fill: textFill,
						opacity: textOpacity,
						transform: textRotate != null ? "rotate(" + textRotate + ", " + x + ", " + y + ")" : null,
						textAnchor: textAnchor
					},
					text
				) : null,
				textIcon != null ? React.createElement(
					"text",
					{
						x: x,
						y: y,
						dx: textIconXOffset,
						dy: textIconYOffset,
						fontSize: textIconFontSize,
						fill: textIconFill,
						opacity: textIconOpacity,
						transform: textIconRotate != null ? "rotate(" + textIconRotate + ", " + x + ", " + y + ")" : null,
						textAnchor: textAnchor
					},
					textIcon
				) : null,
				path != null ? React.createElement("path", {
					d: path({ x: x, y: y }),
					stroke: stroke,
					fill: fill,
					opacity: opacity
				}) : null
			);
		}
	}]);

	return BarAnnotation;
}(Component);

function helper(props, xAccessor, xScale, yScale) {
	var x = props.x,
	    y = props.y,
	    datum = props.datum,
	    fill = props.fill,
	    tooltip = props.tooltip,
	    plotData = props.plotData;


	var xFunc = functor(x);
	var yFunc = functor(y);

	var _ref = [xFunc({ xScale: xScale, xAccessor: xAccessor, datum: datum, plotData: plotData }), yFunc({ yScale: yScale, datum: datum, plotData: plotData })],
	    xPos = _ref[0],
	    yPos = _ref[1];


	return {
		x: xPos,
		y: yPos,
		fill: functor(fill)(datum),
		tooltip: functor(tooltip)(datum)
	};
}

/**
 * any unicode can be applied.
 * @param {any} type
 */

export function getArrowForTextIcon(type) {
	var arrows = {
		simpleUp: "⬆",
		simpleDown: "⬇",
		fatUp: "▲",
		fatDown: "▼",
		lightUp: "↑",
		lightDown: "↓",
		dashedUp: "⇡",
		dashedDown: "⇣",
		dashedRight: "➟",
		fatRight: "➡",
		right: "➤"
	};
	return arrows[type];
}

BarAnnotation.propTypes = {
	className: PropTypes.string,
	path: PropTypes.func,
	onClick: PropTypes.func,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	datum: PropTypes.object,
	stroke: PropTypes.string,
	fill: PropTypes.string,
	opacity: PropTypes.number,
	text: PropTypes.string,
	textAnchor: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	textOpacity: PropTypes.number,
	textFill: PropTypes.string,
	textRotate: PropTypes.number,
	textXOffset: PropTypes.number,
	textYOffset: PropTypes.number,
	textIcon: PropTypes.string,
	textIconFontSize: PropTypes.number,
	textIconOpacity: PropTypes.number,
	textIconFill: PropTypes.string,
	textIconRotate: PropTypes.number,
	textIconXOffset: PropTypes.number,
	textIconYOffset: PropTypes.number,
	textIconAnchor: PropTypes.string
};

BarAnnotation.defaultProps = {
	className: "react-stockcharts-bar-annotation",
	opacity: 1,
	fill: "#000000",
	textAnchor: "middle",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 10,
	textFill: "#000000",
	textOpacity: 1,
	textIconFill: "#000000",
	textIconFontSize: 10,
	x: function x(_ref2) {
		var xScale = _ref2.xScale,
		    xAccessor = _ref2.xAccessor,
		    datum = _ref2.datum;
		return xScale(xAccessor(datum));
	}
};

export default BarAnnotation;
//# sourceMappingURL=BarAnnotation.js.map