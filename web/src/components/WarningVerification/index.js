import React from 'react';
import STRINGS from '../../config/localizedStrings';

const generateTexts = (level = 0) => {
	if (level === 1) {
		return {
			title: STRINGS['VERIFICATION_WARNING_TITLE'],
			text: STRINGS['VERIFICATION_WARNING_MESSAGE'],
		};
	} else {
		return {
			title: STRINGS['VERIFICATION_NO_WITHDRAW_TITLE'],
			text: STRINGS['VERIFICATION_NO_WITHDRAW_MESSAGE'],
		};
	}
};
const WarningVerification = ({ level = 0 }) => {
	const { title, text } = generateTexts(level);
	return (
		<div className="presentation_container apply_rtl d-flex justify-content-center text-center flex-column mb-2">
			<div className="text-uppercase font-title mb-2">{title}</div>
			<div>{text}</div>
		</div>
	);
};

export default WarningVerification;
