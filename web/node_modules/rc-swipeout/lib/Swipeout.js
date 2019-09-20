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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _rcGesture = require('rc-gesture');

var _rcGesture2 = _interopRequireDefault(_rcGesture);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __rest = undefined && undefined.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
// http://caniuse.com/#search=match
function closest(el, selector) {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        } else {
            el = el.parentElement;
        }
    }
    return null;
}

var Swipeout = function (_React$Component) {
    (0, _inherits3['default'])(Swipeout, _React$Component);

    function Swipeout(props) {
        (0, _classCallCheck3['default'])(this, Swipeout);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Swipeout.__proto__ || Object.getPrototypeOf(Swipeout)).call(this, props));

        _this.onCloseSwipe = function (ev) {
            if (!(_this.openedLeft || _this.openedRight)) {
                return;
            }
            var pNode = closest(ev.target, '.' + _this.props.prefixCls + '-actions');
            if (!pNode) {
                ev.preventDefault();
                _this.close();
            }
        };
        _this.onPanStart = function (e) {
            var direction = e.direction,
                moveStatus = e.moveStatus;
            var deltaX = moveStatus.x;
            // http://hammerjs.github.io/api/#directions

            var isLeft = direction === 2;
            var isRight = direction === 4;
            if (!isLeft && !isRight) {
                return;
            }
            var _this$props = _this.props,
                left = _this$props.left,
                right = _this$props.right;

            _this.needShowRight = isLeft && right.length > 0;
            _this.needShowLeft = isRight && left.length > 0;
            if (_this.left) {
                _this.left.style.visibility = _this.needShowRight ? 'hidden' : 'visible';
            }
            if (_this.right) {
                _this.right.style.visibility = _this.needShowLeft ? 'hidden' : 'visible';
            }
            if (_this.needShowLeft || _this.needShowRight) {
                _this.swiping = true;
                _this.setState({
                    swiping: _this.swiping
                });
                _this._setStyle(deltaX);
            }
        };
        _this.onPanMove = function (e) {
            var moveStatus = e.moveStatus,
                srcEvent = e.srcEvent;
            var deltaX = moveStatus.x;

            if (!_this.swiping) {
                return;
            }
            // fixed scroll when it's pan and moving.
            if (srcEvent && srcEvent.preventDefault) {
                srcEvent.preventDefault();
            }
            _this._setStyle(deltaX);
        };
        _this.onPanEnd = function (e) {
            if (!_this.swiping) {
                return;
            }
            var moveStatus = e.moveStatus;
            var deltaX = moveStatus.x;

            var needOpenRight = _this.needShowRight && Math.abs(deltaX) > _this.btnsRightWidth / 2;
            var needOpenLeft = _this.needShowLeft && Math.abs(deltaX) > _this.btnsLeftWidth / 2;
            if (needOpenRight) {
                _this.doOpenRight();
            } else if (needOpenLeft) {
                _this.doOpenLeft();
            } else {
                _this.close();
            }
            _this.swiping = false;
            _this.setState({
                swiping: _this.swiping
            });
            _this.needShowLeft = false;
            _this.needShowRight = false;
        };
        _this.doOpenLeft = function () {
            _this.open(_this.btnsLeftWidth, true, false);
        };
        _this.doOpenRight = function () {
            _this.open(-_this.btnsRightWidth, true, false);
        };
        // set content & actions style
        _this._setStyle = function (value) {
            var limit = value > 0 ? _this.btnsLeftWidth : -_this.btnsRightWidth;
            var contentLeft = _this._getContentEasing(value, limit);
            _this.content.style.left = contentLeft + 'px';
            if (_this.cover) {
                _this.cover.style.display = Math.abs(value) > 0 ? 'block' : 'none';
                _this.cover.style.left = contentLeft + 'px';
            }
        };
        _this.open = function (value, openedLeft, openedRight) {
            if (!_this.openedLeft && !_this.openedRight && _this.props.onOpen) {
                _this.props.onOpen();
            }
            _this.openedLeft = openedLeft;
            _this.openedRight = openedRight;
            _this._setStyle(value);
        };
        _this.close = function () {
            if ((_this.openedLeft || _this.openedRight) && _this.props.onClose) {
                _this.props.onClose();
            }
            _this._setStyle(0);
            _this.openedLeft = false;
            _this.openedRight = false;
        };
        _this.onTouchMove = function (e) {
            if (_this.swiping) {
                e.preventDefault();
            }
        };
        _this.state = {
            swiping: false
        };
        _this.openedLeft = false;
        _this.openedRight = false;
        return _this;
    }

    (0, _createClass3['default'])(Swipeout, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.btnsLeftWidth = this.left ? this.left.offsetWidth : 0;
            this.btnsRightWidth = this.right ? this.right.offsetWidth : 0;
            document.body.addEventListener('touchstart', this.onCloseSwipe, true);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.body.removeEventListener('touchstart', this.onCloseSwipe, true);
        }
        // left & right button click

    }, {
        key: 'onBtnClick',
        value: function onBtnClick(ev, btn) {
            var onPress = btn.onPress;
            if (onPress) {
                onPress(ev);
            }
            if (this.props.autoClose) {
                this.close();
            }
        }
    }, {
        key: '_getContentEasing',
        value: function _getContentEasing(value, limit) {
            // limit content style left when value > actions width
            var delta = Math.abs(value) - Math.abs(limit);
            var isOverflow = delta > 0;
            var factor = limit > 0 ? 1 : -1;
            if (isOverflow) {
                value = limit + Math.pow(delta, 0.85) * factor;
                return Math.abs(value) > Math.abs(limit) ? limit : value;
            }
            return value;
        }
    }, {
        key: 'renderButtons',
        value: function renderButtons(buttons, _ref) {
            var _this2 = this;

            var prefixCls = this.props.prefixCls;
            return buttons && buttons.length ? _react2['default'].createElement(
                'div',
                { className: prefixCls + '-actions ' + prefixCls + '-actions-' + _ref, ref: function ref(el) {
                        return _this2[_ref] = el;
                    } },
                buttons.map(function (btn, i) {
                    return _react2['default'].createElement(
                        'div',
                        { key: i, className: prefixCls + '-btn ' + (btn.hasOwnProperty('className') ? btn.className : ''), style: btn.style, role: 'button', onClick: function onClick(e) {
                                return _this2.onBtnClick(e, btn);
                            } },
                        _react2['default'].createElement(
                            'div',
                            { className: prefixCls + '-btn-text' },
                            btn.text || 'Click'
                        )
                    );
                })
            ) : null;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _a = this.props,
                prefixCls = _a.prefixCls,
                left = _a.left,
                right = _a.right,
                disabled = _a.disabled,
                children = _a.children,
                restProps = __rest(_a, ["prefixCls", "left", "right", "disabled", "children"]);
            var autoClose = restProps.autoClose,
                onOpen = restProps.onOpen,
                onClose = restProps.onClose,
                divProps = __rest(restProps, ["autoClose", "onOpen", "onClose"]);

            var cls = (0, _classnames3['default'])(prefixCls, (0, _defineProperty3['default'])({}, prefixCls + '-swiping', this.state.swiping));
            var refProps = {
                ref: function ref(el) {
                    return _this3.content = _reactDom2['default'].findDOMNode(el);
                }
            };
            return (left.length || right.length) && !disabled ? _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({ className: cls }, divProps),
                _react2['default'].createElement('div', { className: prefixCls + '-cover', ref: function ref(el) {
                        return _this3.cover = el;
                    } }),
                this.renderButtons(left, 'left'),
                this.renderButtons(right, 'right'),
                _react2['default'].createElement(
                    _rcGesture2['default'],
                    (0, _extends3['default'])({ onTouchMove: this.onTouchMove, onPanStart: this.onPanStart, onPanMove: this.onPanMove, onPanEnd: this.onPanEnd, onPanCancel: this.onPanEnd, onSwipeLeft: this.doOpenRight, onSwipeRight: this.doOpenLeft, direction: 'horizontal' }, refProps),
                    _react2['default'].createElement(
                        'div',
                        { className: prefixCls + '-content' },
                        children
                    )
                )
            ) : _react2['default'].createElement(
                'div',
                (0, _extends3['default'])({}, refProps, divProps),
                children
            );
        }
    }]);
    return Swipeout;
}(_react2['default'].Component);

exports['default'] = Swipeout;

Swipeout.defaultProps = {
    prefixCls: 'rc-swipeout',
    autoClose: false,
    disabled: false,
    left: [],
    right: [],
    onOpen: function onOpen() {},
    onClose: function onClose() {}
};
module.exports = exports['default'];