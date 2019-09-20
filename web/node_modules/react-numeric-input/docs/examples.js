(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactDOM"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactDOM"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("React"), require("ReactDOM")) : factory(root["React"], root["ReactDOM"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _Demo = __webpack_require__(3);

	var _Demo2 = _interopRequireDefault(_Demo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import NumericInput from '../index.js';


	$(function () {
	    $('script.jsx').each(function (i, s) {
	        var div = $('<div/>'),
	            props = Function('return (' + $(s).text() + ')')();
	        $(s).replaceWith(div);
	        var widget = _reactDom2.default.render(_react2.default.createElement(NumericInput, props), div[0]);
	        div.data("widget", widget);
	    });

	    _reactDom2.default.render(_react2.default.createElement(_Demo2.default, null), $('.demo')[0]);

	    hljs.configure({ useBR: false });

	    $('.code').each(function (i, block) {
	        hljs.highlightBlock(block);
	    });
	}); /* global $, hljs, NumericInput */

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/* global $, hljs, NumericInput, React */
	var Demo = function (_React$Component) {
	    _inherits(Demo, _React$Component);

	    function Demo() {
	        var _ref;

	        _classCallCheck(this, Demo);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        // var that = this;
	        var _this = _possibleConstructorReturn(this, (_ref = Demo.__proto__ || Object.getPrototypeOf(Demo)).call.apply(_ref, [this].concat(args)));

	        _this.state = {
	            inputProps: {
	                name: { value: "whatever", on: false },
	                className: { value: "form-control", on: true },
	                value: { value: 50, on: true },
	                min: { value: 0, on: true },
	                max: { value: 100, on: true },
	                step: { value: 1, on: true },
	                precision: { value: 0, on: true },
	                size: { value: 5, on: true },
	                maxLength: { value: 2, on: false },
	                disabled: { value: true, on: false },
	                readOnly: { value: true, on: false },
	                mobile: { value: true, on: false },
	                required: { value: true, on: false },
	                noValidate: { value: true, on: false },
	                pattern: { value: "[0-9].[0-9][0-9]", on: false },
	                title: { value: "The title attr", on: false },
	                snap: { value: true, on: false },
	                inputmode: { value: "numeric", on: false },
	                strict: { value: true, on: false },
	                noStyle: { value: true, on: false
	                    // library
	                } }
	        };
	        return _this;
	    }

	    _createClass(Demo, [{
	        key: "componentDidUpdate",
	        value: function componentDidUpdate() {
	            hljs.highlightBlock(this.refs.code);
	        }
	    }, {
	        key: "toggleProp",
	        value: function toggleProp(propName) {
	            this.state.inputProps[propName].on = !this.state.inputProps[propName].on;
	            this.setState(this.state);
	        }
	    }, {
	        key: "setProp",
	        value: function setProp(propName, event) {
	            var val = event.target ? event.target.value : event;
	            this.state.inputProps[propName].value = val;
	            this.setState(this.state);
	        }
	    }, {
	        key: "onChange",
	        value: function onChange(x) {
	            this.state.inputProps.value.value = x === null ? "" : x;
	            if (this.state.inputProps.value.on) {
	                this.setState(this.state);
	            }
	        }
	    }, {
	        key: "onInvalid",
	        value: function onInvalid(message) {
	            // console.log("Invalid", message)
	            $(this.refs.errorMessage).text(message || "Unknown error");
	        }
	    }, {
	        key: "onValid",
	        value: function onValid() {
	            // console.log("Valid")
	            $(this.refs.errorMessage).empty();
	        }
	    }, {
	        key: "renderCode",
	        value: function renderCode() {
	            var out = '<NumericInput ';
	            var hasProps = false;

	            for (var propName in this.state.inputProps) {
	                if (this.state.inputProps[propName].on && !this.state.inputProps[propName].hidden) {
	                    var val = this.state.inputProps[propName].value;
	                    out += "\n\t" + propName;
	                    if (val !== true) {
	                        out += '=' + (typeof val == 'string' ? "\"" + val + "\" " : "{ " + val + " } ");
	                    }
	                    hasProps = true;
	                }
	            }

	            if (hasProps) {
	                out += '\n';
	            }

	            out += '/>';

	            return React.createElement(
	                "div",
	                { className: "code js", ref: "code", style: { minHeight: 379 } },
	                out
	            );
	        }
	    }, {
	        key: "renderPropEditors",
	        value: function renderPropEditors(config) {
	            var _this2 = this;

	            return config.map(function (props, propName) {
	                var editor = null;

	                var type = props.type,
	                    name = props.name,
	                    rest = _objectWithoutProperties(props, ["type", "name"]);

	                if (type == 'text') {
	                    editor = React.createElement("input", {
	                        type: "text",
	                        className: "form-control input-sm",
	                        value: _this2.state.inputProps[name].value,
	                        onChange: _this2.setProp.bind(_this2, name)
	                    });
	                } else if (type == "number") {
	                    editor = React.createElement(NumericInput, _extends({
	                        className: "form-control input-sm",
	                        value: _this2.state.inputProps[name].value,
	                        onChange: _this2.setProp.bind(_this2, name)
	                    }, rest));
	                }

	                return React.createElement(
	                    "tr",
	                    { key: propName },
	                    React.createElement(
	                        "td",
	                        { className: "unselectable" },
	                        React.createElement(
	                            "label",
	                            { style: { display: "block" } },
	                            React.createElement("input", {
	                                type: "checkbox",
	                                checked: _this2.state.inputProps[name].on,
	                                onChange: _this2.toggleProp.bind(_this2, name)
	                            }),
	                            "\xA0",
	                            name
	                        )
	                    ),
	                    React.createElement(
	                        "td",
	                        null,
	                        editor
	                    )
	                );
	            });
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var inputProps = {};
	            for (var propName in this.state.inputProps) {
	                if (this.state.inputProps[propName].on) {
	                    inputProps[propName] = this.state.inputProps[propName].value;
	                }
	                // else {
	                //     inputProps[propName] = null
	                // }
	            }

	            return React.createElement(
	                "div",
	                { className: "row" },
	                React.createElement(
	                    "div",
	                    { className: "col-xs-6" },
	                    React.createElement(
	                        "div",
	                        { className: "panel panel-default" },
	                        React.createElement(
	                            "div",
	                            { className: "panel-heading" },
	                            "Props"
	                        ),
	                        React.createElement(
	                            "table",
	                            { className: "table table-striped table-condensed" },
	                            React.createElement(
	                                "colgroup",
	                                null,
	                                React.createElement("col", { width: 169 }),
	                                React.createElement("col", null)
	                            ),
	                            React.createElement(
	                                "thead",
	                                null,
	                                React.createElement(
	                                    "tr",
	                                    null,
	                                    React.createElement(
	                                        "th",
	                                        null,
	                                        "name"
	                                    ),
	                                    React.createElement(
	                                        "th",
	                                        null,
	                                        "value"
	                                    )
	                                )
	                            )
	                        ),
	                        React.createElement(
	                            "div",
	                            { style: {
	                                    overflow: 'auto',
	                                    maxHeight: 452
	                                } },
	                            React.createElement(
	                                "table",
	                                { className: "table table-striped table-condensed" },
	                                React.createElement(
	                                    "colgroup",
	                                    null,
	                                    React.createElement("col", { width: 169 }),
	                                    React.createElement("col", null)
	                                ),
	                                React.createElement(
	                                    "tbody",
	                                    null,
	                                    this.renderPropEditors([{ name: "name", type: "text" }, { name: "className", type: "text" }, { name: "value", type: "text" }, { name: "min", type: "number" }, { name: "max", type: "number" }, { name: "step", type: "number", min: 0.001, step: 0.1, precision: 3 }, { name: "precision", type: "number", min: 0, max: 20 }, { name: "size", type: "number", min: 0, max: 60 }, { name: "maxLength", type: "number", min: 0, max: 20 }, { name: "disabled", type: "bool" }, { name: "readOnly", type: "bool" }, { name: "mobile", type: "bool" }, { name: "pattern", type: "text" }, { name: "title", type: "text" }, { name: "required", type: "bool" }, { name: "noValidate", type: "bool" }, { name: "inputmode", type: "text" }, { name: "snap", type: "bool" }, { name: "strict", type: "bool" }, { name: "noStyle", type: "bool" }])
	                                )
	                            )
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "col-xs-6" },
	                    React.createElement(
	                        "div",
	                        { className: "panel panel-primary" },
	                        React.createElement(
	                            "div",
	                            { className: "panel-heading" },
	                            "Preview"
	                        ),
	                        React.createElement(
	                            "div",
	                            { className: "panel-body" },
	                            React.createElement(
	                                "div",
	                                { ref: "example" },
	                                React.createElement(NumericInput, _extends({}, inputProps, {
	                                    onChange: this.onChange.bind(this),
	                                    onInvalid: this.onInvalid.bind(this),
	                                    onValid: this.onValid.bind(this),
	                                    value: inputProps.value === null ? undefined : inputProps.value || ""
	                                })),
	                                React.createElement(
	                                    "div",
	                                    { className: "help-block" },
	                                    React.createElement("span", { ref: "errorMessage", className: "text-danger" })
	                                )
	                            ),
	                            React.createElement("hr", null),
	                            this.renderCode()
	                        )
	                    )
	                )
	            );
	        }
	    }]);

	    return Demo;
	}(React.Component);

	exports.default = Demo;

/***/ })
/******/ ])
});
;