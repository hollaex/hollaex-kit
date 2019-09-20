var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericComponent, { getMouseCanvas } from "../GenericComponent";

import { first, last, hexToRGBA, isDefined, isNotDefined, strokeDashTypes, getStrokeDasharray } from "../utils";

var Cursor = function (_Component) {
	_inherits(Cursor, _Component);

	function Cursor(props) {
		_classCallCheck(this, Cursor);

		var _this = _possibleConstructorReturn(this, (Cursor.__proto__ || Object.getPrototypeOf(Cursor)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(Cursor, [{
		key: "getXYCursor",
		value: function getXYCursor(props, moreProps) {
			var mouseXY = moreProps.mouseXY,
			    currentItem = moreProps.currentItem,
			    show = moreProps.show,
			    height = moreProps.height,
			    width = moreProps.width;
			var customSnapX = props.customSnapX,
			    stroke = props.stroke,
			    opacity = props.opacity,
			    strokeDasharray = props.strokeDasharray,
			    disableYCursor = props.disableYCursor;

			if (!show || isNotDefined(currentItem)) return null;

			var yCursor = {
				x1: 0,
				x2: width,
				y1: mouseXY[1],
				y2: mouseXY[1],
				stroke: stroke,
				strokeDasharray: strokeDasharray,
				opacity: opacity,
				id: "yCursor"
			};
			var x = customSnapX(props, moreProps);

			var xCursor = {
				x1: x,
				x2: x,
				y1: 0,
				y2: height,
				stroke: stroke,
				strokeDasharray: strokeDasharray,
				opacity: opacity,
				id: "xCursor"
			};

			return disableYCursor ? [xCursor] : [yCursor, xCursor];
		}
	}, {
		key: "getXCursorShape",
		value: function getXCursorShape(moreProps /* , ctx */) {
			var height = moreProps.height,
			    xScale = moreProps.xScale,
			    currentItem = moreProps.currentItem,
			    plotData = moreProps.plotData;
			var xAccessor = moreProps.xAccessor;

			var xValue = xAccessor(currentItem);
			var centerX = xScale(xValue);
			var shapeWidth = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)))) / (plotData.length - 1);
			var xPos = centerX - shapeWidth / 2;

			return { height: height, xPos: xPos, shapeWidth: shapeWidth };
		}
	}, {
		key: "getXCursorShapeFill",
		value: function getXCursorShapeFill(moreProps) {
			var xCursorShapeFill = this.props.xCursorShapeFill;
			var currentItem = moreProps.currentItem;

			return xCursorShapeFill instanceof Function ? xCursorShapeFill(currentItem) : xCursorShapeFill;
		}
	}, {
		key: "getXCursorShapeStroke",
		value: function getXCursorShapeStroke(moreProps) {
			var xCursorShapeStroke = this.props.xCursorShapeStroke;
			var currentItem = moreProps.currentItem;

			return xCursorShapeStroke instanceof Function ? xCursorShapeStroke(currentItem) : xCursorShapeStroke;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _this2 = this;

			var cursors = this.getXYCursor(this.props, moreProps);

			if (isDefined(cursors)) {
				var useXCursorShape = this.props.useXCursorShape;
				var _context = this.context,
				    margin = _context.margin,
				    ratio = _context.ratio;

				var originX = 0.5 * ratio + margin.left;
				var originY = 0.5 * ratio + margin.top;

				ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.scale(ratio, ratio);

				ctx.translate(originX, originY);

				cursors.forEach(function (line) {
					var dashArray = getStrokeDasharray(line.strokeDasharray).split(",").map(function (d) {
						return +d;
					});
					var xShapeFill = _this2.getXCursorShapeFill(moreProps);

					if (useXCursorShape && line.id === "xCursor") {
						var _props = _this2.props,
						    xCursorShapeOpacity = _props.xCursorShapeOpacity,
						    xCursorShapeStrokeDasharray = _props.xCursorShapeStrokeDasharray;

						var xShape = _this2.getXCursorShape(moreProps);

						if (xCursorShapeStrokeDasharray != null) {
							var xShapeStroke = _this2.getXCursorShapeStroke(moreProps);
							ctx.strokeStyle = hexToRGBA(xShapeStroke, xCursorShapeOpacity);
							ctx.setLineDash(getStrokeDasharray(xCursorShapeStrokeDasharray).split(",").map(function (d) {
								return +d;
							}));
						}

						ctx.beginPath();
						ctx.fillStyle = xShapeFill != null ? hexToRGBA(xShapeFill, xCursorShapeOpacity) : "rgba(0, 0, 0, 0)"; // ="transparent"

						ctx.beginPath();
						xCursorShapeStrokeDasharray == null ? ctx.fillRect(xShape.xPos, 0, xShape.shapeWidth, xShape.height) : ctx.rect(xShape.xPos, 0, xShape.shapeWidth, xShape.height);
						ctx.fill();
					} else {
						ctx.strokeStyle = hexToRGBA(line.stroke, line.opacity);
						ctx.setLineDash(dashArray);
						ctx.beginPath();
						ctx.moveTo(line.x1, line.y1);
						ctx.lineTo(line.x2, line.y2);
					}

					ctx.stroke();
				});

				ctx.restore();
			}
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _this3 = this;

			var cursors = this.getXYCursor(this.props, moreProps);
			if (isNotDefined(cursors)) return null;

			var _props2 = this.props,
			    className = _props2.className,
			    useXCursorShape = _props2.useXCursorShape;


			return React.createElement(
				"g",
				{ className: "react-stockcharts-crosshair " + className },
				cursors.map(function (_ref, idx) {
					var strokeDasharray = _ref.strokeDasharray,
					    id = _ref.id,
					    rest = _objectWithoutProperties(_ref, ["strokeDasharray", "id"]);

					if (useXCursorShape && id === "xCursor") {
						var _props3 = _this3.props,
						    xCursorShapeOpacity = _props3.xCursorShapeOpacity,
						    xCursorShapeStrokeDasharray = _props3.xCursorShapeStrokeDasharray;

						var xShape = _this3.getXCursorShape(moreProps);
						var xShapeFill = _this3.getXCursorShapeFill(moreProps);
						var xShapeStroke = _this3.getXCursorShapeStroke(moreProps);
						return React.createElement("rect", {
							key: idx,
							x: xShape.xPos,
							y: 0,
							width: xShape.shapeWidth,
							height: xShape.height,
							fill: xShapeFill != null ? xShapeFill : "none",
							stroke: xCursorShapeStrokeDasharray == null ? null : xShapeStroke,
							strokeDasharray: xCursorShapeStrokeDasharray == null ? null : getStrokeDasharray(xCursorShapeStrokeDasharray),
							opacity: xCursorShapeOpacity
						});
					}

					return React.createElement("line", _extends({
						key: idx,
						strokeDasharray: getStrokeDasharray(strokeDasharray)
					}, rest));
				})
			);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(GenericComponent, {
				svgDraw: this.renderSVG,
				clip: false,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: getMouseCanvas,
				drawOn: ["mousemove", "pan", "drag"]
			});
		}
	}]);

	return Cursor;
}(Component);

Cursor.propTypes = {
	className: PropTypes.string,
	stroke: PropTypes.string,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
	snapX: PropTypes.bool,
	opacity: PropTypes.number,
	disableYCursor: PropTypes.bool,
	useXCursorShape: PropTypes.bool,
	xCursorShapeFill: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
	xCursorShapeStroke: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
	xCursorShapeStrokeDasharray: PropTypes.oneOf(strokeDashTypes),
	xCursorShapeOpacity: PropTypes.number
};

Cursor.contextTypes = {
	margin: PropTypes.object.isRequired,
	ratio: PropTypes.number.isRequired
	// xScale for getting update event upon pan end, this is needed to get past the PureComponent shouldComponentUpdate
	// xScale: PropTypes.func.isRequired,
};

function customSnapX(props, moreProps) {
	var xScale = moreProps.xScale,
	    xAccessor = moreProps.xAccessor,
	    currentItem = moreProps.currentItem,
	    mouseXY = moreProps.mouseXY;
	var snapX = props.snapX;

	var x = snapX ? Math.round(xScale(xAccessor(currentItem))) : mouseXY[0];
	return x;
}

Cursor.defaultProps = {
	stroke: "#000000",
	opacity: 0.3,
	strokeDasharray: "ShortDash",
	snapX: true, // snaps the crosshair to the nearest xValue
	customSnapX: customSnapX,
	disableYCursor: false,
	useXCursorShape: false,
	xCursorShapeStroke: "#000000",
	xCursorShapeOpacity: 0.5
};

export default Cursor;
//# sourceMappingURL=Cursor.js.map