import React from 'react';
import classnames from 'classnames';

import { DisplayTable } from '../../../components';

import { HOUR_FORMAT } from '../../../config/constants';
import { formatTimestamp } from '../../../utils/utils';

const HEADERS = [
  {
    key: 'price',
    label: 'Price (USD)',
    renderCell: ({ side, price = 0 }, index) => <div className={classnames(side)} key={`time-${index}`}>{price}</div>
  },
  {
    key: 'size',
    label: 'Amount (BTC)',
    renderCell: ({ size = 0 }, index) => size
  },
  {
    key: 'timestamp',
    label: 'Time',
    renderCell: ({ timestamp }, index) => formatTimestamp(timestamp, HOUR_FORMAT)
  },
];

const TradeHistory = ({ data }) => {
  return (
    <div className="flex-auto d-flex">
      <DisplayTable
        headers={HEADERS}
        data={data}
      />
    </div>
  );
}

TradeHistory.defaultProps = {
  data: [],
}

export default TradeHistory;
