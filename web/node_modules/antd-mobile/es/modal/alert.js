import React from 'react';
import ReactDOM from 'react-dom';
import closest from '../_util/closest';
import Modal from './Modal';
export default function alert(title, message) {
    var actions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [{ text: '确定' }];
    var platform = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'ios';

    var closed = false;
    if (!title && !message) {
        // console.log('Must specify either an alert title, or message, or both');
        return {
            close: function close() {}
        };
    }
    var div = document.createElement('div');
    document.body.appendChild(div);
    function close() {
        ReactDOM.unmountComponentAtNode(div);
        if (div && div.parentNode) {
            div.parentNode.removeChild(div);
        }
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
    var prefixCls = 'am-modal';
    function onWrapTouchStart(e) {
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        var pNode = closest(e.target, '.' + prefixCls + '-footer');
        if (!pNode) {
            e.preventDefault();
        }
    }
    ReactDOM.render(React.createElement(
        Modal,
        { visible: true, transparent: true, title: title, transitionName: 'am-zoom', closable: false, maskClosable: false, footer: footer, maskTransitionName: 'am-fade', platform: platform, wrapProps: { onTouchStart: onWrapTouchStart } },
        React.createElement(
            'div',
            { className: prefixCls + '-alert-content' },
            message
        )
    ), div);
    return {
        close: close
    };
}