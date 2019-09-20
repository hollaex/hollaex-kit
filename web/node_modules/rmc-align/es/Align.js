var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import align from 'dom-align';
import addEventListener from 'rc-util/es/Dom/addEventListener';
import isWindow from './isWindow';
function buffer(fn, ms) {
    var timer = void 0;
    function clear() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }
    function bufferFn() {
        clear();
        timer = setTimeout(fn, ms);
    }
    bufferFn.clear = clear;
    return bufferFn;
}

var Align = function (_Component) {
    _inherits(Align, _Component);

    function Align() {
        _classCallCheck(this, Align);

        var _this = _possibleConstructorReturn(this, (Align.__proto__ || Object.getPrototypeOf(Align)).apply(this, arguments));

        _this.forceAlign = function () {
            var props = _this.props;
            if (!props.disabled) {
                var source = ReactDOM.findDOMNode(_this);
                props.onAlign(source, align(source, props.target(), props.align));
            }
        };
        return _this;
    }

    _createClass(Align, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var props = this.props;
                        this.forceAlign();
            if (!props.disabled && props.monitorWindowResize) {
                this.startMonitorWindowResize();
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var reAlign = false;
            var props = this.props;
            if (!props.disabled) {
                if (prevProps.disabled || prevProps.align !== props.align) {
                    reAlign = true;
                } else {
                    var lastTarget = prevProps.target();
                    var currentTarget = props.target();
                    if (isWindow(lastTarget) && isWindow(currentTarget)) {
                        reAlign = false;
                    } else if (lastTarget !== currentTarget) {
                        reAlign = true;
                    }
                }
            }
            if (reAlign) {
                this.forceAlign();
            }
            if (props.monitorWindowResize && !props.disabled) {
                this.startMonitorWindowResize();
            } else {
                this.stopMonitorWindowResize();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.stopMonitorWindowResize();
        }
    }, {
        key: 'startMonitorWindowResize',
        value: function startMonitorWindowResize() {
            if (!this.resizeHandler) {
                this.bufferMonitor = buffer(this.forceAlign, this.props.monitorBufferTime);
                this.resizeHandler = addEventListener(window, 'resize', this.bufferMonitor);
            }
        }
    }, {
        key: 'stopMonitorWindowResize',
        value: function stopMonitorWindowResize() {
            if (this.resizeHandler) {
                this.bufferMonitor.clear();
                this.resizeHandler.remove();
                this.resizeHandler = null;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                childrenProps = _props.childrenProps,
                children = _props.children;

            var child = React.Children.only(children);
            if (childrenProps) {
                var newProps = {};
                for (var prop in childrenProps) {
                    if (childrenProps.hasOwnProperty(prop)) {
                        newProps[prop] = this.props[childrenProps[prop]];
                    }
                }
                return React.cloneElement(child, newProps);
            }
            return child;
        }
    }]);

    return Align;
}(Component);

Align.defaultProps = {
    target: function target() {
        return window;
    },
    onAlign: function onAlign() {},
    monitorBufferTime: 50,
    monitorWindowResize: false,
    disabled: false
};
export default Align;