import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import TouchFeedback from 'rmc-feedback';
import getDataAttr from '../_util/getDataAttr';
import { getComponentLocale } from '../_util/getLocale';
import { defaultProps } from './PropsType';
function onNextFrame(cb) {
    if (window.requestAnimationFrame) {
        return window.requestAnimationFrame(cb);
    }
    return window.setTimeout(cb, 1);
}
function clearNextFrameAction(nextFrameId) {
    if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(nextFrameId);
    } else {
        window.clearTimeout(nextFrameId);
    }
}

var SearchBar = function (_React$Component) {
    _inherits(SearchBar, _React$Component);

    function SearchBar(props) {
        _classCallCheck(this, SearchBar);

        var _this = _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

        _this.onSubmit = function (e) {
            e.preventDefault();
            if (_this.props.onSubmit) {
                _this.props.onSubmit(_this.state.value || '');
            }
            if (_this.inputRef) {
                _this.inputRef.blur();
            }
        };
        _this.onChange = function (e) {
            if (!_this.state.focus) {
                _this.setState({
                    focus: true
                });
            }
            var value = e.target.value;
            if (!('value' in _this.props)) {
                _this.setState({ value: value });
            }
            if (_this.props.onChange) {
                _this.props.onChange(value);
            }
        };
        _this.onFocus = function () {
            _this.setState({
                focus: true
            });
            _this.firstFocus = true;
            if (_this.props.onFocus) {
                _this.props.onFocus();
            }
        };
        _this.onBlur = function () {
            _this.onBlurTimeout = onNextFrame(function () {
                if (!_this.blurFromOnClear) {
                    if (document.activeElement !== _this.inputRef) {
                        _this.setState({
                            focus: false
                        });
                    }
                }
                _this.blurFromOnClear = false;
            });
            if (_this.props.onBlur) {
                _this.props.onBlur();
            }
        };
        _this.onClear = function () {
            _this.doClear();
        };
        _this.doClear = function () {
            var blurFromOnClear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            _this.blurFromOnClear = blurFromOnClear;
            if (!('value' in _this.props)) {
                _this.setState({ value: '' });
            }
            if (_this.props.onClear) {
                _this.props.onClear('');
            }
            if (_this.props.onChange) {
                _this.props.onChange('');
            }
            if (blurFromOnClear) {
                _this.focus();
            }
        };
        _this.onCancel = function () {
            if (_this.props.onCancel) {
                _this.props.onCancel(_this.state.value || '');
            } else {
                _this.doClear(false);
            }
        };
        _this.focus = function () {
            if (_this.inputRef) {
                _this.inputRef.focus();
            }
        };
        var value = void 0;
        if ('value' in props) {
            value = props.value || '';
        } else if ('defaultValue' in props) {
            value = props.defaultValue;
        } else {
            value = '';
        }
        _this.state = {
            value: value,
            focus: false
        };
        return _this;
    }

    _createClass(SearchBar, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.rightBtnRef) {
                var initBtn = window.getComputedStyle(this.rightBtnRef);
                this.rightBtnInitMarginleft = initBtn.marginLeft;
            }
            this.componentDidUpdate();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.syntheticPhRef) {
                if (this.inputContainerRef && this.inputContainerRef.className.indexOf(this.props.prefixCls + '-start') > -1) {
                    // 检测是否包含名为 ${this.props.prefixCls}-start 样式，生成动画
                    // offsetWidth 某些时候是向上取整，某些时候是向下取整，不能用
                    if (this.syntheticPhContainerRef) {
                        var realWidth = this.syntheticPhContainerRef.getBoundingClientRect().width; // 包含小数
                        this.syntheticPhRef.style.width = Math.ceil(realWidth) + 'px';
                    }
                    if (!this.props.showCancelButton && this.rightBtnRef) {
                        this.rightBtnRef.style.marginRight = '0';
                    }
                } else {
                    this.syntheticPhRef.style.width = '100%';
                    if (!this.props.showCancelButton && this.rightBtnRef) {
                        this.rightBtnRef.style.marginRight = '-' + (this.rightBtnRef.offsetWidth + (this.rightBtnInitMarginleft != null ? parseInt(this.rightBtnInitMarginleft, 10) : 0)) + 'px';
                    }
                }
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if ('value' in nextProps && nextProps.value !== this.state.value) {
                this.setState({
                    value: nextProps.value
                });
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.onBlurTimeout) {
                clearNextFrameAction(this.onBlurTimeout);
                this.onBlurTimeout = null;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _classnames3,
                _this2 = this;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                showCancelButton = _props.showCancelButton,
                disabled = _props.disabled,
                placeholder = _props.placeholder,
                className = _props.className,
                style = _props.style,
                maxLength = _props.maxLength;
            // tslint:disable-next-line:variable-name

            var _locale = getComponentLocale(this.props, this.context, 'SearchBar', function () {
                return require('./locale/zh_CN');
            });
            var cancelText = _locale.cancelText;
            var _state = this.state,
                value = _state.value,
                focus = _state.focus;

            var wrapCls = classnames(prefixCls, className, _defineProperty({}, prefixCls + '-start', !!(focus || value && value.length > 0)));
            var clearCls = classnames(prefixCls + '-clear', _defineProperty({}, prefixCls + '-clear-show', !!(focus && value && value.length > 0)));
            var cancelCls = classnames(prefixCls + '-cancel', (_classnames3 = {}, _defineProperty(_classnames3, prefixCls + '-cancel-show', !!(showCancelButton || focus || value && value.length > 0)), _defineProperty(_classnames3, prefixCls + '-cancel-anim', this.firstFocus), _classnames3));
            return React.createElement(
                'form',
                { onSubmit: this.onSubmit, className: wrapCls, style: style, ref: function ref(el) {
                        return _this2.inputContainerRef = el;
                    }, action: '#' },
                React.createElement(
                    'div',
                    { className: prefixCls + '-input' },
                    React.createElement(
                        'div',
                        { className: prefixCls + '-synthetic-ph', ref: function ref(el) {
                                return _this2.syntheticPhRef = el;
                            } },
                        React.createElement(
                            'span',
                            { className: prefixCls + '-synthetic-ph-container', ref: function ref(el) {
                                    return _this2.syntheticPhContainerRef = el;
                                } },
                            React.createElement('i', { className: prefixCls + '-synthetic-ph-icon' }),
                            React.createElement(
                                'span',
                                { className: prefixCls + '-synthetic-ph-placeholder'
                                    // tslint:disable-next-line:jsx-no-multiline-js
                                    , style: {
                                        visibility: placeholder && !value ? 'visible' : 'hidden'
                                    } },
                                placeholder
                            )
                        )
                    ),
                    React.createElement('input', _extends({ type: 'search', className: prefixCls + '-value', value: value, disabled: disabled, placeholder: placeholder, onChange: this.onChange, onFocus: this.onFocus, onBlur: this.onBlur, ref: function ref(el) {
                            return _this2.inputRef = el;
                        }, maxLength: maxLength }, getDataAttr(this.props))),
                    React.createElement(
                        TouchFeedback,
                        { activeClassName: prefixCls + '-clear-active' },
                        React.createElement('a', { onClick: this.onClear, className: clearCls })
                    )
                ),
                React.createElement(
                    'div',
                    { className: cancelCls, onClick: this.onCancel, ref: function ref(el) {
                            return _this2.rightBtnRef = el;
                        } },
                    this.props.cancelText || cancelText
                )
            );
        }
    }]);

    return SearchBar;
}(React.Component);

export default SearchBar;

SearchBar.defaultProps = defaultProps;
SearchBar.contextTypes = {
    antLocale: PropTypes.object
};