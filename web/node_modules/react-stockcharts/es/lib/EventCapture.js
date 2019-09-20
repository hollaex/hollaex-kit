var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { select, event as d3Event, mouse, touches } from "d3-selection";

import { isDefined, mousePosition, touchPosition, getTouchProps, d3Window, MOUSEMOVE, MOUSEUP, MOUSEENTER, MOUSELEAVE, TOUCHMOVE, TOUCHEND, noop } from "./utils";
import { getCurrentCharts } from "./utils/ChartDataUtil";
// import { clearTimeout, setTimeout } from "timers";

var EventCapture = function (_Component) {
	_inherits(EventCapture, _Component);

	function EventCapture(props) {
		_classCallCheck(this, EventCapture);

		var _this = _possibleConstructorReturn(this, (EventCapture.__proto__ || Object.getPrototypeOf(EventCapture)).call(this, props));

		_this.handleEnter = _this.handleEnter.bind(_this);
		_this.handleLeave = _this.handleLeave.bind(_this);
		_this.handleWheel = _this.handleWheel.bind(_this);
		_this.handleMouseMove = _this.handleMouseMove.bind(_this);
		_this.handleMouseDown = _this.handleMouseDown.bind(_this);
		_this.handlePanEnd = _this.handlePanEnd.bind(_this);
		_this.handlePan = _this.handlePan.bind(_this);
		_this.handleTouchStart = _this.handleTouchStart.bind(_this);
		_this.handleTouchMove = _this.handleTouchMove.bind(_this);
		_this.handlePinchZoom = _this.handlePinchZoom.bind(_this);
		_this.handlePinchZoomEnd = _this.handlePinchZoomEnd.bind(_this);

		_this.handleClick = _this.handleClick.bind(_this);

		_this.handleRightClick = _this.handleRightClick.bind(_this);
		_this.handleDrag = _this.handleDrag.bind(_this);
		_this.handleDragEnd = _this.handleDragEnd.bind(_this);

		_this.shouldPan = _this.shouldPan.bind(_this);
		_this.canPan = _this.canPan.bind(_this);

		_this.setCursorClass = _this.setCursorClass.bind(_this);
		_this.saveNode = _this.saveNode.bind(_this);

		_this.mouseInside = false;

		_this.mouseInteraction = true;
		_this.state = {
			panInProgress: false
		};
		return _this;
	}

	_createClass(EventCapture, [{
		key: "saveNode",
		value: function saveNode(node) {
			this.node = node;
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {
			this.focus = this.props.focus;
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.node) {
				select(this.node).on(MOUSEENTER, this.handleEnter).on(MOUSELEAVE, this.handleLeave);
			}
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			this.componentDidMount();
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.node) {
				select(this.node).on(MOUSEENTER, null).on(MOUSELEAVE, null);
				var win = d3Window(this.node);
				select(win).on(MOUSEMOVE, null);
			}
		}
	}, {
		key: "handleEnter",
		value: function handleEnter() {
			var e = d3Event;

			var onMouseEnter = this.props.onMouseEnter;

			this.mouseInside = true;
			if (!this.state.panInProgress && !this.state.dragInProgress) {
				var win = d3Window(this.node);
				select(win).on(MOUSEMOVE, this.handleMouseMove);
			}
			onMouseEnter(e);
		}
	}, {
		key: "handleLeave",
		value: function handleLeave(e) {
			var onMouseLeave = this.props.onMouseLeave;

			this.mouseInside = false;
			if (!this.state.panInProgress && !this.state.dragInProgress) {
				var win = d3Window(this.node);
				select(win).on(MOUSEMOVE, null);
			}
			onMouseLeave(e);
		}
	}, {
		key: "handleWheel",
		value: function handleWheel(e) {
			var _props = this.props,
			    zoom = _props.zoom,
			    onZoom = _props.onZoom;
			var panInProgress = this.state.panInProgress;


			var yZoom = Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 0;
			// const xPan = Math.abs(e.deltaY) < Math.abs(e.deltaX) && Math.abs(e.deltaX) > 0;
			var mouseXY = mousePosition(e);
			e.preventDefault();

			if (zoom && this.focus && yZoom && !panInProgress) {
				var zoomDir = e.deltaY > 0 ? 1 : -1;

				onZoom(zoomDir, mouseXY, e);
			} else if (this.focus) {
				if (this.shouldPan()) {
					// console.log("Do pan now...")
					// pan already in progress
					var _state$panStart = this.state.panStart,
					    panStartXScale = _state$panStart.panStartXScale,
					    chartsToPan = _state$panStart.chartsToPan;

					this.lastNewPos = mouseXY;
					this.panHappened = true;

					this.dx += e.deltaX;
					this.dy += e.deltaY;
					var dxdy = { dx: this.dx, dy: this.dy };

					this.props.onPan(mouseXY, panStartXScale, dxdy, chartsToPan, e);
				} else {
					// console.log("Pan start...")
					// pan start

					var _props2 = this.props,
					    xScale = _props2.xScale,
					    chartConfig = _props2.chartConfig;

					var currentCharts = getCurrentCharts(chartConfig, mouseXY);

					this.dx = 0;
					this.dy = 0;
					this.setState({
						panInProgress: true,
						panStart: {
							panStartXScale: xScale,
							panOrigin: mouseXY,
							chartsToPan: currentCharts
						}
					});
				}
				this.queuePanEnd();
			}
		}
	}, {
		key: "queuePanEnd",
		value: function queuePanEnd() {
			var _this2 = this;

			if (isDefined(this.panEndTimeout)) {
				clearTimeout(this.panEndTimeout);
			}
			this.panEndTimeout = setTimeout(function () {
				_this2.handlePanEnd();
			}, 100);
		}
	}, {
		key: "handleMouseMove",
		value: function handleMouseMove() {
			var e = d3Event;

			var _props3 = this.props,
			    onMouseMove = _props3.onMouseMove,
			    mouseMove = _props3.mouseMove;


			if (this.mouseInteraction && mouseMove && !this.state.panInProgress) {

				var newPos = mouse(this.node);

				onMouseMove(newPos, "mouse", e);
			}
		}
	}, {
		key: "handleClick",
		value: function handleClick(e) {
			var _this3 = this;

			var mouseXY = mousePosition(e);
			var _props4 = this.props,
			    onClick = _props4.onClick,
			    onDoubleClick = _props4.onDoubleClick;


			if (!this.panHappened && !this.dragHappened) {
				if (this.clicked) {
					onDoubleClick(mouseXY, e);
					this.clicked = false;
				} else {
					onClick(mouseXY, e);
					this.clicked = true;
					setTimeout(function () {
						if (_this3.clicked) {
							_this3.clicked = false;
						}
					}, 400);
				}
			}
		}
	}, {
		key: "handleRightClick",
		value: function handleRightClick(e) {
			e.stopPropagation();
			e.preventDefault();
			var _props5 = this.props,
			    onContextMenu = _props5.onContextMenu,
			    onPanEnd = _props5.onPanEnd;


			var mouseXY = mousePosition(e, this.node.getBoundingClientRect());

			if (isDefined(this.state.panStart)) {
				var _state$panStart2 = this.state.panStart,
				    panStartXScale = _state$panStart2.panStartXScale,
				    panOrigin = _state$panStart2.panOrigin,
				    chartsToPan = _state$panStart2.chartsToPan;

				if (this.panHappened) {
					onPanEnd(mouseXY, panStartXScale, panOrigin, chartsToPan, e);
				}
				var win = d3Window(this.node);
				select(win).on(MOUSEMOVE, null).on(MOUSEUP, null);

				this.setState({
					panInProgress: false,
					panStart: null
				});
			}

			onContextMenu(mouseXY, e);
		}
	}, {
		key: "handleDrag",
		value: function handleDrag() {
			var e = d3Event;
			if (this.props.onDrag) {
				this.dragHappened = true;
				var mouseXY = mouse(this.node);
				this.props.onDrag({
					startPos: this.state.dragStartPosition,
					mouseXY: mouseXY
				}, e);
			}
		}
	}, {
		key: "cancelDrag",
		value: function cancelDrag() {
			var win = d3Window(this.node);
			select(win).on(MOUSEMOVE, this.mouseInside ? this.handleMouseMove : null).on(MOUSEUP, null);

			this.setState({
				dragInProgress: false
			});
			this.mouseInteraction = true;
		}
	}, {
		key: "handleDragEnd",
		value: function handleDragEnd() {
			var e = d3Event;
			var mouseXY = mouse(this.node);

			var win = d3Window(this.node);
			select(win).on(MOUSEMOVE, this.mouseInside ? this.handleMouseMove : null).on(MOUSEUP, null);

			if (this.dragHappened) {
				this.props.onDragComplete({
					mouseXY: mouseXY
				}, e);
			}

			this.setState({
				dragInProgress: false
			});
			this.mouseInteraction = true;
		}
	}, {
		key: "canPan",
		value: function canPan() {
			var getAllPanConditions = this.props.getAllPanConditions;
			var initialPanEnabled = this.props.pan;

			var _getAllPanConditions$ = getAllPanConditions().reduce(function (returnObj, a) {
				return {
					draggable: returnObj.draggable || a.draggable,
					panEnabled: returnObj.panEnabled && a.panEnabled
				};
			}, {
				draggable: false,
				panEnabled: initialPanEnabled
			}),
			    panEnabled = _getAllPanConditions$.panEnabled,
			    somethingSelected = _getAllPanConditions$.draggable;

			return {
				panEnabled: panEnabled,
				somethingSelected: somethingSelected
			};
		}
	}, {
		key: "handleMouseDown",
		value: function handleMouseDown(e) {
			if (e.button !== 0) {
				return;
			}
			var _props6 = this.props,
			    xScale = _props6.xScale,
			    chartConfig = _props6.chartConfig,
			    onMouseDown = _props6.onMouseDown;


			this.panHappened = false;
			this.dragHappened = false;
			this.focus = true;

			if (!this.state.panInProgress && this.mouseInteraction) {

				var mouseXY = mousePosition(e);
				var currentCharts = getCurrentCharts(chartConfig, mouseXY);

				var _canPan = this.canPan(),
				    panEnabled = _canPan.panEnabled,
				    somethingSelected = _canPan.somethingSelected;

				var pan = panEnabled && !somethingSelected;

				if (pan) {
					this.setState({
						panInProgress: pan,
						panStart: {
							panStartXScale: xScale,
							panOrigin: mouseXY,
							chartsToPan: currentCharts
						}
					});

					var win = d3Window(this.node);
					select(win).on(MOUSEMOVE, this.handlePan).on(MOUSEUP, this.handlePanEnd);
				} else if (somethingSelected) {
					this.setState({
						panInProgress: false,
						dragInProgress: true,
						panStart: null,
						dragStartPosition: mouseXY
					});
					this.props.onDragStart({ startPos: mouseXY }, e);
					// this.mouseInteraction = false;

					var _win = d3Window(this.node);
					select(_win).on(MOUSEMOVE, this.handleDrag).on(MOUSEUP, this.handleDragEnd);
				}

				onMouseDown(mouseXY, currentCharts, e);
			}
			e.preventDefault();
		}
	}, {
		key: "shouldPan",
		value: function shouldPan() {
			var _props7 = this.props,
			    panEnabled = _props7.pan,
			    onPan = _props7.onPan;

			return panEnabled && onPan && isDefined(this.state.panStart);
		}
	}, {
		key: "handlePan",
		value: function handlePan() {
			var e = d3Event;

			if (this.shouldPan()) {
				this.panHappened = true;

				var _state$panStart3 = this.state.panStart,
				    panStartXScale = _state$panStart3.panStartXScale,
				    panOrigin = _state$panStart3.panOrigin,
				    chartsToPan = _state$panStart3.chartsToPan;


				var mouseXY = this.mouseInteraction ? mouse(this.node) : touches(this.node)[0];

				this.lastNewPos = mouseXY;
				var dx = mouseXY[0] - panOrigin[0];
				var dy = mouseXY[1] - panOrigin[1];

				this.dx = dx;
				this.dy = dy;

				this.props.onPan(mouseXY, panStartXScale, { dx: dx, dy: dy }, chartsToPan, e);
			}
		}
	}, {
		key: "handlePanEnd",
		value: function handlePanEnd() {
			var e = d3Event;
			var _props8 = this.props,
			    panEnabled = _props8.pan,
			    onPanEnd = _props8.onPanEnd;


			if (isDefined(this.state.panStart)) {
				var _state$panStart4 = this.state.panStart,
				    panStartXScale = _state$panStart4.panStartXScale,
				    chartsToPan = _state$panStart4.chartsToPan;


				var win = d3Window(this.node);
				select(win).on(MOUSEMOVE, this.mouseInside ? this.handleMouseMove : null).on(MOUSEUP, null).on(TOUCHMOVE, null).on(TOUCHEND, null);

				if (this.panHappened
				// && !this.contextMenuClicked
				&& panEnabled && onPanEnd) {
					var dx = this.dx,
					    dy = this.dy;

					// console.log(dx, dy)

					delete this.dx;
					delete this.dy;
					onPanEnd(this.lastNewPos, panStartXScale, { dx: dx, dy: dy }, chartsToPan, e);
				}

				this.setState({
					panInProgress: false,
					panStart: null
				});
			}
		}
	}, {
		key: "handleTouchMove",
		value: function handleTouchMove(e) {
			var onMouseMove = this.props.onMouseMove;

			var touchXY = touchPosition(getTouchProps(e.touches[0]), e);
			onMouseMove(touchXY, "touch", e);
		}
	}, {
		key: "handleTouchStart",
		value: function handleTouchStart(e) {
			this.mouseInteraction = false;

			var _props9 = this.props,
			    panEnabled = _props9.pan,
			    chartConfig = _props9.chartConfig,
			    onMouseMove = _props9.onMouseMove;
			var _props10 = this.props,
			    xScale = _props10.xScale,
			    onPanEnd = _props10.onPanEnd;


			if (e.touches.length === 1) {

				this.panHappened = false;
				var touchXY = touchPosition(getTouchProps(e.touches[0]), e);
				onMouseMove(touchXY, "touch", e);

				if (panEnabled) {
					var currentCharts = getCurrentCharts(chartConfig, touchXY);

					this.setState({
						panInProgress: true,
						panStart: {
							panStartXScale: xScale,
							panOrigin: touchXY,
							chartsToPan: currentCharts
						}
					});

					var win = d3Window(this.node);
					select(win).on(TOUCHMOVE, this.handlePan, false).on(TOUCHEND, this.handlePanEnd, false);
				}
			} else if (e.touches.length === 2) {
				// pinch zoom begin
				// do nothing pinch zoom is handled in handleTouchMove
				var _state = this.state,
				    panInProgress = _state.panInProgress,
				    panStart = _state.panStart;


				if (panInProgress && panEnabled && onPanEnd) {
					var panStartXScale = panStart.panStartXScale,
					    panOrigin = panStart.panOrigin,
					    chartsToPan = panStart.chartsToPan;


					var _win2 = d3Window(this.node);
					select(_win2).on(MOUSEMOVE, this.mouseInside ? this.handleMouseMove : null).on(MOUSEUP, null).on(TOUCHMOVE, this.handlePinchZoom, false).on(TOUCHEND, this.handlePinchZoomEnd, false);

					var touch1Pos = touchPosition(getTouchProps(e.touches[0]), e);
					var touch2Pos = touchPosition(getTouchProps(e.touches[1]), e);

					if (this.panHappened
					// && !this.contextMenuClicked
					&& panEnabled && onPanEnd) {

						onPanEnd(this.lastNewPos, panStartXScale, panOrigin, chartsToPan, e);
					}

					this.setState({
						panInProgress: false,
						pinchZoomStart: {
							xScale: xScale,
							touch1Pos: touch1Pos,
							touch2Pos: touch2Pos,
							range: xScale.range(),
							chartsToPan: chartsToPan
						}
					});
				}
			}
		}
	}, {
		key: "handlePinchZoom",
		value: function handlePinchZoom() {
			var e = d3Event;

			var _touches = touches(this.node),
			    _touches2 = _slicedToArray(_touches, 2),
			    touch1Pos = _touches2[0],
			    touch2Pos = _touches2[1];

			var _props11 = this.props,
			    xScale = _props11.xScale,
			    zoomEnabled = _props11.zoom,
			    onPinchZoom = _props11.onPinchZoom;

			// eslint-disable-next-line no-unused-vars

			var _state$pinchZoomStart = this.state.pinchZoomStart,
			    chartsToPan = _state$pinchZoomStart.chartsToPan,
			    initialPinch = _objectWithoutProperties(_state$pinchZoomStart, ["chartsToPan"]);

			if (zoomEnabled && onPinchZoom) {
				onPinchZoom(initialPinch, {
					touch1Pos: touch1Pos,
					touch2Pos: touch2Pos,
					xScale: xScale
				}, e);
			}
		}
	}, {
		key: "handlePinchZoomEnd",
		value: function handlePinchZoomEnd() {
			var e = d3Event;

			var win = d3Window(this.node);
			select(win).on(TOUCHMOVE, null).on(TOUCHEND, null);

			var _props12 = this.props,
			    zoomEnabled = _props12.zoom,
			    onPinchZoomEnd = _props12.onPinchZoomEnd;

			// eslint-disable-next-line no-unused-vars

			var _state$pinchZoomStart2 = this.state.pinchZoomStart,
			    chartsToPan = _state$pinchZoomStart2.chartsToPan,
			    initialPinch = _objectWithoutProperties(_state$pinchZoomStart2, ["chartsToPan"]);

			if (zoomEnabled && onPinchZoomEnd) {
				onPinchZoomEnd(initialPinch, e);
			}

			this.setState({
				pinchZoomStart: null
			});
		}
	}, {
		key: "setCursorClass",
		value: function setCursorClass(cursorOverrideClass) {
			if (cursorOverrideClass !== this.state.cursorOverrideClass) {
				this.setState({
					cursorOverrideClass: cursorOverrideClass
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props13 = this.props,
			    height = _props13.height,
			    width = _props13.width,
			    disableInteraction = _props13.disableInteraction,
			    useCrossHairStyleCursor = _props13.useCrossHairStyleCursor;

			var className = this.state.cursorOverrideClass != null ? this.state.cursorOverrideClass : !useCrossHairStyleCursor ? "" : this.state.panInProgress ? "react-stockcharts-grabbing-cursor" : "react-stockcharts-crosshair-cursor";

			var interactionProps = disableInteraction || {
				onWheel: this.handleWheel,
				onMouseDown: this.handleMouseDown,
				onClick: this.handleClick,
				onContextMenu: this.handleRightClick,
				onTouchStart: this.handleTouchStart,
				onTouchMove: this.handleTouchMove
			};

			return React.createElement("rect", _extends({ ref: this.saveNode,
				className: className,
				width: width,
				height: height,
				style: { opacity: 0 }
			}, interactionProps));
		}
	}]);

	return EventCapture;
}(Component);

// 				onMouseEnter={this.handleEnter}
//				onMouseLeave={this.handleLeave}


EventCapture.propTypes = {
	mouseMove: PropTypes.bool.isRequired,
	zoom: PropTypes.bool.isRequired,
	pan: PropTypes.bool.isRequired,
	panSpeedMultiplier: PropTypes.number.isRequired,
	focus: PropTypes.bool.isRequired,
	useCrossHairStyleCursor: PropTypes.bool.isRequired,

	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	chartConfig: PropTypes.array,
	xScale: PropTypes.func.isRequired,
	xAccessor: PropTypes.func.isRequired,
	disableInteraction: PropTypes.bool.isRequired,

	getAllPanConditions: PropTypes.func.isRequired,

	onMouseMove: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onZoom: PropTypes.func,
	onPinchZoom: PropTypes.func,
	onPinchZoomEnd: PropTypes.func.isRequired,
	onPan: PropTypes.func,
	onPanEnd: PropTypes.func,
	onDragStart: PropTypes.func,
	onDrag: PropTypes.func,
	onDragComplete: PropTypes.func,

	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	onMouseDown: PropTypes.func,
	children: PropTypes.node
};

EventCapture.defaultProps = {
	mouseMove: false,
	zoom: false,
	pan: false,
	panSpeedMultiplier: 1,
	focus: false,
	onDragComplete: noop,
	disableInteraction: false
};

export default EventCapture;
//# sourceMappingURL=EventCapture.js.map