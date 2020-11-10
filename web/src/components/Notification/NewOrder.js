import React from 'react';
import EventListener from 'react-event-listener';
import { connect } from 'react-redux';
import { CURRENCY_PRICE_FORMAT, DEFAULT_COIN_DATA } from 'config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow,
} from './Notification';
import { Button } from '../';
import { formatToCurrency } from '../../utils/currency';

const generateRows = ({ order, pairData }, coins) => {
	const { type, side, price, size } = order;
	const secondaryFormat = coins[pairData.pair_2] || DEFAULT_COIN_DATA;
	const baseFormat = coins[pairData.pair_base] || DEFAULT_COIN_DATA;
	const rows = [];

	rows.push({
		stringId: `TYPE,CHECK_ORDER_TYPE,TYPES_VALUES.${type},SIDES_VALUES.${side}`,
		label: STRINGS['TYPE'],
		value: (
			<div className="text-capitalize">
				{STRINGS.formatString(
					STRINGS['CHECK_ORDER_TYPE'],
					STRINGS[`TYPES_VALUES.${type}`],
					STRINGS[`SIDES_VALUES.${side}`]
				)}
			</div>
		),
	});

	rows.push({
		stringId: 'SIZE',
		label: STRINGS['SIZE'],
		value: STRINGS.formatString(
			CURRENCY_PRICE_FORMAT,
			formatToCurrency(size, pairData.increment_size),
			baseFormat.symbol.toUpperCase()
		),
	});

	if (type === 'limit') {
		rows.push({
			stringId: 'PRICE',
			label: STRINGS['PRICE'],
			value: STRINGS.formatString(
				CURRENCY_PRICE_FORMAT,
				formatToCurrency(price, pairData.increment_price),
				secondaryFormat.symbol.toUpperCase()
			),
		});
	}

	return rows;
};

const OrderDisplay = ({ rows }) => {
	return (
		<NotificationContent>
			{rows.map((row, index) => (
				<InformationRow {...row} key={index} />
			))}
		</NotificationContent>
	);
};

const NewOrderNotification = ({
	type,
	data,
	coins,
	onBack,
	onConfirm,
	icons: ICONS,
}) => {
	const rows = generateRows(data, coins);
	const onConfirmClick = () => {
		onConfirm();
		onBack();
	};

	const onKeydown = ({ key }) => {
		if (key === 'Enter') {
			onConfirmClick();
		}
	};

	return (
		<NotificationWraper
			stringId="CHECK_ORDER"
			title={STRINGS['CHECK_ORDER']}
			iconId="CHECK_ORDER"
			icon={ICONS['CHECK_ORDER']}
			className="new-order-notification"
		>
			<EventListener target="document" onKeydown={onKeydown} />
			<OrderDisplay rows={rows} />
			<div className="d-flex">
				<Button label={STRINGS['BACK_TEXT']} onClick={onBack} />
				<div className="separator" />
				<Button label={STRINGS['CONFIRM_TEXT']} onClick={onConfirmClick} />
			</div>
		</NotificationWraper>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(NewOrderNotification);
