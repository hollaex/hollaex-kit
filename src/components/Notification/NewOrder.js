import React from 'react';
import EventListener from 'react-event-listener';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	formatBtcAmount,
	// formatBtcFullAmount,
	formatFiatAmount
} from '../../utils/currency';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow
} from './Notification';
import { Button } from '../';

const generateRows = ({ order }) => {
	const { type, side, price, size, orderFees, orderPrice } = order;
	const rows = [];
	rows.push({
		label: STRINGS.TYPE,
		value: (
			<div className="text-capitalize">
				{STRINGS.formatString(
					STRINGS.CHECK_ORDER_TYPE,
					STRINGS.TYPES_VALUES[type],
					STRINGS.SIDES_VALUES[side]
				)}
			</div>
		)
	});

	rows.push({
		label: STRINGS.SIZE,
		value: STRINGS.formatString(
			STRINGS.BTC_PRICE_FORMAT,
			formatBtcAmount(size),
			STRINGS.BTC_CURRENCY_SYMBOL
		)
	});

	if (type === 'limit') {
		rows.push({
			label: STRINGS.PRICE,
			value: STRINGS.formatString(
				STRINGS.BTC_PRICE_FORMAT,
				formatFiatAmount(price),
				STRINGS.FIAT_CURRENCY_SYMBOL
			)
		});
	}

	rows.push({
		label: STRINGS.FEE,
		value: STRINGS.formatString(
			STRINGS.BTC_PRICE_FORMAT,
			formatFiatAmount(orderFees),
			STRINGS.BTC_CURRENCY_SYMBOL
		)
	});

	rows.push({
		label: STRINGS.TOTAL_ORDER,
		value: STRINGS.formatString(
			STRINGS.BTC_PRICE_FORMAT,
			formatFiatAmount(orderPrice),
			STRINGS.FIAT_CURRENCY_SYMBOL
		)
	});

	return rows;
};

const OrderDisplay = ({ rows }) => {
	return (
		<NotificationContent>
			{rows.map((row, index) => <InformationRow {...row} key={index} />)}
		</NotificationContent>
	);
};

const NewOrderNotification = ({ type, data, onBack, onConfirm }) => {
	const rows = generateRows(data);
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
			title={STRINGS.CHECK_ORDER}
			icon={ICONS.CHECK_ORDER}
			className="new-order-notification"
		>
			<EventListener target="document" onKeydown={onKeydown} />
			<OrderDisplay rows={rows} />
			<div className="d-flex">
				<Button label={STRINGS.BACK_TEXT} onClick={onBack} />
				<div className="separator" />
				<Button label={STRINGS.CONFIRM_TEXT} onClick={onConfirmClick} />
			</div>
		</NotificationWraper>
	);
};

export default NewOrderNotification;
