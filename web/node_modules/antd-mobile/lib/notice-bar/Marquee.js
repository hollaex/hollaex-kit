'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * https://github.com/jasonslyvia/react-marquee
 * remove PC
 * support React Element for text prop
*/
var Marquee = function (_React$Component) {
    (0, _inherits3['default'])(Marquee, _React$Component);

    function Marquee() {
        (0, _classCallCheck3['default'])(this, Marquee);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Marquee.__proto__ || Object.getPrototypeOf(Marquee)).apply(this, arguments));

        _this.state = {
            animatedWidth: 0,
            overflowWidth: 0
        };
        return _this;
    }

    (0, _createClass3['default'])(Marquee, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._measureText();
            this._startAnimation();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this._measureText();
            if (!this._marqueeTimer) {
                this._startAnimation();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearTimeout(this._marqueeTimer);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                className = _props.className,
                text = _props.text;

            var style = (0, _extends3['default'])({ position: 'relative', right: this.state.animatedWidth, whiteSpace: 'nowrap', display: 'inline-block' }, this.props.style);
            return _react2['default'].createElement(
                'div',
                { className: prefixCls + '-marquee-wrap ' + className, style: { overflow: 'hidden' }, role: 'marquee' },
                _react2['default'].createElement(
                    'div',
                    { ref: function ref(el) {
                            return _this2.textRef = el;
                        }, className: prefixCls + '-marquee', style: style },
                    text
                )
            );
        }
    }, {
        key: '_startAnimation',
        value: function _startAnimation() {
            var _this3 = this;

            if (this._marqueeTimer) {
                window.clearTimeout(this._marqueeTimer);
            }
            var fps = this.props.fps;
            var TIMEOUT = 1 / fps * 1000;
            var isLeading = this.state.animatedWidth === 0;
            var timeout = isLeading ? this.props.leading : TIMEOUT;
            var animate = function animate() {
                var overflowWidth = _this3.state.overflowWidth;

                var animatedWidth = _this3.state.animatedWidth + 1;
                var isRoundOver = animatedWidth > overflowWidth;
                if (isRoundOver) {
                    if (_this3.props.loop) {
                        animatedWidth = 0;
                    } else {
                        return;
                    }
                }
                if (isRoundOver && _this3.props.trailing) {
                    _this3._marqueeTimer = window.setTimeout(function () {
                        _this3.setState({
                            animatedWidth: animatedWidth
                        });
                        _this3._marqueeTimer = window.setTimeout(animate, TIMEOUT);
                    }, _this3.props.trailing);
                } else {
                    _this3.setState({
                        animatedWidth: animatedWidth
                    });
                    _this3._marqueeTimer = window.setTimeout(animate, TIMEOUT);
                }
            };
            if (this.state.overflowWidth !== 0) {
                this._marqueeTimer = window.setTimeout(animate, timeout);
            }
        }
    }, {
        key: '_measureText',
        value: function _measureText() {
            var container = _reactDom2['default'].findDOMNode(this);
            var node = this.textRef;
            if (container && node) {
                var containerWidth = container.offsetWidth;
                var textWidth = node.offsetWidth;
                var overflowWidth = textWidth - containerWidth;
                if (overflowWidth !== this.state.overflowWidth) {
                    this.setState({
                        overflowWidth: overflowWidth
                    });
                }
            }
        }
    }]);
    return Marquee;
}(_react2['default'].Component);

exports['default'] = Marquee;

Marquee.defaultProps = {
    text: '',
    loop: false,
    leading: 500,
    trailing: 800,
    fps: 40,
    className: ''
};
module.exports = exports['default'];