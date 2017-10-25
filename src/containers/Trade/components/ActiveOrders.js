import React from 'react';
import classnames from 'classnames';
import math from 'mathjs';

import { Table } from '../../../components';
import { formatTimestamp } from '../../../utils/utils';
import { formatFiatAmount, formatBtcAmount } from '../../../utils/currency';

const substract = (a = 0, b = 0) => {
  const remaining = math.chain(a).subtract(b).done();
  return remaining;
}

const HEADERS = [
  {
    label: 'Side',
    key: 'side',
    renderCell: ({ side = '' }, key, index) => {
      return (
        <td key={index} className={classnames('cell_box-type')}>
          <div className={classnames(side)}>{side}</div>
        </td>
      );
    },
  },
  {
    label: 'Type',
    key: 'type',
    renderCell: ({ type = '' }, key, index) => {
      return (
        <td key={index} className="text-capitalize">{type || 'market'}</td>
      );
    },
  },
  {
    label: 'Time',
    key: 'created_At',
    renderCell: ({ created_at = '' }, key, index) => {
      return (
        <td key={index}>{formatTimestamp(created_at)}</td>
      );
    },
  },
  {
    label: 'Price',
    key: 'price',
    renderCell: ({ price = 0 }, key, index) => {
      return (
        <td key={index}>{formatFiatAmount(price)}</td>
      );
    },
  },
  {
    label: 'Amount',
    key: 'size',
    exportToCsv: ({ size = 0 }) => size,
    renderCell: ({ size = 0 }, key, index) => {
      return (
        <td key={index}>{formatBtcAmount(size)}</td>
      );
    },
  },
  {
    label: 'Remaining',
    key: 'remaining',
    renderCell: ({ size = 0, filled = 0 }, key, index) => {
      return (
        <td key={index}>{formatBtcAmount(substract(size, filled))}</td>
      );
    },
  },
  {
    label: 'Status',
    key: 'status',
    renderCell: ({ size = 0, filled = 0 }, key, index) => {
      const remaining = substract(size, filled);
      const fullfilled = formatFiatAmount(math.chain(filled).divide(size).multiply(100).done());
      return (
        <td key={index} className={classnames('cell_box-type', 'fullfilled')}>
          <div className="cell-wrapper">
            <div className="cell_value-wrapper text_overflow">
              {`${fullfilled} % Fullfilled`}
              <span className="cell_value-bar" style={{ width: `${fullfilled}%`}}></span>
            </div>
          </div>
        </td>
      );
    },
  },
];

const ActiveOrders = ({ orders }) => {
  
  return (
    <div className="trade_active_orders-wrapper">
      <Table
        headers={HEADERS}
        data={orders}
        count={orders.length}
        showAll={true}
        displayPaginator={false}
      />
    </div>
  );
}

ActiveOrders.defaultProps = {
  orders: []
}
export default ActiveOrders;
