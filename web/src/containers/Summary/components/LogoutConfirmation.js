import React from 'react';

import STRINGS from '../../../config/localizedStrings';
import icons from 'config/icons/dark';
import { Button, EditWrapper, Image } from '../../../components';

const LogoutConfirmation = ({ onClose, onConfirm, ...rest }) => {
	return (
		<div className="signout-confirmation-popup-description">
			<div className="signout-confirmation-content">
				<Image icon={icons['TAB_SIGNOUT']} wrapperClassName="sign-out-icon" />
				<span className="signout-title">
					<EditWrapper stringId="CONFIRM_TEXT">
						{STRINGS['CONFIRM_TEXT']} {STRINGS['SIGN_OUT_TEXT']}
					</EditWrapper>
				</span>
				<span className="signout-description-content">
					<EditWrapper stringId="LOGOUT_CONFIRM_TEXT">
						{STRINGS['LOGOUT_CONFIRM_TEXT']}
					</EditWrapper>
				</span>
			</div>
			<div className="signout-confirmation-button-wrapper">
				<Button
					className="cancel-btn"
					label={STRINGS['CANCEL']}
					onClick={() => onClose()}
				></Button>
				<Button
					className="confirm-btn"
					label={STRINGS['CONFIRM_TEXT']}
					onClick={() => onConfirm()}
				></Button>
			</div>
		</div>
	);
};

export default LogoutConfirmation;
