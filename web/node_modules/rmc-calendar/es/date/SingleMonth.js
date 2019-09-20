import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import * as React from 'react';
import { Models } from './DataTypes';

var SingleMonth = function (_React$PureComponent) {
    _inherits(SingleMonth, _React$PureComponent);

    function SingleMonth(props) {
        _classCallCheck(this, SingleMonth);

        var _this = _possibleConstructorReturn(this, _React$PureComponent.call(this, props));

        _this.genWeek = function (weeksData, index) {
            var _this$props = _this.props,
                getDateExtra = _this$props.getDateExtra,
                monthData = _this$props.monthData,
                onCellClick = _this$props.onCellClick,
                locale = _this$props.locale,
                rowSize = _this$props.rowSize;

            var rowCls = 'row';
            if (rowSize === 'xl') {
                rowCls += ' row-xl';
            }
            _this.state.weekComponents[index] = React.createElement(
                'div',
                { key: index, className: rowCls },
                weeksData.map(function (day, dayOfWeek) {
                    var extra = getDateExtra && getDateExtra(new Date(day.tick)) || {};
                    var info = extra.info;
                    var disable = extra.disable || day.outOfDate;
                    var cls = 'date';
                    var lCls = 'left';
                    var rCls = 'right';
                    var infoCls = 'info';
                    if (dayOfWeek === 0 || dayOfWeek === 6) {
                        cls += ' grey';
                    }
                    if (disable) {
                        cls += ' disable';
                    } else if (info) {
                        cls += ' important';
                    }
                    if (day.selected) {
                        cls += ' date-selected';
                        var styleType = day.selected;
                        switch (styleType) {
                            case Models.SelectType.Only:
                                info = locale.begin;
                                infoCls += ' date-selected';
                                break;
                            case Models.SelectType.All:
                                info = locale.begin_over;
                                infoCls += ' date-selected';
                                break;
                            case Models.SelectType.Start:
                                info = locale.begin;
                                infoCls += ' date-selected';
                                if (dayOfWeek === 6 || day.isLastOfMonth) {
                                    styleType = Models.SelectType.All;
                                }
                                break;
                            case Models.SelectType.Middle:
                                if (dayOfWeek === 0 || day.isFirstOfMonth) {
                                    if (day.isLastOfMonth || dayOfWeek === 6) {
                                        styleType = Models.SelectType.All;
                                    } else {
                                        styleType = Models.SelectType.Start;
                                    }
                                } else if (dayOfWeek === 6 || day.isLastOfMonth) {
                                    styleType = Models.SelectType.End;
                                }
                                break;
                            case Models.SelectType.End:
                                info = locale.over;
                                infoCls += ' date-selected';
                                if (dayOfWeek === 0 || day.isFirstOfMonth) {
                                    styleType = Models.SelectType.All;
                                }
                                break;
                        }
                        switch (styleType) {
                            case Models.SelectType.Single:
                            case Models.SelectType.Only:
                            case Models.SelectType.All:
                                cls += ' selected-single';
                                break;
                            case Models.SelectType.Start:
                                cls += ' selected-start';
                                rCls += ' date-selected';
                                break;
                            case Models.SelectType.Middle:
                                cls += ' selected-middle';
                                lCls += ' date-selected';
                                rCls += ' date-selected';
                                break;
                            case Models.SelectType.End:
                                cls += ' selected-end';
                                lCls += ' date-selected';
                                break;
                        }
                    }
                    var defaultContent = [React.createElement(
                        'div',
                        { key: 'wrapper', className: 'date-wrapper' },
                        React.createElement('span', { className: lCls }),
                        React.createElement(
                            'div',
                            { className: cls },
                            day.dayOfMonth
                        ),
                        React.createElement('span', { className: rCls })
                    ), React.createElement(
                        'div',
                        { key: 'info', className: infoCls },
                        info
                    )];
                    return React.createElement(
                        'div',
                        { key: dayOfWeek, className: 'cell ' + (extra.cellCls || ''), onClick: function onClick() {
                                !disable && onCellClick && onCellClick(day, monthData);
                            } },
                        extra.cellRender ? extra.cellRender(new Date(day.tick)) : defaultContent
                    );
                })
            );
        };
        _this.updateWeeks = function (monthData) {
            (monthData || _this.props.monthData).weeks.forEach(function (week, index) {
                _this.genWeek(week, index);
            });
        };
        _this.setWarpper = function (dom) {
            _this.wrapperDivDOM = dom;
        };
        _this.state = {
            weekComponents: []
        };
        return _this;
    }

    SingleMonth.prototype.componentWillMount = function componentWillMount() {
        var _this2 = this;

        this.props.monthData.weeks.forEach(function (week, index) {
            _this2.genWeek(week, index);
        });
    };

    SingleMonth.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (this.props.monthData !== nextProps.monthData) {
            this.updateWeeks(nextProps.monthData);
        }
    };

    SingleMonth.prototype.render = function render() {
        var title = this.props.monthData.title;
        var weekComponents = this.state.weekComponents;

        return React.createElement(
            'div',
            { className: 'single-month', ref: this.setWarpper },
            React.createElement(
                'div',
                { className: 'month-title' },
                title
            ),
            React.createElement(
                'div',
                { className: 'date' },
                weekComponents
            )
        );
    };

    return SingleMonth;
}(React.PureComponent);

export default SingleMonth;

SingleMonth.defaultProps = {
    rowSize: 'normal'
};