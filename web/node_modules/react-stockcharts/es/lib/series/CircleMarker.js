
import React from "react";
import PropTypes from "prop-types";

import { hexToRGBA, functor } from "../utils";

function Circle(props) {
	var className = props.className,
	    stroke = props.stroke,
	    strokeWidth = props.strokeWidth,
	    opacity = props.opacity,
	    fill = props.fill,
	    point = props.point,
	    r = props.r;

	var radius = functor(r)(point.datum);
	return React.createElement("circle", { className: className,
		cx: point.x, cy: point.y,
		stroke: stroke, strokeWidth: strokeWidth,
		fillOpacity: opacity, fill: fill, r: radius });
}

Circle.propTypes = {
	stroke: PropTypes.string,
	fill: PropTypes.string.isRequired,
	opacity: PropTypes.number.isRequired,
	point: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		datum: PropTypes.object.isRequired
	}).isRequired,
	className: PropTypes.string,
	strokeWidth: PropTypes.number,
	r: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired
};

Circle.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-marker-circle"
};

Circle.drawOnCanvas = function (props, point, ctx) {
	var stroke = props.stroke,
	    fill = props.fill,
	    opacity = props.opacity,
	    strokeWidth = props.strokeWidth;


	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;

	if (fill !== "none") {
		ctx.fillStyle = hexToRGBA(fill, opacity);
	}

	Circle.drawOnCanvasWithNoStateChange(props, point, ctx);
};

Circle.drawOnCanvasWithNoStateChange = function (props, point, ctx) {
	var r = props.r;

	var radius = functor(r)(point.datum);

	ctx.moveTo(point.x, point.y);
	ctx.beginPath();
	ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.fill();
};

export default Circle;
//# sourceMappingURL=CircleMarker.js.map