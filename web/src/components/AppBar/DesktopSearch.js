import React from 'react';
import STRINGS from 'config/localizedStrings';
import EditWrapper from 'components/EditWrapper';
import MobileBarMoreOptions from 'containers/App/MobileBarMoreOptions';

const DesktopSearch = () => {
	return (
		<div className="summary-container desktop-search-wrapper">
			<div className="search-description-container">
				<div className="search-description">
					<EditWrapper stringId="DESKTOP_ULTIMATE_SEARCH.SEARCH_DESCRIPTION">
						{STRINGS['DESKTOP_ULTIMATE_SEARCH.SEARCH_DESCRIPTION']}
					</EditWrapper>
				</div>
				<div className="dynamic-search-container">
					<MobileBarMoreOptions />
				</div>
			</div>
		</div>
	);
};

export default DesktopSearch;
