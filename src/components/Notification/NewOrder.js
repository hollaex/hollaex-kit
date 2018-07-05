import React from 'react';
import EventListener from 'react-event-listener';
import { ICONS, CURRENCIES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow
} from './Notification';
import { Button } from '../';

const generateRows = ({ order, pairData }) => {
	const { type, side, price, size, orderFees, orderPrice } = order;
	const secondaryCurrency = pairData.pair_2.toUpperCase();
	const secondaryFormat = CURRENCIES[pairData.pair_2].formatToCurrency;
	const baseCurrency = pairData.pair_base.toUpperCase();
	const baseFormat = CURRENCIES[pairData.pair_base].formatToCurrency;
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
			STRINGS[`${baseCurrency}_PRICE_FORMAT`],
			baseFormat(size),
			STRINGS[`${baseCurrency}_CURRENCY_SYMBOL`]
		)
	});

	if (type === 'limit') {
		rows.push({
			label: STRINGS.PRICE,
			value: STRINGS.formatString(
				STRINGS[`${baseCurrency}_PRICE_FORMAT`],
				secondaryFormat(price),
				STRINGS[`${secondaryCurrency}_CURRENCY_SYMBOL`]
			)
		});
	}

	rows.push({
		label: STRINGS.FEE,
		value: STRINGS.formatString(
			STRINGS[`${baseCurrency}_PRICE_FORMAT`],
			secondaryFormat(orderFees),
			STRINGS[`${secondaryCurrency}_CURRENCY_SYMBOL`]
		)
	});

	rows.push({
		label: STRINGS.TOTAL_ORDER,
		value: STRINGS.formatString(
			STRINGS[`${baseCurrency}_PRICE_FORMAT`],
			secondaryFormat(orderPrice),
			STRINGS[`${secondaryCurrency}_CURRENCY_SYMBOL`]
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
