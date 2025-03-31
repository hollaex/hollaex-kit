import React from 'react';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';

import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import icons from 'config/icons/dark';
import { EditWrapper, IconTitle } from 'components';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import './_loginConfirmation.scss';

const EmailConfirmation = () => {
	const BottomLink = () => (
		<div
			className={
				isMobile
					? 'w-100 d-flex flex-column align-items-center justify-content-conter mt-5'
					: 'w-100 d-flex flex-column align-items-center justify-content-conter'
			}
		>
			<div className={classnames('f-1', 'link_wrapper')}>
				{STRINGS['SIGN_UP.HAVE_ACCOUNT']}
				<Link to="/login" className={classnames('blue-link')}>
					{STRINGS['SIGN_UP.GOTO_LOGIN']}
				</Link>
			</div>
			<div className={classnames('f-1', 'link_wrapper')}>
				{STRINGS['LOGIN.NO_ACCOUNT']}
				<Link to="/signup" className={classnames('blue-link')}>
					{STRINGS['LOGIN.CREATE_ACCOUNT']}
				</Link>
			</div>
		</div>
	);

	return (
		<div
			className={classnames(
				...FLEX_CENTER_CLASSES,
				'flex-column',
				'f-1',
				'login-confirm-warpper email-confirm-verify-wrapper'
			)}
		>
			<div className="auth_wrapper d-flex flex-column align-items-center justify-content-center">
				<div className="login-security-icon-wrapper">
					<IconTitle
						iconId="VERIFICATION_EMAIL_NEW"
						iconPath={icons['VERIFICATION_EMAIL_NEW']}
						stringId="LOGIN_CONFIRMATION.EMAIL_CONFIRMATION"
						text={STRINGS['LOGIN_CONFIRMATION.EMAIL_CONFIRMATION']}
						useSvg={true}
						textType="title"
						className="w-100 confirm-login-icon"
					/>
				</div>
				<div className="line-separator "></div>
				<div className="login-confirm-option ">
					<div className="confirm-warning-description ">
						<div className="description-text">
							<EditWrapper>
								{STRINGS['LOGIN_CONFIRMATION.EMAIL_CONFIRMATION_DESC_1']}
							</EditWrapper>
							<EditWrapper>
								{STRINGS.formatString(
									STRINGS['LOGIN_CONFIRMATION.EMAIL_CONFIRMATION_DESC_2'],
									<span className="font-weight-bold">
										{STRINGS['LOGIN_CONFIRMATION.EMAIL_TEXT']}
									</span>
								)}
							</EditWrapper>
						</div>
					</div>
				</div>
			</div>
			{!isMobile && <BottomLink />}
		</div>
	);
};

export default EmailConfirmation;
