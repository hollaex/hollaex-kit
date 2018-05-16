import React from 'react';
import math from 'mathjs';
import { ICONS, PAIRS, CURRENCIES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow
} from './Notification';

const SIDE_BUY = 'buy';
const SIDE_SELL = 'sell';

const getTitleAndIcon = (side, type) => {
	const data = {
		icon: '',
		title: ''
	};

	if (side === SIDE_BUY) {
		data.icon = ICONS.NOTIFICATION_ORDER_MARKET_BUY_FILLED;
		data.title = STRINGS.formatString(
			STRINGS.ORDER_TITLE_TRADE_COMPLETE,
			<span className="text-capitalize">{STRINGS.TYPES_VALUES[type]}</span>,
			STRINGS.SIDES_VALUES[SIDE_BUY]
		);
	} else if (side === SIDE_SELL) {
		data.icon = ICONS.NOTIFICATION_ORDER_MARKET_SELL_FILLED;
		data.title = STRINGS.formatString(
			STRINGS.ORDER_TITLE_TRADE_COMPLETE,
			<span className="text-capitalize">{STRINGS.TYPES_VALUES[type]}</span>,
			STRINGS.SIDES_VALUES[SIDE_SELL]
		);
	}

	return data;
};

const calculateValues = (data = [], pair) => {
	let baseAccumulated = math.fraction(0);
	let fiatAccumulated = math.fraction(0);
	const averages = [];
	data.forEach(({ size, price }) => {
		baseAccumulated = math.add(baseAccumulated, math.fraction(size));
		const orderValue = math.multiply(math.fraction(price), math.fraction(size));
		fiatAccumulated = math.add(fiatAccumulated, orderValue);
		averages.push(math.number(orderValue));
	});

	return {
		btc: CURRENCIES[pair.pair_base].formatToCurrency(baseAccumulated),
		fiat: CURRENCIES[pair.pair_2].formatToCurrency(fiatAccumulated),
		average: CURRENCIES[pair.pair_2].formatToCurrency(math.median(averages))
	};
};

const TradeDisplay = ({ side, data, ...rest }) => {
	const pair = PAIRS[data[0].symbol];
	const basePair = pair.pair_base.toUpperCase();
	const payPair = pair.pair_2.toUpperCase();

	const actionText =
		side === 'sell' ? STRINGS.ORDER_SOLD : STRINGS.ORDER_BOUGHT;
	const resultText =
		side === 'sell' ? STRINGS.ORDER_RECEIVED : STRINGS.ORDER_SPENT;
	const { btc, fiat, average } = calculateValues(data, pair);
	return (
		<NotificationContent>
			<InformationRow
				label={actionText}
				value={STRINGS.formatString(
					STRINGS[`${basePair}_PRICE_FORMAT`],
					btc,
					STRINGS[`${basePair}_SHORTNAME`]
				)}
			/>
			<InformationRow
				label={STRINGS.ORDER_AVERAGE_PRICE}
				value={STRINGS.formatString(
					STRINGS[`${payPair}_PRICE_FORMAT`],
					average,
					STRINGS[`${payPair}_SHORTNAME`]
				)}
			/>
			<InformationRow
				label={resultText}
				value={STRINGS.formatString(
					STRINGS[`${payPair}_PRICE_FORMAT`],
					fiat,
					STRINGS[`${payPair}_SHORTNAME`]
				)}
			/>
		</NotificationContent>
	);
};

const TradeNotification = ({ data: { order, data } }) => {
	const { side, type } = order;
	const notificationProps = getTitleAndIcon(side, type);

	return (
		<NotificationWraper {...notificationProps} className="trade-notification">
			<TradeDisplay side={side} data={data} />
		</NotificationWraper>
	);
};

export default TradeNotification;
