import React, { Fragment } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { IconTitle } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { isLoggedIn } from 'utils/token';

const NotLoggedIn = ({
	icons: ICONS,
	placeholderKey = 'NOT_LOGGEDIN.TEXT_GENERAL',
	children,
	hasBackground = true,
}) => {
	const SignUpLink = (
		<Link
			to="/signup"
			className={classnames('blue-link', 'dialog-link', 'pointer')}
		>
			{STRINGS['SIGNUP_TEXT']}
		</Link>
	);

	const LoginLink = (
		<Link
			to="/login"
			className={classnames('blue-link', 'dialog-link', 'pointer')}
		>
			{STRINGS['NOT_LOGGEDIN.LOGIN_HERE']}{' '}
		</Link>
	);

	return isLoggedIn() ? (
		<Fragment>{children}</Fragment>
	) : (
		<div
			className={classnames('not-logged-in_view', {
				'show-background': hasBackground,
			})}
		>
			<IconTitle
				iconId="DEMO_LOGIN_ICON"
				iconPath={ICONS['DEMO_LOGIN_ICON']}
				textType="title"
				className="w-100 d-flex justify-content-center"
			/>
			<div className="text-center my-3">
				<div className="xht-order-heading">{STRINGS[placeholderKey]}</div>
				<div className="xht-order-content">
					<div className="my-2">
						{STRINGS.formatString(
							STRINGS['NOT_LOGGEDIN.TXT_2'],
							SignUpLink,
							LoginLink
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withConfig(NotLoggedIn);
