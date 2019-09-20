var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import PropTypes from "prop-types";

function ToolTipTSpanLabel(props) {
	return React.createElement(
		"tspan",
		_extends({ className: "react-stockcharts-tooltip-label" }, props),
		props.children
	);
}

ToolTipTSpanLabel.propTypes = {
	children: PropTypes.node.isRequired,
	fill: PropTypes.string.isRequired
};

ToolTipTSpanLabel.defaultProps = {
	fill: "#4682B4"
};

export default ToolTipTSpanLabel;
//# sourceMappingURL=ToolTipTSpanLabel.js.map