import React from 'react';

import STRINGS from '../../../config/localizedStrings';

const AccountAssets = () => {
    return (
        <div className="summary-section_2">
            <div className="summary-content-txt assets-description">
                <div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_1}</div>
                <div>{STRINGS.SUMMARY.ACCOUNT_ASSETS_TXT_2}</div>
            </div>
        </div>
    );
};

export default AccountAssets;