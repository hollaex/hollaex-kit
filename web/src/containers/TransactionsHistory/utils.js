import React from 'react';
import { notification, Icon } from 'antd';
import classnames from 'classnames';
import mathjs from 'mathjs';
import { isMobile } from 'react-device-detect';

import STRINGS from '../../config/localizedStrings';

import { CurrencyBall } from '../../components';
import {
	EXPLORERS_ENDPOINT,
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA
} from '../../config/constants';
import { formatTimestamp, isBlockchainTx } from '../../utils/utils';
import { formatToCurrency } from '../../utils/currency';

notification.config({
	placement: 'topLeft',
	duration: 3
});

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

export const generateTradeHeaders = (symbol, pairs, coins, discount) => {
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
						<div className={classnames(side)}>
							{STRINGS.SIDES_VALUES[side]}
						</div>
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
					const { min, ...rest } =
						coins[symbol || BASE_CURRENCY] || DEFAULT_COIN_DATA;
					const shortName = rest.symbol.toUpperCase();
					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(size, min),
						shortName
					).join('');
				} else {
					return size;
				}
			},
			renderCell: ({ size = 0, ...data }, key, index) => {
				if (pairs[data.symbol]) {
					const symbol = pairs[data.symbol].pair_base;
					const { min, ...rest } =
						coins[symbol || BASE_CURRENCY] || DEFAULT_COIN_DATA;
					const shortName = rest.symbol.toUpperCase();
					return (
						<td key={index}>
							{STRINGS.formatString(
								CURRENCY_PRICE_FORMAT,
								formatToCurrency(size, min),
								shortName
							)}
						</td>
					);
				} else {
					return <td key={index}>{size}</td>;
				}
			}
		},
		{
			label: STRINGS.PRICE,
			key: 'price',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { pair_2 } = pairs[symbol];
					const { min, ...rest } =
						coins[pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(calculatePrice(quick, price, size), min),
						rest.symbol.toUpperCase()
					).join('');
				} else {
					return calculatePrice(quick, price, size);
				}
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { pair_2 } = pairs[symbol];
					const { min, ...rest } =
						coins[pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
					return (
						<td key={index}>
							{STRINGS.formatString(
								CURRENCY_PRICE_FORMAT,
								formatToCurrency(
									calculatePrice(quick, price, size),
									min
								),
								rest.symbol.toUpperCase()
							)}
						</td>
					);
				} else {
					return <td key={index}>{calculatePrice(quick, price, size)}</td>;
				}
			}
		},
		{
			label: STRINGS.AMOUNT,
			key: 'amount',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { pair_2 } = pairs[symbol];
					const { min, ...rest } =
						coins[pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(calculateAmount(quick, price, size), min),
						rest.symbol.toUpperCase()
					).join('');
				} else {
					return calculateAmount(quick, price, size);
				}
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { pair_2 } = pairs[symbol];
					const { min, ...rest } =
						coins[pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
					return (
						<td key={index}>
							{STRINGS.formatString(
								CURRENCY_PRICE_FORMAT,
								formatToCurrency(
									calculateAmount(quick, price, size),
									min
								),
								rest.symbol.toUpperCase()
							)}
						</td>
					);
				} else {
					return (
						<td>
							{formatToCurrency(
								calculateAmount(quick, price, size),
								0.0001
							)}
						</td>
					);
				}
			}
		},
		{
			label: STRINGS.FEE,
			key: 'fee',
			exportToCsv: ({
				fee = 0,
				price = 0,
				size = 0,
				quick,
				symbol,
				side
			}) => {
				let feeData =  discount
					? (fee - (fee * discount / 100))
					: fee;
				if (!feeData) {
					return calculateFeeAmount(feeData);
				}
				if (pairs[symbol]) {
					const { pair_base, pair_2 } = pairs[symbol];
					const pair = side === 'buy' ? pair_base : pair_2;
					const { min, ...rest } =
						coins[pair || BASE_CURRENCY] || DEFAULT_COIN_DATA;
					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(
							calculateFeeAmount(feeData, quick, price, size, side),
							min
						),
						rest.symbol.toUpperCase()
					).join('');
				} else {
					calculateFeeAmount(feeData, quick, price, size, side);
				}
			},
			renderCell: (
				{ fee, price, size, quick, symbol, side },
				key,
				index
			) => {
				let feeData =  discount
					? (fee - (fee * discount / 100))
					: fee;
				if (!feeData) {
					return <td key={index}> {calculateFeeAmount(feeData)}</td>;
				}
				if (pairs[symbol]) {
					const { pair_base, pair_2 } = pairs[symbol];
					const pair = side === 'buy' ? pair_base : pair_2;
					const { min, ...rest } =
						coins[pair || BASE_CURRENCY] || DEFAULT_COIN_DATA;
					return (
						<td key={index}>
							{STRINGS.formatString(
								CURRENCY_PRICE_FORMAT,
								formatToCurrency(
									calculateFeeAmount(feeData, quick, price, size, side),
									min,
									true
								),
								rest.symbol.toUpperCase()
							)}
						</td>
					);
				} else {
					calculateFeeAmount(feeData, quick, price, size, side);
				}
			}
		},
		{
			label: STRINGS.TIME,
			key: 'timestamp',
			className: isMobile ? 'text-center' : '',
			exportToCsv: ({ timestamp = '' }) => timestamp,
			renderCell: ({ timestamp = '' }, key, index) => {
				return (
					<td key={index} className={isMobile ? 'text-center' : ''}>
						{formatTimestamp(timestamp)}
					</td>
				);
			}
		}
	];
};

export const generateWithdrawalsHeaders = (
	symbol,
	coins = {},
	withdrawalPopup
) => {
	return [
		{
			label: '',
			key: 'icon',
			renderCell: ({ currency }, key, index) => {
				const data = coins[currency] || DEFAULT_COIN_DATA;
				return (
					<td className={classnames('icon-cell')} key={index}>
						<CurrencyBall
							name={data.symbol.toUpperCase()}
							symbol={currency}
							size="s"
						/>
					</td>
				);
			}
		},
		{
			label: STRINGS.CURRENCY,
			key: 'currency',
			exportToCsv: ({ currency }) => {
				const { fullname } = coins[currency] || DEFAULT_COIN_DATA;
				return fullname;
			},
			renderCell: ({ currency }, key, index) => {
				const { fullname } = coins[currency] || DEFAULT_COIN_DATA;
				return <td key={index}>{fullname}</td>;
			}
		},
		{
			label: STRINGS.STATUS,
			key: 'status',
			exportToCsv: ({
				status = false,
				dismissed = false,
				rejected = false
			}) =>
				status
					? STRINGS.COMPLETE
					: dismissed || rejected
					? STRINGS.REJECTED
					: STRINGS.PENDING,
			renderCell: (
				{ status = false, dismissed = false, rejected = false },
				key,
				index
			) => {
				return (
					<td key={index}>
						{status
							? STRINGS.COMPLETE
							: dismissed || rejected
							? STRINGS.REJECTED
							: STRINGS.PENDING}
					</td>
				);
			}
		},
		{
			label: STRINGS.AMOUNT,
			key: 'amount',
			exportToCsv: ({ amount = 0, fee = 0, currency }) => {
				const { min, ...rest } =
					coins[currency || BASE_CURRENCY] || DEFAULT_COIN_DATA;
				return `${formatToCurrency(
					amount - fee,
					min
				)} ${rest.symbol.toUpperCase()}`;
			},
			renderCell: ({ amount = 0, fee = 0, currency }, key, index) => {
				const { min, ...rest } =
					coins[currency || BASE_CURRENCY] || DEFAULT_COIN_DATA;
				return (
					<td key={index}>{`${formatToCurrency(
						amount - fee,
						min,
						true
					)} ${rest.symbol.toUpperCase()}`}</td>
				);
			}
		},
		{
			label: STRINGS.FEE,
			key: 'fee',
			exportToCsv: ({ fee = 0 }) => fee,
			renderCell: ({ fee, price, size, currency }, key, index) => {
				const data = coins[currency] || DEFAULT_COIN_DATA;
				if (fee === 0) {
					return <td key={index}>{calculateFeeAmount(fee)}</td>;
				}
				return ((
					// STRINGS[`${currency.toUpperCase()}_PRICE_FORMAT`]
					// ?
					<td key={index}>
						{STRINGS.formatString(
							CURRENCY_PRICE_FORMAT,
							fee,
							data.symbol.toUpperCase()
						)}
					</td> /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/ /*: <td key={index}>{fee}</td>*/
					// : <td key={index}>{fee}</td>
				) /*: <td key={index}>{fee}</td>*/);
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
			renderCell: (
				{
					transaction_id = '',
					currency,
					status,
					dismissed,
					processing,
					rejected,
					waiting,
					id,
					amount,
					type
				},
				key,
				index
			) => {
				if (
					status === false &&
					dismissed === false &&
					processing === false &&
					waiting === false &&
					type === 'withdrawal'
				) {
					// Pending Status
					return (
						<td key={index}>
							<div
								className="withdrawal-cancel"
								onClick={() => withdrawalPopup(id, amount)}
								key={id}
							>
								{STRINGS.CANCEL}
							</div>
						</td>
					);
				} else if (
					status === false &&
					((dismissed === true) || (rejected === true)) &&
					type === 'withdrawal'
				) {
					// Canceled Status
					return (
						<td
							className="btn-tx"
							key={index}
							onClick={() => {
								notification.open({
									message: 'Transaction ID',
									description: transaction_id,
									icon: (
										<Icon
											type="info-circle"
											theme="twoTone"
											style={{ color: '#0000ff' }}
										/>
									)
								});
							}}
						>
							{STRINGS.VIEW}
						</td>
					);
				} else {
					// Completed Status
					return isBlockchainTx(transaction_id) &&
						currency !== BASE_CURRENCY ? (
						<td key={index}>
							<a
								target="blank"
								href={EXPLORERS_ENDPOINT(currency) + transaction_id}
							>
								{STRINGS.VIEW}
							</a>
						</td>
					) : (
						<td
							className="btn-tx"
							key={index}
							onClick={() => {
								notification.open({
									message: 'Transaction ID',
									description: transaction_id,
									icon: (
										<Icon
											type="info-circle"
											theme="twoTone"
											style={{ color: '#0000ff' }}
										/>
									)
								});
							}}
						>
							{STRINGS.VIEW}
						</td>
					);
				}
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

export const generateTradeHeadersMobile = (symbol, pairs, coins, discount) => {
	const KEYS = ['pair', 'side', 'size', 'price', 'fee', 'timestamp'];
	return generateTradeHeaders(symbol, pairs, coins, discount).filter(
		({ key }) => KEYS.indexOf(key) > -1
	);
};

export const generateLessTradeHeaders = (symbol, pairs, coins, discount) => {
	const KEYS = ['side', 'price', 'amount', 'fee', 'timestamp'];
	return generateTradeHeaders(symbol, pairs, coins, discount).filter(
		({ key }) => KEYS.indexOf(key) > -1
	);
};
