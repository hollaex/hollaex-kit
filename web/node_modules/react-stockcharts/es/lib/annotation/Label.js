var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericComponent from "../GenericComponent";

import { isDefined, hexToRGBA, functor } from "../utils";
import LabelAnnotation, { defaultProps, helper } from "./LabelAnnotation";

var Label = function (_Component) {
	_inherits(Label, _Component);

	function Label(props) {
		_classCallCheck(this, Label);

		var _this = _possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(Label, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			drawOnCanvas2(ctx, this.props, this.context, moreProps);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(GenericComponent, {
				canvasToDraw: this.props.selectCanvas,
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				drawOn: []
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var chartConfig = moreProps.chartConfig;


			return React.createElement(LabelAnnotation, _extends({ yScale: getYScale(chartConfig) }, this.props, { text: getText(this.props) }));
		}
	}]);

	return Label;
}(Component);

function getText(props) {
	return functor(props.text)(props);
}

function getYScale(chartConfig) {
	return Array.isArray(chartConfig) ? undefined : chartConfig.yScale;
}

Label.propTypes = {
	className: PropTypes.string,
	selectCanvas: PropTypes.func,
	text: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
	textAnchor: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	opacity: PropTypes.number,
	rotate: PropTypes.number,
	onClick: PropTypes.func,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	datum: PropTypes.object,
	x: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
	y: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
};

Label.contextTypes = {
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,

	margin: PropTypes.object.isRequired,
	ratio: PropTypes.number.isRequired
};

Label.defaultProps = _extends({}, defaultProps, {
	selectCanvas: function selectCanvas(canvases) {
		return canvases.bg;
	}
});

function drawOnCanvas2(ctx, props, context, moreProps) {
	ctx.save();

	var canvasOriginX = context.canvasOriginX,
	    canvasOriginY = context.canvasOriginY,
	    margin = context.margin,
	    ratio = context.ratio;

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(ratio, ratio);

	if (isDefined(canvasOriginX)) ctx.translate(canvasOriginX, canvasOriginY);else ctx.translate(margin.left + 0.5 * ratio, margin.top + 0.5 * ratio);

	drawOnCanvas(ctx, props, moreProps);

	ctx.restore();
}

function drawOnCanvas(ctx, props, moreProps) {
	var textAnchor = props.textAnchor,
	    fontFamily = props.fontFamily,
	    fontSize = props.fontSize,
	    opacity = props.opacity,
	    rotate = props.rotate;
	var xScale = moreProps.xScale,
	    chartConfig = moreProps.chartConfig,
	    xAccessor = moreProps.xAccessor;

	var _helper = helper(props, xAccessor, xScale, getYScale(chartConfig)),
	    xPos = _helper.xPos,
	    yPos = _helper.yPos,
	    fill = _helper.fill,
	    text = _helper.text;

	var radians = rotate / 180 * Math.PI;
	ctx.save();
	ctx.translate(xPos, yPos);
	ctx.rotate(radians);

	ctx.font = fontSize + "px " + fontFamily;
	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	ctx.beginPath();
	ctx.fillText(text, 0, 0);
	ctx.restore();
}

export default Label;
//# sourceMappingURL=Label.js.map