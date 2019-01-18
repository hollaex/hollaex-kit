import React from 'react';

import STRINGS from '../../../config/localizedStrings';
import { SUMMMARY_ICON } from '../../../config/constants';

const TraderAccounts = ({ account = {}, activeTheme, limits = [], isAccountDetails = false, onFeesAndLimits, onUpgradeAccount }) => {
    let icon = activeTheme === 'dark' && SUMMMARY_ICON[`${account.symbol.toUpperCase()}_DARK`]
        ? SUMMMARY_ICON[`${account.symbol.toUpperCase()}_DARK`] : SUMMMARY_ICON[account.symbol.toUpperCase()];
    // let limitLevel = limits.filter(obj => obj.verification_level === account.level);
    return (
        <div className="d-flex">
            <div>
                <img src={icon} alt="trader account" className="trader-account-icon" />
            </div>
            <div className="trade-account-secondary-txt summary-content-txt">
                {isAccountDetails && <div className="summary-block-title mb-3">{account.fullName}</div>}
                <div className="mb-2">{STRINGS.SUMMARY[`${account.symbol.toUpperCase()}_ACCOUNT_TXT_1`]}</div>
                <div className="mb-2">{STRINGS.SUMMARY[`${account.symbol.toUpperCase()}_ACCOUNT_TXT_2`]}</div>
                {/* {!!limitLevel.length && <div
                    className="trade-account-link mb-2">
                    <span
                        className="pointer"
                        onClick={() => onFeesAndLimits(account)}>
                        {STRINGS.SUMMARY.VIEW_FEE_STRUCTURE.toUpperCase()}
                    </span>
                </div>} */}
                <div
                    className="trade-account-link mb-2">
                    <span
                        className="pointer"
                        onClick={() => onFeesAndLimits(account)}>
                        {STRINGS.SUMMARY.VIEW_FEE_STRUCTURE.toUpperCase()}
                    </span>
                </div>
                {!isAccountDetails && account.level >= 1 && account.level < 4 &&
                    <div className="trade-account-link mb-2">
                        <span className="pointer" onClick={onUpgradeAccount}>
                            {STRINGS.SUMMARY.UPGRADE_ACCOUNT.toUpperCase()}
                        </span>
                    </div>
                }
            </div>
        </div>
    );
};

export default TraderAccounts;