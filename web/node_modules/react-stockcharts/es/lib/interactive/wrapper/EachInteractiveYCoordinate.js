var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { saveNodeType, isHover } from "../utils";

import ClickableShape from "../components/ClickableShape";
import InteractiveYCoordinate from "../components/InteractiveYCoordinate";

var EachInteractiveYCoordinate = function (_Component) {
	_inherits(EachInteractiveYCoordinate, _Component);

	function EachInteractiveYCoordinate(props) {
		_classCallCheck(this, EachInteractiveYCoordinate);

		var _this = _possibleConstructorReturn(this, (EachInteractiveYCoordinate.__proto__ || Object.getPrototypeOf(EachInteractiveYCoordinate)).call(this, props));

		_this.handleHover = _this.handleHover.bind(_this);
		_this.handleCloseIconHover = _this.handleCloseIconHover.bind(_this);

		_this.handleDragStart = _this.handleDragStart.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);

		_this.handleDelete = _this.handleDelete.bind(_this);

		_this.isHover = isHover.bind(_this);
		_this.saveNodeType = saveNodeType.bind(_this);
		_this.nodes = {};

		_this.state = {
			hover: false,
			closeIconHover: false
		};
		return _this;
	}

	_createClass(EachInteractiveYCoordinate, [{
		key: "handleDragStart",
		value: function handleDragStart(moreProps) {
			var yValue = this.props.yValue;
			var mouseXY = moreProps.mouseXY;
			var yScale = moreProps.chartConfig.yScale;

			var _mouseXY = _slicedToArray(mouseXY, 2),
			    mouseY = _mouseXY[1];

			var dy = mouseY - yScale(yValue);

			this.dragStartPosition = {
				yValue: yValue, dy: dy
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
			    yScale = moreProps.chartConfig.yScale;

			var dy = this.dragStartPosition.dy;


			var newYValue = yScale.invert(mouseY - dy);

			onDrag(index, newYValue);
		}
	}, {
		key: "handleDelete",
		value: function handleDelete(moreProps) {
			var _props2 = this.props,
			    index = _props2.index,
			    onDelete = _props2.onDelete;

			onDelete(index, moreProps);
		}
	}, {
		key: "handleHover",
		value: function handleHover(moreProps) {
			if (this.state.hover !== moreProps.hovering) {
				this.setState({
					hover: moreProps.hovering,
					closeIconHover: moreProps.hovering ? this.state.closeIconHover : false
				});
			}
		}
	}, {
		key: "handleCloseIconHover",
		value: function handleCloseIconHover(moreProps) {
			if (this.state.closeIconHover !== moreProps.hovering) {
				this.setState({
					closeIconHover: moreProps.hovering
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props3 = this.props,
			    yValue = _props3.yValue,
			    bgFill = _props3.bgFill,
			    bgOpacity = _props3.bgOpacity,
			    textFill = _props3.textFill,
			    fontFamily = _props3.fontFamily,
			    fontSize = _props3.fontSize,
			    fontWeight = _props3.fontWeight,
			    fontStyle = _props3.fontStyle,
			    text = _props3.text,
			    selected = _props3.selected,
			    onDragComplete = _props3.onDragComplete,
			    stroke = _props3.stroke,
			    strokeOpacity = _props3.strokeOpacity,
			    strokeDasharray = _props3.strokeDasharray,
			    strokeWidth = _props3.strokeWidth,
			    edge = _props3.edge,
			    textBox = _props3.textBox,
			    draggable = _props3.draggable;
			var _state = this.state,
			    hover = _state.hover,
			    closeIconHover = _state.closeIconHover;


			var hoverHandler = {
				onHover: this.handleHover,
				onUnHover: this.handleHover
			};

			var dragProps = draggable ? {
				onDragStart: this.handleDragStart,
				onDrag: this.handleDrag,
				onDragComplete: onDragComplete
			} : {};
			return React.createElement(
				"g",
				null,
				React.createElement(InteractiveYCoordinate, _extends({
					ref: this.saveNodeType("priceCoordinate"),
					selected: selected && !closeIconHover,
					hovering: hover || closeIconHover,
					interactiveCursorClass: "react-stockcharts-move-cursor"
				}, hoverHandler, dragProps, {

					yValue: yValue,
					bgFill: bgFill,
					bgOpacity: bgOpacity,
					textFill: textFill,
					fontFamily: fontFamily,
					fontStyle: fontStyle,
					fontWeight: fontWeight,
					fontSize: fontSize,
					stroke: stroke,
					strokeOpacity: strokeOpacity,
					strokeDasharray: strokeDasharray,
					strokeWidth: strokeWidth,
					text: text,
					textBox: textBox,
					edge: edge
				})),
				React.createElement(ClickableShape, {
					show: true,
					hovering: closeIconHover,
					text: text,
					yValue: yValue,
					fontFamily: fontFamily,
					fontStyle: fontStyle,
					fontWeight: fontWeight,
					fontSize: fontSize,
					textBox: textBox,

					stroke: stroke,
					strokeOpacity: strokeOpacity,

					onHover: this.handleCloseIconHover,
					onUnHover: this.handleCloseIconHover,
					onClick: this.handleDelete
				})
			);
		}
	}]);

	return EachInteractiveYCoordinate;
}(Component);

EachInteractiveYCoordinate.propTypes = {
	index: PropTypes.number,

	draggable: PropTypes.bool.isRequired,
	yValue: PropTypes.number.isRequired,

	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	strokeOpacity: PropTypes.number.isRequired,
	strokeDasharray: PropTypes.string.isRequired,
	textFill: PropTypes.string.isRequired,

	fontWeight: PropTypes.string.isRequired,
	fontFamily: PropTypes.string.isRequired,
	fontStyle: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,

	text: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,

	edge: PropTypes.object.isRequired,
	textBox: PropTypes.object.isRequired,

	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired
};

EachInteractiveYCoordinate.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,

	strokeWidth: 1,
	opacity: 1,
	selected: false,
	fill: "#FFFFFF",
	draggable: false
};

export default EachInteractiveYCoordinate;
//# sourceMappingURL=EachInteractiveYCoordinate.js.map