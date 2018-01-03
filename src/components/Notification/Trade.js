import React from 'react';
import math from 'mathjs';
import { Button, ActionNotification } from '../';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { formatBtcAmount, formatFiatAmount } from '../../utils/currency';
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

const calculateValues = (data = []) => {
	let btcAccumulated = math.fraction(0);
	let fiatAccumulated = math.fraction(0);
	let averageAccumulated = math.fraction(0);
	const averages = [];
	data.forEach(({ size, price }) => {
		btcAccumulated = math.add(btcAccumulated, math.fraction(size));
		const orderValue = math.multiply(math.fraction(price), math.fraction(size));
		fiatAccumulated = math.add(fiatAccumulated, orderValue);
		averages.push(math.number(orderValue));
	});

	return {
		btc: formatBtcAmount(btcAccumulated),
		fiat: formatFiatAmount(fiatAccumulated),
		average: formatFiatAmount(math.median(averages))
	};
};

const TradeDisplay = ({ side, data }) => {
	const actionText =
		side === 'sell' ? STRINGS.ORDER_SOLD : STRINGS.ORDER_BOUGHT;
	const resultText =
		side === 'sell' ? STRINGS.ORDER_RECEIVED : STRINGS.ORDER_SPENT;
	const { btc, fiat, average } = calculateValues(data);
	return (
		<NotificationContent>
			<InformationRow
				label={actionText}
				value={STRINGS.formatString(
					STRINGS.BTC_PRICE_FORMAT,
					btc,
					STRINGS.BTC_SHORTNAME
				)}
			/>
			<InformationRow
				label={STRINGS.ORDER_AVERAGE_PRICE}
				value={STRINGS.formatString(
					STRINGS.FIAT_PRICE_FORMAT,
					average,
					STRINGS.FIAT_SHORTNAME
				)}
			/>
			<InformationRow
				label={resultText}
				value={STRINGS.formatString(
					STRINGS.FIAT_PRICE_FORMAT,
					fiat,
					STRINGS.FIAT_SHORTNAME
				)}
			/>
		</NotificationContent>
	);
};

const TradeNotification = ({ data: { order, data } }) => {
	const { side, type } = order;
	const notificationProps = getTitleAndIcon(side, type);

	return (
		<NotificationWraper {...notificationProps}>
			<TradeDisplay side={side} data={data} />
			{/*<Button label="Go back to trade" />*/}
		</NotificationWraper>
	);
};

export default TradeNotification;
