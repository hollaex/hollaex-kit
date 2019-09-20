var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

var propTypes = {
	xPosition: PropTypes.func,
	drawCoordinate: PropTypes.func,
	displayFormat: PropTypes.func.isRequired,
	at: PropTypes.oneOf(["bottom", "top"]),
	orient: PropTypes.oneOf(["bottom", "top"]),
	text: PropTypes.shape({
		fontStyle: PropTypes.string,
		fontWeight: PropTypes.string,
		fontFamily: PropTypes.string,
		fontSize: PropTypes.number,
		fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
	}),
	bg: PropTypes.shape({
		fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
		stroke: PropTypes.string,
		strokeWidth: PropTypes.number,
		padding: PropTypes.shape({
			left: PropTypes.number,
			right: PropTypes.number,
			top: PropTypes.number,
			bottom: PropTypes.number
		})
	}),
	dx: PropTypes.number,
	dy: PropTypes.number
};

var defaultProps = {
	xPosition: xPosition,
	drawCoordinate: drawCoordinate,
	at: "bottom",
	orient: "bottom",

	text: {
		fontStyle: "",
		fontWeight: "",
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 13,
		fill: "rgb(35, 35, 35)"
	},
	bg: {
		fill: "rgb(255, 255, 255)",
		stroke: "rgb(35, 35, 35)",
		strokeWidth: 1,
		padding: {
			left: 7,
			right: 7,
			top: 4,
			bottom: 4
		}
	},
	dx: 7,
	dy: 7
};

var MouseCoordinateXV2 = function (_Component) {
	_inherits(MouseCoordinateXV2, _Component);

	function MouseCoordinateXV2(props) {
		_classCallCheck(this, MouseCoordinateXV2);

		var _this = _possibleConstructorReturn(this, (MouseCoordinateXV2.__proto__ || Object.getPrototypeOf(MouseCoordinateXV2)).call(this, props));

		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(MouseCoordinateXV2, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var show = moreProps.show,
			    currentItem = moreProps.currentItem;
			var drawCoordinate = this.props.drawCoordinate;


			if (show && currentItem != null) {
				var shape = getXCoordinateInfo(ctx, this.props, moreProps);
				drawCoordinate(ctx, shape, this.props, moreProps);
			}
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(GenericChartComponent, {
				clip: false,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: getMouseCanvas,
				drawOn: ["mousemove", "pan", "drag"]
			});
		}
	}]);

	return MouseCoordinateXV2;
}(Component);

MouseCoordinateXV2.defaultProps = defaultProps;
MouseCoordinateXV2.propTypes = propTypes;

function xPosition(props, moreProps) {
	var currentItem = moreProps.currentItem,
	    xAccessor = moreProps.xAccessor;

	return xAccessor(currentItem);
}
function getXCoordinateInfo(ctx, props, moreProps) {
	var xPosition = props.xPosition;

	var xValue = xPosition(props, moreProps);
	var at = props.at,
	    displayFormat = props.displayFormat;
	var text = props.text;
	var xScale = moreProps.xScale,
	    height = moreProps.chartConfig.height;

	ctx.font = text.fontStyle + " " + text.fontWeight + " " + text.fontSize + "px " + text.fontFamily;

	var t = displayFormat(xValue);
	var textWidth = ctx.measureText(t).width;

	var y = at === "bottom" ? height : 0;
	var x = Math.round(xScale(xValue));

	return {
		x: x,
		y: y,
		textWidth: textWidth,
		text: t
	};
}

function drawCoordinate(ctx, shape, props, moreProps) {
	var x = shape.x,
	    y = shape.y,
	    textWidth = shape.textWidth,
	    text = shape.text;
	var orient = props.orient,
	    dx = props.dx,
	    dy = props.dy;
	var _props$bg = props.bg,
	    padding = _props$bg.padding,
	    fill = _props$bg.fill,
	    stroke = _props$bg.stroke,
	    strokeWidth = _props$bg.strokeWidth,
	    _props$text = props.text,
	    fontSize = _props$text.fontSize,
	    textFill = _props$text.fill;


	ctx.textAlign = "center";

	var sign = orient === "top" ? -1 : 1;
	var halfWidth = Math.round(textWidth / 2 + padding.right);
	var height = Math.round(fontSize + padding.top + padding.bottom);

	ctx.strokeStyle = typeof stroke === "function" ? stroke(moreProps, ctx) : stroke;
	ctx.fillStyle = typeof fill === "function" ? fill(moreProps, ctx) : fill;
	ctx.lineWidth = typeof strokeWidth === "function" ? strokeWidth(moreProps) : strokeWidth;

	ctx.beginPath();

	ctx.moveTo(x, y);
	ctx.lineTo(x + dx, y + sign * dy);
	ctx.lineTo(x + halfWidth, y + sign * dy);
	ctx.lineTo(x + halfWidth, y + sign * (dy + height));
	ctx.lineTo(x - halfWidth, y + sign * (dy + height));
	ctx.lineTo(x - halfWidth, y + sign * dy);
	ctx.lineTo(x - dx, y + sign * dy);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = typeof textFill === "function" ? textFill(moreProps, ctx) : textFill;

	ctx.textBaseline = orient === "top" ? "alphabetic" : "hanging";
	var pad = orient === "top" ? padding.bottom : padding.top;

	ctx.fillText(text, x, y + sign * (dy + pad + 2));
}

export default MouseCoordinateXV2;
//# sourceMappingURL=MouseCoordinateXV2.js.map