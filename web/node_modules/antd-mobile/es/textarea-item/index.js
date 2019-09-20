import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};
/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import React from 'react';
import TouchFeedback from 'rmc-feedback';
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
    _inherits(TextareaItem, _React$Component);

    function TextareaItem(props) {
        _classCallCheck(this, TextareaItem);

        var _this = _possibleConstructorReturn(this, (TextareaItem.__proto__ || Object.getPrototypeOf(TextareaItem)).call(this, props));

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

    _createClass(TextareaItem, [{
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
            var wrapCls = classnames(className, prefixListCls + '-item', prefixCls + '-item', (_classnames = {}, _defineProperty(_classnames, prefixCls + '-disabled', disabled), _defineProperty(_classnames, prefixCls + '-item-single-line', this.props.rows === 1 && !autoHeight), _defineProperty(_classnames, prefixCls + '-error', error), _defineProperty(_classnames, prefixCls + '-focus', focus), _defineProperty(_classnames, prefixCls + '-has-count', hasCount), _classnames));
            var labelCls = classnames(prefixCls + '-label', (_classnames2 = {}, _defineProperty(_classnames2, prefixCls + '-label-2', labelNumber === 2), _defineProperty(_classnames2, prefixCls + '-label-3', labelNumber === 3), _defineProperty(_classnames2, prefixCls + '-label-4', labelNumber === 4), _defineProperty(_classnames2, prefixCls + '-label-5', labelNumber === 5), _defineProperty(_classnames2, prefixCls + '-label-6', labelNumber === 6), _defineProperty(_classnames2, prefixCls + '-label-7', labelNumber === 7), _classnames2));
            var characterLength = countSymbols(value);
            var lengthCtrlProps = {};
            if (count > 0) {
                lengthCtrlProps.maxLength = count - characterLength + (value ? value.length : 0);
            }
            return React.createElement(
                'div',
                { className: wrapCls },
                title && React.createElement(
                    'div',
                    { className: labelCls },
                    title
                ),
                React.createElement(
                    'div',
                    { className: prefixCls + '-control' },
                    React.createElement('textarea', _extends({ ref: function ref(el) {
                            return _this2.textareaRef = el;
                        } }, lengthCtrlProps, otherProps, { value: value, onChange: this.onChange, onBlur: this.onBlur, onFocus: this.onFocus, readOnly: !editable, style: style }))
                ),
                clear && editable && value && characterLength > 0 && React.createElement(
                    TouchFeedback,
                    { activeClassName: prefixCls + '-clear-active' },
                    React.createElement('div', { className: prefixCls + '-clear', onClick: this.clearInput })
                ),
                error && React.createElement('div', { className: prefixCls + '-error-extra', onClick: this.onErrorClick }),
                hasCount && React.createElement(
                    'span',
                    { className: prefixCls + '-count' },
                    React.createElement(
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
}(React.Component);

export default TextareaItem;

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