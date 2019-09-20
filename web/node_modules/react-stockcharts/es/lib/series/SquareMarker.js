
import React from "react";
import PropTypes from "prop-types";
import { hexToRGBA, functor } from "../utils";

function Square(props) {
	var className = props.className,
	    stroke = props.stroke,
	    strokeWidth = props.strokeWidth,
	    opacity = props.opacity,
	    fill = props.fill,
	    point = props.point,
	    width = props.width;

	var w = functor(width)(point.datum);
	var x = point.x - w / 2;
	var y = point.y - w / 2;
	return React.createElement("rect", {
		className: className,
		x: x,
		y: y,
		stroke: stroke,
		strokeWidth: strokeWidth,
		fillOpacity: opacity,
		fill: fill,
		width: w,
		height: w
	});
}
Square.propTypes = {
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
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired
};
Square.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-marker-rect"
};
Square.drawOnCanvas = function (props, point, ctx) {
	var stroke = props.stroke,
	    fill = props.fill,
	    opacity = props.opacity,
	    strokeWidth = props.strokeWidth;

	ctx.strokeStyle = stroke;
	ctx.lineWidth = strokeWidth;
	if (fill !== "none") {
		ctx.fillStyle = hexToRGBA(fill, opacity);
	}
	Square.drawOnCanvasWithNoStateChange(props, point, ctx);
};
Square.drawOnCanvasWithNoStateChange = function (props, point, ctx) {
	var width = props.width;

	var w = functor(width)(point.datum);
	var x = point.x - w / 2;
	var y = point.y - w / 2;
	ctx.beginPath();
	ctx.rect(x, y, w, w);
	ctx.stroke();
	ctx.fill();
};
export default Square;
//# sourceMappingURL=SquareMarker.js.map