import React from 'react';
import { EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';

const LoginData = ({ device }) => {
	return (
		<div>
			<div className="d-flex">
				<div className="bold important-text">
					<EditWrapper stringId="LOGINS_HISTORY.CONTENT.TABLE.CELL.DEVICE">
						{STRINGS['LOGINS_HISTORY.CONTENT.TABLE.CELL.DEVICE']}:
					</EditWrapper>
				</div>
				<div className="secondary-text px-1">{device}</div>
			</div>
		</div>
	);
};

export default LoginData;
