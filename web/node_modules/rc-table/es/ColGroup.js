import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import PropTypes from 'prop-types';
import { INTERNAL_COL_DEFINE } from './utils';

export default function ColGroup(props, _ref) {
  var table = _ref.table;
  var _table$props = table.props,
      prefixCls = _table$props.prefixCls,
      expandIconAsCell = _table$props.expandIconAsCell;
  var fixed = props.fixed;


  var cols = [];

  if (expandIconAsCell && fixed !== 'right') {
    cols.push(React.createElement('col', { className: prefixCls + '-expand-icon-col', key: 'rc-table-expand-icon-col' }));
  }

  var leafColumns = void 0;

  if (fixed === 'left') {
    leafColumns = table.columnManager.leftLeafColumns();
  } else if (fixed === 'right') {
    leafColumns = table.columnManager.rightLeafColumns();
  } else {
    leafColumns = table.columnManager.leafColumns();
  }
  cols = cols.concat(leafColumns.map(function (_ref2) {
    var key = _ref2.key,
        dataIndex = _ref2.dataIndex,
        width = _ref2.width,
        additionalProps = _ref2[INTERNAL_COL_DEFINE];

    var mergedKey = key !== undefined ? key : dataIndex;
    return React.createElement('col', _extends({ key: mergedKey, style: { width: width, minWidth: width } }, additionalProps));
  }));

  return React.createElement(
    'colgroup',
    null,
    cols
  );
}

ColGroup.propTypes = {
  fixed: PropTypes.string
};

ColGroup.contextTypes = {
  table: PropTypes.any
};