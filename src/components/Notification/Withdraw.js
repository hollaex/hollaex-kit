import React from 'react';
import { NotificationWraper, NotificationContent } from './Notification';
import {
	ICONS,
	BLOCKTRAIL_ENDPOINT,
	ETHEREUM_ENDPOINT
} from '../../config/constants';
import { Button } from '../';

import STRINGS from '../../config/localizedStrings';

const getTransactionEndpoint = (currency, transaction_id) => {
	switch (currency) {
		case 'btc':
			return `${BLOCKTRAIL_ENDPOINT}${transaction_id}`;
		case 'eth':
			return `${ETHEREUM_ENDPOINT}${transaction_id}`;
		default:
			return transaction_id;
	}
};
const WithdrawNotification = ({ data, onClose }) => {
	const notificationProps = {
		icon:
			ICONS[`COIN_WITHDRAW_BTC`] ||
			ICONS.COIN_WITHDRAW_FIAT,
		title: STRINGS.SUCCESS_TEXT
	};

	return (
		<NotificationWraper
			{...notificationProps}
			className="notification-withdrawal text-center"
		>
			<NotificationContent>
				{data.transaction_id && (
					<div>
						<span>{STRINGS.WITHDRAW_NOTIFICATION_TRANSACTION_ID}</span>
						<div className="notification-link-wrapper">
							<a
								href={getTransactionEndpoint(
									data.currency,
									data.transaction_id
								)}
								target="_blank"
								className="notification-link"
							>
								{data.transaction_id}
							</a>
						</div>
					</div>
				)}
			</NotificationContent>
			<Button label={STRINGS.CLOSE_TEXT} onClick={onClose} />
		</NotificationWraper>
	);
};

export default WithdrawNotification;
