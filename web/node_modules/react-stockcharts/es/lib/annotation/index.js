

export { default as Annotate } from "./Annotate";
export { default as LabelAnnotation } from "./LabelAnnotation";
export { default as SvgPathAnnotation } from "./SvgPathAnnotation";
export { default as Label } from "./Label";

var halfWidth = 10;
var bottomWidth = 3;
var height = 20;

export function buyPath(_ref) {
	var x = _ref.x,
	    y = _ref.y;

	return "M" + x + " " + y + " " + ("L" + (x + halfWidth) + " " + (y + halfWidth) + " ") + ("L" + (x + bottomWidth) + " " + (y + halfWidth) + " ") + ("L" + (x + bottomWidth) + " " + (y + height) + " ") + ("L" + (x - bottomWidth) + " " + (y + height) + " ") + ("L" + (x - bottomWidth) + " " + (y + halfWidth) + " ") + ("L" + (x - halfWidth) + " " + (y + halfWidth) + " ") + "Z";
}

export function sellPath(_ref2) {
	var x = _ref2.x,
	    y = _ref2.y;

	return "M" + x + " " + y + " " + ("L" + (x + halfWidth) + " " + (y - halfWidth) + " ") + ("L" + (x + bottomWidth) + " " + (y - halfWidth) + " ") + ("L" + (x + bottomWidth) + " " + (y - height) + " ") + ("L" + (x - bottomWidth) + " " + (y - height) + " ") + ("L" + (x - bottomWidth) + " " + (y - halfWidth) + " ") + ("L" + (x - halfWidth) + " " + (y - halfWidth) + " ") + "Z";
}
//# sourceMappingURL=index.js.map