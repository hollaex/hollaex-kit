import React from 'react';
import classnames from 'classnames';

import { HOUR_FORMAT } from '../../../config/constants';
import { formatTimestamp } from '../../../utils/utils';

const HEADERS = [
  {
    key: 'price',
    label: 'Price',
    renderCell: ({ side, price = 0 }, index) => {
      return <td className={classnames(side)} key={`time-${index}`}>{price}</td>
    }
  },
  {
    key: 'size',
    label: 'Amount',
    renderCell: ({ size = 0 }, index) => {
      return <td key={`time-${index}`}>{size}</td>
    }
  },
  {
    key: 'timestamp',
    label: 'Time',
    renderCell: ({ timestamp }, index) => {
      return <td key={`time-${index}`}>{formatTimestamp(timestamp, HOUR_FORMAT)}</td>
    }
  },
]
const TradeHistory = ({ data }) => {
  return (
    <div className="">
      <table>
        <thead>
          <tr>
            {HEADERS.map(({ label }, index) => <th key={index}>{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {HEADERS.map(({ key, renderCell }, cellIndex) => renderCell(row, `${rowIndex}-${cellIndex}`))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

TradeHistory.defaultProps = {
  data: [],
}

export default TradeHistory;
