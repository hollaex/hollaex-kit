import React from 'react';
import classnames from 'classnames';

import STRINGS from '../../config/localizedStrings';

import { CurrencyBall } from '../../components';
import { CURRENCIES } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';
import { formatTimestamp } from '../../utils/utils';

const fiatFormatToCurrency = CURRENCIES[fiatSymbol].formatToCurrency;
const fiatCurrencySymbol = CURRENCIES.fiat.currencySymbol;

export const generateTradeHeaders = (symbol) => {
  const { formatToCurrency } = CURRENCIES[symbol];
  const shortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`];
  const fullName = STRINGS[`${symbol.toUpperCase()}_FULLNAME`];
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
      label: STRINGS.CURRENCY,
      key: 'currency',
      exportToCsv: () => fullName,
      renderCell: (data, key, index) => <td key={index}>{fullName}</td>,
    },
    {
      label: STRINGS.TYPE,
      key: 'side',
      exportToCsv: ({ side = '' }) => side,
      renderCell: ({ side = '' }, key, index) => {
        return (
          <td key={index} className={classnames('cell_box-type')}>
            <div className={classnames(side)}>{STRINGS.SIDES_VALUES[side]}</div>
          </td>
        );
      },
    },
    {
      label: STRINGS.SIZE,
      key: 'size',
      exportToCsv: ({ size = 0 }) => STRINGS.formatString(STRINGS.BTC_PRICE_FORMAT, formatToCurrency(size), shortName),
      renderCell: ({ size = 0 }, key, index) => {
        return (
          <td key={index}>{STRINGS.formatString(STRINGS.BTC_PRICE_FORMAT, formatToCurrency(size), shortName)}</td>
        )
      },
    },
    {
      label: STRINGS.PRICE,
      key: 'price',
      exportToCsv: ({ price = 0}) => STRINGS.formatString(STRINGS.FIAT_PRICE_FORMAT, fiatFormatToCurrency(price), fiatCurrencySymbol),
      renderCell: ({ price = 0 }, key, index) => {
        return <td key={index}>{STRINGS.formatString(STRINGS.FIAT_PRICE_FORMAT, fiatFormatToCurrency(price), fiatCurrencySymbol)}</td>
      },
    },
    {
      label: STRINGS.FEE,
      key: 'fee',
      exportToCsv: ({ fee = 0 }) => fee,
      renderCell: ({ fee = 0 }, key, index) => {
        return <td key={index}>{fee}</td>
      },
    },
    {
      label: STRINGS.TIME,
      key: 'timestamp',
      exportToCsv: ({ timestamp = '' }) => timestamp,
      renderCell: ({ timestamp = '' }, key, index) => {
        return <td key={index}>{formatTimestamp(timestamp)}</td>;
      },
    },
  ];
};

export const generateWithdrawalsHeaders = (symbol) => {
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
      label: STRINGS.CURRENCY,
      key: 'currency',
      exportToCsv: ({ currency }) => CURRENCIES[currency].fullName,
      renderCell: ({ currency }, key, index) => {
        const fullName = CURRENCIES[currency].fullName;
        return <td key={index}>{fullName}</td>;
      },
    },
    {
      label: STRINGS.STATUS,
      key: 'status',
      exportToCsv: ({ status = false }) => status ? 'Complete' : 'Pending',
      renderCell: ({ status = false }, key, index) => {
        return <td key={index}>{status ? 'Complete' : 'Pending'}</td>;
      },
    },
    {
      label: STRINGS.AMOUNT,
      key: 'amount',
      exportToCsv: ({ amount = 0, currency }) => {
        const { formatToCurrency, shortName } = CURRENCIES[currency];
        return `${formatToCurrency(amount)} ${shortName}`;
      },
      renderCell: ({ amount = 0, currency }, key, index) => {
        const { formatToCurrency, shortName } = CURRENCIES[currency];
        return <td key={index}>{`${formatToCurrency(amount)} ${shortName}`}</td>;
      },
    },
    {
      label: STRINGS.FEE,
      key: 'fee',
      exportToCsv: ({ fee = 0 }) => fee,
      renderCell: ({ fee = 0 }, key, index) => {
        return <td key={index}>{fee}</td>
      },
    },
    {
      label: STRINGS.TIME,
      key: 'created_at',
      exportToCsv: ({ created_at = '' }) => created_at,
      renderCell: ({ created_at = '' }, key, index) => {
        return <td key={index}>{formatTimestamp(created_at)}</td>;
      },
    },
  ];
}

export const generateDepositsHeaders = generateWithdrawalsHeaders;
