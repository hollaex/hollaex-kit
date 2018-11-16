import React from 'react';
import STRINGS from '../../../config/localizedStrings';

const TraderAccounts = ({ icon }) => {
    return (
        <div className="summary-section_1 d-flex">
            <div>
                <img src={icon} alt="trader account" className="trader-account-icon" />
            </div>
            <div className="trade-account-secondary-txt w-50">
                <div className="mb-2">{STRINGS.SUMMARY.TRADER_ACCOUNT_TXT_1}</div>
                <div className="mb-2">{STRINGS.SUMMARY.TRADER_ACCOUNT_TXT_2}</div>
                <div className="trade-account-link mb-2">{STRINGS.SUMMARY.VIEW_FEE_STRUCTURE.toUpperCase()}</div>
                <div className="trade-account-link mb-2">{STRINGS.SUMMARY.UPGRADE_ACCOUNT.toUpperCase()}</div>
            </div>
        </div>
    );
};

export default TraderAccounts;