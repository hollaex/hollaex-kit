'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Result = function (_React$Component) {
    (0, _inherits3['default'])(Result, _React$Component);

    function Result() {
        (0, _classCallCheck3['default'])(this, Result);
        return (0, _possibleConstructorReturn3['default'])(this, (Result.__proto__ || Object.getPrototypeOf(Result)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Result, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                prefixCls = _props.prefixCls,
                className = _props.className,
                style = _props.style,
                img = _props.img,
                imgUrl = _props.imgUrl,
                title = _props.title,
                message = _props.message,
                buttonText = _props.buttonText,
                onButtonClick = _props.onButtonClick,
                buttonType = _props.buttonType;

            var imgContent = null;
            if (img) {
                imgContent = _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-pic' },
                    img
                );
            } else if (imgUrl) {
                imgContent = _react2['default'].createElement('div', { className: prefixCls + '-pic', style: { backgroundImage: 'url(' + imgUrl + ')' } });
            }
            return _react2['default'].createElement(
                'div',
                { className: (0, _classnames2['default'])(prefixCls, className), style: style, role: 'alert' },
                imgContent,
                title ? _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-title' },
                    title
                ) : null,
                message ? _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-message' },
                    message
                ) : null,
                buttonText ? _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-button' },
                    _react2['default'].createElement(
                        _button2['default'],
                        { type: buttonType, onClick: onButtonClick },
                        buttonText
                    )
                ) : null
            );
        }
    }]);
    return Result;
}(_react2['default'].Component); /* tslint:disable:jsx-no-multiline-js */


exports['default'] = Result;

Result.defaultProps = {
    prefixCls: 'am-result',
    buttonType: '',
    onButtonClick: function onButtonClick() {}
};
module.exports = exports['default'];