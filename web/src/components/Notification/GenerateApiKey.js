import React from 'react';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

import { NotificationWraper, NotificationContent } from './Notification';
import { Button } from '../';

export const GenerateApiKey = (props) => {
	const {
		icon,
		iconId,
		nextLabel,
		onBack,
		onNext,
		disabledNext,
		children,
		stringId_nextLabel,
	} = props;

	return (
		<NotificationWraper
			icon={icon}
			iconId={iconId}
			className="new-order-notification"
		>
			<NotificationContent>{children}</NotificationContent>
			<div className="d-flex">
				<div className="w-50">
					<EditWrapper stringId="BACK_TEXT" />
					<Button label={STRINGS['BACK_TEXT']} onClick={onBack} />
				</div>
				<div className="separator" />
				<div className="w-50">
					<EditWrapper stringId={stringId_nextLabel} />
					<Button label={nextLabel} onClick={onNext} disabled={disabledNext} />
				</div>
			</div>
		</NotificationWraper>
	);
};

export const CreatedApiKey = (props) => {
	const { icon, onClose, children, iconId } = props;

	return (
		<NotificationWraper
			icon={icon}
			iconId={iconId}
			iconType="svg"
			className="new-order-notification"
		>
			<NotificationContent>{children}</NotificationContent>
			<EditWrapper stringId="CLOSE_TEXT" />
			<div className="d-flex">
				<Button label={STRINGS['CLOSE_TEXT']} onClick={onClose} />
			</div>
		</NotificationWraper>
	);
};

export default GenerateApiKey;
