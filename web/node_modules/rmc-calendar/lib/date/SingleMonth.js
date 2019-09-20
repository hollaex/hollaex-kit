'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _DataTypes = require('./DataTypes');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SingleMonth = function (_React$PureComponent) {
    (0, _inherits3['default'])(SingleMonth, _React$PureComponent);

    function SingleMonth(props) {
        (0, _classCallCheck3['default'])(this, SingleMonth);

        var _this = (0, _possibleConstructorReturn3['default'])(this, _React$PureComponent.call(this, props));

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
                            case _DataTypes.Models.SelectType.Only:
                                info = locale.begin;
                                infoCls += ' date-selected';
                                break;
                            case _DataTypes.Models.SelectType.All:
                                info = locale.begin_over;
                                infoCls += ' date-selected';
                                break;
                            case _DataTypes.Models.SelectType.Start:
                                info = locale.begin;
                                infoCls += ' date-selected';
                                if (dayOfWeek === 6 || day.isLastOfMonth) {
                                    styleType = _DataTypes.Models.SelectType.All;
                                }
                                break;
                            case _DataTypes.Models.SelectType.Middle:
                                if (dayOfWeek === 0 || day.isFirstOfMonth) {
                                    if (day.isLastOfMonth || dayOfWeek === 6) {
                                        styleType = _DataTypes.Models.SelectType.All;
                                    } else {
                                        styleType = _DataTypes.Models.SelectType.Start;
                                    }
                                } else if (dayOfWeek === 6 || day.isLastOfMonth) {
                                    styleType = _DataTypes.Models.SelectType.End;
                                }
                                break;
                            case _DataTypes.Models.SelectType.End:
                                info = locale.over;
                                infoCls += ' date-selected';
                                if (dayOfWeek === 0 || day.isFirstOfMonth) {
                                    styleType = _DataTypes.Models.SelectType.All;
                                }
                                break;
                        }
                        switch (styleType) {
                            case _DataTypes.Models.SelectType.Single:
                            case _DataTypes.Models.SelectType.Only:
                            case _DataTypes.Models.SelectType.All:
                                cls += ' selected-single';
                                break;
                            case _DataTypes.Models.SelectType.Start:
                                cls += ' selected-start';
                                rCls += ' date-selected';
                                break;
                            case _DataTypes.Models.SelectType.Middle:
                                cls += ' selected-middle';
                                lCls += ' date-selected';
                                rCls += ' date-selected';
                                break;
                            case _DataTypes.Models.SelectType.End:
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

exports['default'] = SingleMonth;

SingleMonth.defaultProps = {
    rowSize: 'normal'
};
module.exports = exports['default'];