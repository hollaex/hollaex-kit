import React from 'react';
import classnames from 'classnames';

import { DisplayTable } from '../../../components';

import { HOUR_FORMAT } from '../../../config/constants';
import { formatTimestamp } from '../../../utils/utils';
import { formatFiatAmount, formatBtcAmount } from '../../../utils/currency';

import STRINGS from '../../../config/localizedStrings';

const HEADERS = [
  {
    key: 'price',
    label: STRINGS.PRICE,
    renderCell: ({ side, price = 0 }, index) =>
      <div className={classnames(side)} key={`time-${index}`}>
        {formatFiatAmount(price)}
      </div>
  },
  {
    key: 'size',
    label: STRINGS.SIZE,
    renderCell: ({ size = 0 }, index) => formatBtcAmount(size)
  },
  {
    key: 'timestamp',
    label: STRINGS.TIME,
    renderCell: ({ timestamp }, index) => formatTimestamp(timestamp, STRINGS.HOUR_FORMAT)
  },
];

const TradeHistory = ({ data }) => {
  return (
    <div className="flex-auto d-flex apply_rtl">
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
