import React from 'react';

import STRINGS from '../../../config/localizedStrings';
import { SUMMMARY_ICON } from '../../../config/constants';

const TraderAccounts = ({ account = {}, isAccountDetails = false, onFeesAndLimits }) => {
    return (
        <div className="d-flex">
            <div>
                <img src={SUMMMARY_ICON[account.symbol.toUpperCase()]} alt="trader account" className="trader-account-icon" />
            </div>
            <div className="trade-account-secondary-txt summary-content-txt">
                {isAccountDetails && <div className="summary-block-title">{account.fullName}</div>}
                <div className="mb-2">{STRINGS.SUMMARY[`${account.symbol.toUpperCase()}_ACCOUNT_TXT_1`]}</div>
                <div className="mb-2">{STRINGS.SUMMARY[`${account.symbol.toUpperCase()}_ACCOUNT_TXT_2`]}</div>
                <div
                    className="trade-account-link mb-2"
                    onClick={() => onFeesAndLimits(account)}>
                    {STRINGS.SUMMARY.VIEW_FEE_STRUCTURE.toUpperCase()}
                </div>
                {!isAccountDetails && <div className="trade-account-link mb-2">{STRINGS.SUMMARY.UPGRADE_ACCOUNT.toUpperCase()}</div>}
            </div>
        </div>
    );
};

export default TraderAccounts;