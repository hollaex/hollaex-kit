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

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rmcFeedback = require('rmc-feedback');

var _rmcFeedback2 = _interopRequireDefault(_rmcFeedback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
/* tslint:disable:jsx-no-multiline-js */

function noop() {}
function fixControlledValue(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }
    return value;
}
var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\n/g;
function countSymbols() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return text.replace(regexAstralSymbols, '_').length;
}

var TextareaItem = function (_React$Component) {
    (0, _inherits3['default'])(TextareaItem, _React$Component);

    function TextareaItem(props) {
        (0, _classCallCheck3['default'])(this, TextareaItem);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (TextareaItem.__proto__ || Object.getPrototypeOf(TextareaItem)).call(this, props));

        _this.focus = function () {
            _this.textareaRef.focus();
        };
        _this.reAlignHeight = function () {
            var textareaDom = _this.textareaRef;
            textareaDom.style.height = ''; // 字数减少时能自动减小高度
            textareaDom.style.height = textareaDom.scrollHeight + 'px';
        };
        _this.onChange = function (e) {
            var value = e.target.value;
            if ('value' in _this.props) {
                _this.setState({ value: _this.props.value });
            } else {
                _this.setState({ value: value });
            }
            var onChange = _this.props.onChange;

            if (onChange) {
                onChange(value);
            }
            // 设置 defaultValue 时，用户输入不会触发 componentDidUpdate ，此处手工调用
            _this.componentDidUpdate();
        };
        _this.onBlur = function (e) {
            _this.debounceTimeout = setTimeout(function () {
                if (document.activeElement !== _this.textareaRef) {
                    _this.setState({
                        focus: false
                    });
                }
            }, 100);
            var value = e.currentTarget.value;
            if (_this.props.onBlur) {
                _this.props.onBlur(value);
            }
        };
        _this.onFocus = function (e) {
            if (_this.debounceTimeout) {
                clearTimeout(_this.debounceTimeout);
                _this.debounceTimeout = null;
            }
            _this.setState({
                focus: true
            });
            var value = e.currentTarget.value;
            if (_this.props.onFocus) {
                _this.props.onFocus(value);
            }
        };
        _this.onErrorClick = function () {
            if (_this.props.onErrorClick) {
                _this.props.onErrorClick();
            }
        };
        _this.clearInput = function () {
            _this.setState({
                value: ''
            });
            if (_this.props.onChange) {
                _this.props.onChange('');
            }
        };
        _this.state = {
            focus: false,
            value: props.value || props.defaultValue || ''
        };
        return _this;
    }

    (0, _createClass3['default'])(TextareaItem, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if ('value' in nextProps) {
                this.setState({
                    value: fixControlledValue(nextProps.value)
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.autoHeight) {
                this.reAlignHeight();
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.autoHeight && this.state.focus) {
                this.reAlignHeight();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = null;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _classnames,
                _classnames2,
                _this2 = this;

            var _a = this.props,
                prefixCls = _a.prefixCls,
                prefixListCls = _a.prefixListCls,
                editable = _a.editable,
                style = _a.style,
                clear = _a.clear,
                children = _a.children,
                error = _a.error,
                className = _a.className,
                count = _a.count,
                labelNumber = _a.labelNumber,
                title = _a.title,
                onErrorClick = _a.onErrorClick,
                autoHeight = _a.autoHeight,
                defaultValue = _a.defaultValue,
                otherProps = __rest(_a, ["prefixCls", "prefixListCls", "editable", "style", "clear", "children", "error", "className", "count", "labelNumber", "title", "onErrorClick", "autoHeight", "defaultValue"]);var disabled = otherProps.disabled;
            var _state = this.state,
                value = _state.value,
                focus = _state.focus;

            var hasCount = count > 0 && this.props.rows > 1;
            var wrapCls = (0, _classnames4['default'])(className, prefixListCls + '-item', prefixCls + '-item', (_classnames = {}, (0, _defineProperty3['default'])(_classnames, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_classnames, prefixCls + '-item-single-line', this.props.rows === 1 && !autoHeight), (0, _defineProperty3['default'])(_classnames, prefixCls + '-error', error), (0, _defineProperty3['default'])(_classnames, prefixCls + '-focus', focus), (0, _defineProperty3['default'])(_classnames, prefixCls + '-has-count', hasCount), _classnames));
            var labelCls = (0, _classnames4['default'])(prefixCls + '-label', (_classnames2 = {}, (0, _defineProperty3['default'])(_classnames2, prefixCls + '-label-2', labelNumber === 2), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-label-3', labelNumber === 3), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-label-4', labelNumber === 4), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-label-5', labelNumber === 5), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-label-6', labelNumber === 6), (0, _defineProperty3['default'])(_classnames2, prefixCls + '-label-7', labelNumber === 7), _classnames2));
            var characterLength = countSymbols(value);
            var lengthCtrlProps = {};
            if (count > 0) {
                lengthCtrlProps.maxLength = count - characterLength + (value ? value.length : 0);
            }
            return _react2['default'].createElement(
                'div',
                { className: wrapCls },
                title && _react2['default'].createElement(
                    'div',
                    { className: labelCls },
                    title
                ),
                _react2['default'].createElement(
                    'div',
                    { className: prefixCls + '-control' },
                    _react2['default'].createElement('textarea', (0, _extends3['default'])({ ref: function ref(el) {
                            return _this2.textareaRef = el;
                        } }, lengthCtrlProps, otherProps, { value: value, onChange: this.onChange, onBlur: this.onBlur, onFocus: this.onFocus, readOnly: !editable, style: style }))
                ),
                clear && editable && value && characterLength > 0 && _react2['default'].createElement(
                    _rmcFeedback2['default'],
                    { activeClassName: prefixCls + '-clear-active' },
                    _react2['default'].createElement('div', { className: prefixCls + '-clear', onClick: this.clearInput })
                ),
                error && _react2['default'].createElement('div', { className: prefixCls + '-error-extra', onClick: this.onErrorClick }),
                hasCount && _react2['default'].createElement(
                    'span',
                    { className: prefixCls + '-count' },
                    _react2['default'].createElement(
                        'span',
                        null,
                        value ? characterLength : 0
                    ),
                    '/',
                    count
                )
            );
        }
    }]);
    return TextareaItem;
}(_react2['default'].Component);

exports['default'] = TextareaItem;

TextareaItem.defaultProps = {
    prefixCls: 'am-textarea',
    prefixListCls: 'am-list',
    autoHeight: false,
    editable: true,
    disabled: false,
    placeholder: '',
    clear: false,
    rows: 1,
    onChange: noop,
    onBlur: noop,
    onFocus: noop,
    onErrorClick: noop,
    error: false,
    labelNumber: 5
};
module.exports = exports['default'];