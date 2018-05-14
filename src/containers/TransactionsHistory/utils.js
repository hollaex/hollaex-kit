import React from 'react';
import classnames from 'classnames';
import mathjs from 'mathjs';

import STRINGS from '../../config/localizedStrings';

import { CurrencyBall } from '../../components';
import { CURRENCIES } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';
import { formatTimestamp } from '../../utils/utils';

const fiatFormatToCurrency = CURRENCIES[fiatSymbol].formatToCurrency;
const fiatCurrencySymbol = CURRENCIES.fiat.currencySymbol;

const calculateFeeAmount = (fee = 0, quick = false, price = 1, size = 0) => {
	if (!fee || fee <= 0) {
		return STRINGS.NO_FEE;
	}
	const amount = calculateAmount(quick, price, size);
	const feeAmount = mathjs
		.chain(amount)
		.multiply(fee)
		.divide(100)
		.done();
	return feeAmount;
};

const calculateAmount = (isQuick = false, price, size) => {
	if (isQuick) {
		return price;
	}
	const amount = mathjs
		.chain(price)
		.multiply(size)
		.done();
	return amount;
};

const calculatePrice = (isQuick = false, price, size) => {
	if (isQuick) {
		const amount = mathjs
			.chain(price)
			.divide(size)
			.done();
		return amount;
	}
	return price;
};

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
			)
		},
		{
			label: STRINGS.CURRENCY,
			key: 'currency',
			exportToCsv: () => fullName,
			renderCell: (data, key, index) => <td key={index}>{fullName}</td>
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
			}
		},
		{
			label: STRINGS.SIZE,
			key: 'size',
			exportToCsv: ({ size = 0 }) =>
				STRINGS.formatString(
					STRINGS.BTC_PRICE_FORMAT,
					formatToCurrency(size),
					shortName
				),
			renderCell: ({ size = 0 }, key, index) => {
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS.BTC_PRICE_FORMAT,
							formatToCurrency(size),
							shortName
						)}
					</td>
				);
			}
		},
		{
			label: STRINGS.PRICE,
			key: 'price',
			exportToCsv: ({ price = 0, size = 0, quick }) =>
				STRINGS.formatString(
					STRINGS.FIAT_PRICE_FORMAT,
					fiatFormatToCurrency(calculatePrice(quick, price, size)),
					fiatCurrencySymbol
				),
			renderCell: ({ price = 0, size = 0, quick }, key, index) => {
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS.FIAT_PRICE_FORMAT,
							fiatFormatToCurrency(calculatePrice(quick, price, size)),
							fiatCurrencySymbol
						)}
					</td>
				);
			}
		},
		{
			label: STRINGS.AMOUNT,
			key: 'amount',
			exportToCsv: ({ price = 0, size = 0, quick }) =>
				STRINGS.formatString(
					STRINGS.FIAT_PRICE_FORMAT,
					fiatFormatToCurrency(calculateAmount(quick, price, size)),
					fiatCurrencySymbol
				),
			renderCell: ({ price = 0, size = 0, quick }, key, index) => {
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS.FIAT_PRICE_FORMAT,
							fiatFormatToCurrency(calculateAmount(quick, price, size)),
							fiatCurrencySymbol
						)}
					</td>
				);
			}
		},
		{
			label: STRINGS.FEE,
			key: 'fee',
			exportToCsv: ({ fee = 0, price = 0, size = 0, quick }) =>
				calculateFeeAmount(fee, quick, price, size),
			renderCell: ({ fee, price, size, quick }, key, index) => {
				if (!fee) {
					return <td key={index}> {calculateFeeAmount(fee)}</td>;
				}
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS.FIAT_PRICE_FORMAT,
							fiatFormatToCurrency(calculateFeeAmount(fee, quick, price, size)),
							fiatCurrencySymbol
						)}
					</td>
				);
			}
		},
		{
			label: STRINGS.TIME,
			key: 'timestamp',
			exportToCsv: ({ timestamp = '' }) => timestamp,
			renderCell: ({ timestamp = '' }, key, index) => {
				return <td key={index}>{formatTimestamp(timestamp)}</td>;
			}
		}
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
			}
		},
		{
			label: STRINGS.CURRENCY,
			key: 'currency',
			exportToCsv: ({ currency }) => STRINGS[`${currency.toUpperCase()}_FULLNAME`],
			renderCell: ({ currency }, key, index) => <td key={index}>{STRINGS[`${currency.toUpperCase()}_FULLNAME`]}</td>
		},
		{
			label: STRINGS.STATUS,
			key: 'status',
			exportToCsv: ({ status = false }) => (status ? STRINGS.COMPLETE : STRINGS.PENDING),
			renderCell: ({ status = false }, key, index) => {
				return <td key={index}>{status ? STRINGS.COMPLETE : STRINGS.PENDING}</td>;
			}
		},
		{
			label: STRINGS.AMOUNT,
			key: 'amount',
			exportToCsv: ({ amount = 0, fee = 0, currency }) => {
				const { formatToCurrency } = CURRENCIES[currency];
				const currencySymbol = STRINGS[`${currency.toUpperCase()}_CURRENCY_SYMBOL`];
				return `${formatToCurrency(amount - fee)} ${currencySymbol}`;
			},
			renderCell: ({ amount = 0, fee = 0, currency }, key, index) => {
				const { formatToCurrency } = CURRENCIES[currency];
				const currencySymbol = STRINGS[`${currency.toUpperCase()}_CURRENCY_SYMBOL`];
				return (
					<td key={index}>{`${formatToCurrency(amount - fee)} ${currencySymbol}`}</td>
				);
			}
		},
		{
			label: STRINGS.FEE,
			key: 'fee',
			exportToCsv: ({ fee = 0 }) => fee,
			renderCell: ({ fee, price, size, quick }, key, index) => {
				if (fee === 0) {
					return <td key={index}>{calculateFeeAmount(fee)}</td>;
				}
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS.FIAT_PRICE_FORMAT,
							fee,
							fiatCurrencySymbol
						)}
					</td>
				);
			}
		},
		{
			label: STRINGS.TIME,
			key: 'created_at',
			exportToCsv: ({ created_at = '' }) => created_at,
			renderCell: ({ created_at = '' }, key, index) => {
				return <td key={index}>{formatTimestamp(created_at)}</td>;
			}
		}
	];
};

export const generateDepositsHeaders = generateWithdrawalsHeaders;

export const filterData = (symbol, { count = 0, data = [] }) => {
	const filteredData = data.filter((item) => item.symbol === symbol);
	return {
		count: filteredData.length,
		data: filteredData
	};
};
