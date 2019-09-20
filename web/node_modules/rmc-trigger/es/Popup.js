import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Align from 'rmc-align';
import Animate from 'rc-animate';
import PopupInner from './PopupInner';
import LazyRenderBox from './LazyRenderBox';
import { saveRef } from './utils';

var Popup = function (_Component) {
    _inherits(Popup, _Component);

    function Popup(props) {
        _classCallCheck(this, Popup);

        var _this = _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).call(this, props));

        _this.onAlign = function (popupDomNode, align) {
            var props = _this.props;
            var currentAlignClassName = props.getClassNameFromAlign(align);
            // FIX: https://github.com/react-component/trigger/issues/56
            // FIX: https://github.com/react-component/tooltip/issues/79
            if (_this.currentAlignClassName !== currentAlignClassName) {
                _this.currentAlignClassName = currentAlignClassName;
                popupDomNode.className = _this.getClassName(currentAlignClassName);
            }
            props.onAlign(popupDomNode, align);
        };
        _this.getTarget = function () {
            return _this.props.getRootDomNode();
        };
        _this.savePopupRef = saveRef.bind(_this, 'popupInstance');
        _this.saveAlignRef = saveRef.bind(_this, 'alignInstance');
        return _this;
    }

    _createClass(Popup, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.rootNode = this.getPopupDomNode();
        }
    }, {
        key: 'getPopupDomNode',
        value: function getPopupDomNode() {
            return ReactDOM.findDOMNode(this.popupInstance);
        }
    }, {
        key: 'getMaskTransitionName',
        value: function getMaskTransitionName() {
            var props = this.props;
            var transitionName = props.maskTransitionName;
            var animation = props.maskAnimation;
            if (!transitionName && animation) {
                transitionName = props.prefixCls + '-' + animation;
            }
            return transitionName;
        }
    }, {
        key: 'getTransitionName',
        value: function getTransitionName() {
            var props = this.props;
            var transitionName = props.transitionName;
            if (!transitionName && props.animation) {
                transitionName = props.prefixCls + '-' + props.animation;
            }
            return transitionName;
        }
    }, {
        key: 'getClassName',
        value: function getClassName(currentAlignClassName) {
            return this.props.prefixCls + ' ' + this.props.className + ' ' + currentAlignClassName;
        }
    }, {
        key: 'getPopupElement',
        value: function getPopupElement() {
            var savePopupRef = this.savePopupRef,
                props = this.props;
            var align = props.align,
                style = props.style,
                visible = props.visible,
                prefixCls = props.prefixCls,
                destroyPopupOnHide = props.destroyPopupOnHide;

            var className = this.getClassName(this.currentAlignClassName || props.getClassNameFromAlign(align));
            var hiddenClassName = prefixCls + '-hidden';
            if (!visible) {
                this.currentAlignClassName = null;
            }
            var newStyle = _extends({}, style, this.getZIndexStyle());
            var popupInnerProps = {
                className: className,
                prefixCls: prefixCls,
                ref: savePopupRef,
                style: newStyle
            };
            if (destroyPopupOnHide) {
                return React.createElement(
                    Animate,
                    { component: '', exclusive: true, transitionAppear: true, onAnimateLeave: props.onAnimateLeave, transitionName: this.getTransitionName() },
                    visible ? React.createElement(
                        Align,
                        { target: this.getTarget, key: 'popup', ref: this.saveAlignRef, monitorWindowResize: true, align: align, onAlign: this.onAlign },
                        React.createElement(
                            PopupInner,
                            _extends({ visible: true }, popupInnerProps),
                            props.children
                        )
                    ) : null
                );
            }
            var alignOtherProps = {
                xVisible: visible
            };
            return React.createElement(
                Animate,
                { component: '', exclusive: true, transitionAppear: true, transitionName: this.getTransitionName(), onAnimateLeave: props.onAnimateLeave, showProp: 'xVisible' },
                React.createElement(
                    Align,
                    _extends({ target: this.getTarget, key: 'popup', ref: this.saveAlignRef, monitorWindowResize: true }, alignOtherProps, { childrenProps: { visible: 'xVisible' }, disabled: !visible, align: align, onAlign: this.onAlign }),
                    React.createElement(
                        PopupInner,
                        _extends({ hiddenClassName: hiddenClassName }, popupInnerProps),
                        props.children
                    )
                )
            );
        }
    }, {
        key: 'getZIndexStyle',
        value: function getZIndexStyle() {
            var style = {};
            var props = this.props;
            if (props.zIndex !== undefined) {
                style.zIndex = props.zIndex;
            }
            return style;
        }
    }, {
        key: 'getMaskElement',
        value: function getMaskElement() {
            var props = this.props;
            var maskElement = void 0;
            if (props.mask) {
                var maskTransition = this.getMaskTransitionName();
                maskElement = React.createElement(LazyRenderBox, { style: this.getZIndexStyle(), key: 'mask', className: props.prefixCls + '-mask', hiddenClassName: props.prefixCls + '-mask-hidden', visible: props.visible });
                if (maskTransition) {
                    maskElement = React.createElement(
                        Animate,
                        { key: 'mask', showProp: 'visible', transitionAppear: true, component: '', transitionName: maskTransition },
                        maskElement
                    );
                }
            }
            return maskElement;
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                this.getMaskElement(),
                this.getPopupElement()
            );
        }
    }]);

    return Popup;
}(Component);

export default Popup;