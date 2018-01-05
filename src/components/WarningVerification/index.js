import React from 'react';
import { Link } from 'react-router';
import STRINGS from '../../config/localizedStrings';

const WarningVerification = () => {
	return (
		<div className="presentation_container apply_rtl d-flex justify-content-center text-center flex-column mb-2">
			<div className="text-uppercase font-title mb-2">
				{STRINGS.VERIFICATION_WARNING_TITLE}
			</div>
			<div>
				{STRINGS.formatString(
					STRINGS.VERIFICATION_WARNING_MESSAGE,
					<Link to="/account" className="font-weight-bold">
						{STRINGS.ACCOUNTS.TITLE}
					</Link>
				)}
			</div>
		</div>
	);
};

export default WarningVerification;
