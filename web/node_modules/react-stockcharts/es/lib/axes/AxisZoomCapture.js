var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { select, event as d3Event, mouse, touches } from "d3-selection";
import { mean } from "d3-array";

import { first, last, isDefined, noop, mousePosition, d3Window, MOUSEMOVE, MOUSEUP, TOUCHMOVE, TOUCHEND, touchPosition, getTouchProps, sign } from "../utils";

var AxisZoomCapture = function (_Component) {
	_inherits(AxisZoomCapture, _Component);

	function AxisZoomCapture(props) {
		_classCallCheck(this, AxisZoomCapture);

		var _this = _possibleConstructorReturn(this, (AxisZoomCapture.__proto__ || Object.getPrototypeOf(AxisZoomCapture)).call(this, props));

		_this.handleDragStartMouse = _this.handleDragStartMouse.bind(_this);
		_this.handleDragStartTouch = _this.handleDragStartTouch.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);
		_this.handleDragEnd = _this.handleDragEnd.bind(_this);
		_this.handleRightClick = _this.handleRightClick.bind(_this);
		_this.saveNode = _this.saveNode.bind(_this);
		_this.state = {
			startPosition: null
		};
		return _this;
	}

	_createClass(AxisZoomCapture, [{
		key: "saveNode",
		value: function saveNode(node) {
			this.node = node;
		}
	}, {
		key: "handleRightClick",
		value: function handleRightClick(e) {
			e.stopPropagation();
			e.preventDefault();

			var onContextMenu = this.props.onContextMenu;


			var mouseXY = mousePosition(e, this.node.getBoundingClientRect());

			select(d3Window(this.node)).on(MOUSEMOVE, null).on(MOUSEUP, null);
			this.setState({
				startPosition: null
			});

			onContextMenu(mouseXY, e);

			this.contextMenuClicked = true;
		}
	}, {
		key: "handleDragStartMouse",
		value: function handleDragStartMouse(e) {
			this.mouseInteraction = true;

			var _props = this.props,
			    getScale = _props.getScale,
			    getMoreProps = _props.getMoreProps;

			var startScale = getScale(getMoreProps());
			this.dragHappened = false;

			if (startScale.invert) {
				select(d3Window(this.node)).on(MOUSEMOVE, this.handleDrag, false).on(MOUSEUP, this.handleDragEnd, false);

				var startXY = mousePosition(e);

				this.setState({
					startPosition: {
						startXY: startXY,
						startScale: startScale
					}
				});
			}
			e.preventDefault();
		}
	}, {
		key: "handleDragStartTouch",
		value: function handleDragStartTouch(e) {
			this.mouseInteraction = false;

			var _props2 = this.props,
			    getScale = _props2.getScale,
			    getMoreProps = _props2.getMoreProps;

			var startScale = getScale(getMoreProps());
			this.dragHappened = false;

			if (e.touches.length === 1 && startScale.invert) {
				select(d3Window(this.node)).on(TOUCHMOVE, this.handleDrag).on(TOUCHEND, this.handleDragEnd);

				var startXY = touchPosition(getTouchProps(e.touches[0]), e);

				this.setState({
					startPosition: {
						startXY: startXY,
						startScale: startScale
					}
				});
			}
		}
	}, {
		key: "handleDrag",
		value: function handleDrag() {
			var startPosition = this.state.startPosition;
			var _props3 = this.props,
			    getMouseDelta = _props3.getMouseDelta,
			    inverted = _props3.inverted;


			this.dragHappened = true;
			if (isDefined(startPosition)) {
				var startScale = startPosition.startScale;
				var startXY = startPosition.startXY;


				var mouseXY = this.mouseInteraction ? mouse(this.node) : touches(this.node)[0];

				var diff = getMouseDelta(startXY, mouseXY);

				var center = mean(startScale.range());

				var tempRange = startScale.range().map(function (d) {
					return inverted ? d - sign(d - center) * diff : d + sign(d - center) * diff;
				});

				var newDomain = tempRange.map(startScale.invert);

				if (sign(last(startScale.range()) - first(startScale.range())) === sign(last(tempRange) - first(tempRange))) {
					var axisZoomCallback = this.props.axisZoomCallback;
					// console.log(startXScale.domain(), newXDomain)

					axisZoomCallback(newDomain);
				}
			}
		}
	}, {
		key: "handleDragEnd",
		value: function handleDragEnd() {
			var _this2 = this;

			if (!this.dragHappened) {
				if (this.clicked) {
					var e = d3Event;
					var mouseXY = this.mouseInteraction ? mouse(this.node) : touches(this.node)[0];
					var onDoubleClick = this.props.onDoubleClick;


					onDoubleClick(mouseXY, e);
				} else {
					this.clicked = true;
					setTimeout(function () {
						_this2.clicked = false;
					}, 300);
				}
			}

			select(d3Window(this.node)).on(MOUSEMOVE, null).on(MOUSEUP, null).on(TOUCHMOVE, null).on(TOUCHEND, null);

			this.setState({
				startPosition: null
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _props4 = this.props,
			    bg = _props4.bg,
			    className = _props4.className,
			    zoomCursorClassName = _props4.zoomCursorClassName;


			var cursor = isDefined(this.state.startPosition) ? zoomCursorClassName : "react-stockcharts-default-cursor";

			return React.createElement("rect", {
				className: "react-stockcharts-enable-interaction " + cursor + " " + className,
				ref: this.saveNode,
				x: bg.x, y: bg.y, opacity: 0, height: bg.h, width: bg.w,
				onContextMenu: this.handleRightClick,
				onMouseDown: this.handleDragStartMouse,
				onTouchStart: this.handleDragStartTouch
			});
		}
	}]);

	return AxisZoomCapture;
}(Component);

AxisZoomCapture.propTypes = {
	innerTickSize: PropTypes.number,
	outerTickSize: PropTypes.number,
	tickFormat: PropTypes.func,
	tickPadding: PropTypes.number,
	tickSize: PropTypes.number,
	ticks: PropTypes.number,
	tickValues: PropTypes.array,
	showDomain: PropTypes.bool,
	showTicks: PropTypes.bool,
	className: PropTypes.string,
	axisZoomCallback: PropTypes.func,
	inverted: PropTypes.bool,
	bg: PropTypes.object.isRequired,
	zoomCursorClassName: PropTypes.string.isRequired,
	getMoreProps: PropTypes.func.isRequired,
	getScale: PropTypes.func.isRequired,
	getMouseDelta: PropTypes.func.isRequired,
	onDoubleClick: PropTypes.func.isRequired,
	onContextMenu: PropTypes.func.isRequired
};

AxisZoomCapture.defaultProps = {
	onDoubleClick: noop,
	onContextMenu: noop,
	inverted: true
};

export default AxisZoomCapture;
//# sourceMappingURL=AxisZoomCapture.js.map