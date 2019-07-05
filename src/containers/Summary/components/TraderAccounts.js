import React from 'react';
import ReactSVG from 'react-svg';
import { isMobile } from 'react-device-detect';

import STRINGS from '../../../config/localizedStrings';
import { ICONS } from '../../../config/constants';


const TraderAccounts = ({ account = {}, activeTheme, isAccountDetails = false, onFeesAndLimits, onUpgradeAccount, logout, onInviteFriends }) => {
    // let limitLevel = limits.filter(obj => obj.verification_level === account.level);
    return (
        <div className="d-flex">
            <div>
                <ReactSVG path={ICONS[account.symbol.toUpperCase()]} wrapperClassName="trader-account-icon" />
            </div>
            <div className="trade-account-secondary-txt summary-content-txt">
                {isAccountDetails && <div className="summary-block-title mb-3">{account.fullName}</div>}
                <div className="account-details-content">
                    <div className="mb-2">{STRINGS.SUMMARY[`${account.symbol.toUpperCase()}_ACCOUNT_TXT_1`]}</div>
                    <div className="mb-2">{STRINGS.SUMMARY[`${account.symbol.toUpperCase()}_ACCOUNT_TXT_2`]}</div>
                </div>
                {/* {!!limitLevel.length && <div
                    className="trade-account-link mb-2">
                    <span
                        className="pointer"
                        onClick={() => onFeesAndLimits(account)}>
                        {STRINGS.SUMMARY.VIEW_FEE_STRUCTURE.toUpperCase()}
                    </span>
                </div>} */}
                {!isAccountDetails && <div
                    className="trade-account-link mb-2">
                    <span
                        className="pointer"
                        onClick={onInviteFriends}>
                        {STRINGS.REFERRAL_LINK.TITLE.toUpperCase()}
                    </span>
                </div>}
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
                    {isMobile ?
                        <div className="my-2" onClick={() => logout()} > 
                            {STRINGS.LOGOUT.toUpperCase()}
                        </div> 
                    :'' }
                    </div>
                }
            </div>
        </div>
    );
};

export default TraderAccounts;