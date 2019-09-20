import React from 'react';
import ReactDOM from 'react-dom';
import closest from '../_util/closest';
import Modal from './Modal';
export default function prompt(title, message, callbackOrActions) {
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'default';
    var defaultValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var placeholders = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : ['', ''];
    var platform = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'ios';

    var closed = false;
    defaultValue = typeof defaultValue === 'string' ? defaultValue : typeof defaultValue === 'number' ? '' + defaultValue : '';
    if (!callbackOrActions) {
        // console.log('Must specify callbackOrActions');
        return {
            close: function close() {}
        };
    }
    var prefixCls = 'am-modal';
    var data = {
        text: defaultValue
    };
    function onChange(e) {
        var target = e.target;
        var inputType = target.getAttribute('type');
        if (inputType !== null) {
            data[inputType] = target.value;
        }
    }
    // hotfix issue: https://github.com/ant-design/ant-design-mobile/issues/2177
    function onClick(e) {
        var target = e.currentTarget || e.target;
        if (target) {
            target.focus();
        }
    }
    var inputDom = void 0;
    var focusFn = function focusFn(input) {
        setTimeout(function () {
            if (input) {
                input.focus();
            }
        }, 500);
    };
    switch (type) {
        case 'login-password':
            inputDom = React.createElement(
                'div',
                { className: prefixCls + '-input-container' },
                React.createElement(
                    'div',
                    { className: prefixCls + '-input' },
                    React.createElement(
                        'label',
                        null,
                        React.createElement('input', { type: 'text', defaultValue: data.text, ref: function ref(input) {
                                return focusFn(input);
                            }, onClick: onClick, onChange: onChange, placeholder: placeholders[0] })
                    )
                ),
                React.createElement(
                    'div',
                    { className: prefixCls + '-input' },
                    React.createElement(
                        'label',
                        null,
                        React.createElement('input', { type: 'password', defaultValue: data.password, onClick: onClick, onChange: onChange, placeholder: placeholders[1] })
                    )
                )
            );
            break;
        case 'secure-text':
            inputDom = React.createElement(
                'div',
                { className: prefixCls + '-input-container' },
                React.createElement(
                    'div',
                    { className: prefixCls + '-input' },
                    React.createElement(
                        'label',
                        null,
                        React.createElement('input', { type: 'password', defaultValue: data.password, ref: function ref(input) {
                                return focusFn(input);
                            }, onClick: onClick, onChange: onChange, placeholder: placeholders[0] })
                    )
                )
            );
            break;
        case 'default':
        default:
            inputDom = React.createElement(
                'div',
                { className: prefixCls + '-input-container' },
                React.createElement(
                    'div',
                    { className: prefixCls + '-input' },
                    React.createElement(
                        'label',
                        null,
                        React.createElement('input', { type: 'text', defaultValue: data.text, ref: function ref(input) {
                                return focusFn(input);
                            }, onClick: onClick, onChange: onChange, placeholder: placeholders[0] })
                    )
                )
            );
    }
    var content = React.createElement(
        'div',
        null,
        message,
        inputDom
    );
    var div = document.createElement('div');
    document.body.appendChild(div);
    function close() {
        ReactDOM.unmountComponentAtNode(div);
        if (div && div.parentNode) {
            div.parentNode.removeChild(div);
        }
    }
    function handleConfirm(callback) {
        if (typeof callback !== 'function') {
            return;
        }
        var _data$text = data.text,
            text = _data$text === undefined ? '' : _data$text,
            _data$password = data.password,
            password = _data$password === undefined ? '' : _data$password;

        var callbackArgs = type === 'login-password' ? [text, password] : type === 'secure-text' ? [password] : [text];
        return callback.apply(undefined, callbackArgs);
    }
    var actions = void 0;
    if (typeof callbackOrActions === 'function') {
        actions = [{
            text: '取消',
            onPress: function onPress() {}
        }, {
            text: '确定',
            onPress: function onPress() {
                handleConfirm(callbackOrActions);
            }
        }];
    } else {
        actions = callbackOrActions.map(function (item) {
            return {
                text: item.text,
                onPress: function onPress() {
                    return handleConfirm(item.onPress);
                }
            };
        });
    }
    var footer = actions.map(function (button) {
        // tslint:disable-next-line:only-arrow-functions
        var orginPress = button.onPress || function () {};
        button.onPress = function () {
            if (closed) {
                return;
            }
            var res = orginPress();
            if (res && res.then) {
                res.then(function () {
                    closed = true;
                    close();
                })['catch'](function () {});
            } else {
                closed = true;
                close();
            }
        };
        return button;
    });
    function onWrapTouchStart(e) {
        // exclude input element for focus
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        var pNode = closest(e.target, '.' + prefixCls + '-content');
        if (!pNode) {
            e.preventDefault();
        }
    }
    ReactDOM.render(React.createElement(
        Modal,
        { visible: true, transparent: true, prefixCls: prefixCls, title: title, closable: false, maskClosable: false, transitionName: 'am-zoom', footer: footer, maskTransitionName: 'am-fade', platform: platform, wrapProps: { onTouchStart: onWrapTouchStart } },
        React.createElement(
            'div',
            { className: prefixCls + '-propmt-content' },
            content
        )
    ), div);
    return {
        close: close
    };
}