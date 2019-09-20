var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { isDefined } from "../../utils";

var PADDING = 10;
var MIN_WIDTH = PADDING;

var HoverTextNearMouse = function (_Component) {
	_inherits(HoverTextNearMouse, _Component);

	function HoverTextNearMouse(props) {
		_classCallCheck(this, HoverTextNearMouse);

		var _this = _possibleConstructorReturn(this, (HoverTextNearMouse.__proto__ || Object.getPrototypeOf(HoverTextNearMouse)).call(this, props));

		_this.state = {
			textWidth: undefined,
			textHeight: undefined
		};

		_this.saveNode = _this.saveNode.bind(_this);
		_this.updateTextSize = _this.updateTextSize.bind(_this);
		_this.renderSVG = _this.renderSVG.bind(_this);
		return _this;
	}

	_createClass(HoverTextNearMouse, [{
		key: "saveNode",
		value: function saveNode(node) {
			this.textNode = node;
		}
	}, {
		key: "updateTextSize",
		value: function updateTextSize() {
			var _props = this.props,
			    bgWidth = _props.bgWidth,
			    bgHeight = _props.bgHeight;

			if (bgWidth === "auto" || bgHeight === "auto") {
				var textNode = this.textNode;
				if (textNode) {
					var _textNode$getBBox = textNode.getBBox(),
					    width = _textNode$getBBox.width,
					    height = _textNode$getBBox.height;

					if (this.state.textWidth !== width || this.state.textHeight !== height) {
						this.setState({
							textWidth: width,
							textHeight: height
						});
					}
				}
			}
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			this.updateTextSize();
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			this.updateTextSize();
		}
	}, {
		key: "getBgWidth",
		value: function getBgWidth() {
			var bgWidth = this.props.bgWidth;
			var textWidth = this.state.textWidth;


			if (bgWidth !== "auto") {
				return bgWidth;
			} else if (textWidth !== undefined) {
				return textWidth + PADDING;
			} else {
				return MIN_WIDTH;
			}
		}
	}, {
		key: "getBgHeight",
		value: function getBgHeight() {
			var bgHeight = this.props.bgHeight;
			var textHeight = this.state.textHeight;


			if (bgHeight !== "auto") {
				return bgHeight;
			} else if (textHeight !== undefined) {
				return textHeight + PADDING;
			} else {
				return MIN_WIDTH;
			}
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props2 = this.props,
			    fontFamily = _props2.fontFamily,
			    fontSize = _props2.fontSize,
			    fill = _props2.fill,
			    bgFill = _props2.bgFill,
			    bgOpacity = _props2.bgOpacity;

			// console.log(moreProps)

			var textMetaData = helper(_extends({}, this.props, {
				bgWidth: this.getBgWidth(),
				bgHeight: this.getBgHeight()
			}), moreProps);

			if (isDefined(textMetaData)) {
				var rect = textMetaData.rect,
				    text = textMetaData.text;

				return React.createElement(
					"g",
					null,
					React.createElement("rect", _extends({
						fill: bgFill,
						fillOpacity: bgOpacity,
						stroke: bgFill
					}, rect)),
					React.createElement(
						"text",
						{
							ref: this.saveNode,
							fontSize: fontSize,
							fontFamily: fontFamily,
							textAnchor: "start",
							alignmentBaseline: "central",
							fill: fill,
							x: text.x,
							y: text.y },
						text.text
					)
				);
			}
		}
	}, {
		key: "render",
		value: function render() {
			var text = this.props.text;

			if (text) {
				return React.createElement(GenericChartComponent, {
					svgDraw: this.renderSVG,
					drawOn: ["mousemove"]
				});
			} else {
				return null;
			}
		}
	}]);

	return HoverTextNearMouse;
}(Component);

var numberOrString = PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(["auto"])]);

HoverTextNearMouse.propTypes = {
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	bgFill: PropTypes.string.isRequired,
	bgOpacity: PropTypes.number.isRequired,
	bgWidth: numberOrString.isRequired,
	bgHeight: numberOrString.isRequired,
	show: PropTypes.bool.isRequired
};

HoverTextNearMouse.defaultProps = {
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	bgFill: "#FA9325",
	bgOpacity: 0.5
};

function helper(props, moreProps) {
	var show = props.show,
	    bgWidth = props.bgWidth,
	    bgHeight = props.bgHeight;
	var mouseXY = moreProps.mouseXY,
	    _moreProps$chartConfi = moreProps.chartConfig,
	    height = _moreProps$chartConfi.height,
	    width = _moreProps$chartConfi.width,
	    mouseInsideCanvas = moreProps.show;


	if (show && mouseInsideCanvas) {
		var _mouseXY = _slicedToArray(mouseXY, 2),
		    x = _mouseXY[0],
		    y = _mouseXY[1];

		var cx = x < width / 2 ? x + PADDING : x - bgWidth - PADDING;

		var cy = y < height / 2 ? y + PADDING : y - bgHeight - PADDING;

		var rect = {
			x: cx,
			y: cy,
			width: bgWidth,
			height: bgHeight
		};

		var text = {
			text: props.text,
			x: cx + PADDING / 2,
			y: cy + bgHeight / 2
		};

		return {
			rect: rect,
			text: text
		};
	}
}

export default HoverTextNearMouse;
//# sourceMappingURL=HoverTextNearMouse.js.map