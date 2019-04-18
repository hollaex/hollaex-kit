import React from 'react';
import math from 'mathjs';
import { connect } from 'react-redux';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { formatBtcAmount, formatFiatAmount } from '../../utils/currency';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow
} from './Notification';

const SIDE_BUY = 'buy';

const getTitleAndIcon = (type, { side, filled }) => {
	const data = {
		icon: '',
		title: ''
	};

	if (type === 'order_added') {
		if (filled === 0) {
			data.icon =
				side === SIDE_BUY
					? ICONS.NOTIFICATION_ORDER_LIMIT_BUY_CREATED
					: ICONS.NOTIFICATION_ORDER_LIMIT_SELL_CREATED;
			data.title = STRINGS.formatString(
				STRINGS.ORDER_TITLE_CREATED,
				STRINGS.SIDES_VALUES[side]
			);
		} else {
			data.icon =
				side === SIDE_BUY
					? ICONS.TRADE_PARTIALLY_FILLED
					: ICONS.TRADE_PARTIALLY_FILLED;
			data.title = STRINGS.formatString(
				STRINGS.ORDER_TITLE_PARTIALLY_FILLED,
				<span className="text-capitalize">{STRINGS.SIDES_VALUES[side]}</span>
			);
		}
	} else if (type === 'order_filled') {
		data.icon =
			side === SIDE_BUY
				? ICONS.NOTIFICATION_ORDER_LIMIT_SELL_FILLED
				: ICONS.NOTIFICATION_ORDER_LIMIT_SELL_CREATED;
		data.title = STRINGS.formatString(
			STRINGS.ORDER_TITLE_FULLY_FILLED,
			<span className="text-capitalize">{STRINGS.SIDES_VALUES[side]}</span>
		);
	}

	return data;
};

const generateRows = (type, order, pairs) => {
	const rows = [];
	const pair = pairs[order.symbol];
	const basePair = pair.pair_base.toUpperCase();
	const payPair = pair.pair_2.toUpperCase();

	if (type === 'order_added' && order.filled === 0) {
		rows.push({
			label: STRINGS.SIZE,
			value: STRINGS.formatString(
				STRINGS[`${basePair}_PRICE_FORMAT`],
				formatBtcAmount(order.size),
				STRINGS[`${basePair}_SHORTNAME`]
			)
		});
		rows.push({
			label: STRINGS.PRICE,
			value: STRINGS.formatString(
				STRINGS[`${payPair}_PRICE_FORMAT`],
				formatFiatAmount(order.price),
				STRINGS[`${payPair}_SHORTNAME`]
			)
		});
	} else {
		const size = math.fraction(order.size);
		const filled = math.fraction(order.filled);
		const orderValue = math.multiply(filled, math.fraction(order.price));
		const remaining = math.subtract(size, filled);

		rows.push({
			label:
				order.side === SIDE_BUY ? STRINGS.ORDER_BOUGHT : STRINGS.ORDER_SOLD,
			value: STRINGS.formatString(
				STRINGS[`${basePair}_PRICE_FORMAT`],
				formatBtcAmount(order.filled),
				STRINGS[`${basePair}_SHORTNAME`]
			)
		});
		rows.push({
			label: STRINGS.PRICE,
			value: STRINGS.formatString(
				STRINGS[`${payPair}_PRICE_FORMAT`],
				formatFiatAmount(order.price),
				STRINGS[`${payPair}_SHORTNAME`]
			)
		});
		rows.push({
			label:
				order.side === SIDE_BUY ? STRINGS.ORDER_SPENT : STRINGS.ORDER_RECEIVED,
			value: STRINGS.formatString(
				STRINGS[`${payPair}_PRICE_FORMAT`],
				formatFiatAmount(orderValue),
				STRINGS[`${payPair}_SHORTNAME`]
			)
		});

		if (type === 'order_added') {
			rows.push({
				label: STRINGS.REMAINING,
				value: STRINGS.formatString(
					STRINGS.BTC_PRICE_FORMAT,
					formatBtcAmount(remaining),
					STRINGS.BTC_SHORTNAME
				)
			});
		}
	}

	return rows;
};

const OrderDisplay = ({ rows }) => {
	return (
		<NotificationContent>
			{rows.map((row, index) => <InformationRow {...row} key={index} />)}
		</NotificationContent>
	);
};

const OrderNotification = ({ type, data, pairs }) => {
	const notificationProps = getTitleAndIcon(type, data);
	const rows = generateRows(type, data, pairs);

	return (
		<NotificationWraper
			{...notificationProps}
			className="order-notification"
			compressOnMobile={true}
		>
			<OrderDisplay rows={rows} />
			{/*<Button label="Go back to trade" />*/}
		</NotificationWraper>
	);
};

const mapStateToProps = state => ({
	pairs: state.app.pairs
});

export default connect(mapStateToProps)(OrderNotification);
