import React from 'react';

import icons from 'config/icons/dark';
import strings from 'config/localizedStrings';
import { IconTitle } from 'hollaex-web-lib';
import { EditWrapper } from 'components';

const NoDealsData = ({ trade }) => {
	return (
		<div className="no-deals-data">
			<IconTitle
				stringId="ACCOUNTS.P2P"
				textType="title"
				iconPath={icons['TAB_P2P']}
				iconId={strings['ACCOUNTS.P2P']}
			/>
			<span className="important-text">
				{trade === 'deals' ? (
					<EditWrapper stringId="P2P.NO_DEALS_DESC">
						{strings['P2P.NO_DEALS_DESC']}
					</EditWrapper>
				) : (
					<EditWrapper stringId="P2P.NO_ORDERS_DESC">
						{strings['P2P.NO_ORDERS_DESC']}
					</EditWrapper>
				)}
			</span>
		</div>
	);
};

export default NoDealsData;
