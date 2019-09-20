import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import { polyfill } from 'react-lifecycles-compat';
import classNames from 'classnames';
import TableCell from './TableCell';
import { warningOnce } from './utils';

var TableRow = function (_React$Component) {
  _inherits(TableRow, _React$Component);

  function TableRow(props) {
    _classCallCheck(this, TableRow);

    var _this = _possibleConstructorReturn(this, (TableRow.__proto__ || Object.getPrototypeOf(TableRow)).call(this, props));

    _this.onTriggerEvent = function (rowPropFunc, legacyFunc, additionalFunc) {
      var _this$props = _this.props,
          record = _this$props.record,
          index = _this$props.index;


      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // Additional function like trigger `this.onHover` to handle self logic
        if (additionalFunc) {
          additionalFunc();
        }

        // [Legacy] Some legacy function like `onRowClick`.
        var event = args[0];

        if (legacyFunc) {
          legacyFunc(record, index, event);
        }

        // Pass to the function from `onRow`
        if (rowPropFunc) {
          rowPropFunc.apply(undefined, args);
        }
      };
    };

    _this.onMouseEnter = function () {
      var _this$props2 = _this.props,
          onHover = _this$props2.onHover,
          rowKey = _this$props2.rowKey;

      onHover(true, rowKey);
    };

    _this.onMouseLeave = function () {
      var _this$props3 = _this.props,
          onHover = _this$props3.onHover,
          rowKey = _this$props3.rowKey;

      onHover(false, rowKey);
    };

    _this.shouldRender = props.visible;

    _this.state = {};
    return _this;
  }

  _createClass(TableRow, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.state.shouldRender) {
        this.saveRowRef();
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !!(this.props.visible || nextProps.visible);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.shouldRender && !this.rowRef) {
        this.saveRowRef();
      }
    }
  }, {
    key: 'setExpandedRowHeight',
    value: function setExpandedRowHeight() {
      var _props = this.props,
          store = _props.store,
          rowKey = _props.rowKey;

      var _store$getState = store.getState(),
          expandedRowsHeight = _store$getState.expandedRowsHeight;

      var height = this.rowRef.getBoundingClientRect().height;
      expandedRowsHeight = _extends({}, expandedRowsHeight, _defineProperty({}, rowKey, height));
      store.setState({ expandedRowsHeight: expandedRowsHeight });
    }
  }, {
    key: 'setRowHeight',
    value: function setRowHeight() {
      var _props2 = this.props,
          store = _props2.store,
          rowKey = _props2.rowKey;

      var _store$getState2 = store.getState(),
          fixedColumnsBodyRowsHeight = _store$getState2.fixedColumnsBodyRowsHeight;

      var height = this.rowRef.getBoundingClientRect().height;
      store.setState({
        fixedColumnsBodyRowsHeight: _extends({}, fixedColumnsBodyRowsHeight, _defineProperty({}, rowKey, height))
      });
    }
  }, {
    key: 'getStyle',
    value: function getStyle() {
      var _props3 = this.props,
          height = _props3.height,
          visible = _props3.visible;


      if (height && height !== this.style.height) {
        this.style = _extends({}, this.style, { height: height });
      }

      if (!visible && !this.style.display) {
        this.style = _extends({}, this.style, { display: 'none' });
      }

      return this.style;
    }
  }, {
    key: 'saveRowRef',
    value: function saveRowRef() {
      this.rowRef = ReactDOM.findDOMNode(this);

      var _props4 = this.props,
          isAnyColumnsFixed = _props4.isAnyColumnsFixed,
          fixed = _props4.fixed,
          expandedRow = _props4.expandedRow,
          ancestorKeys = _props4.ancestorKeys;


      if (!isAnyColumnsFixed) {
        return;
      }

      if (!fixed && expandedRow) {
        this.setExpandedRowHeight();
      }

      if (!fixed && ancestorKeys.length >= 0) {
        this.setRowHeight();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.shouldRender) {
        return null;
      }

      var _props5 = this.props,
          prefixCls = _props5.prefixCls,
          columns = _props5.columns,
          record = _props5.record,
          rowKey = _props5.rowKey,
          index = _props5.index,
          onRow = _props5.onRow,
          indent = _props5.indent,
          indentSize = _props5.indentSize,
          hovered = _props5.hovered,
          height = _props5.height,
          visible = _props5.visible,
          components = _props5.components,
          hasExpandIcon = _props5.hasExpandIcon,
          renderExpandIcon = _props5.renderExpandIcon,
          renderExpandIconCell = _props5.renderExpandIconCell,
          onRowClick = _props5.onRowClick,
          onRowDoubleClick = _props5.onRowDoubleClick,
          onRowMouseEnter = _props5.onRowMouseEnter,
          onRowMouseLeave = _props5.onRowMouseLeave,
          onRowContextMenu = _props5.onRowContextMenu;


      var BodyRow = components.body.row;
      var BodyCell = components.body.cell;

      var className = this.props.className;


      if (hovered) {
        className += ' ' + prefixCls + '-hover';
      }

      var cells = [];

      renderExpandIconCell(cells);

      for (var i = 0; i < columns.length; i++) {
        var column = columns[i];

        warningOnce(column.onCellClick === undefined, 'column[onCellClick] is deprecated, please use column[onCell] instead.');

        cells.push(React.createElement(TableCell, {
          prefixCls: prefixCls,
          record: record,
          indentSize: indentSize,
          indent: indent,
          index: index,
          column: column,
          key: column.key || column.dataIndex,
          expandIcon: hasExpandIcon(i) && renderExpandIcon(),
          component: BodyCell
        }));
      }

      var _ref = onRow(record, index) || {},
          customClassName = _ref.className,
          customStyle = _ref.style,
          rowProps = _objectWithoutProperties(_ref, ['className', 'style']);

      var style = { height: height };

      if (!visible) {
        style.display = 'none';
      }

      style = _extends({}, style, customStyle);

      var rowClassName = classNames(prefixCls, className, prefixCls + '-level-' + indent, customClassName);

      return React.createElement(
        BodyRow,
        _extends({}, rowProps, {
          onClick: this.onTriggerEvent(rowProps.onClick, onRowClick),
          onDoubleClick: this.onTriggerEvent(rowProps.onDoubleClick, onRowDoubleClick),
          onMouseEnter: this.onTriggerEvent(rowProps.onMouseEnter, onRowMouseEnter, this.onMouseEnter),
          onMouseLeave: this.onTriggerEvent(rowProps.onMouseLeave, onRowMouseLeave, this.onMouseLeave),
          onContextMenu: this.onTriggerEvent(rowProps.onContextMenu, onRowContextMenu),
          className: rowClassName,
          style: style,
          'data-row-key': rowKey
        }),
        cells
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.visible || !prevState.visible && nextProps.visible) {
        return {
          shouldRender: true,
          visible: nextProps.visible
        };
      }
      return {
        visible: nextProps.visible
      };
    }
  }]);

  return TableRow;
}(React.Component);

TableRow.propTypes = {
  onRow: PropTypes.func,
  onRowClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onRowContextMenu: PropTypes.func,
  onRowMouseEnter: PropTypes.func,
  onRowMouseLeave: PropTypes.func,
  record: PropTypes.object,
  prefixCls: PropTypes.string,
  onHover: PropTypes.func,
  columns: PropTypes.array,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  index: PropTypes.number,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
  indent: PropTypes.number,
  indentSize: PropTypes.number,
  hasExpandIcon: PropTypes.func,
  hovered: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
  fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  renderExpandIcon: PropTypes.func,
  renderExpandIconCell: PropTypes.func,
  components: PropTypes.any,
  expandedRow: PropTypes.bool,
  isAnyColumnsFixed: PropTypes.bool,
  ancestorKeys: PropTypes.array.isRequired
};
TableRow.defaultProps = {
  onRow: function onRow() {},
  onHover: function onHover() {},
  hasExpandIcon: function hasExpandIcon() {},
  renderExpandIcon: function renderExpandIcon() {},
  renderExpandIconCell: function renderExpandIconCell() {}
};


function getRowHeight(state, props) {
  var expandedRowsHeight = state.expandedRowsHeight,
      fixedColumnsBodyRowsHeight = state.fixedColumnsBodyRowsHeight;
  var fixed = props.fixed,
      rowKey = props.rowKey;


  if (!fixed) {
    return null;
  }

  if (expandedRowsHeight[rowKey]) {
    return expandedRowsHeight[rowKey];
  }

  if (fixedColumnsBodyRowsHeight[rowKey]) {
    return fixedColumnsBodyRowsHeight[rowKey];
  }

  return null;
}

polyfill(TableRow);

export default connect(function (state, props) {
  var currentHoverKey = state.currentHoverKey,
      expandedRowKeys = state.expandedRowKeys;
  var rowKey = props.rowKey,
      ancestorKeys = props.ancestorKeys;

  var visible = ancestorKeys.length === 0 || ancestorKeys.every(function (k) {
    return ~expandedRowKeys.indexOf(k);
  });

  return {
    visible: visible,
    hovered: currentHoverKey === rowKey,
    height: getRowHeight(state, props)
  };
})(TableRow);