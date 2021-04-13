import React from 'react';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';

const Fiat = () => {
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
					<EditWrapper stringId="PAGE_UNDER_CONSTRUCTION">
						{STRINGS['PAGE_UNDER_CONSTRUCTION']}
					</EditWrapper>
				</div>
			</div>
		</div>
	);
};

export default Fiat;
