import React from 'react';
import classnames from 'classnames';
import math from 'mathjs';

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
      renderCell: () => (
        <td className={classnames('icon-cell')}>
          <CurrencyBall name={shortName} symbol={symbol} size="s" />
        </td>
      ),
    },
    {
      label: 'CURRENCY',
      key: 'currency',
      renderCell: () => <td>{fullName}</td>,
    },
    {
      label: 'SIZE',
      key: 'size',
      renderCell: ({ size = '' }) => <td>{`${formatToCurrency(size)} ${shortName}`}</td>,
    },
    {
      label: 'SIDE',
      key: 'side',
      renderCell: ({ side = '' }) => <td>{side}</td>,
    },
    {
      label: 'PRICE',
      key: 'price',
      renderCell: ({ price = 0 }) => <td>{`${fiatCurrencySymbol} ${fiatFormatToCurrency(price)}`}</td>,
    },
    {
      label: 'TIMESTAMP',
      key: 'timestamp',
      renderCell: ({ timestamp = '' }) => <td>{formatTimestamp(timestamp)}</td>,
    },
  ];
}

export const subtract = (a = 0, b = 0) => {
  const remaining = math.chain(a).subtract(b).done();
  return remaining;
}
