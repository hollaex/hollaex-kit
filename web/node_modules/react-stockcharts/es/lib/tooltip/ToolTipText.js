var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

var ToolTipText = function (_Component) {
	_inherits(ToolTipText, _Component);

	function ToolTipText() {
		_classCallCheck(this, ToolTipText);

		return _possibleConstructorReturn(this, (ToolTipText.__proto__ || Object.getPrototypeOf(ToolTipText)).apply(this, arguments));
	}

	_createClass(ToolTipText, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"text",
				_extends({
					fontFamily: this.props.fontFamily,
					fontSize: this.props.fontSize
				}, this.props, {
					className: "react-stockcharts-tooltip" }),
				this.props.children
			);
		}
	}]);

	return ToolTipText;
}(Component);

ToolTipText.propTypes = {
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired
};

ToolTipText.defaultProps = {
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 11
};

export default ToolTipText;
//# sourceMappingURL=ToolTipText.js.map