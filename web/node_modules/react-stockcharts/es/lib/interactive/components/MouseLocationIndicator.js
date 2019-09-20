var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import { isDefined, getClosestValue, noop, shallowEqual, functor } from "../../utils";
import { getXValue } from "../../utils/ChartDataUtil";

var MouseLocationIndicator = function (_Component) {
	_inherits(MouseLocationIndicator, _Component);

	function MouseLocationIndicator(props) {
		_classCallCheck(this, MouseLocationIndicator);

		var _this = _possibleConstructorReturn(this, (MouseLocationIndicator.__proto__ || Object.getPrototypeOf(MouseLocationIndicator)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);

		_this.handleMousePosChange = _this.handleMousePosChange.bind(_this);
		_this.handleMouseDown = _this.handleMouseDown.bind(_this);
		_this.handleClick = _this.handleClick.bind(_this);
		_this.xy = _this.xy.bind(_this);

		_this.mutableState = {};
		return _this;
	}

	_createClass(MouseLocationIndicator, [{
		key: "handleMouseDown",
		value: function handleMouseDown(moreProps, e) {
			var pos = this.xy(moreProps, e);
			if (isDefined(pos)) {
				var xValue = pos.xValue,
				    yValue = pos.yValue,
				    x = pos.x,
				    y = pos.y;

				this.mutableState = { x: x, y: y };
				this.props.onMouseDown([xValue, yValue], moreProps, e);
			}
		}
	}, {
		key: "handleClick",
		value: function handleClick(moreProps, e) {
			var pos = this.xy(moreProps, e);
			if (isDefined(pos)) {
				var xValue = pos.xValue,
				    yValue = pos.yValue,
				    x = pos.x,
				    y = pos.y;

				this.mutableState = { x: x, y: y };
				this.props.onClick([xValue, yValue], moreProps, e);
			}
		}
	}, {
		key: "xy",
		value: function xy(moreProps, e) {
			var xAccessor = moreProps.xAccessor,
			    plotData = moreProps.plotData;
			var mouseXY = moreProps.mouseXY,
			    currentItem = moreProps.currentItem,
			    xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale;
			var _props = this.props,
			    enabled = _props.enabled,
			    snap = _props.snap,
			    shouldDisableSnap = _props.shouldDisableSnap,
			    snapTo = _props.snapTo;


			if (enabled && isDefined(currentItem) && isDefined(e)) {
				var xValue = snap && !shouldDisableSnap(e) ? xAccessor(currentItem) : getXValue(xScale, xAccessor, mouseXY, plotData);
				var yValue = snap && !shouldDisableSnap(e) ? getClosestValue(snapTo(currentItem), yScale.invert(mouseXY[1])) : yScale.invert(mouseXY[1]);

				var x = xScale(xValue);
				var y = yScale(yValue);

				return { xValue: xValue, yValue: yValue, x: x, y: y };
			}
		}
	}, {
		key: "handleMousePosChange",
		value: function handleMousePosChange(moreProps, e) {
			if (!shallowEqual(moreProps.mousXY, moreProps.prevMouseXY)) {
				var pos = this.xy(moreProps, e);
				if (isDefined(pos)) {
					var xValue = pos.xValue,
					    yValue = pos.yValue,
					    x = pos.x,
					    y = pos.y;

					this.mutableState = { x: x, y: y };
					this.props.onMouseMove([xValue, yValue], e);
				}
			}
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props2 = this.props,
			    enabled = _props2.enabled,
			    r = _props2.r,
			    stroke = _props2.stroke,
			    strokeWidth = _props2.strokeWidth;
			var _mutableState = this.mutableState,
			    x = _mutableState.x,
			    y = _mutableState.y;
			var show = moreProps.show;
			// console.log(show)

			if (enabled && show && isDefined(x)) {
				ctx.lineWidth = strokeWidth;
				ctx.strokeStyle = stroke;
				ctx.moveTo(x, y);
				ctx.beginPath();
				ctx.arc(x, y, r, 0, 2 * Math.PI, false);
				ctx.stroke();
				// ctx.fill();
			}
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props3 = this.props,
			    enabled = _props3.enabled,
			    r = _props3.r,
			    stroke = _props3.stroke,
			    strokeWidth = _props3.strokeWidth,
			    opacity = _props3.opacity;
			var _mutableState2 = this.mutableState,
			    x = _mutableState2.x,
			    y = _mutableState2.y;
			var show = moreProps.show;

			// console.log("HERE")
			// console.log(stroke, strokeWidth, opacity)

			return enabled && show && isDefined(x) ? React.createElement("circle", {
				cx: x,
				cy: y,
				r: r,
				stroke: stroke,
				opacity: opacity,
				fill: "none",
				strokeWidth: strokeWidth }) : null;
		}
	}, {
		key: "render",
		value: function render() {
			var _props4 = this.props,
			    enabled = _props4.enabled,
			    disablePan = _props4.disablePan;

			return React.createElement(GenericChartComponent, {
				onMouseDown: this.handleMouseDown,
				onClick: this.handleClick,
				onContextMenu: this.handleContextMenu,
				onMouseMove: this.handleMousePosChange,
				onPan: this.handleMousePosChange,

				disablePan: enabled && disablePan,

				svgDraw: this.renderSVG,

				canvasDraw: this.drawOnCanvas,
				canvasToDraw: getMouseCanvas,

				drawOn: ["mousemove", "pan"]
			});
		}
	}]);

	return MouseLocationIndicator;
}(Component);

MouseLocationIndicator.propTypes = {
	enabled: PropTypes.bool.isRequired,
	snap: PropTypes.bool.isRequired,
	shouldDisableSnap: PropTypes.func.isRequired,
	snapTo: PropTypes.func,

	onMouseMove: PropTypes.func.isRequired,
	onMouseDown: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
	r: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	disablePan: PropTypes.bool.isRequired
};

MouseLocationIndicator.defaultProps = {
	onMouseMove: noop,
	onMouseDown: noop,
	onClick: noop,
	shouldDisableSnap: functor(false),
	stroke: "#000000",
	strokeWidth: 1,
	opacity: 1,
	disablePan: true
};

export default MouseLocationIndicator;
//# sourceMappingURL=MouseLocationIndicator.js.map