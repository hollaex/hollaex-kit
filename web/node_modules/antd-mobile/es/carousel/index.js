import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
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
import classnames from 'classnames';
import React from 'react';
import ReactCarousel from 'rmc-nuka-carousel';

var Carousel = function (_React$Component) {
    _inherits(Carousel, _React$Component);

    function Carousel(props) {
        _classCallCheck(this, Carousel);

        var _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

        _this.onChange = function (index) {
            _this.setState({
                selectedIndex: index
            }, function () {
                if (_this.props.afterChange) {
                    _this.props.afterChange(index);
                }
            });
        };
        _this.state = {
            selectedIndex: _this.props.selectedIndex
        };
        return _this;
    }

    _createClass(Carousel, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                infinite = _a.infinite,
                selectedIndex = _a.selectedIndex,
                beforeChange = _a.beforeChange,
                afterChange = _a.afterChange,
                dots = _a.dots,
                restProps = __rest(_a, ["infinite", "selectedIndex", "beforeChange", "afterChange", "dots"]);var prefixCls = restProps.prefixCls,
                dotActiveStyle = restProps.dotActiveStyle,
                dotStyle = restProps.dotStyle,
                className = restProps.className,
                vertical = restProps.vertical;

            var newProps = _extends({}, restProps, { wrapAround: infinite, slideIndex: selectedIndex, beforeSlide: beforeChange });
            var Decorators = [];
            if (dots) {
                Decorators = [{
                    component: function component(_ref) {
                        var slideCount = _ref.slideCount,
                            slidesToScroll = _ref.slidesToScroll,
                            currentSlide = _ref.currentSlide;

                        var arr = [];
                        for (var i = 0; i < slideCount; i += slidesToScroll) {
                            arr.push(i);
                        }
                        var dotDom = arr.map(function (index) {
                            var dotCls = classnames(prefixCls + '-wrap-dot', _defineProperty({}, prefixCls + '-wrap-dot-active', index === currentSlide));
                            var currentDotStyle = index === currentSlide ? dotActiveStyle : dotStyle;
                            return React.createElement(
                                'div',
                                { className: dotCls, key: index },
                                React.createElement('span', { style: currentDotStyle })
                            );
                        });
                        return React.createElement(
                            'div',
                            { className: prefixCls + '-wrap' },
                            dotDom
                        );
                    },
                    position: 'BottomCenter'
                }];
            }
            var wrapCls = classnames(prefixCls, className, _defineProperty({}, prefixCls + '-vertical', vertical));
            return React.createElement(ReactCarousel, _extends({}, newProps, { className: wrapCls, decorators: Decorators, afterSlide: this.onChange }));
        }
    }]);

    return Carousel;
}(React.Component);

export default Carousel;

Carousel.defaultProps = {
    prefixCls: 'am-carousel',
    dots: true,
    arrows: false,
    autoplay: false,
    infinite: false,
    cellAlign: 'center',
    selectedIndex: 0,
    dotStyle: {},
    dotActiveStyle: {}
};