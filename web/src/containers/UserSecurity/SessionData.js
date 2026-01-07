import React, { Fragment } from 'react';
import { withRouter } from 'react-router';

import { EditWrapper, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import { getFormatTimestamp } from 'utils/utils';
import { getCountry } from 'containers/Verification/utils';
import withConfig from 'components/ConfigProvider/withConfig';

const SessionData = ({
	login: { country, ip, device, timestamp },
	meta = {},
	icons: ICONS = {},
	router,
}) => {
	const { name, flag } = getCountry(country);
	return (
		<div>
			<div className="d-flex">
				<div className="bold important-text">
					<EditWrapper stringId="SESSIONS.CONTENT.TABLE.CELL.COUNTRY">
						{STRINGS['SESSIONS.CONTENT.TABLE.CELL.COUNTRY']}:
					</EditWrapper>
				</div>
				<div className="d-flex secondary-text px-1">
					{country && (
						<Fragment>
							<div>{flag}</div>
							<div className="px-1">{name}</div>
						</Fragment>
					)}
				</div>
			</div>
			<div className="d-flex">
				<div className="bold important-text">
					<EditWrapper stringId="SESSIONS.CONTENT.TABLE.CELL.IP_ADDRESS">
						{STRINGS['SESSIONS.CONTENT.TABLE.CELL.IP_ADDRESS']}:
					</EditWrapper>
				</div>
				<div className="secondary-text px-1">{ip}</div>
			</div>
			<div className="d-flex">
				<div className="bold important-text">
					<EditWrapper stringId="SESSIONS.CONTENT.TABLE.CELL.DEVICE">
						{STRINGS['SESSIONS.CONTENT.TABLE.CELL.DEVICE']}:
					</EditWrapper>
				</div>
				<div className="secondary-text px-1">{device}</div>
			</div>
			<div className="d-flex">
				<div className="bold important-text">
					<EditWrapper stringId="SESSIONS.CONTENT.TABLE.CELL.LOGIN_TIME">
						{STRINGS['SESSIONS.CONTENT.TABLE.CELL.LOGIN_TIME']}:
					</EditWrapper>
				</div>
				<div className="secondary-text px-1">
					{getFormatTimestamp(timestamp)}
				</div>
			</div>
			<div className="d-flex">
				{meta?.is_sharedaccount && (
					<div>
						<Image
							iconId="ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU"
							icon={ICONS?.['ACCOUNT_SHARING_SHARED_ACCOUNT_BY_YOU']}
							svgWrapperClassName="shared-account-icon-session-table mt-1 mr-2"
						/>
						{STRINGS?.formatString(
							STRINGS['ACCOUNT_SHARING.SHARED_ACCOUNT_DESCRIPTION'],
							<EditWrapper stringId="ACCOUNT_SHARING.SHARED_ACCOUNT">
								<span
									className="pointer blue-link underline-text"
									onClick={() => router.push('/account-sharing')}
								>
									{STRINGS?.['ACCOUNT_SHARING.SHARED_ACCOUNT']}
								</span>
							</EditWrapper>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default withRouter(withConfig(SessionData));
