import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { CurrencyBallWithPrice, ActionNotification, Button } from 'components';

import { getDepositTexts } from './constants';
import Header from './Header';
import { BASE_CURRENCY } from 'config/constants';
import STRINGS from 'config/localizedStrings';

const DepositNotification = ({
	data,
	onClose,
	openContactForm,
	icons: ICONS,
	coins,
}) => {
	const depositTexts = getDepositTexts(data.currency, coins, data.status);

	const headerProps = {
		text: depositTexts.title,
		iconId:
			data.currency === BASE_CURRENCY
				? data.status
					? 'DEPOSIT_BASE_COIN_COMPLETE'
					: 'INCOMING_COIN'
				: data.status
				? 'DEPOSIT_RECEIVED_BITCOIN'
				: 'INCOMING_BTC',
		icon:
			data.currency === BASE_CURRENCY
				? data.status
					? ICONS['DEPOSIT_BASE_COIN_COMPLETE']
					: ICONS['INCOMING_COIN']
				: data.status
				? ICONS['DEPOSIT_RECEIVED_BITCOIN']
				: ICONS['INCOMING_BTC'],
	};
	const onClick = () => {
		onClose();
		openContactForm();
	};
	return (
		<div className="notification-content-wrapper">
			<Header {...headerProps} />
			<div className="notification-content-header">
				{depositTexts.subtitle}
				<ActionNotification
					showActionText={false}
					text=""
					status="information"
					iconId="BLUE_QUESTION"
					iconPath={ICONS['BLUE_QUESTION']}
					onClick={onClick}
				/>
			</div>
			{depositTexts.information.length > 0 && (
				<div
					className={classnames({
						'notification-information': !!depositTexts.information,
					})}
				>
					{depositTexts.information.join('\n')}
				</div>
			)}
			<div className="notification-content-block_amount d-flex justify-content-center">
				<CurrencyBallWithPrice symbol={data.currency} amount={data.amount} />
			</div>
			<div className="notification-buttons-wrapper d-flex">
				<Button
					label={STRINGS['NOTIFICATIONS.BUTTONS.OKAY']}
					onClick={onClose}
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	coins: store.app.coins,
});

export default connect(mapStateToProps)(DepositNotification);
