import React from 'react';
import ReactSVG from 'react-svg';
import { isMobile } from 'react-device-detect';

import STRINGS from '../../../config/localizedStrings';
import { ICONS } from '../../../config/constants';


const TraderAccounts = ({ account = {}, activeTheme, isAccountDetails = false, onFeesAndLimits, onUpgradeAccount, logout, onInviteFriends, onStakeToken, is_hap }) => {
    // let limitLevel = limits.filter(obj => obj.verification_level === account.level);
    return (
        <div className="d-flex">
            <div>
                <ReactSVG path={is_hap === true ? ICONS.HAP_ACCOUNT_ICON : ICONS.ACCOUNT_SUMMARY} wrapperClassName="trader-account-icon" />
            </div>
            <div className="trade-account-secondary-txt summary-content-txt">
                {isAccountDetails && <div className="summary-block-title mb-3">{account.fullName}</div>}
                <div className="account-details-content">
                    <div className="mb-2">{
                        is_hap
                            ? <div>{STRINGS.SUMMARY.HAP_ACCOUNT_TXT}</div>
                            : <div>
                                <div> {STRINGS.SUMMARY.TRADER_ACCOUNT_TXT_1}</div>
                                <div> {STRINGS.SUMMARY.TRADER_ACCOUNT_TXT_2}</div>
                            </div>
                    }
                    </div>
                </div>
                {!isAccountDetails && <div>

                    <div className="trade-account-link mb-2">
                        <span
                            className="pointer" onClick={onInviteFriends}>
                            {STRINGS.REFERRAL_LINK.TITLE.toUpperCase()}
                        </span>

                    </div>
                    <div className="trade-account-link mb-2">
                        <span
                            className="pointer" onClick={onStakeToken}>
                            {STRINGS.STAKE_TOKEN.TITLE.toUpperCase()}
                        </span>

                    </div>
                </div>
                }
                {isMobile ?
                    <div className="trade-account-link my-2" onClick={() => logout()} >
                        {STRINGS.LOGOUT.toUpperCase()}
                    </div>
                    : ''}
            </div>
        </div>
    );
};

export default TraderAccounts;