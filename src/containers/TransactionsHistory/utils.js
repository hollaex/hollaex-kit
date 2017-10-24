import React from 'react';
import classnames from 'classnames';

import { CurrencyBall } from '../../components';
import { CURRENCIES, FLEX_CENTER_CLASSES } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';
import { formatTimestamp } from '../../utils/utils';

const fiatShortName = CURRENCIES[fiatSymbol].shortName;
const fiatFormatToCurrency = CURRENCIES[fiatSymbol].formatToCurrency;
const fiatCurrencySymbol = CURRENCIES.fiat.currencySymbol;

export const generateHeaders = (symbol) => {
  const { shortName, fullName, formatToCurrency } = CURRENCIES[symbol];

  return [
    {
      label: '',
      key: 'icon',
      renderCell: (data, key, index) => (
        <td className={classnames('icon-cell')} key={index}>
          <CurrencyBall name={shortName} symbol={symbol} size="s" />
        </td>
      ),
    },
    {
      label: 'CURRENCY',
      key: 'currency',
      renderCell: (data, key, index) => <td key={index}>{fullName}</td>,
    },
    {
      label: 'SIDE',
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
      label: 'SIZE',
      key: 'size',
      renderCell: ({ size = 0 }, key, index) => {
        return (
          <td key={index}>{`${formatToCurrency(size)} ${shortName}`}</td>
        )
      },
    },
    {
      label: 'PRICE',
      key: 'price',
      renderCell: ({ price = 0 }, key, index) => {
        return <td key={index}>{`${fiatCurrencySymbol} ${fiatFormatToCurrency(price)}`}</td>
      },
    },
    {
      label: 'Fee',
      key: 'fee',
      renderCell: ({ fee = 0 }, key, index) => {
        return <td key={index}>{fee}</td>
      },
    },
    {
      label: 'Time',
      key: 'timestamp',
      renderCell: ({ timestamp = '' }, key, index) => {
        return <td key={index}>{formatTimestamp(timestamp)}</td>;
      },
    },
  ];
}
