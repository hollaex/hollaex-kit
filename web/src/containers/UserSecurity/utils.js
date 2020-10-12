import React from 'react';
import { Icon } from 'antd';
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
import { getFormatTimestamp, isBlockchainTx } from '../../utils/utils';
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

export const generateWithdrawalsHeaders = (
	symbol,
	coins = {},
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
				return <td key={index}>{getFormatTimestamp(created_at)}</td>;
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
