import React from 'react';
import math from 'mathjs';
import { connect } from 'react-redux';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { formatBtcAmount, formatToCurrency } from '../../utils/currency';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow,
} from './Notification';

const SIDE_BUY = 'buy';

export const getTitleAndIcon = (type, { side, filled }, ICONS = {}) => {
	const data = {
		iconId: '',
		stringId: '',
		icon: '',
		title: '',
		onBack: true,
	};

	if (type === 'order_added') {
		if (filled === 0) {
			data.iconId = SIDE_BUY
				? 'TRADE_FILLED_SUCESSFUL'
				: 'TRADE_FILLED_SUCESSFUL';
			data.icon =
				side === SIDE_BUY
					? ICONS['TRADE_FILLED_SUCESSFUL']
					: ICONS['TRADE_FILLED_SUCESSFUL'];
			data.title = STRINGS.formatString(
				STRINGS['ORDER_TITLE_CREATED'],
				STRINGS[`SIDES_VALUES.${side}`]
			);
			data.stringId = `ORDER_TITLE_CREATED,SIDES_VALUES.${side}`;
		} else {
			data.iconId =
				side === SIDE_BUY ? 'TRADE_PARTIALLY_FILLED' : 'TRADE_PARTIALLY_FILLED';
			data.icon =
				side === SIDE_BUY
					? ICONS['TRADE_PARTIALLY_FILLED']
					: ICONS['TRADE_PARTIALLY_FILLED'];
			data.title = STRINGS.formatString(
				STRINGS['ORDER_TITLE_PARTIALLY_FILLED'],
				<span className="text-capitalize">
					{STRINGS[`SIDES_VALUES.${side}`]}
				</span>
			);
			data.stringId = `ORDER_TITLE_PARTIALLY_FILLED,SIDES_VALUES.${side}`;
		}
	} else if (type === 'filled' || type === 'pfilled') {
		data.iconId =
			side === SIDE_BUY ? 'TRADE_FILLED_SUCESSFUL' : 'TRADE_FILLED_SUCESSFUL';
		data.icon =
			side === SIDE_BUY
				? ICONS['TRADE_FILLED_SUCESSFUL']
				: ICONS['TRADE_FILLED_SUCESSFUL'];
		data.title = STRINGS.formatString(
			STRINGS['ORDER_TITLE_FULLY_FILLED'],
			<span className="text-capitalize">{STRINGS[`SIDES_VALUES.${side}`]}</span>
		);
		data.stringId = `ORDER_TITLE_FULLY_FILLED,SIDES_VALUES.${side}`;
	}

	return data;
};

export const generateRows = (type, order, pairs, coins) => {
	const rows = [];
	const pair = pairs[order.symbol] || {};
	const { min } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const baseValue = coins[pair.pair_base] || DEFAULT_COIN_DATA;
	const payValue = coins[pair.pair_2] || DEFAULT_COIN_DATA;
	const btcValue = coins['btc'] || DEFAULT_COIN_DATA;

	if (type === 'order_added' && order.filled === 0) {
		rows.push({
			stringId: 'SIZE',
			label: STRINGS['SIZE'],
			value: STRINGS.formatString(
				CURRENCY_PRICE_FORMAT,
				formatBtcAmount(order.size),
				baseValue.symbol.toUpperCase()
			),
		});
		rows.push({
			stringId: 'PRICE',
			label: STRINGS['PRICE'],
			value: STRINGS.formatString(
				CURRENCY_PRICE_FORMAT,
				formatToCurrency(order.price, min),
				payValue.symbol.toUpperCase()
			),
		});
	} else {
		const size = math.fraction(order.size);
		const filled = math.fraction(order.filled);
		const orderValue = math.multiply(filled, math.fraction(order.price));
		const remaining = math.subtract(size, filled);

		rows.push({
			stringId: order.side === SIDE_BUY ? 'ORDER_BOUGHT' : 'ORDER_SOLD',
			label:
				order.side === SIDE_BUY
					? STRINGS['ORDER_BOUGHT']
					: STRINGS['ORDER_SOLD'],
			value: STRINGS.formatString(
				CURRENCY_PRICE_FORMAT,
				formatBtcAmount(order.filled),
				baseValue.symbol.toUpperCase()
			),
		});
		rows.push({
			stringId: 'PRICE',
			label: STRINGS['PRICE'],
			value: STRINGS.formatString(
				CURRENCY_PRICE_FORMAT,
				formatToCurrency(order.price, min),
				payValue.symbol.toUpperCase()
			),
		});
		rows.push({
			stringId: order.side === SIDE_BUY ? 'ORDER_SPENT' : 'ORDER_RECEIVED',
			label:
				order.side === SIDE_BUY
					? STRINGS['ORDER_SPENT']
					: STRINGS['ORDER_RECEIVED'],
			value: STRINGS.formatString(
				CURRENCY_PRICE_FORMAT,
				formatToCurrency(orderValue, min),
				payValue.symbol.toUpperCase()
			),
		});

		if (type === 'order_added') {
			rows.push({
				stringId: 'REMAINING',
				label: STRINGS['REMAINING'],
				value: STRINGS.formatString(
					CURRENCY_PRICE_FORMAT,
					formatBtcAmount(remaining),
					btcValue.symbol.toUpperCase()
				),
			});
		}
	}

	return rows;
};

export const OrderDisplay = ({ rows }) => {
	return (
		<NotificationContent>
			{rows.map((row, index) => (
				<InformationRow {...row} key={index} />
			))}
		</NotificationContent>
	);
};

const OrderNotification = ({ type, data, pairs, coins, onClose, icons }) => {
	const notificationProps = getTitleAndIcon(type, data, icons);
	const rows = generateRows(type, data, pairs, coins);

	return (
		<NotificationWraper
			{...notificationProps}
			onClose={onClose}
			className="order-notification"
			compressOnMobile={true}
		>
			<OrderDisplay rows={rows} />
			{/*<Button label="Go back to trade" />*/}
		</NotificationWraper>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
});

export default connect(mapStateToProps)(OrderNotification);
