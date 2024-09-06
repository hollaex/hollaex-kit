import React from 'react';

import icons from 'config/icons/dark';
import strings from 'config/localizedStrings';
import { IconTitle } from 'hollaex-web-lib';
import { EditWrapper } from 'components';

const NoDealsData = () => {
	return (
		<div className="no-deals-data">
			<IconTitle
				stringId="ACCOUNTS.P2P"
				textType="title"
				iconPath={icons['TAB_P2P']}
				iconId={strings['ACCOUNTS.P2P']}
			/>
			<span>
				<EditWrapper stringId="P2P.NO_DEALS_DATA">
					{strings['P2P.NO_DEALS_DATA']}
				</EditWrapper>
			</span>
		</div>
	);
};

export default NoDealsData;
