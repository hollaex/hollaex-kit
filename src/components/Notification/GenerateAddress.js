import React from 'react';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { NotificationWraper, NotificationContent } from './Notification';
import { Button, Loader } from '../';

const GenerateAddressNotification = ({
	type,
	data,
	currency,
	onBack,
	onGenerate
}) => {
	const { fetching, error } = data;
	const title = STRINGS.formatString(
		STRINGS.WALLET_ADDRESS_TITLE,
		STRINGS[`${currency.toUpperCase()}_NAME`]
	);
	if (fetching) {
		return (
			<NotificationWraper className="new-order-notification">
				<Loader relative={true} background={false} />
			</NotificationWraper>
		);
	}
	return (
		<NotificationWraper
			title={title}
			icon={ICONS.SIDEBAR_WALLET_ACTIVE}
			className="new-order-notification"
			titleClassName="with-border-bottom"
		>
			<NotificationContent>
				{!error ? (
					<div className="notification-content-header">
						{STRINGS.WALLET_ADDRESS_MESSAGE}
					</div>
				) : (
					<div className="notification-content-header warning_text">
						{STRINGS.WALLET_ADDRESS_ERROR}
					</div>
				)}
			</NotificationContent>
			<div className="d-flex mt-4">
				<Button label={STRINGS.BACK_TEXT} onClick={onBack} />
				<div className="separator" />
				<Button
					label={STRINGS.WALLET_ADDRESS_GENERATE}
					onClick={onGenerate}
					disabled={!!error}
				/>
			</div>
		</NotificationWraper>
	);
};

export default GenerateAddressNotification;
