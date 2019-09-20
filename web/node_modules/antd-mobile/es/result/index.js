import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import React from 'react';
import Button from '../button';

var Result = function (_React$Component) {
    _inherits(Result, _React$Component);

    function Result() {
        _classCallCheck(this, Result);

        return _possibleConstructorReturn(this, (Result.__proto__ || Object.getPrototypeOf(Result)).apply(this, arguments));
    }

    _createClass(Result, [{
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
                imgContent = React.createElement(
                    'div',
                    { className: prefixCls + '-pic' },
                    img
                );
            } else if (imgUrl) {
                imgContent = React.createElement('div', { className: prefixCls + '-pic', style: { backgroundImage: 'url(' + imgUrl + ')' } });
            }
            return React.createElement(
                'div',
                { className: classnames(prefixCls, className), style: style, role: 'alert' },
                imgContent,
                title ? React.createElement(
                    'div',
                    { className: prefixCls + '-title' },
                    title
                ) : null,
                message ? React.createElement(
                    'div',
                    { className: prefixCls + '-message' },
                    message
                ) : null,
                buttonText ? React.createElement(
                    'div',
                    { className: prefixCls + '-button' },
                    React.createElement(
                        Button,
                        { type: buttonType, onClick: onButtonClick },
                        buttonText
                    )
                ) : null
            );
        }
    }]);

    return Result;
}(React.Component);

export default Result;

Result.defaultProps = {
    prefixCls: 'am-result',
    buttonType: '',
    onButtonClick: function onButtonClick() {}
};