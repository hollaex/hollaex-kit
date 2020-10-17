import React from 'react';
import STRINGS from '../../config/localizedStrings';

import { NotificationWraper, NotificationContent } from './Notification';
import { Button } from '../';

export const GenerateApiKey = (props) => {
	const { icon, iconId, nextLabel, onBack, onNext, disabledNext, children } = props;

	return (
		<NotificationWraper icon={icon} iconId={iconId} className="new-order-notification">
			<NotificationContent>{children}</NotificationContent>
			<div className="d-flex">
				<Button label={STRINGS["BACK_TEXT"]} onClick={onBack} />
				<div className="separator" />
				<Button label={nextLabel} onClick={onNext} disabled={disabledNext} />
			</div>
		</NotificationWraper>
	);
};

export const CreatedApiKey = (props) => {
	const { icon, onClose, children } = props;

	return (
		<NotificationWraper icon={icon} iconType="svg" className="new-order-notification">
			<NotificationContent>{children}</NotificationContent>
			<div className="d-flex">
				<Button label={STRINGS["CLOSE_TEXT"]} onClick={onClose} />
			</div>
		</NotificationWraper>
	);
};

export default GenerateApiKey;
