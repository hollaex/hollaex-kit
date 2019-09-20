import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/*
 * https://github.com/jasonslyvia/react-marquee
 * remove PC
 * support React Element for text prop
*/
import React from 'react';
import ReactDOM from 'react-dom';

var Marquee = function (_React$Component) {
    _inherits(Marquee, _React$Component);

    function Marquee() {
        _classCallCheck(this, Marquee);

        var _this = _possibleConstructorReturn(this, (Marquee.__proto__ || Object.getPrototypeOf(Marquee)).apply(this, arguments));

        _this.state = {
            animatedWidth: 0,
            overflowWidth: 0
        };
        return _this;
    }

    _createClass(Marquee, [{
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

            var style = _extends({ position: 'relative', right: this.state.animatedWidth, whiteSpace: 'nowrap', display: 'inline-block' }, this.props.style);
            return React.createElement(
                'div',
                { className: prefixCls + '-marquee-wrap ' + className, style: { overflow: 'hidden' }, role: 'marquee' },
                React.createElement(
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
            var container = ReactDOM.findDOMNode(this);
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
}(React.Component);

export default Marquee;

Marquee.defaultProps = {
    text: '',
    loop: false,
    leading: 500,
    trailing: 800,
    fps: 40,
    className: ''
};