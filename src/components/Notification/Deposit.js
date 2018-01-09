import React from 'react';
import classnames from 'classnames';
import { CurrencyBallWithPrice, ActionNotification, Button } from '../';
import { ICONS } from '../../config/constants';

import { getDepositTexts } from './constants';
import Header from './Header';
import { fiatSymbol } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

const DepositNotification = ({ data, onClose, goToPage, openContactForm }) => {
	const depositTexts = getDepositTexts(data.currency, data.status);

	const headerProps = {
		text: depositTexts.title,
		icon:
			data.currency === fiatSymbol
				? ICONS.DEPOSIT_FIAT_COMPLETE
				: ICONS.DEPOSIT_RECEIVED_BITCOIN
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
					text={STRINGS.NEED_HELP_TEXT}
					status="information"
					iconPath={ICONS.BLUE_QUESTION}
					onClick={onClick}
				/>
			</div>
			{
				<div
					className={classnames({
						'notification-information': !!depositTexts.information
					})}
				>
					{depositTexts.information && depositTexts.information.join('\n')}
				</div>
			}
			<div className="notification-content-block_amount d-flex justify-content-center">
				<CurrencyBallWithPrice
					symbol={data.currency}
					amount={data.amount}
					price={data.price || 1}
				/>
			</div>
			<div className="notification-buttons-wrapper d-flex">
				<Button label={STRINGS.NOTIFICATIONS.BUTTONS.OKAY} onClick={onClose} />
				<div className="separator" />
				<Button
					className={classnames(`button-${data.currency}`)}
					label={
						data.currency === fiatSymbol
							? STRINGS.NOTIFICATIONS.BUTTONS.START_TRADING
							: STRINGS.NOTIFICATIONS.BUTTONS.SEE_HISTORY
					}
					onClick={() => {
						goToPage(data.currency === fiatSymbol ? 'trade' : 'transactions');
						onClose();
					}}
				/>
			</div>
		</div>
	);
};

export default DepositNotification;
