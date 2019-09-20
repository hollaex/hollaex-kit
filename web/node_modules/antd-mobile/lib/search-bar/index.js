'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames4 = require('classnames');

var _classnames5 = _interopRequireDefault(_classnames4);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rmcFeedback = require('rmc-feedback');

var _rmcFeedback2 = _interopRequireDefault(_rmcFeedback);

var _getDataAttr = require('../_util/getDataAttr');

var _getDataAttr2 = _interopRequireDefault(_getDataAttr);

var _getLocale = require('../_util/getLocale');

var _PropsType = require('./PropsType');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
    (0, _inherits3['default'])(SearchBar, _React$Component);

    function SearchBar(props) {
        (0, _classCallCheck3['default'])(this, SearchBar);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

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

    (0, _createClass3['default'])(SearchBar, [{
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

            var _locale = (0, _getLocale.getComponentLocale)(this.props, this.context, 'SearchBar', function () {
                return require('./locale/zh_CN');
            });
            var cancelText = _locale.cancelText;
            var _state = this.state,
                value = _state.value,
                focus = _state.focus;

            var wrapCls = (0, _classnames5['default'])(prefixCls, className, (0, _defineProperty3['default'])({}, prefixCls + '-start', !!(focus || value && value.length > 0)));
            var clearCls = (0, _classnames5['default'])(prefixCls + '-clear', (0, _defineProperty3['default'])({}, prefixCls + '-clear-show', !!(focus && value && value.length > 0)));
            var cancelCls = (0, _classnames5['default'])(prefixCls + '-cancel', (_classnames3 = {}, (0, _defineProperty3['default'])(_classnames3, prefixCls + '-cancel-show', !!(showCancelButton || focus || value && value.length > 0)), (0, _defineProperty3['default'])(_classnames3, prefixCls + '-cancel-anim', this.firstFocus), _classnames3));
            return _react2['default'].createElement(
                'form',
                { onSubmit: this.onSubmit, className: wrapCls, style: style, ref: function ref(el) {
                        return _this2.inputContainerRef = el;
                    }, action: '#' },
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-input' },
                    _react2['default'].createElement(
                        'div',
                        { className: prefixCls + '-synthetic-ph', ref: function ref(el) {
                                return _this2.syntheticPhRef = el;
                            } },
                        _react2['default'].createElement(
                            'span',
                            { className: prefixCls + '-synthetic-ph-container', ref: function ref(el) {
                                    return _this2.syntheticPhContainerRef = el;
                                } },
                            _react2['default'].createElement('i', { className: prefixCls + '-synthetic-ph-icon' }),
                            _react2['default'].createElement(
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
                    _react2['default'].createElement('input', (0, _extends3['default'])({ type: 'search', className: prefixCls + '-value', value: value, disabled: disabled, placeholder: placeholder, onChange: this.onChange, onFocus: this.onFocus, onBlur: this.onBlur, ref: function ref(el) {
                            return _this2.inputRef = el;
                        }, maxLength: maxLength }, (0, _getDataAttr2['default'])(this.props))),
                    _react2['default'].createElement(
                        _rmcFeedback2['default'],
                        { activeClassName: prefixCls + '-clear-active' },
                        _react2['default'].createElement('a', { onClick: this.onClear, className: clearCls })
                    )
                ),
                _react2['default'].createElement(
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
}(_react2['default'].Component);

exports['default'] = SearchBar;

SearchBar.defaultProps = _PropsType.defaultProps;
SearchBar.contextTypes = {
    antLocale: _propTypes2['default'].object
};
module.exports = exports['default'];