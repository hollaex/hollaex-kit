var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import PureComponent from "./utils/PureComponent";

import { hexToRGBA, isDefined } from "./utils";

var BackgroundText = function (_PureComponent) {
	_inherits(BackgroundText, _PureComponent);

	function BackgroundText() {
		_classCallCheck(this, BackgroundText);

		return _possibleConstructorReturn(this, (BackgroundText.__proto__ || Object.getPrototypeOf(BackgroundText)).apply(this, arguments));
	}

	_createClass(BackgroundText, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.context.chartCanvasType !== "svg" && isDefined(this.context.getCanvasContexts)) {
				var contexts = this.context.getCanvasContexts();
				if (contexts) BackgroundText.drawOnCanvas(contexts.bg, this.props, this.context, this.props.children);
			}
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			this.componentDidMount();
		}
	}, {
		key: "render",
		value: function render() {
			var chartCanvasType = this.context.chartCanvasType;


			if (chartCanvasType !== "svg") return null;

			var _props = this.props,
			    x = _props.x,
			    y = _props.y,
			    fill = _props.fill,
			    opacity = _props.opacity,
			    stroke = _props.stroke,
			    strokeOpacity = _props.strokeOpacity,
			    fontFamily = _props.fontFamily,
			    fontSize = _props.fontSize,
			    textAnchor = _props.textAnchor;

			var props = { x: x, y: y, fill: fill, opacity: opacity, stroke: stroke, strokeOpacity: strokeOpacity, fontFamily: fontFamily, fontSize: fontSize, textAnchor: textAnchor };
			return React.createElement(
				"text",
				props,
				"this.props.children(interval)"
			);
		}
	}]);

	return BackgroundText;
}(PureComponent);

BackgroundText.drawOnCanvas = function (ctx, props, _ref, getText) {
	var interval = _ref.interval;

	ctx.clearRect(-1, -1, ctx.canvas.width + 2, ctx.canvas.height + 2);
	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(0.5, 0.5);

	var x = props.x,
	    y = props.y,
	    fill = props.fill,
	    opacity = props.opacity,
	    stroke = props.stroke,
	    strokeOpacity = props.strokeOpacity,
	    fontFamily = props.fontFamily,
	    fontSize = props.fontSize,
	    textAnchor = props.textAnchor;


	var text = getText(interval);

	ctx.strokeStyle = hexToRGBA(stroke, strokeOpacity);

	ctx.font = fontSize + "px " + fontFamily;
	ctx.fillStyle = hexToRGBA(fill, opacity);
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	if (stroke !== "none") ctx.strokeText(text, x, y);
	ctx.fillText(text, x, y);

	ctx.restore();
};

BackgroundText.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number.isRequired,
	fill: PropTypes.string,
	stroke: PropTypes.string,
	opacity: PropTypes.number,
	strokeOpacity: PropTypes.number,
	textAnchor: PropTypes.string,
	children: PropTypes.func
};

BackgroundText.defaultProps = {
	opacity: 0.3,
	fill: "#9E7523",
	stroke: "#9E7523",
	strokeOpacity: 1,
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	textAnchor: "middle"
};

BackgroundText.contextTypes = {
	interval: PropTypes.string.isRequired,
	getCanvasContexts: PropTypes.func,
	chartCanvasType: PropTypes.string
};

export default BackgroundText;
//# sourceMappingURL=BackgroundText.js.map