import React from 'react';
import classnames from 'classnames';
import mathjs from 'mathjs';

import STRINGS from '../../config/localizedStrings';

import { CurrencyBall } from '../../components';
import { CURRENCIES, PAIRS } from '../../config/constants';
import { formatTimestamp } from '../../utils/utils';

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
	return [
		{
			label: STRINGS.PAIR,
			key: 'pair',
			exportToCsv: ({ symbol }) => symbol.toUpperCase(),
			renderCell: ({ symbol }, key, index) => {
				return (
					<td key={index} className="text-uppercase">
						{symbol}
					</td>
				);
			}
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
			exportToCsv: ({ size = 0, ...data }) => {
				const symbol = PAIRS[data.symbol].pair_base;
				const { formatToCurrency } = CURRENCIES[symbol];
				const shortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`];
				return STRINGS.formatString(
					STRINGS[`${symbol.toUpperCase()}_PRICE_FORMAT`],
					formatToCurrency(size),
					shortName
				);
			},
			renderCell: ({ size = 0, ...data }, key, index) => {
				const symbol = PAIRS[data.symbol].pair_base;
				const { formatToCurrency } = CURRENCIES[symbol];
				const shortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`];
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS[`${symbol.toUpperCase()}_PRICE_FORMAT`],
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
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				const { pair_2 } = PAIRS[symbol];
				const pair = pair_2.toUpperCase();
				return STRINGS.formatString(
					STRINGS[`${pair}_PRICE_FORMAT`],
					CURRENCIES[pair_2].formatToCurrency(
						calculatePrice(quick, price, size)
					),
					CURRENCIES[pair_2].currencySymbol
				);
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				const { pair_2 } = PAIRS[symbol];
				const pair = pair_2.toUpperCase();
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS[`${pair}_PRICE_FORMAT`],
							CURRENCIES[pair_2].formatToCurrency(
								calculatePrice(quick, price, size)
							),
							CURRENCIES[pair_2].currencySymbol
						)}
					</td>
				);
			}
		},
		{
			label: STRINGS.AMOUNT,
			key: 'amount',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				const { pair_2 } = PAIRS[symbol];
				const pair = pair_2.toUpperCase();
				return STRINGS.formatString(
					STRINGS[`${pair}_PRICE_FORMAT`],
					CURRENCIES[pair_2].formatToCurrency(
						calculateAmount(quick, price, size)
					),
					CURRENCIES[pair_2].currencySymbol
				);
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				const { pair_2 } = PAIRS[symbol];
				const pair = pair_2.toUpperCase();
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS[`${pair}_PRICE_FORMAT`],
							CURRENCIES[pair_2].formatToCurrency(
								calculateAmount(quick, price, size)
							),
							CURRENCIES[pair_2].currencySymbol
						)}
					</td>
				);
			}
		},
		{
			label: STRINGS.FEE,
			key: 'fee',
			exportToCsv: ({ fee = 0, price = 0, size = 0, quick, symbol, side }) => {
				if (!fee) {
					return calculateFeeAmount(fee);
				}
				const { pair_base, pair_2 } = PAIRS[symbol];
				const pair = side === 'buy' ? pair_base : pair_2;
				return STRINGS.formatString(
					STRINGS[`${pair.toUpperCase()}_PRICE_FORMAT`],
					CURRENCIES[pair].formatToCurrency(
						calculateFeeAmount(fee, quick, price, size)
					),
					CURRENCIES[pair].currencySymbol
				);
			},
			renderCell: ({ fee, price, size, quick, symbol, side }, key, index) => {
				if (!fee) {
					return <td key={index}> {calculateFeeAmount(fee)}</td>;
				}
				const { pair_base, pair_2 } = PAIRS[symbol];
				const pair = side === 'buy' ? pair_base : pair_2;
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS[`${pair.toUpperCase()}_PRICE_FORMAT`],
							CURRENCIES[pair].formatToCurrency(
								calculateFeeAmount(fee, quick, price, size)
							),
							CURRENCIES[pair].currencySymbol
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
			exportToCsv: ({ currency }) =>
				STRINGS[`${currency.toUpperCase()}_FULLNAME`],
			renderCell: ({ currency }, key, index) => (
				<td key={index}>{STRINGS[`${currency.toUpperCase()}_FULLNAME`]}</td>
			)
		},
		{
			label: STRINGS.STATUS,
			key: 'status',
			exportToCsv: ({ status = false }) =>
				status ? STRINGS.COMPLETE : STRINGS.PENDING,
			renderCell: ({ status = false }, key, index) => {
				return (
					<td key={index}>{status ? STRINGS.COMPLETE : STRINGS.PENDING}</td>
				);
			}
		},
		{
			label: STRINGS.AMOUNT,
			key: 'amount',
			exportToCsv: ({ amount = 0, fee = 0, currency }) => {
				const { formatToCurrency } = CURRENCIES[currency];
				const currencySymbol =
					STRINGS[`${currency.toUpperCase()}_CURRENCY_SYMBOL`];
				return `${formatToCurrency(amount - fee)} ${currencySymbol}`;
			},
			renderCell: ({ amount = 0, fee = 0, currency }, key, index) => {
				const { formatToCurrency } = CURRENCIES[currency];
				const currencySymbol =
					STRINGS[`${currency.toUpperCase()}_CURRENCY_SYMBOL`];
				return (
					<td key={index}>{`${formatToCurrency(
						amount - fee
					)} ${currencySymbol}`}</td>
				);
			}
		},
		{
			label: STRINGS.FEE,
			key: 'fee',
			exportToCsv: ({ fee = 0 }) => fee,
			renderCell: ({ fee, price, size, currency }, key, index) => {
				if (fee === 0) {
					return <td key={index}>{calculateFeeAmount(fee)}</td>;
				}
				return (
					<td key={index}>
						{STRINGS.formatString(
							STRINGS[`${currency.toUpperCase()}_PRICE_FORMAT`],
							fee,
							CURRENCIES[currency].currencySymbol
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

export const generateTradeHeadersMobile = (symbol) => {
	const KEYS = ['pair', 'side', 'size', 'price', 'fee', 'timestamp'];
	return generateTradeHeaders(symbol).filter(
		({ key }) => KEYS.indexOf(key) > -1
	);
};

export const generateLessTradeHeaders = (symbol) => {
	const KEYS = ['side', 'price', 'amount', 'fee', 'timestamp'];
	return generateTradeHeaders(symbol).filter(
		({ key }) => KEYS.indexOf(key) > -1
	);
};
