import _defineProperty from 'babel-runtime/helpers/defineProperty';
import classnames from 'classnames';
import React from 'react';
import Notification from 'rmc-notification';
import Icon from '../icon';
var messageInstance = void 0;
var prefixCls = 'am-toast';
function getMessageInstance(mask, callback) {
    var _classnames;

    if (messageInstance) {
        messageInstance.destroy();
        messageInstance = null;
    }
    Notification.newInstance({
        prefixCls: prefixCls,
        style: {},
        transitionName: 'am-fade',
        className: classnames((_classnames = {}, _defineProperty(_classnames, prefixCls + '-mask', mask), _defineProperty(_classnames, prefixCls + '-nomask', !mask), _classnames))
    }, function (notification) {
        return callback && callback(notification);
    });
}
function notice(content, type) {
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
    var _onClose = arguments[3];
    var mask = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    var iconTypes = {
        info: '',
        success: 'success',
        fail: 'fail',
        offline: 'dislike',
        loading: 'loading'
    };
    var iconType = iconTypes[type];
    getMessageInstance(mask, function (notification) {
        messageInstance = notification;
        notification.notice({
            duration: duration,
            style: {},
            content: !!iconType ? React.createElement(
                'div',
                { className: prefixCls + '-text ' + prefixCls + '-text-icon', role: 'alert', 'aria-live': 'assertive' },
                React.createElement(Icon, { type: iconType, size: 'lg' }),
                React.createElement(
                    'div',
                    { className: prefixCls + '-text-info' },
                    content
                )
            ) : React.createElement(
                'div',
                { className: prefixCls + '-text', role: 'alert', 'aria-live': 'assertive' },
                React.createElement(
                    'div',
                    null,
                    content
                )
            ),
            closable: true,
            onClose: function onClose() {
                if (_onClose) {
                    _onClose();
                }
                notification.destroy();
                notification = null;
                messageInstance = null;
            }
        });
    });
}
export default {
    SHORT: 3,
    LONG: 8,
    show: function show(content, duration, mask) {
        return notice(content, 'info', duration, function () {}, mask);
    },
    info: function info(content, duration, onClose, mask) {
        return notice(content, 'info', duration, onClose, mask);
    },
    success: function success(content, duration, onClose, mask) {
        return notice(content, 'success', duration, onClose, mask);
    },
    fail: function fail(content, duration, onClose, mask) {
        return notice(content, 'fail', duration, onClose, mask);
    },
    offline: function offline(content, duration, onClose, mask) {
        return notice(content, 'offline', duration, onClose, mask);
    },
    loading: function loading(content, duration, onClose, mask) {
        return notice(content, 'loading', duration, onClose, mask);
    },
    hide: function hide() {
        if (messageInstance) {
            messageInstance.destroy();
            messageInstance = null;
        }
    }
};