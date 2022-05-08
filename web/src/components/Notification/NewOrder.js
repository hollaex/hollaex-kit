import React from 'react';
import EventListener from 'react-event-listener';
import { CURRENCY_PRICE_FORMAT } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import {
	NotificationWraper,
	NotificationContent,
	InformationRow,
} from './Notification';
import { Button } from '../';
import { formatToCurrency } from 'utils/currency';

const generateRows = ({ order, pairData }) => {
	const { type, side, price, size } = order;
	const { pair_base_display, pair_2_display } = pairData;
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
			pair_base_display
		),
	});

	if (type === 'limit') {
		rows.push({
			stringId: 'PRICE',
			label: STRINGS['PRICE'],
			value: STRINGS.formatString(
				CURRENCY_PRICE_FORMAT,
				formatToCurrency(price, pairData.increment_price),
				pair_2_display
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
	onBack,
	onConfirm,
	icons: ICONS,
}) => {
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

export default NewOrderNotification;
