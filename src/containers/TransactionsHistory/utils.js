import React from 'react';
import classnames from 'classnames';

import { CurrencyBall } from '../../components';
import { CURRENCIES, FLEX_CENTER_CLASSES } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';
import { formatTimestamp } from '../../utils/utils';

const fiatShortName = CURRENCIES[fiatSymbol].shortName;
const fiatFormatToCurrency = CURRENCIES[fiatSymbol].formatToCurrency;
const fiatCurrencySymbol = CURRENCIES.fiat.currencySymbol;

export const generateTradeHeaders = (symbol) => {
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
      label: 'Currency',
      key: 'currency',
      renderCell: (data, key, index) => <td key={index}>{fullName}</td>,
    },
    {
      label: 'Type',
      key: 'side',
      exportToCsv: true,
      exportToCsv: (value) => value,
      renderCell: ({ side = '' }, key, index) => {
        return (
          <td key={index} className={classnames('cell_box-type')}>
            <div className={classnames(side)}>{side}</div>
          </td>
        );
      },
    },
    {
      label: 'Size',
      key: 'size',
      exportToCsv: (size) => `${formatToCurrency(size)} ${shortName}`,
      renderCell: ({ size = 0 }, key, index) => {
        return (
          <td key={index}>{`${formatToCurrency(size)} ${shortName}`}</td>
        )
      },
    },
    {
      label: 'Price',
      key: 'price',
      exportToCsv: (price) => `${fiatCurrencySymbol} ${fiatFormatToCurrency(price)}`,
      renderCell: ({ price = 0 }, key, index) => {
        return <td key={index}>{`${fiatCurrencySymbol} ${fiatFormatToCurrency(price)}`}</td>
      },
    },
    {
      label: 'Fee',
      key: 'fee',
      exportToCsv: (value) => value,
      renderCell: ({ fee = 0 }, key, index) => {
        return <td key={index}>{fee}</td>
      },
    },
    {
      label: 'Time',
      key: 'timestamp',
      exportToCsv: (value) => value,
      renderCell: ({ timestamp = '' }, key, index) => {
        return <td key={index}>{formatTimestamp(timestamp)}</td>;
      },
    },
  ];
};

export const generateWithdrawalsHeaders = (symbol) => {
  const { shortName, fullName, formatToCurrency } = CURRENCIES[symbol];
  return [
    {
      label: '',
      key: 'icon',
      renderCell: ({ currency }, key, index) => {
        const cellName = CURRENCIES[currency].shortName;
        return (
          <td className={classnames('icon-cell')} key={index}>
            <CurrencyBall name={cellName} symbol={currency} size="s" />
          </td>
        );
      },
    },
    {
      label: 'Currency',
      key: 'currency',
      exportToCsv: (value) => value,
      renderCell: ({ currency }, key, index) => {
        const fullName = CURRENCIES[currency].fullName;
        return <td key={index}>{fullName}</td>;
      },
    },
    {
      label: 'Amount',
      key: 'amount',
      // exportToCsv: (amount) => {
      //   const { formatToCurrency, currencySymbol } = CURRENCIES[currency];
      //   return `${currencySymbol} ${formatToCurrency(amount)}`
      // },
      exportToCsv: (value) => value,
      renderCell: ({ amount = 0, currency }, key, index) => {
        const { formatToCurrency, shortName } = CURRENCIES[currency];
        return <td key={index}>{`${formatToCurrency(amount)} ${shortName}`}</td>;
      },
    },
    {
      label: 'Fee',
      key: 'fee',
      exportToCsv: (value) => value,
      renderCell: ({ fee = 0 }, key, index) => {
        return <td key={index}>{fee}</td>
      },
    },
    {
      label: 'Time',
      key: 'created_at',
      exportToCsv: (value) => value,
      renderCell: ({ created_at = '' }, key, index) => {
        return <td key={index}>{formatTimestamp(created_at)}</td>;
      },
    },
  ];
}

export const generateDepositsHeaders = generateWithdrawalsHeaders;
