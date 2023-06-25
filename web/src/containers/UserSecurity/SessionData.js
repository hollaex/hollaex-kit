import React from 'react';
import { EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import { getFormatTimestamp } from 'utils/utils';
import { getCountry } from 'containers/Verification/utils';

const SessionData = ({ login: { country, ip, device, timestamp } }) => {
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
					<div>{flag}</div>
					<div className="px-1">{name}</div>
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
		</div>
	);
};

export default SessionData;
