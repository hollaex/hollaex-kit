import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from 'rmc-dialog';
import TouchFeedback from 'rmc-feedback';
import getDataAttr from '../_util/getDataAttr';
var NORMAL = 'NORMAL';
var SHARE = 'SHARE';
// tslint:disable-next-line:no-empty
function noop() {}
var queue = [];
function createActionSheet(flag, config, callback) {
    var props = _extends({ prefixCls: 'am-action-sheet', cancelButtonText: '取消' }, config);
    var prefixCls = props.prefixCls,
        className = props.className,
        transitionName = props.transitionName,
        maskTransitionName = props.maskTransitionName,
        _props$maskClosable = props.maskClosable,
        maskClosable = _props$maskClosable === undefined ? true : _props$maskClosable;

    var div = document.createElement('div');
    document.body.appendChild(div);
    queue.push(close);
    function close() {
        if (div) {
            ReactDOM.unmountComponentAtNode(div);
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
            var index = queue.indexOf(close);
            if (index !== -1) {
                queue.splice(index, 1);
            }
        }
    }
    function cb(index) {
        var rowIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var res = callback(index, rowIndex);
        if (res && res.then) {
            res.then(function () {
                close();
            });
        } else {
            close();
        }
    }
    var title = props.title,
        message = props.message,
        options = props.options,
        destructiveButtonIndex = props.destructiveButtonIndex,
        cancelButtonIndex = props.cancelButtonIndex,
        cancelButtonText = props.cancelButtonText;

    var titleMsg = [title ? React.createElement(
        'h3',
        { key: '0', className: prefixCls + '-title' },
        title
    ) : null, message ? React.createElement(
        'div',
        { key: '1', className: prefixCls + '-message' },
        message
    ) : null];
    var children = null;
    var mode = 'normal';
    switch (flag) {
        case NORMAL:
            mode = 'normal';
            var normalOptions = options;
            children = React.createElement(
                'div',
                getDataAttr(props),
                titleMsg,
                React.createElement(
                    'div',
                    { className: prefixCls + '-button-list', role: 'group' },
                    normalOptions.map(function (item, index) {
                        var _classnames;

                        var itemProps = {
                            className: classnames(prefixCls + '-button-list-item', (_classnames = {}, _defineProperty(_classnames, prefixCls + '-destructive-button', destructiveButtonIndex === index), _defineProperty(_classnames, prefixCls + '-cancel-button', cancelButtonIndex === index), _classnames)),
                            onClick: function onClick() {
                                return cb(index);
                            },
                            role: 'button'
                        };
                        var bItem = React.createElement(
                            TouchFeedback,
                            { key: index, activeClassName: prefixCls + '-button-list-item-active' },
                            React.createElement(
                                'div',
                                itemProps,
                                item
                            )
                        );
                        if (cancelButtonIndex === index || destructiveButtonIndex === index) {
                            bItem = React.createElement(
                                TouchFeedback,
                                { key: index, activeClassName: prefixCls + '-button-list-item-active' },
                                React.createElement(
                                    'div',
                                    itemProps,
                                    item,
                                    cancelButtonIndex === index ? React.createElement('span', { className: prefixCls + '-cancel-button-mask' }) : null
                                )
                            );
                        }
                        return bItem;
                    })
                )
            );
            break;
        case SHARE:
            mode = 'share';
            var multipleLine = options.length && Array.isArray(options[0]) || false;
            var createList = function createList(item, index) {
                var rowIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                return React.createElement(
                    'div',
                    { className: prefixCls + '-share-list-item', role: 'button', key: index, onClick: function onClick() {
                            return cb(index, rowIndex);
                        } },
                    React.createElement(
                        'div',
                        { className: prefixCls + '-share-list-item-icon' },
                        item.icon
                    ),
                    React.createElement(
                        'div',
                        { className: prefixCls + '-share-list-item-title' },
                        item.title
                    )
                );
            };
            children = React.createElement(
                'div',
                getDataAttr(props),
                titleMsg,
                React.createElement(
                    'div',
                    { className: prefixCls + '-share' },
                    multipleLine ? options.map(function (item, index) {
                        return React.createElement(
                            'div',
                            { key: index, className: prefixCls + '-share-list' },
                            item.map(function (ii, ind) {
                                return createList(ii, ind, index);
                            })
                        );
                    }) : React.createElement(
                        'div',
                        { className: prefixCls + '-share-list' },
                        options.map(function (item, index) {
                            return createList(item, index);
                        })
                    ),
                    React.createElement(
                        TouchFeedback,
                        { activeClassName: prefixCls + '-share-cancel-button-active' },
                        React.createElement(
                            'div',
                            { className: prefixCls + '-share-cancel-button', role: 'button', onClick: function onClick() {
                                    return cb(-1);
                                } },
                            cancelButtonText
                        )
                    )
                )
            );
            break;
        default:
            break;
    }
    var rootCls = classnames(prefixCls + '-' + mode, className);
    ReactDOM.render(React.createElement(
        Dialog,
        { visible: true, title: '', footer: '', prefixCls: prefixCls, className: rootCls, transitionName: transitionName || 'am-slide-up', maskTransitionName: maskTransitionName || 'am-fade', onClose: function onClose() {
                return cb(cancelButtonIndex || -1);
            }, maskClosable: maskClosable, wrapProps: props.wrapProps || {} },
        children
    ), div);
    return {
        close: close
    };
}
export default {
    showActionSheetWithOptions: function showActionSheetWithOptions(config) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        createActionSheet(NORMAL, config, callback);
    },
    showShareActionSheetWithOptions: function showShareActionSheetWithOptions(config) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        createActionSheet(SHARE, config, callback);
    },
    close: function close() {
        queue.forEach(function (q) {
            return q();
        });
    }
};