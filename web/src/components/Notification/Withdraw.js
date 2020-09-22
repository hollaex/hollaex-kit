import React from 'react';
import { NotificationWraper, NotificationContent } from './Notification';
import { ICONS, EXPLORERS_ENDPOINT } from '../../config/constants';
import { Button } from '../';

import STRINGS from '../../config/localizedStrings';

const WithdrawNotification = ({ data, onClose }) => {
	const notificationProps = {
		icon: ICONS[`COIN_WITHDRAW_BTC`] || ICONS.COIN_WITHDRAW_BASE,
		title: STRINGS["SUCCESS_TEXT"]
	};

	return (
		<NotificationWraper
			{...notificationProps}
			className="notification-withdrawal text-center"
		>
			<NotificationContent>
				{data.transaction_id && (
					<div>
						<span>{STRINGS["WITHDRAW_NOTIFICATION_TRANSACTION_ID"]}</span>
						<div className="notification-link-wrapper">
							<a
								href={
									EXPLORERS_ENDPOINT(data.currency) +
									data.transaction_id
								}
								target="_blank"
								rel="noopener noreferrer"
								className="notification-link"
							>
								{data.transaction_id}
							</a>
						</div>
					</div>
				)}
			</NotificationContent>
			<Button label={STRINGS["CLOSE_TEXT"]} onClick={onClose} />
		</NotificationWraper>
	);
};

export default WithdrawNotification;
