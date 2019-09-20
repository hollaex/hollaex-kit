var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { saveNodeType, isHover } from "../utils";
import { getXValue } from "../../utils/ChartDataUtil";

import HoverTextNearMouse from "../components/HoverTextNearMouse";
import InteractiveText from "../components/InteractiveText";

var EachText = function (_Component) {
	_inherits(EachText, _Component);

	function EachText(props) {
		_classCallCheck(this, EachText);

		var _this = _possibleConstructorReturn(this, (EachText.__proto__ || Object.getPrototypeOf(EachText)).call(this, props));

		_this.handleHover = _this.handleHover.bind(_this);

		_this.handleDragStart = _this.handleDragStart.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);

		_this.isHover = isHover.bind(_this);
		_this.saveNodeType = saveNodeType.bind(_this);
		_this.nodes = {};

		_this.state = {
			hover: false
		};
		return _this;
	}

	_createClass(EachText, [{
		key: "handleDragStart",
		value: function handleDragStart(moreProps) {
			var position = this.props.position;
			var mouseXY = moreProps.mouseXY;
			var yScale = moreProps.chartConfig.yScale,
			    xScale = moreProps.xScale;

			var _mouseXY = _slicedToArray(mouseXY, 2),
			    mouseX = _mouseXY[0],
			    mouseY = _mouseXY[1];

			var _position = _slicedToArray(position, 2),
			    textCX = _position[0],
			    textCY = _position[1];

			var dx = mouseX - xScale(textCX);
			var dy = mouseY - yScale(textCY);

			this.dragStartPosition = {
				position: position, dx: dx, dy: dy
			};
		}
	}, {
		key: "handleDrag",
		value: function handleDrag(moreProps) {
			var _props = this.props,
			    index = _props.index,
			    onDrag = _props.onDrag;

			var _moreProps$mouseXY = _slicedToArray(moreProps.mouseXY, 2),
			    mouseY = _moreProps$mouseXY[1],
			    yScale = moreProps.chartConfig.yScale,
			    xAccessor = moreProps.xAccessor,
			    mouseXY = moreProps.mouseXY,
			    plotData = moreProps.plotData,
			    xScale = moreProps.xScale;

			var _dragStartPosition = this.dragStartPosition,
			    dx = _dragStartPosition.dx,
			    dy = _dragStartPosition.dy;

			var xValue = xScale.invert(xScale(getXValue(xScale, xAccessor, mouseXY, plotData)) - dx);
			// xScale.invert(xScale(xAccessor(currentItem)) - dx);
			var xyValue = [xValue, yScale.invert(mouseY - dy)];

			onDrag(index, xyValue);
		}
	}, {
		key: "handleHover",
		value: function handleHover(moreProps) {
			if (this.state.hover !== moreProps.hovering) {
				this.setState({
					hover: moreProps.hovering
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props,
			    position = _props2.position,
			    bgFill = _props2.bgFill,
			    bgOpacity = _props2.bgOpacity,
			    bgStroke = _props2.bgStroke,
			    bgStrokeWidth = _props2.bgStrokeWidth,
			    textFill = _props2.textFill,
			    fontFamily = _props2.fontFamily,
			    fontSize = _props2.fontSize,
			    fontWeight = _props2.fontWeight,
			    fontStyle = _props2.fontStyle,
			    text = _props2.text,
			    hoverText = _props2.hoverText,
			    selected = _props2.selected,
			    onDragComplete = _props2.onDragComplete;
			var hover = this.state.hover;


			var hoverHandler = {
				onHover: this.handleHover,
				onUnHover: this.handleHover
			};

			var hoverTextEnabled = hoverText.enable,
			    hoverTextSelected = hoverText.selectedText,
			    hoverTextUnselected = hoverText.text,
			    restHoverTextProps = _objectWithoutProperties(hoverText, ["enable", "selectedText", "text"]);

			return React.createElement(
				"g",
				null,
				React.createElement(InteractiveText, _extends({
					ref: this.saveNodeType("text"),
					selected: selected || hover,
					interactiveCursorClass: "react-stockcharts-move-cursor"
				}, hoverHandler, {

					onDragStart: this.handleDragStart,
					onDrag: this.handleDrag,
					onDragComplete: onDragComplete,
					position: position,
					bgFill: bgFill,
					bgOpacity: bgOpacity,
					bgStroke: bgStroke || textFill,
					bgStrokeWidth: bgStrokeWidth,
					textFill: textFill,
					fontFamily: fontFamily,
					fontStyle: fontStyle,
					fontWeight: fontWeight,
					fontSize: fontSize,
					text: text
				})),
				React.createElement(HoverTextNearMouse, _extends({
					show: hoverTextEnabled && hover
				}, restHoverTextProps, {
					text: selected ? hoverTextSelected : hoverTextUnselected
				}))
			);
		}
	}]);

	return EachText;
}(Component);
/*
export function getNewXY(moreProps, snapTo) {
	const { xScale, xAccessor, plotData, mouseXY } = moreProps;

	const currentItem = getCurrentItem(xScale, xAccessor, mouseXY, plotData);
	const x = xAccessor(currentItem);
	const y = snapTo(currentItem);

	return [x, y];
}
 */


EachText.propTypes = {
	index: PropTypes.number,

	position: PropTypes.array.isRequired,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	bgStrokeWidth: PropTypes.number.isRequired,
	bgStroke: PropTypes.string,
	textFill: PropTypes.string.isRequired,

	fontWeight: PropTypes.string.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontStyle: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,

	text: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,

	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,

	hoverText: PropTypes.object.isRequired
};

EachText.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,
	bgOpacity: 1,
	bgStrokeWidth: 1,
	selected: false,
	fill: "#8AAFE2",
	hoverText: _extends({}, HoverTextNearMouse.defaultProps, {
		enable: true,
		bgHeight: "auto",
		bgWidth: "auto",
		text: "Click to select object"
	})
};

export default EachText;
//# sourceMappingURL=EachText.js.map