var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { first, last, hexToRGBA } from "../utils";

/*
function d3_scaleExtent(domain) {
	var start = domain[0], stop = domain[domain.length - 1];
	return start < stop ? [start, stop] : [stop, start];
}

function d3_scaleRange(scale) {
	return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
}
*/

var AxisLine = function (_Component) {
	_inherits(AxisLine, _Component);

	function AxisLine() {
		_classCallCheck(this, AxisLine);

		return _possibleConstructorReturn(this, (AxisLine.__proto__ || Object.getPrototypeOf(AxisLine)).apply(this, arguments));
	}

	_createClass(AxisLine, [{
		key: "render",
		value: function render() {
			var _props = this.props,
			    orient = _props.orient,
			    outerTickSize = _props.outerTickSize,
			    fill = _props.fill,
			    stroke = _props.stroke,
			    strokeWidth = _props.strokeWidth,
			    className = _props.className,
			    shapeRendering = _props.shapeRendering,
			    opacity = _props.opacity,
			    range = _props.range;

			var sign = orient === "top" || orient === "left" ? -1 : 1;

			// var range = d3_scaleRange(scale);

			var d = void 0;

			if (orient === "bottom" || orient === "top") {
				d = "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize;
			} else {
				d = "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize;
			}

			return React.createElement("path", {
				className: className,
				shapeRendering: shapeRendering,
				d: d,
				fill: fill,
				opacity: opacity,
				stroke: stroke,
				strokeWidth: strokeWidth });
		}
	}]);

	return AxisLine;
}(Component);

AxisLine.propTypes = {
	className: PropTypes.string,
	shapeRendering: PropTypes.string,
	orient: PropTypes.string.isRequired,
	scale: PropTypes.func.isRequired,
	outerTickSize: PropTypes.number,
	fill: PropTypes.string,
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	opacity: PropTypes.number,
	range: PropTypes.array
};

AxisLine.defaultProps = {
	className: "react-stockcharts-axis-line",
	shapeRendering: "crispEdges",
	outerTickSize: 0,
	fill: "none",
	stroke: "#000000",
	strokeWidth: 1,
	opacity: 1
};

AxisLine.drawOnCanvasStatic = function (props, ctx /* , xScale, yScale*/) {
	props = _extends({}, AxisLine.defaultProps, props);

	var _props2 = props,
	    orient = _props2.orient,
	    outerTickSize = _props2.outerTickSize,
	    stroke = _props2.stroke,
	    strokeWidth = _props2.strokeWidth,
	    opacity = _props2.opacity,
	    range = _props2.range;


	var sign = orient === "top" || orient === "left" ? -1 : 1;
	var xAxis = orient === "bottom" || orient === "top";

	// var range = d3_scaleRange(xAxis ? xScale : yScale);

	ctx.lineWidth = strokeWidth;
	ctx.strokeStyle = hexToRGBA(stroke, opacity);

	ctx.beginPath();

	if (xAxis) {
		ctx.moveTo(first(range), sign * outerTickSize);
		ctx.lineTo(first(range), 0);
		ctx.lineTo(last(range), 0);
		ctx.lineTo(last(range), sign * outerTickSize);
	} else {
		ctx.moveTo(sign * outerTickSize, first(range));
		ctx.lineTo(0, first(range));
		ctx.lineTo(0, last(range));
		ctx.lineTo(sign * outerTickSize, last(range));
	}
	ctx.stroke();

	// ctx.strokeStyle = strokeStyle;
};

export default AxisLine;
//# sourceMappingURL=AxisLine.js.map