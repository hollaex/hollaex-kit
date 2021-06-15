import React from 'react';

import { getCountryFromNumber } from './utils';
import { Button, PanelInformationRow } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

const MobileVerificationHome = ({ user, setActivePageContent }) => {
	const { phone_number } = user;
	if (!phone_number) {
		return (
			<div className="btn-wrapper">
				<div className="holla-verification-button">
					<EditWrapper stringId="USER_VERIFICATION.START_PHONE_VERIFICATION" />
					<Button
						label={STRINGS['USER_VERIFICATION.START_PHONE_VERIFICATION']}
						onClick={() => setActivePageContent('sms')}
					/>
				</div>
			</div>
		);
	} else {
		return (
			<div className="my-3">
				<PanelInformationRow
					stringId="USER_VERIFICATION.PHONE_COUNTRY_ORIGIN"
					label={STRINGS['USER_VERIFICATION.PHONE_COUNTRY_ORIGIN']}
					information={getCountryFromNumber(phone_number).name}
					className="title-font"
					disable
				/>
				<PanelInformationRow
					stringId="USER_VERIFICATION.MOBILE_NUMBER"
					label={STRINGS['USER_VERIFICATION.MOBILE_NUMBER']}
					information={phone_number}
					className="title-font"
					disable
				/>
			</div>
		);
	}
};

export default MobileVerificationHome;
