import React from 'react';

import STRINGS from '../../../config/localizedStrings';

const TradingVolume = () => {
    return (
        <div className="summary-section_2">
            <div className="summary-content-txt">
                <div>{STRINGS.SUMMARY.TRADING_VOLUME_TXT_1}</div>
                <div>{STRINGS.SUMMARY.TRADING_VOLUME_TXT_2}</div>
            </div>
        </div>
    );
};

export default TradingVolume;