import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "babel-runtime/helpers/possibleConstructorReturn";
import _inherits from "babel-runtime/helpers/inherits";
import * as React from 'react';

var Header = function (_React$PureComponent) {
    _inherits(Header, _React$PureComponent);

    function Header() {
        _classCallCheck(this, Header);

        return _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));
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

export default Header;

Header.defaultProps = {
    closeIcon: 'X'
};