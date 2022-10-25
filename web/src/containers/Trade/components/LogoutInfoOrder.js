import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { IconTitle } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';

const LogoutInfoOrder = ({ icons: ICONS }) => {
	const SIGN_IN = (
		<Link
			to="/login"
			className={classnames('blue-link', 'dialog-link', 'pointer')}
		>
			{STRINGS['SIGNUP_TEXT']}
		</Link>
	);
	return (
		<div>
			<IconTitle
				iconId="DEMO_LOGIN_ICON"
				iconPath={ICONS['DEMO_LOGIN_ICON']}
				textType="title"
				className="w-100"
			/>
			<div className="text-center">
				<div className="xht-order-heading">{STRINGS['NOT_LOGGEDIN.TXT_1']}</div>
				<div className="xht-order-content">
					<div className="my-2">
						{STRINGS.formatString(
							STRINGS['NOT_LOGGEDIN.TXT_2'],
							SIGN_IN,
							<Link
								to="/login"
								className={classnames('blue-link', 'dialog-link', 'pointer')}
							>
								{STRINGS['NOT_LOGGEDIN.LOGIN_HERE']}{' '}
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
export default withConfig(LogoutInfoOrder);
