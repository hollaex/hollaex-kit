import React from 'react';
import { IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const UnderConstruction = ({ icons: ICONS }) => {
	return (
		<div className="withdraw-form-wrapper">
			<div className="withdraw-form">
				<div
					style={{
						height: '28rem',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<IconTitle
						stringId="PAGE_UNDER_CONSTRUCTION"
						text={STRINGS['PAGE_UNDER_CONSTRUCTION']}
						iconId="FIAT_UNDER_CONSTRUCTION"
						iconPath={ICONS['FIAT_UNDER_CONSTRUCTION']}
						className="flex-direction-column"
					/>
				</div>
			</div>
		</div>
	);
};

export default withConfig(UnderConstruction);
