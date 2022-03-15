import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { IconTitle } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';

const LogoutInfoTrade = ({ icons: ICONS }) => {
	return (
		<div>
			<IconTitle
				iconId="DEMO_LOGIN_ICON"
				iconPath={ICONS['DEMO_LOGIN_ICON']}
				textType="title"
				className="w-100"
			/>
			<div className="text-center my-3">
				<div className="xht-order-heading my-3">
					{STRINGS['TERMS_OF_SERVICES.XHT_TRADE_TXT_1']}
				</div>
				<div className="xht-order-content my-3">
					{STRINGS.formatString(
						STRINGS['TERMS_OF_SERVICES.XHT_TRADE_TXT_2'],
						<Link
							to="/login"
							className={classnames('blue-link', 'dialog-link', 'pointer')}
						>
							{STRINGS['TERMS_OF_SERVICES.LOGIN_HERE']}
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};
export default withConfig(LogoutInfoTrade);
