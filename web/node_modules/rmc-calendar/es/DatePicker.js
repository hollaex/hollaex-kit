import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import * as React from 'react';
import Component from './DatePicker.base';
import WeekPanel from './date/WeekPanel';
import SingleMonth from './date/SingleMonth';

var DatePicker = function (_Component) {
    _inherits(DatePicker, _Component);

    function DatePicker() {
        _classCallCheck(this, DatePicker);

        var _this = _possibleConstructorReturn(this, _Component.apply(this, arguments));

        _this.transform = '';
        _this.genMonthComponent = function (data) {
            if (!data) return;
            return React.createElement(SingleMonth, { key: data.title, locale: _this.props.locale || {}, monthData: data, rowSize: _this.props.rowSize, onCellClick: _this.onCellClick, getDateExtra: _this.props.getDateExtra, ref: function ref(dom) {
                    // FIXME?: sometimes will callback twice, and the second is null, when use preact.
                    data.componentRef = dom || data.componentRef || undefined;
                    data.updateLayout = function () {
                        _this.computeHeight(data, dom);
                    };
                    data.updateLayout();
                } });
        };
        _this.computeHeight = function (data, singleMonth) {
            if (singleMonth && singleMonth.wrapperDivDOM) {
                // preact, ref时dom有可能无height, offsetTop数据。
                if (!data.height && !singleMonth.wrapperDivDOM.clientHeight) {
                    setTimeout(function () {
                        return _this.computeHeight(data, singleMonth);
                    }, 500);
                    return;
                }
                data.height = singleMonth.wrapperDivDOM.clientHeight || data.height || 0;
                data.y = singleMonth.wrapperDivDOM.offsetTop || data.y || 0;
            }
        };
        _this.setLayout = function (dom) {
            if (dom) {
                var onLayout = _this.props.onLayout;

                onLayout && onLayout(dom.clientHeight);
                var scrollHandler = _this.createOnScroll();
                dom.onscroll = function (evt) {
                    scrollHandler({
                        client: dom.clientHeight,
                        full: evt.currentTarget.clientHeight,
                        top: evt.currentTarget.scrollTop
                    });
                };
            }
        };
        _this.setPanel = function (dom) {
            _this.panel = dom;
        };
        // tslint:disable-next-line:member-ordering
        _this.touchHandler = function () {
            var initDelta = 0;
            var lastY = 0;
            var delta = initDelta;
            return {
                onTouchStart: function onTouchStart(evt) {
                    lastY = evt.touches[0].screenY;
                    delta = initDelta;
                },
                onTouchMove: function onTouchMove(evt) {
                    var ele = evt.currentTarget;
                    var isReachTop = ele.scrollTop === 0;
                    if (isReachTop) {
                        delta = evt.touches[0].screenY - lastY;
                        if (delta > 0) {
                            evt.preventDefault();
                            if (delta > 80) {
                                delta = 80;
                            }
                        } else {
                            delta = 0;
                        }
                        _this.setTransform(_this.panel.style, 'translate3d(0,' + delta + 'px,0)');
                    }
                },
                onTouchEnd: function onTouchEnd() {
                    _this.touchHandler.onFinish();
                },
                onTouchCancel: function onTouchCancel() {
                    _this.touchHandler.onFinish();
                },
                onFinish: function onFinish() {
                    if (delta > 40 && _this.canLoadPrev()) {
                        _this.genMonthData(_this.state.months[0].firstDate, -1);
                        _this.visibleMonth = _this.state.months.slice(0, _this.props.initalMonths);
                        _this.state.months.forEach(function (m) {
                            m.updateLayout && m.updateLayout();
                        });
                        _this.forceUpdate();
                    }
                    _this.setTransform(_this.panel.style, 'translate3d(0,0,0)');
                    _this.setTransition(_this.panel.style, '.3s');
                    setTimeout(function () {
                        _this.panel && _this.setTransition(_this.panel.style, '');
                    }, 300);
                }
            };
        }();
        return _this;
    }

    DatePicker.prototype.setTransform = function setTransform(nodeStyle, value) {
        this.transform = value;
        nodeStyle.transform = value;
        nodeStyle.webkitTransform = value;
    };

    DatePicker.prototype.setTransition = function setTransition(nodeStyle, value) {
        nodeStyle.transition = value;
        nodeStyle.webkitTransition = value;
    };

    DatePicker.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            _props$prefixCls = _props.prefixCls,
            prefixCls = _props$prefixCls === undefined ? '' : _props$prefixCls,
            _props$locale = _props.locale,
            locale = _props$locale === undefined ? {} : _props$locale;

        var style = {
            transform: this.transform
        };
        return React.createElement(
            'div',
            { className: prefixCls + ' date-picker' },
            React.createElement(WeekPanel, { locale: locale }),
            React.createElement(
                'div',
                { className: 'wrapper', style: {
                        overflowX: 'hidden',
                        overflowY: 'visible'
                    }, ref: this.setLayout, onTouchStart: this.touchHandler.onTouchStart, onTouchMove: this.touchHandler.onTouchMove, onTouchEnd: this.touchHandler.onTouchEnd, onTouchCancel: this.touchHandler.onTouchCancel },
                React.createElement(
                    'div',
                    { style: style, ref: this.setPanel },
                    this.canLoadPrev() && React.createElement(
                        'div',
                        { className: 'load-tip' },
                        locale.loadPrevMonth
                    ),
                    React.createElement(
                        'div',
                        { className: 'months' },
                        this.state.months.map(function (m) {
                            var hidden = m.height && _this2.visibleMonth.indexOf(m) < 0;
                            if (hidden) {
                                return React.createElement('div', { key: m.title + '_shallow', style: { height: m.height } });
                            }
                            return m.component;
                        })
                    )
                )
            )
        );
    };

    return DatePicker;
}(Component);

export default DatePicker;