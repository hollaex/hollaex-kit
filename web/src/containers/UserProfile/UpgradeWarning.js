import React from 'react';
import STRINGS from '../../config/localizedStrings';

const UpgradeWarning = () => (
	<div className="warning_text">
		<div>{STRINGS['USER_VERIFICATION.WARNING.TEXT_1']}</div>
		<ul>
			<li>{STRINGS['USER_VERIFICATION.WARNING.LIST_ITEM_1']}</li>
			<li>{STRINGS['USER_VERIFICATION.WARNING.LIST_ITEM_2']}</li>
			<li>{STRINGS['USER_VERIFICATION.WARNING.LIST_ITEM_3']}</li>
		</ul>
	</div>
);

export default UpgradeWarning;
