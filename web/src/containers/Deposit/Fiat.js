import React from 'react';
import STRINGS from 'config/localizedStrings';
import { SmartTarget, IconTitle } from 'components';

const Fiat = (props) => {
	const { icons: ICONS } = props;
	return (
		<SmartTarget {...props}>
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
		</SmartTarget>
	);
};

export default Fiat;
