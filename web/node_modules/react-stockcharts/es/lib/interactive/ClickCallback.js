var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../utils";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

var ClickCallback = function (_Component) {
	_inherits(ClickCallback, _Component);

	function ClickCallback() {
		_classCallCheck(this, ClickCallback);

		return _possibleConstructorReturn(this, (ClickCallback.__proto__ || Object.getPrototypeOf(ClickCallback)).apply(this, arguments));
	}

	_createClass(ClickCallback, [{
		key: "render",
		value: function render() {
			var _props = this.props,
			    onMouseDown = _props.onMouseDown,
			    onClick = _props.onClick,
			    onDoubleClick = _props.onDoubleClick,
			    onContextMenu = _props.onContextMenu,
			    onMouseMove = _props.onMouseMove,
			    onPan = _props.onPan,
			    onPanEnd = _props.onPanEnd;


			return React.createElement(GenericChartComponent, {

				onMouseDown: onMouseDown,
				onClick: onClick,
				onDoubleClick: onDoubleClick,
				onContextMenu: onContextMenu,
				onMouseMove: onMouseMove,
				onPan: onPan,
				onPanEnd: onPanEnd,

				svgDraw: noop,
				canvasDraw: noop,
				canvasToDraw: getMouseCanvas,

				drawOn: ["mousemove", "pan"]
			});
		}
	}]);

	return ClickCallback;
}(Component);

ClickCallback.propTypes = {
	disablePan: PropTypes.bool.isRequired,
	onMouseDown: PropTypes.func,
	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	onMouseMove: PropTypes.func,
	onPan: PropTypes.func,
	onPanEnd: PropTypes.func
};

ClickCallback.defaultProps = {
	disablePan: false
};

export default ClickCallback;
//# sourceMappingURL=ClickCallback.js.map