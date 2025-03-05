import React from 'react';
import {
	InfoCircleTwoTone,
	PlusSquareOutlined,
	MinusSquareOutlined,
	ThunderboltFilled,
} from '@ant-design/icons';
import { notification, Tooltip } from 'antd';
import classnames from 'classnames';
import mathjs from 'mathjs';
import { isMobile } from 'react-device-detect';

import STRINGS from 'config/localizedStrings';
import { Coin, EditWrapper } from 'components';
import {
	EXPLORERS_ENDPOINT,
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';
import { getFormatTimestamp } from 'utils/utils';
import { formatToCurrency, formatBaseAmount } from 'utils/currency';
import { Loading } from 'containers/DigitalAssets/components/utils';

notification.config({
	placement: 'topLeft',
	duration: 3,
});

/*const calculateFeeAmount = (
	fee = 0,
	quick = false,
	price = 1,
	size = 0,
	side = ''
) => {
	if (!fee || fee <= 0) {
		return STRINGS['NO_FEE'];
	}
	let feeAmount = 0;
	if (side === 'buy') {
		feeAmount = mathjs.chain(size).multiply(fee).divide(100).done();
	} else if (side === 'sell') {
		const amount = calculateAmount(quick, price, size);
		feeAmount = mathjs.chain(amount).multiply(fee).divide(100).done();
	}
	return feeAmount;
};*/

const calculateAmount = (isQuick = false, price, size) => {
	/* Deprecated
	if (isQuick) {
		return price;
	}
	*/
	const amount = mathjs.chain(price).multiply(size).done();
	return amount;
};

const calculatePrice = (isQuick = false, price, size) => {
	/* Deprecated
	if (isQuick) {
		const amount = mathjs.chain(price).divide(size).done();
		return amount;
	}
	*/
	return price;
};

export const generateOrderHistoryHeaders = (
	symbol,
	pairs = {},
	coins,
	discount,
	prices = {},
	ICONS,
	type
) => {
	return [
		{
			key: 'icon',
			className: 'sticky-col',
			renderCell: (
				{ display_name, icon_id },
				key,
				index,
				isExpandable,
				isExpanded
			) => {
				return (
					<td key={index}>
						<div className="d-flex">
							{isExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'PAIR',
			label: STRINGS['PAIR'],
			className: 'sticky-col',
			key: 'pair',
			exportToCsv: ({ display_name }) => display_name,
			renderCell: ({ display_name, icon_id }, key, index) => {
				return (
					<td key={index} className="text-uppercase sticky-col">
						<div className="d-flex align-items-center">
							<Coin iconId={icon_id} />
							<div className="px-2">{display_name}</div>
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'SIDE',
			label: STRINGS['SIDE'],
			key: 'side',
			exportToCsv: ({ side = '' }) => side,
			renderCell: ({ side = '' }, key, index) => {
				return (
					<td key={index} className={classnames('cell_box-type')}>
						<div className={classnames(side)}>
							{STRINGS[`SIDES_VALUES.${side}`]}
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'TYPE',
			label: STRINGS['TYPE'],
			key: 'type',
			exportToCsv: ({ type = '' }) => type,
			renderCell: ({ type = '' }, key, index) => {
				return (
					<td key={index}>
						{type ? STRINGS[`TYPES.${type.toUpperCase()}`] : ''}
					</td>
				);
			},
		},
		{
			stringId: 'SIZE',
			label: STRINGS['SIZE'],
			key: 'size',
			exportToCsv: ({ size = 0, symbol }) => {
				if (pairs[symbol]) {
					const { increment_size, pair_base_display } = pairs[symbol];

					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(size, increment_size),
						pair_base_display
					).join('');
				} else {
					return size;
				}
			},
			renderCell: ({ size = 0, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { increment_size, pair_base_display } = pairs[symbol];

					return (
						<td key={index}>
							{STRINGS.formatString(
								CURRENCY_PRICE_FORMAT,
								formatToCurrency(size, increment_size),
								pair_base_display
							)}
						</td>
					);
				} else {
					return <td key={index}>{size}</td>;
				}
			},
		},
		{
			stringId: 'PRICE',
			label: STRINGS['PRICE'],
			key: 'price',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { increment_price, pair_2_display } = pairs[symbol];

					return price
						? STRINGS.formatString(
								CURRENCY_PRICE_FORMAT,
								formatToCurrency(
									calculatePrice(quick, price, size),
									increment_price
								),
								pair_2_display
						  ).join('')
						: '';
				} else {
					return calculatePrice(quick, price, size);
				}
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { increment_price, pair_2_display } = pairs[symbol];

					return (
						<td key={index}>
							{price
								? STRINGS.formatString(
										CURRENCY_PRICE_FORMAT,
										formatToCurrency(
											calculatePrice(quick, price, size),
											increment_price
										),
										pair_2_display
								  )
								: STRINGS['NA']}
						</td>
					);
				} else {
					return <td key={index}>{calculatePrice(quick, price, size)}</td>;
				}
			},
		},
		{
			stringId: 'AVERAGE',
			label: STRINGS['AVERAGE'],
			key: 'average',
			exportToCsv: ({ average = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { increment_price, pair_2_display } = pairs[symbol];

					return average
						? STRINGS.formatString(
								CURRENCY_PRICE_FORMAT,
								formatToCurrency(
									calculatePrice(quick, average, size),
									increment_price
								),
								pair_2_display
						  ).join('')
						: '';
				} else {
					return calculatePrice(quick, average, size);
				}
			},
			renderCell: ({ average = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { increment_price, pair_2_display } = pairs[symbol];

					return (
						<td key={index}>
							{average
								? STRINGS.formatString(
										CURRENCY_PRICE_FORMAT,
										formatToCurrency(
											calculatePrice(quick, average, size),
											increment_price
										),
										pair_2_display
								  )
								: STRINGS['NA']}
						</td>
					);
				} else {
					return <td key={index}>{calculatePrice(quick, average, size)}</td>;
				}
			},
		},
		{
			stringId: 'AMOUNT',
			label: STRINGS['AMOUNT'],
			key: 'amount',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { increment_price, pair_2_display } = pairs[symbol];

					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(
							calculateAmount(quick, price, size),
							increment_price
						),
						pair_2_display
					).join('');
				} else {
					return calculateAmount(quick, price, size);
				}
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { increment_price, pair_2_display } = pairs[symbol];

					return (
						<td key={index}>
							{STRINGS.formatString(
								CURRENCY_PRICE_FORMAT,
								formatToCurrency(
									calculateAmount(quick, price, size),
									increment_price
								),
								pair_2_display
							)}
						</td>
					);
				} else {
					return (
						<td>
							{formatToCurrency(calculateAmount(quick, price, size), 0.0001)}
						</td>
					);
				}
			},
		},
		!isMobile && {
			label: '',
			key: 'status',
			renderCell: ({ size = 0, filled = 0 }, key, index) => {
				const fullfilled = formatBaseAmount(
					mathjs.chain(filled).divide(size).multiply(100).done()
				);
				return (
					<td key={index} className={classnames('cell_box-type', 'fullfilled')}>
						<div className="cell-wrapper">
							<div className="cell_value-wrapper text_overflow">
								{STRINGS.formatString(STRINGS['FULLFILLED'], fullfilled)}
								<span
									className="cell_value-bar"
									style={{ width: `${fullfilled}%` }}
								/>
							</div>
						</div>
					</td>
				);
			},
		},
		isMobile && {
			label: STRINGS['FILLED'],
			key: 'status',
			renderCell: ({ filled = 0, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { increment_size } = pairs[symbol];
					const fullfilled = formatToCurrency(filled, increment_size);
					return <td key={index}>{fullfilled}</td>;
				} else {
					return <td key={index}>{formatToCurrency(filled, 0.0001)}</td>;
				}
			},
		},
		{
			label: STRINGS['STATUS'],
			key: 'status',
			exportToCsv: ({ status }) => status,
			renderCell: ({ status }, key, index) => {
				return (
					<td key={index} className="caps-first">
						{status}
					</td>
				);
			},
		},
		/*{
			stringId: 'FEE,NO_FEE',
			label: STRINGS['FEE'],
			key: 'fee',
			exportToCsv: ({ fee = 0, fee_coin_display = '' }) =>
				`${fee} ${fee_coin_display}`,
			renderCell: ({ fee = 0, fee_coin_display = '' }, key, index) => (
				<td key={index}>
					{STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						fee,
						fee_coin_display
					)}
				</td>
			),
		},*/
		{
			stringId: 'TIME',
			label: type,
			key: 'created_at',
			className: isMobile ? 'text-center' : '',
			exportToCsv: ({ created_at = '' }) => created_at,
			renderCell: ({ created_at = '' }, key, index) => {
				return (
					<td key={index} className={isMobile ? 'text-center' : ''}>
						{getFormatTimestamp(created_at)}
					</td>
				);
			},
		},
	];
};

export const generateTradeHeaders = (
	symbol,
	pairs,
	coins,
	discount,
	prices = {},
	ICONS,
	setActiveTab = () => {},
	isLoading = false
) => {
	return [
		{
			key: 'icon',
			className: 'sticky-col',
			renderCell: (
				{ display_name, icon_id },
				key,
				index,
				isExpandable,
				isExpanded
			) => {
				return (
					<td key={index}>
						<div className="d-flex">
							{isExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'PAIR',
			label: STRINGS['PAIR'],
			key: 'pair',
			exportToCsv: ({ display_name }) => display_name,
			className: 'sticky-col',
			renderCell: ({ display_name, icon_id, quick }, key, index) => {
				return (
					<td key={index} className="text-uppercase sticky-col">
						{!isLoading ? (
							<div className="d-flex align-items-center">
								<Coin iconId={icon_id} />
								<div className="px-2">{display_name}</div>
								<div className="quick-icon-wrapper">
									{quick && (
										<Tooltip
											overlayClassName="quick-trade-tooltip"
											title={STRINGS['TRANSACTION_HISTORY.QUICK_TRADE_TOOLTIP']}
										>
											<ThunderboltFilled style={{ color: '#FFF100' }} />
										</Tooltip>
									)}
								</div>
							</div>
						) : (
							<Loading index={index} />
						)}
					</td>
				);
			},
		},
		{
			stringId: 'SIDE',
			label: STRINGS['SIDE'],
			key: 'side',
			exportToCsv: ({ side = '' }) => side,
			renderCell: ({ side = '' }, key, index) => {
				return (
					<td key={index} className={classnames('cell_box-type recent-trades')}>
						{!isLoading ? (
							<div className={classnames(side)}>
								{STRINGS[`SIDES_VALUES.${side}`]}
							</div>
						) : (
							<Loading index={index} />
						)}
					</td>
				);
			},
		},
		{
			stringId: 'SIZE',
			label: STRINGS['SIZE'],
			key: 'size',
			exportToCsv: ({ size = 0, ...data }) => {
				if (pairs[data.symbol]) {
					const { pair_base_display, increment_size } = pairs[data.symbol];

					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(size, increment_size),
						pair_base_display
					).join('');
				} else {
					return size;
				}
			},
			renderCell: ({ size = 0, ...data }, key, index) => {
				if (pairs[data.symbol]) {
					const { pair_base_display, increment_size } = pairs[data.symbol];

					return (
						<td key={index}>
							{!isLoading ? (
								STRINGS.formatString(
									CURRENCY_PRICE_FORMAT,
									formatToCurrency(size, increment_size),
									pair_base_display
								)
							) : (
								<Loading index={index} />
							)}
						</td>
					);
				} else {
					return (
						<td key={index}>{!isLoading ? size : <Loading index={index} />}</td>
					);
				}
			},
		},
		{
			stringId: 'PRICE',
			label: STRINGS['PRICE'],
			key: 'price',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { pair_2_display, increment_price } = pairs[symbol];

					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(
							calculatePrice(quick, price, size),
							increment_price
						),
						pair_2_display
					).join('');
				} else {
					return calculatePrice(quick, price, size);
				}
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { pair_2_display, increment_price } = pairs[symbol];
					return (
						<td key={index}>
							{!isLoading ? (
								<span>
									{price
										? STRINGS.formatString(
												CURRENCY_PRICE_FORMAT,
												formatToCurrency(
													calculatePrice(quick, price, size),
													increment_price
												),
												pair_2_display
										  )
										: ''}
								</span>
							) : (
								<Loading index={index} />
							)}
						</td>
					);
				} else {
					return (
						<td key={index}>
							{!isLoading ? (
								calculatePrice(quick, price, size)
							) : (
								<Loading index={index} />
							)}
						</td>
					);
				}
			},
		},
		{
			stringId: 'AMOUNT',
			label: STRINGS['AMOUNT'],
			key: 'amount',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { pair_2_display, increment_price } = pairs[symbol];

					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(
							calculateAmount(quick, price, size),
							increment_price
						),
						pair_2_display
					).join('');
				} else {
					return calculateAmount(quick, price, size);
				}
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { pair_2_display, increment_price } = pairs[symbol];

					return (
						<td key={index}>
							{!isLoading ? (
								STRINGS.formatString(
									CURRENCY_PRICE_FORMAT,
									formatToCurrency(
										calculateAmount(quick, price, size),
										increment_price
									),
									pair_2_display
								)
							) : (
								<Loading index={index} />
							)}
						</td>
					);
				} else {
					return (
						<td>
							{!isLoading ? (
								formatToCurrency(calculateAmount(quick, price, size), 0.0001)
							) : (
								<Loading index={index} />
							)}
						</td>
					);
				}
			},
		},
		/*		{
			stringId: 'AMOUNT_IN',
			label: `${STRINGS['AMOUNT_IN']} ${BASE_CURRENCY.toUpperCase()}`,
			key: 'amount-in',
			exportToCsv: ({ price = 0, size = 0, quick, symbol }) => {
				if (pairs[symbol]) {
					const { increment_price, pair_base } = pairs[symbol];
					const { min, ...rest } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
					return STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(
							calculateAmount(quick, prices[pair_base] || 0, size),
							increment_price
						),
						rest.symbol.toUpperCase()
					).join('');
				} else {
					return calculateAmount(quick, price, size);
				}
			},
			renderCell: ({ price = 0, size = 0, quick, symbol }, key, index) => {
				if (pairs[symbol]) {
					const { increment_price, pair_base } = pairs[symbol];
					const { min, ...rest } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
					return (
						<td key={index}>
							{STRINGS.formatString(
								CURRENCY_PRICE_FORMAT,
								formatToCurrency(
									calculateAmount(quick, prices[pair_base] || 0, size),
									increment_price
								),
								rest.symbol.toUpperCase()
							)}
						</td>
					);
				} else {
					return (
						<td>
							{formatToCurrency(calculateAmount(quick, price, size), 0.0001)}
						</td>
					);
				}
			},
		},*/
		{
			stringId: 'FEE,NO_FEE',
			label: STRINGS['FEE'],
			key: 'fee',
			exportToCsv: ({ fee = 0, fee_coin_display = '' }) =>
				`${fee} ${fee_coin_display}`,
			renderCell: ({ fee = 0, fee_coin_display = '' }, key, index) => (
				<td key={index}>
					{!isLoading ? (
						STRINGS.formatString(
							CURRENCY_PRICE_FORMAT,
							formatToCurrency(fee, 0, true),
							fee_coin_display
						)
					) : (
						<Loading index={index} />
					)}
				</td>
			),
		},
		{
			stringId: 'TIME',
			label: STRINGS['TIME'],
			key: 'timestamp',
			className: isMobile ? 'text-center' : '',
			exportToCsv: ({ timestamp = '' }) => timestamp,
			renderCell: ({ timestamp = '' }, key, index) => {
				return (
					<td key={index} className={isMobile ? 'text-center' : ''}>
						{!isLoading ? (
							getFormatTimestamp(timestamp)
						) : (
							<Loading index={index} />
						)}
					</td>
				);
			},
		},
	];
};

export const generateWithdrawalsHeaders = (
	symbol,
	coins = {},
	withdrawalPopup,
	ICONS
) => {
	return [
		// {
		// 	label: '',
		// 	key: 'icon',
		// 	renderCell: ({ currency }, key, index) => {
		// 		const data = coins[currency] || DEFAULT_COIN_DATA;
		// 		return (
		// 			<td className={classnames('icon-cell')} key={index}>
		// 				<CurrencyBall
		// 					name={data.symbol.toUpperCase()}
		// 					symbol={currency}
		// 					size="s"
		// 				/>
		// 			</td>
		// 		);
		// 	},
		// },
		{
			key: 'icon',
			className: 'sticky-col',
			renderCell: (
				{ display_name, icon_id },
				key,
				index,
				isExpandable,
				isExpanded
			) => {
				return (
					<td key={index}>
						<div className="d-flex">
							{isExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'CURRENCY',
			label: STRINGS['CURRENCY'],
			className: 'sticky-col',
			key: 'currency',
			exportToCsv: ({ currency }) => {
				const { fullname } = coins[currency] || DEFAULT_COIN_DATA;
				return fullname;
			},
			renderCell: ({ currency, icon_id }, key, index) => {
				const data = coins[currency] || DEFAULT_COIN_DATA;
				return (
					<td key={index} className="coin-cell sticky-col">
						<div className="d-flex align-items-center">
							<Coin iconId={icon_id} />
							<div className="px-2">{data.fullname}</div>
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'STATUS,COMPLETE,REJECTED,PENDING',
			label: STRINGS['STATUS'],
			key: 'status',
			exportToCsv: ({ status = false, dismissed = false, rejected = false }) =>
				status
					? STRINGS['COMPLETE']
					: dismissed || rejected
					? STRINGS['REJECTED']
					: STRINGS['PENDING'],
			renderCell: (
				{ status = false, dismissed = false, rejected = false, is_new = false },
				key,
				index
			) => {
				return (
					<td key={index} className="transaction-status">
						<div
							className={classnames(
								'd-flex new-tag-wrapper',
								getClassNameByStatus(status, dismissed, rejected, is_new)
							)}
						>
							{is_new ? (
								<div className="new-tag">{STRINGS['DEPOSIT_STATUS.NEW']}</div>
							) : null}
							{status
								? STRINGS['COMPLETE']
								: dismissed || rejected
								? STRINGS['REJECTED']
								: STRINGS['PENDING']}
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'AMOUNT',
			label: STRINGS['AMOUNT'],
			key: 'amount',
			exportToCsv: ({ amount = 0, currency, display_name }) => {
				const { min } = coins[currency || BASE_CURRENCY] || DEFAULT_COIN_DATA;
				return `${formatToCurrency(amount, min)} ${display_name}`;
			},
			renderCell: ({ amount = 0, currency, display_name }, key, index) => {
				const { min } = coins[currency || BASE_CURRENCY] || DEFAULT_COIN_DATA;
				return (
					<td key={index}>{`${formatToCurrency(
						amount,
						min,
						true
					)} ${display_name}`}</td>
				);
			},
		},
		{
			stringId: 'FEE,NO_FEE',
			label: STRINGS['FEE'],
			key: 'fee',
			exportToCsv: ({ fee = 0, fee_coin_display }) =>
				`${fee} ${fee_coin_display}`,
			renderCell: ({ fee = 0, fee_coin_display }, key, index) => (
				<td key={index}>
					{STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatToCurrency(fee, 0, true),
						fee_coin_display
					)}
				</td>
			),
		},
		{
			stringId: 'TIME',
			label: STRINGS['TIME'],
			key: 'created_at',
			exportToCsv: ({ created_at = '' }) => created_at,
			renderCell: ({ created_at = '' }, key, index) => {
				return <td key={index}>{getFormatTimestamp(created_at)}</td>;
			},
		},
		{
			stringId: 'category',
			label: STRINGS['CATEGORY'],
			key: 'category',
			renderCell: (data, value, index) => {
				return !data.category ? (
					<td key={index}>{'-'}</td>
				) : (
					<EditWrapper>
						<td className="category-label" key={index}>
							{STRINGS[`TRANSACTION_HISTORY.${data.category.toUpperCase()}`]}
						</td>
					</EditWrapper>
				);
			},
		},
		{
			stringId: 'network',
			label: STRINGS['NETWORK'],
			key: 'network',
			renderCell: (data, value, index) => {
				return !data.network ? (
					<td key={index}>{'-'}</td>
				) : (
					<td key={index}>{data.network.toUpperCase()}</td>
				);
			},
		},
		{
			stringId: 'MORE,CANCEL,VIEW',
			label: STRINGS['MORE'],
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
					type,
					network,
				},
				key,
				index
			) => {
				if (
					status === false &&
					dismissed === false &&
					rejected === false &&
					processing === false &&
					waiting === false &&
					type === 'withdrawal'
				) {
					// Pending Status
					return (
						<td key={index}>
							<div
								className="withdrawal-cancel"
								onClick={() => withdrawalPopup(id, amount, currency)}
								key={id}
							>
								{STRINGS['CANCEL']}
							</div>
						</td>
					);
				} else if (
					status === false &&
					(dismissed === true || rejected === true) &&
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
									icon: <InfoCircleTwoTone style={{ color: '#0000ff' }} />,
								});
							}}
						>
							{STRINGS['VIEW']}
						</td>
					);
				} else {
					// Completed Status
					// return isBlockchainTx(transaction_id) &&
					return network && EXPLORERS_ENDPOINT(network).length > 0 ? (
						// currency !== BASE_CURRENCY ? (
						<td key={index}>
							<a
								target="blank"
								href={EXPLORERS_ENDPOINT(network) + transaction_id}
							>
								{STRINGS['VIEW']}
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
									icon: <InfoCircleTwoTone style={{ color: '#0000ff' }} />,
								});
							}}
						>
							{STRINGS['VIEW']}
						</td>
					);
				}
			},
		},
	];
};

export const generateDepositsHeaders = generateWithdrawalsHeaders;

export const filterData = (symbol, { count = 0, data = [] }) => {
	const filteredData = data.filter((item) => item.symbol === symbol);
	return {
		count: filteredData.length,
		data: filteredData,
	};
};

export const generateTradeHeadersMobile = (
	symbol,
	pairs,
	coins,
	discount,
	prices,
	icons
) => {
	const KEYS = ['pair', 'side', 'size', 'price', 'fee', 'timestamp'];
	return generateTradeHeaders(
		symbol,
		pairs,
		coins,
		discount,
		prices,
		icons
	).filter(({ key }) => KEYS.indexOf(key) > -1);
};

export const generateLessTradeHeaders = (
	symbol,
	pairs,
	coins,
	discount,
	prices,
	icons
) => {
	const KEYS = ['side', 'price', 'amount', 'fee', 'timestamp'];
	return generateTradeHeaders(
		symbol,
		pairs,
		coins,
		discount,
		prices,
		icons
	).filter(({ key }) => KEYS.indexOf(key) > -1);
};

export const generateRecentTradeHeaders = (
	symbol,
	pairs,
	coins,
	discount,
	prices,
	icons,
	isLoading
) => {
	const KEYS = ['pair', 'size', 'side', 'price', 'amount', 'timestamp'];
	return generateTradeHeaders(
		symbol,
		pairs,
		coins,
		discount,
		prices,
		icons,
		isLoading
	)
		.filter(({ key }) => KEYS.indexOf(key) > -1)
		.sort((a, b) => KEYS.indexOf(a.key) - KEYS.indexOf(b.key));
};

const getClassNameByStatus = (
	status = false,
	dismissed = false,
	rejected = false,
	is_new = false
) => {
	if (is_new) {
		return '';
	}
	return status ? 'completed' : dismissed || rejected ? 'rejected' : 'pending';
};
