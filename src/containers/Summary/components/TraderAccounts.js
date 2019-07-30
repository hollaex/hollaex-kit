import React from 'react';
import ReactSVG from 'react-svg';
import { isMobile } from 'react-device-detect';

import STRINGS from '../../../config/localizedStrings';
import { ICONS, BASE_CURRENCY } from '../../../config/constants';


const TraderAccounts = ({ account = {}, activeTheme, isAccountDetails = false, onFeesAndLimits, onUpgradeAccount, logout, onInviteFriends }) => {
    // let limitLevel = limits.filter(obj => obj.verification_level === account.level);
    return (
        <div className="d-flex">
            <div>
                <ReactSVG path={ICONS.ACCOUNT_SUMMARY} wrapperClassName="trader-account-icon" />
            </div>
            <div className="trade-account-secondary-txt summary-content-txt">
                {isAccountDetails && <div className="summary-block-title mb-3">{account.fullName}</div>}
                <div className="account-details-content">
                    <div className="mb-2">
                        {STRINGS.formatString(
                            STRINGS.SUMMARY.TRADER_ACCOUNT_TXT_1,
                            STRINGS.HEX_SHORTNAME,
                            '$0.10'
                        )}
                    </div>
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
            </div>
        </div>
    );
};

export default TraderAccounts;