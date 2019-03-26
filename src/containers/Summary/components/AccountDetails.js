import React from 'react';
import { isMobile } from 'react-device-detect';

import AccountTypesList from './AccountTypesList';
import AccountTypeDetails from './AccountTypeDetails';
import MobileAccountTypeList from '../MobileAccountTypeList';

import { TRADING_ACCOUNT_TYPE } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const AccountDetails = ({
    user, 
    activeTheme,
    fees,
    limits,
    pairs,
    selectedAccount,
    lastMonthVolume,
    onAccountTypeChange,
    currentTradingAccount,
    onFeesAndLimits,
    onUpgradeAccount }) => {

    const accounts = Object.keys(TRADING_ACCOUNT_TYPE);
    return (
        <div className="account-details-wrapper summary-content-txt">
            <div>
                <div>{STRINGS.SUMMARY.ACCOUNT_DETAILS_TXT_1}</div>
                <div>{STRINGS.SUMMARY.ACCOUNT_DETAILS_TXT_2}</div>
                <div className="mt-2">{STRINGS.SUMMARY.ACCOUNT_DETAILS_TXT_3}</div>
                <div className="mt-2">{STRINGS.SUMMARY.ACCOUNT_DETAILS_TXT_4}</div>
            </div>
            {isMobile
                ? <MobileAccountTypeList
                    user={user}
                    accounts={accounts}
                    activeTheme={activeTheme}
                    selectedAccount={selectedAccount}
                    lastMonthVolume={lastMonthVolume}
                    currentTradingAccount={currentTradingAccount}
                    onAccountTypeChange={onAccountTypeChange}
                    onFeesAndLimits={onFeesAndLimits}
                    onUpgradeAccount={onUpgradeAccount} />
                : <div className="d-flex align-items-center mt-5">
                    <AccountTypesList
                        accounts={accounts}
                        activeTheme={activeTheme}
                        selectedAccount={selectedAccount}
                        currentTradingAccount={currentTradingAccount}
                        onAccountTypeChange={onAccountTypeChange} />
                    <AccountTypeDetails
                        className="w-50"
                        user={user}
                        fees={fees}
                        limits={limits}
                        pairs={pairs}
                        accounts={accounts}
                        activeTheme={activeTheme}
                        selectedAccount={selectedAccount}
                        lastMonthVolume={lastMonthVolume}
                        currentTradingAccount={currentTradingAccount}
                        onAccountTypeChange={onAccountTypeChange}
                        onFeesAndLimits={onFeesAndLimits}
                        onUpgradeAccount={onUpgradeAccount} />
                </div>
            }
        </div>
    );
};

export default AccountDetails;