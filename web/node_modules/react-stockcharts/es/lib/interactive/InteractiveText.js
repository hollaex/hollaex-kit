var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop } from "../utils";

import { getValueFromOverride, terminate, saveNodeType, isHoverForInteractiveType } from "./utils";
import EachText from "./wrapper/EachText";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

var InteractiveText = function (_Component) {
	_inherits(InteractiveText, _Component);

	function InteractiveText(props) {
		_classCallCheck(this, InteractiveText);

		var _this = _possibleConstructorReturn(this, (InteractiveText.__proto__ || Object.getPrototypeOf(InteractiveText)).call(this, props));

		_this.handleDraw = _this.handleDraw.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);
		_this.handleDragComplete = _this.handleDragComplete.bind(_this);
		_this.terminate = terminate.bind(_this);

		_this.saveNodeType = saveNodeType.bind(_this);
		_this.getSelectionState = isHoverForInteractiveType("textList").bind(_this);

		_this.nodes = [];
		_this.state = {};
		return _this;
	}

	_createClass(InteractiveText, [{
		key: "handleDrag",
		value: function handleDrag(index, position) {
			this.setState({
				override: {
					index: index,
					position: position
				}
			});
		}
	}, {
		key: "handleDragComplete",
		value: function handleDragComplete(moreProps) {
			var _this2 = this;

			var override = this.state.override;

			if (isDefined(override)) {
				var textList = this.props.textList;

				var newTextList = textList.map(function (each, idx) {
					var selected = idx === override.index;
					return selected ? _extends({}, each, {
						position: override.position,
						selected: selected
					}) : _extends({}, each, {
						selected: selected
					});
				});
				this.setState({
					override: null
				}, function () {
					_this2.props.onDragComplete(newTextList, moreProps);
				});
			}
		}
	}, {
		key: "handleDrawLine",
		value: function handleDrawLine(xyValue) {
			var current = this.state.current;


			if (isDefined(current) && isDefined(current.start)) {
				this.setState({
					current: {
						start: current.start,
						end: xyValue
					}
				});
			}
		}
	}, {
		key: "handleDraw",
		value: function handleDraw(moreProps, e) {
			var enabled = this.props.enabled;

			if (enabled) {
				var _moreProps$mouseXY = _slicedToArray(moreProps.mouseXY, 2),
				    mouseY = _moreProps$mouseXY[1],
				    yScale = moreProps.chartConfig.yScale,
				    xAccessor = moreProps.xAccessor,
				    currentItem = moreProps.currentItem;

				var xyValue = [xAccessor(currentItem), yScale.invert(mouseY)];

				var _props = this.props,
				    defaultText = _props.defaultText,
				    onChoosePosition = _props.onChoosePosition;


				var newText = _extends({}, defaultText, {
					position: xyValue
				});
				onChoosePosition(newText, moreProps, e);
			} /*  else {
     this.handleClick(moreProps, e);
     } */
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var _props2 = this.props,
			    textList = _props2.textList,
			    defaultText = _props2.defaultText,
			    hoverText = _props2.hoverText;
			var override = this.state.override;

			return React.createElement(
				"g",
				null,
				textList.map(function (each, idx) {
					var defaultHoverText = InteractiveText.defaultProps.hoverText;
					var props = _extends({}, defaultText, each, {
						hoverText: _extends({}, defaultHoverText, hoverText, each.hoverText || {})
					});
					return React.createElement(EachText, _extends({ key: idx,
						ref: _this3.saveNodeType(idx),
						index: idx
					}, props, {
						selected: each.selected,
						position: getValueFromOverride(override, idx, "position", each.position),

						onDrag: _this3.handleDrag,
						onDragComplete: _this3.handleDragComplete,
						edgeInteractiveCursor: "react-stockcharts-move-cursor"
					}));
				}),
				React.createElement(GenericChartComponent, {

					onClick: this.handleDraw,

					svgDraw: noop,
					canvasDraw: noop,
					canvasToDraw: getMouseCanvas,

					drawOn: ["mousemove", "pan"]
				}),
				";"
			);
		}
	}]);

	return InteractiveText;
}(Component);

InteractiveText.propTypes = {
	onChoosePosition: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

	defaultText: PropTypes.shape({
		bgFill: PropTypes.string.isRequired,
		bgOpacity: PropTypes.number.isRequired,
		bgStrokeWidth: PropTypes.number,
		bgStroke: PropTypes.string,
		textFill: PropTypes.string.isRequired,
		fontFamily: PropTypes.string.isRequired,
		fontWeight: PropTypes.string.isRequired,
		fontStyle: PropTypes.string.isRequired,
		fontSize: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired
	}).isRequired,

	hoverText: PropTypes.object.isRequired,
	textList: PropTypes.array.isRequired,
	enabled: PropTypes.bool.isRequired
};

InteractiveText.defaultProps = {
	onChoosePosition: noop,
	onDragComplete: noop,
	onSelect: noop,

	defaultText: {
		bgFill: "#D3D3D3",
		bgOpacity: 1,
		bgStrokeWidth: 1,
		textFill: "#F10040",
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
		text: "Lorem ipsum..."
	},
	hoverText: _extends({}, HoverTextNearMouse.defaultProps, {
		enable: true,
		bgHeight: "auto",
		bgWidth: "auto",
		text: "Click to select object",
		selectedText: ""
	}),
	textList: []
};

InteractiveText.contextTypes = {
	subscribe: PropTypes.func.isRequired,
	unsubscribe: PropTypes.func.isRequired,
	generateSubscriptionId: PropTypes.func.isRequired,
	chartId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

export default InteractiveText;
//# sourceMappingURL=InteractiveText.js.map