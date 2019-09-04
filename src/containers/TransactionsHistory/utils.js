import React from 'react';
import classnames from 'classnames';
import mathjs from 'mathjs';
import { isMobile } from 'react-device-detect';

import STRINGS from '../../config/localizedStrings';

import { CurrencyBall } from '../../components';
import { BLOCKTRAIL_ENDPOINT, ETHEREUM_ENDPOINT, BITCOINCOM_ENDPOINT, BASE_CURRENCY } from '../../config/constants';
import { formatTimestamp, isBlockchainTx } from '../../utils/utils';
import { formatToCurrency } from '../../utils/currency';

const calculateFeeAmount = (
	fee = 0,
	quick = false,
	price = 1,
	size = 0,
	side = ''
) => {
	if (!fee || fee <= 0) {
		return STRINGS.NO_FEE;
	}
	let feeAmount = 0;
	if (side === 'buy') {
		feeAmount = mathjs
			.chain(size)
			.multiply(fee)
			.divide(100)
			.done();
	} else if (side === 'sell') {
		const amount = calculateAmount(quick, price, size);
		feeAmount = mathjs
			.chain(amount)
			.multiply(fee)
			.divide(100)
			.done();
	}
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

export const generateTradeHeaders = (symbol, pairs, coins) => {
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
				if (pairs[data.symbol]) {
					const symbol = pairs[data.symbol].pair_base;
					const { min } = coins[symbol || BASE_CURRENCY] || {};
					const shortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`];
					return STRINGS.formatString(
						STRINGS[`${symbol.toUpperCase()}_PRICE_FORMAT`],
						formatToCurrency(size, min),
						shortName
					);
				}
			},
			renderCell: ({ size = 0, ...data }, key, index) => {
				if (pairs[data.symbol]) {
					const symbol = pairs[data.symbol].pair_base;
					const { min } = coins[symbol || BASE_CURRENCY] || {};
					const shortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`];
					return (
						<td key={index}>
							{STRINGS.formatString(
								STRINGS[`${symbol.toUpperCase()}_PRICE_FORMAT`],
								formatToCurrency(size, min),
								shortName
							)}
						</td>
					);
				}
			}
		},
		{
			label: STRINGS.PRICE,
			key: 'price',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { pair_2 } = pairs[symbol];
					const { min } = coins[pair_2 || BASE_CURRENCY] || {};
					const pair = pair_2.toUpperCase();
					return STRINGS.formatString(
						STRINGS[`${pair}_PRICE_FORMAT`],
						formatToCurrency(
							calculatePrice(quick, price, size),
							min
						),
						STRINGS[`${pair}_CURRENCY_SYMBOL`]
					);
				}
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { pair_2 } = pairs[symbol];
					const { min } = coins[pair_2 || BASE_CURRENCY] || {};
					const pair = pair_2.toUpperCase();
					return (
						<td key={index}>
							{STRINGS.formatString(
								STRINGS[`${pair}_PRICE_FORMAT`],
								formatToCurrency(
									calculatePrice(quick, price, size),
									min
								),
								STRINGS[`${pair}_CURRENCY_SYMBOL`]
							)}
						</td>
					);
				}
			}
		},
		{
			label: STRINGS.AMOUNT,
			key: 'amount',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { pair_2 } = pairs[symbol];
					const { min } = coins[pair_2 || BASE_CURRENCY] || {};
					const pair = pair_2.toUpperCase();
					return STRINGS.formatString(
						STRINGS[`${pair}_PRICE_FORMAT`],
						formatToCurrency(
							calculateAmount(quick, price, size),
							min
						),
						STRINGS[`${pair}_CURRENCY_SYMBOL`]
					);
				}
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { pair_2 } = pairs[symbol];
					const { min } = coins[pair_2 || BASE_CURRENCY] || {};
					const pair = pair_2.toUpperCase();
					return (
						<td key={index}>
							{STRINGS.formatString(
								STRINGS[`${pair}_PRICE_FORMAT`],
								formatToCurrency(
									calculateAmount(quick, price, size),
									min
								),
								STRINGS[`${pair}_CURRENCY_SYMBOL`]
							)}
						</td>
					);
				}
			}
		},
		{
			label: STRINGS.FEE,
			key: 'fee',
			exportToCsv: ({ fee = 0, price = 0, size = 0, quick, symbol, side }) => {
				if (!fee) {
					return calculateFeeAmount(fee);
				}
				if (pairs[symbol]) {
					const { pair_base, pair_2 } = pairs[symbol];
					const pair = side === 'buy' ? pair_base : pair_2;
					const { min } = coins[pair || BASE_CURRENCY] || {};
					return STRINGS.formatString(
						STRINGS[`${pair.toUpperCase()}_PRICE_FORMAT`],
						formatToCurrency(
							calculateFeeAmount(fee, quick, price, size, side),
							min
						),
						STRINGS[`${pair.toUpperCase()}_CURRENCY_SYMBOL`]
					);
				}
			},
			renderCell: ({ fee, price, size, quick, symbol, side }, key, index) => {
				if (!fee) {
					return <td key={index}> {calculateFeeAmount(fee)}</td>;
				}
				if (pairs[symbol]) {
					const { pair_base, pair_2 } = pairs[symbol];
					const pair = side === 'buy' ? pair_base : pair_2;
					const { min } = coins[pair || BASE_CURRENCY] || {};
					return (
						<td key={index}>
							{STRINGS.formatString(
								STRINGS[`${pair.toUpperCase()}_PRICE_FORMAT`],
								formatToCurrency(
									calculateFeeAmount(fee, quick, price, size, side),
									min,
									true
								),
								STRINGS[`${pair.toUpperCase()}_CURRENCY_SYMBOL`]
							)}
						</td>
					);
				}
			}
		},
		{
			label: STRINGS.TIME,
			key: 'timestamp',
			className: isMobile ? "text-center" : '',
			exportToCsv: ({ timestamp = '' }) => timestamp,
			renderCell: ({ timestamp = '' }, key, index) => {
				return <td key={index} className={isMobile ? "text-center" : ''}>{formatTimestamp(timestamp)}</td>;
			}
		}
	];
};

export const generateWithdrawalsHeaders = (symbol, withdrawalPopup, coins = {}) => {
	return [
		{
			label: '',
			key: 'icon',
			renderCell: ({ currency }, key, index) => {
				return (
					<td className={classnames('icon-cell')} key={index}>
						<CurrencyBall name={STRINGS[`${currency.toUpperCase()}_SHORTNAME`]} symbol={currency} size="s" />
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
			exportToCsv: ({ status = false, dismissed = false, rejected = false }) =>
				status ? STRINGS.COMPLETE : ((dismissed || rejected) ? STRINGS.REJECTED : STRINGS.PENDING),
			renderCell: ({ status = false, dismissed = false, rejected = false }, key, index) => {
				return (
					<td key={index}>{status ? STRINGS.COMPLETE : ((dismissed || rejected) ? STRINGS.REJECTED : STRINGS.PENDING)}</td>
				);
			}
		},
		{
			label: STRINGS.AMOUNT,
			key: 'amount',
			exportToCsv: ({ amount = 0, fee = 0, currency }) => {
				const { min } = coins[currency || BASE_CURRENCY] || {};
				const currencySymbol =
					STRINGS[`${currency.toUpperCase()}_CURRENCY_SYMBOL`];
				return `${formatToCurrency(amount - fee, min)} ${currencySymbol}`;
			},
			renderCell: ({ amount = 0, fee = 0, currency }, key, index) => {
				const { min } = coins[currency || BASE_CURRENCY] || {};
				const currencySymbol =
					STRINGS[`${currency.toUpperCase()}_CURRENCY_SYMBOL`];
				return (
					<td key={index}>{`${formatToCurrency(
						amount - fee,
						min,
						true
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
					STRINGS[`${currency.toUpperCase()}_PRICE_FORMAT`]
					? <td key={index}>
						{STRINGS.formatString(
							STRINGS[`${currency.toUpperCase()}_PRICE_FORMAT`],
							fee,
							STRINGS[`${currency.toUpperCase()}_CURRENCY_SYMBOL`]
						)}
					</td>
					: <td key={index}>{fee}</td>
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
		},
		{
			label: STRINGS.MORE,
			key: 'transaction_id',
			exportToCsv: ({ transaction_id = '' }) => transaction_id,
			renderCell: ({ transaction_id = '', currency, status, dismissed, id, amount, type }, key, index) => {
				if(status===false && dismissed===false && type==='withdrawal') {
					return isBlockchainTx(transaction_id) ? 
					<td key={index}>
						<div 
							className='withdrawal-cancel'
							onClick={() => withdrawalPopup(id, amount)}
							key={id}
						>
							{STRINGS.CANCEL} 
						</div>
					</td>:''
		       	} else {
					return isBlockchainTx(transaction_id) && currency !== BASE_CURRENCY ?
						<td key={index}><a target="blank" href={(currency === 'btc' ? BLOCKTRAIL_ENDPOINT : 
							(currency === 'eth') ? ETHEREUM_ENDPOINT : BITCOINCOM_ENDPOINT) + transaction_id}>{STRINGS.VIEW}</a></td> : <td key={index}></td>;
				}
			}
		},
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

export const generateTradeHeadersMobile = (symbol, pairs, coins) => {
	const KEYS = ['pair', 'side', 'size', 'price', 'fee', 'timestamp'];
	return generateTradeHeaders(symbol, pairs, coins).filter(
		({ key }) => KEYS.indexOf(key) > -1
	);
};

export const generateLessTradeHeaders = (symbol, pairs, coins) => {
	const KEYS = ['side', 'price', 'amount', 'fee', 'timestamp'];
	return generateTradeHeaders(symbol, pairs, coins).filter(
		({ key }) => KEYS.indexOf(key) > -1
	);
};
