import React from 'react';
import { Link } from 'react-router';
import { IconTitle } from '../../components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const SignupSuccess = ({ icons: ICONS, ...rest }) => {
	return (
		<div className="signup_success-wrapper d-flex justify-content-center align-items-center flex-column auth_wrapper">
			<IconTitle
				iconId="CHECK"
				iconPath={ICONS['CHECK']}
				stringId="VERIFICATION_TEXTS.TITLE"
				text={STRINGS['VERIFICATION_TEXTS.TITLE']}
				textType="title"
				className="w-100"
			/>
			<div className="signup_success-content">
				<p>{STRINGS['VERIFICATION_TEXTS.TEXT_1']}</p>
				<p>{STRINGS['VERIFICATION_TEXTS.TEXT_2']}</p>
			</div>
			<div>
				{STRINGS['SIGN_UP.NO_EMAIL']}
				<Link to="/verify" className="blue-link">
					{STRINGS['SIGN_UP.REQUEST_EMAIL']}
				</Link>
			</div>
		</div>
	);
};
export default withConfig(SignupSuccess);
