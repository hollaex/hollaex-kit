"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Header = function (_React$PureComponent) {
    (0, _inherits3["default"])(Header, _React$PureComponent);

    function Header() {
        (0, _classCallCheck3["default"])(this, Header);
        return (0, _possibleConstructorReturn3["default"])(this, _React$PureComponent.apply(this, arguments));
    }

    Header.prototype.render = function render() {
        var _props = this.props,
            title = _props.title,
            _props$locale = _props.locale,
            locale = _props$locale === undefined ? {} : _props$locale,
            onCancel = _props.onCancel,
            onClear = _props.onClear,
            showClear = _props.showClear,
            closeIcon = _props.closeIcon,
            clearIcon = _props.clearIcon;

        return React.createElement(
            "div",
            { className: "header" },
            React.createElement(
                "span",
                { className: "left", onClick: function onClick() {
                        return onCancel && onCancel();
                    } },
                closeIcon
            ),
            React.createElement(
                "span",
                { className: "title" },
                title || locale.title
            ),
            showClear && React.createElement(
                "span",
                { className: "right", onClick: function onClick() {
                        return onClear && onClear();
                    } },
                clearIcon || locale.clear
            )
        );
    };

    return Header;
}(React.PureComponent);

exports["default"] = Header;

Header.defaultProps = {
    closeIcon: 'X'
};
module.exports = exports['default'];