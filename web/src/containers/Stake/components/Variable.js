import React from 'react';
import { Image, EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';

const Variable = ({ icons: ICONS, className = 'secondary-text' }) => {
	const iconId = 'STAKING_VARIABLE';
	return (
		<div className="d-flex align-center">
			<div>
				<Image
					iconId={iconId}
					icon={ICONS[iconId]}
					wrapperClassName="stake-variable"
				/>
			</div>
			<div className={`pl-2 ${className}`}>
				<EditWrapper stringId="STAKE.VARIABLE_TITLE">
					{STRINGS['STAKE_TABLE.VARIABLE']}
				</EditWrapper>
			</div>
		</div>
	);
};

export default withConfig(Variable);
