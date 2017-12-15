import React from 'react';
import classnames from 'classnames';
import math from 'mathjs';

import { ICONS } from '../../../config/constants';
import { Table, ActionNotification } from '../../../components';
import { formatTimestamp } from '../../../utils/utils';
import { formatFiatAmount, formatBtcAmount } from '../../../utils/currency';

import { subtract } from '../utils';
import STRINGS from '../../../config/localizedStrings';

const generateHeaders = (onCancel) => ([
  {
    label: STRINGS.SIDE,
    key: 'side',
    renderCell: ({ side = '' }, key, index) => {
      return (
        <td key={index} className={classnames('cell_box-type')}>
          <div className={classnames(side)}>{STRINGS.SIDES_VALUES[side]}</div>
        </td>
      );
    },
  },
  // {
  //   label: 'Type',
  //   key: 'type',
  //   renderCell: ({ type = '' }, key, index) => {
  //     return (
  //       <td key={index} className="text-capitalize">{type || 'market'}</td>
  //     );
  //   },
  // },
  {
    label: STRINGS.TIME,
    key: 'created_At',
    renderCell: ({ created_at = '' }, key, index) => {
      return (
        <td key={index}>{formatTimestamp(created_at)}</td>
      );
    },
  },
  {
    label: STRINGS.PRICE,
    key: 'price',
    renderCell: ({ price = 0 }, key, index) => {
      return (
        <td key={index}>{formatFiatAmount(price)}</td>
      );
    },
  },
  {
    label: STRINGS.AMOUNT,
    key: 'size',
    exportToCsv: ({ size = 0 }) => size,
    renderCell: ({ size = 0 }, key, index) => {
      return (
        <td key={index}>{formatBtcAmount(size)}</td>
      );
    },
  },
  {
    label: STRINGS.REMAINING,
    key: 'remaining',
    renderCell: ({ size = 0, filled = 0 }, key, index) => {
      return (
        <td key={index}>{formatBtcAmount(subtract(size, filled))}</td>
      );
    },
  },
  {
    label: STRINGS.STATUS,
    key: 'status',
    renderCell: ({ size = 0, filled = 0 }, key, index) => {
      const fullfilled = formatFiatAmount(math.chain(filled).divide(size).multiply(100).done());
      return (
        <td key={index} className={classnames('cell_box-type', 'fullfilled')}>
          <div className="cell-wrapper">
            <div className="cell_value-wrapper text_overflow">
              {STRINGS.formatString(STRINGS.FULLFILLED, fullfilled)}
              <span className="cell_value-bar" style={{ width: `${fullfilled}%`}}></span>
            </div>
          </div>
        </td>
      );
    },
  },
  {
    label: STRINGS.CANCEL,
    key: 'cancel',
    renderCell: ({ size = 0, filled = 0, id }, key, index) => {
      return (
        <td key={index} style={{ position: 'relative' }}>
          <ActionNotification
            text={STRINGS.CANCEL}
            iconPath={ICONS.CHECK}
            onClick={() => onCancel(id)}
            className="relative"
            status=""
            textPosition="left"
          />
        </td>
      );
    },
  },
]);

const ActiveOrders = ({ orders, onCancel }) => {

  return (
    <div className="trade_active_orders-wrapper">
      <Table
        headers={generateHeaders(onCancel)}
        data={orders}
        count={orders.length}
        showAll={true}
        displayPaginator={false}
      />
    </div>
  );
}

ActiveOrders.defaultProps = {
  orders: [],
  onCancel: () => {},
}
export default ActiveOrders;
