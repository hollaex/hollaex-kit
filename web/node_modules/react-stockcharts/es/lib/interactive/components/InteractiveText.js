var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import { isDefined, noop, hexToRGBA } from "../../utils";

var InteractiveText = function (_Component) {
	_inherits(InteractiveText, _Component);

	function InteractiveText(props) {
		_classCallCheck(this, InteractiveText);

		var _this = _possibleConstructorReturn(this, (InteractiveText.__proto__ || Object.getPrototypeOf(InteractiveText)).call(this, props));

		_this.calculateTextWidth = true;

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(InteractiveText, [{
		key: "isHover",
		value: function isHover(moreProps) {
			var onHover = this.props.onHover;


			if (isDefined(onHover) && isDefined(this.textWidth) && !this.calculateTextWidth) {
				var _helper = helper(this.props, moreProps, this.textWidth),
				    rect = _helper.rect;

				var _moreProps$mouseXY = _slicedToArray(moreProps.mouseXY, 2),
				    x = _moreProps$mouseXY[0],
				    y = _moreProps$mouseXY[1];

				if (x >= rect.x && y >= rect.y && x <= rect.x + rect.width && y <= rect.y + rect.height) {
					return true;
				}
			}
			return false;
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.calculateTextWidth = nextProps.text !== this.props.text || nextProps.fontStyle !== this.props.fontStyle || nextProps.fontWeight !== this.props.fontWeight || nextProps.fontSize !== this.props.fontSize || nextProps.fontFamily !== this.props.fontFamily;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props = this.props,
			    bgFill = _props.bgFill,
			    bgOpacity = _props.bgOpacity,
			    bgStrokeWidth = _props.bgStrokeWidth,
			    bgStroke = _props.bgStroke,
			    textFill = _props.textFill,
			    fontFamily = _props.fontFamily,
			    fontSize = _props.fontSize,
			    fontStyle = _props.fontStyle,
			    fontWeight = _props.fontWeight,
			    text = _props.text;


			if (this.calculateTextWidth) {
				ctx.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;

				var _ctx$measureText = ctx.measureText(text),
				    width = _ctx$measureText.width;

				this.textWidth = width;
				this.calculateTextWidth = false;
			}

			var selected = this.props.selected;

			var _helper2 = helper(this.props, moreProps, this.textWidth),
			    x = _helper2.x,
			    y = _helper2.y,
			    rect = _helper2.rect;

			ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);

			ctx.beginPath();
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

			if (selected) {
				ctx.strokeStyle = bgStroke;
				ctx.lineWidth = bgStrokeWidth;
				ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
			}

			ctx.fillStyle = textFill;
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;

			ctx.beginPath();
			ctx.fillText(text, x, y);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG() {
			throw new Error("svg not implemented");
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props,
			    selected = _props2.selected,
			    interactiveCursorClass = _props2.interactiveCursorClass;
			var _props3 = this.props,
			    onHover = _props3.onHover,
			    onUnHover = _props3.onUnHover;
			var _props4 = this.props,
			    onDragStart = _props4.onDragStart,
			    onDrag = _props4.onDrag,
			    onDragComplete = _props4.onDragComplete;


			return React.createElement(GenericChartComponent, {
				isHover: this.isHover,

				svgDraw: this.renderSVG,
				canvasToDraw: getMouseCanvas,
				canvasDraw: this.drawOnCanvas,

				interactiveCursorClass: interactiveCursorClass,
				selected: selected,

				onDragStart: onDragStart,
				onDrag: onDrag,
				onDragComplete: onDragComplete,
				onHover: onHover,
				onUnHover: onUnHover,

				drawOn: ["mousemove", "mouseleave", "pan", "drag"]
			});
		}
	}]);

	return InteractiveText;
}(Component);

function helper(props, moreProps, textWidth) {
	var position = props.position,
	    fontSize = props.fontSize;
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale;

	var _position = _slicedToArray(position, 2),
	    xValue = _position[0],
	    yValue = _position[1];

	var x = xScale(xValue);
	var y = yScale(yValue);

	var rect = {
		x: x - textWidth / 2 - fontSize,
		y: y - fontSize,
		width: textWidth + fontSize * 2,
		height: fontSize * 2
	};

	return {
		x: x, y: y, rect: rect
	};
}

InteractiveText.propTypes = {
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	bgStrokeWidth: PropTypes.number.isRequired,
	bgStroke: PropTypes.string.isRequired,

	textFill: PropTypes.string.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	fontWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	fontStyle: PropTypes.string.isRequired,

	text: PropTypes.string.isRequired,

	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,

	defaultClassName: PropTypes.string,
	interactiveCursorClass: PropTypes.string,

	tolerance: PropTypes.number.isRequired,
	selected: PropTypes.bool.isRequired
};

InteractiveText.defaultProps = {
	onDragStart: noop,
	onDrag: noop,
	onDragComplete: noop,

	type: "SD", // standard dev
	fontWeight: "normal", // standard dev

	tolerance: 4,
	selected: false
};

export default InteractiveText;
//# sourceMappingURL=InteractiveText.js.map