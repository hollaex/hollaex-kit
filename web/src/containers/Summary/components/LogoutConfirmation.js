import React from 'react';

import { Button } from '../../../components';
import STRINGS from '../../../config/localizedStrings';

const LogoutConfirmation = ({ onClose, onConfirm, ...rest }) => {
	return (
		<div className="logout-wrapper d-flex justify-content-center align-items-center flex-column">
			<div className="mt-1 mb-2 confirm-text">
				{STRINGS['LOGOUT_CONFIRM_TEXT']}
			</div>
			<div className="d-flex mt-3">
				<Button label={STRINGS['BACK_TEXT']} onClick={onClose} />
				<div className="mx-2" />
				<Button
					label={STRINGS['NOTIFICATIONS.BUTTONS.OKAY']}
					onClick={onConfirm}
				/>
			</div>
		</div>
	);
};

export default LogoutConfirmation;
