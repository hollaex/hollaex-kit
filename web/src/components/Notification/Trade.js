import React from 'react';
import math from 'mathjs';
import { connect } from 'react-redux';
import {
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow,
} from './Notification';
import { formatToCurrency } from '../../utils/currency';

const SIDE_BUY = 'buy';
const SIDE_SELL = 'sell';

export const getTitleAndIcon = (side, type, ICONS) => {
	const data = {
		iconId: '',
		stringId: '',
		icon: '',
		title: '',
		onBack: true,
	};

	if (side === SIDE_BUY) {
		data.iconId = 'TRADE_FILLED_SUCESSFUL';
		data.icon = ICONS['TRADE_FILLED_SUCESSFUL'];
		data.title = STRINGS.formatString(
			STRINGS['ORDER_TITLE_TRADE_COMPLETE'],
			<span className="text-capitalize">
				{STRINGS[`TYPES_VALUES.${type}`]}
			</span>,
			STRINGS[`SIDES_VALUES.${SIDE_BUY}`]
		);
		data.stringId = `ORDER_TITLE_TRADE_COMPLETE,TYPES_VALUES.${type},SIDES_VALUES.${SIDE_BUY}`;
	} else if (side === SIDE_SELL) {
		data.iconId = 'TRADE_FILLED_SUCESSFUL';
		data.icon = ICONS['TRADE_FILLED_SUCESSFUL'];
		data.title = STRINGS.formatString(
			STRINGS['ORDER_TITLE_TRADE_COMPLETE'],
			<span className="text-capitalize">
				{STRINGS[`TYPES_VALUES.${type}`]}
			</span>,
			STRINGS[`SIDES_VALUES.${SIDE_SELL}`]
		);
		data.stringId = `ORDER_TITLE_TRADE_COMPLETE,TYPES_VALUES.${type},SIDES_VALUES.${SIDE_SELL}`;
	}

	return data;
};

const calculateValues = (data = [], pair, coins = {}) => {
	let btcAccumulated = math.fraction(0);
	let baseAccumulated = math.fraction(0);
	const averages = [];
	const baseFormat = coins[pair.pair_base] || DEFAULT_COIN_DATA;
	const secondaryFormat = coins[pair.pair_2] || DEFAULT_COIN_DATA;
	data.forEach(({ size, price, filled, side }) => {
		let calcSize = size;
		if (side === SIDE_BUY) {
			calcSize = filled || size;
		} else if (side === SIDE_SELL) {
			calcSize = filled || size;
		}
		btcAccumulated = math.add(btcAccumulated, math.fraction(calcSize));
		const orderValue = math.multiply(
			math.fraction(price),
			math.fraction(calcSize)
		);
		baseAccumulated = math.add(baseAccumulated, orderValue);
		averages.push(math.number(orderValue));
	});

	return {
		btc: formatToCurrency(btcAccumulated, baseFormat.min),
		base: formatToCurrency(baseAccumulated, secondaryFormat.min),
		average: formatToCurrency(math.median(averages), secondaryFormat.min),
	};
};

export const TradeDisplay = ({ side, data, pairs, coins, ...rest }) => {
	const pair = data[0] ? pairs[data[0].symbol] : { pair_base: '', pair_2: '' };
	const baseValue = coins[pair.pair_base] || DEFAULT_COIN_DATA;
	const payValue = coins[pair.pair_2] || DEFAULT_COIN_DATA;

	const actionText =
		side === 'sell' ? STRINGS['ORDER_SOLD'] : STRINGS['ORDER_BOUGHT'];
	const resultText =
		side === 'sell' ? STRINGS['ORDER_RECEIVED'] : STRINGS['ORDER_SPENT'];
	const { btc, base, average } = calculateValues(data, pair, coins);
	return (
		<NotificationContent>
			<InformationRow
				stringId={side === 'sell' ? 'ORDER_SOLD' : 'ORDER_BOUGHT'}
				label={actionText}
				value={STRINGS.formatString(
					CURRENCY_PRICE_FORMAT,
					btc,
					baseValue.symbol.toUpperCase()
				)}
			/>
			<InformationRow
				stringId="ORDER_AVERAGE_PRICE"
				label={STRINGS['ORDER_AVERAGE_PRICE']}
				value={STRINGS.formatString(
					CURRENCY_PRICE_FORMAT,
					average,
					payValue.symbol.toUpperCase()
				)}
			/>
			<InformationRow
				stringId={side === 'sell' ? 'ORDER_RECEIVED' : 'ORDER_SPENT'}
				label={resultText}
				value={STRINGS.formatString(
					CURRENCY_PRICE_FORMAT,
					base,
					payValue.symbol.toUpperCase()
				)}
			/>
		</NotificationContent>
	);
};

const TradeNotification = ({
	onClose,
	data: { order, data },
	pairs,
	coins,
	icons,
}) => {
	const { side, type } = order;
	const notificationProps = getTitleAndIcon(side, type, icons);

	return (
		<NotificationWraper
			{...notificationProps}
			className="trade-notification"
			compressOnMobile={true}
			onClose={onClose}
		>
			<TradeDisplay side={side} data={data} pairs={pairs} coins={coins} />
		</NotificationWraper>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
});

export default connect(mapStateToProps)(TradeNotification);
