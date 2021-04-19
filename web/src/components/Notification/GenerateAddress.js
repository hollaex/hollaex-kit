import React from 'react';
import { DEFAULT_COIN_DATA } from 'config/constants';
import STRINGS from '../../config/localizedStrings';
import { NotificationWraper, NotificationContent } from './Notification';
import { Button, Loader } from '../';
import { EditWrapper } from 'components';
import Image from 'components/Image';

const GenerateAddressNotification = ({
	type,
	data,
	coins,
	currency,
	onBack,
	onGenerate,
	icons: ICONS,
}) => {
	const { fetching, error } = data;
	const { fullname } = coins[currency] || DEFAULT_COIN_DATA;
	const title = STRINGS.formatString(STRINGS['WALLET_ADDRESS_TITLE'], fullname);
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
			stringId="WALLET_ADDRESS_TITLE"
			iconId="SIDEBAR_WALLET_ACTIVE"
			icon={ICONS['SIDEBAR_WALLET_ACTIVE']}
			className="new-order-notification"
			titleClassName="with-border-bottom"
		>
			<NotificationContent>
				{!error ? (
					<div className="notification-content-header d-flex align-items-center">
						<Image
							iconId={`${currency.toUpperCase()}_ICON`}
							icon={ICONS[`${currency.toUpperCase()}_ICON`]}
							wrapperClassName="form_currency-ball mr-3"
						/>
						<EditWrapper stringId="WALLET_ADDRESS_MESSAGE">
							{STRINGS['WALLET_ADDRESS_MESSAGE']}
						</EditWrapper>
					</div>
				) : (
					<div className="notification-content-header warning_text">
						<EditWrapper stringId="WALLET_ADDRESS_ERROR">
							{STRINGS['WALLET_ADDRESS_ERROR']}
						</EditWrapper>
					</div>
				)}
			</NotificationContent>
			<div className="d-flex mt-4">
				<Button label={STRINGS['BACK_TEXT']} onClick={onBack} />
				<div className="separator" />
				<Button
					label={STRINGS['WALLET_ADDRESS_GENERATE']}
					onClick={onGenerate}
					disabled={!!error}
				/>
			</div>
		</NotificationWraper>
	);
};

export default GenerateAddressNotification;
