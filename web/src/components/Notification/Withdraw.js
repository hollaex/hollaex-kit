import React from 'react';
import { NotificationWraper, NotificationContent } from './Notification';
import { EXPLORERS_ENDPOINT } from '../../config/constants';
import { Button } from '../';

import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

const WithdrawNotification = ({ data, onClose, icons: ICONS }) => {
	const notificationProps = {
		iconId: 'COIN_WITHDRAW_BTC,COIN_WITHDRAW_BASE',
		icon: ICONS['COIN_WITHDRAW_BTC'] || ICONS['COIN_WITHDRAW_BASE'],
		title: STRINGS['SUCCESS_TEXT'],
		stringId: 'SUCCESS_TEXT',
	};

	return (
		<NotificationWraper
			{...notificationProps}
			className="notification-withdrawal text-center"
		>
			<NotificationContent>
				{data.transaction_id && (
					<div>
						<span>
							<EditWrapper stringId="WITHDRAW_NOTIFICATION_TRANSACTION_ID">
								{STRINGS['WITHDRAW_NOTIFICATION_TRANSACTION_ID']}
							</EditWrapper>
						</span>
						<div className="notification-link-wrapper">
							<a
								href={EXPLORERS_ENDPOINT(data.currency) + data.transaction_id}
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
			<Button label={STRINGS['CLOSE_TEXT']} onClick={onClose} />
		</NotificationWraper>
	);
};

export default WithdrawNotification;
