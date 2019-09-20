var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

var TypeChooser = function (_Component) {
	_inherits(TypeChooser, _Component);

	function TypeChooser(props) {
		_classCallCheck(this, TypeChooser);

		var _this = _possibleConstructorReturn(this, (TypeChooser.__proto__ || Object.getPrototypeOf(TypeChooser)).call(this, props));

		_this.state = {
			type: _this.props.type
		};
		_this.handleTypeChange = _this.handleTypeChange.bind(_this);
		return _this;
	}

	_createClass(TypeChooser, [{
		key: "handleTypeChange",
		value: function handleTypeChange(e) {
			// console.log(e.target.value);
			this.setState({
				type: e.target.value
			});
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				null,
				React.createElement(
					"label",
					null,
					"Type: "
				),
				React.createElement(
					"select",
					{ name: "type", id: "type", onChange: this.handleTypeChange, value: this.state.type },
					React.createElement(
						"option",
						{ value: "svg" },
						"svg"
					),
					React.createElement(
						"option",
						{ value: "hybrid" },
						"canvas + svg"
					)
				),
				React.createElement(
					"div",
					{ style: this.props.style },
					this.props.children(this.state.type)
				)
			);
		}
	}]);

	return TypeChooser;
}(Component);

TypeChooser.propTypes = {
	type: PropTypes.oneOf(["svg", "hybrid"]),
	children: PropTypes.func.isRequired,
	style: PropTypes.object.isRequired
};

TypeChooser.defaultProps = {
	type: "hybrid",
	style: {}
};

export default TypeChooser;
//# sourceMappingURL=TypeChooser.js.map