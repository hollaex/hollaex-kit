import React from 'react';
import classnames from 'classnames';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';

import { BASE_CURRENCY } from '../../config/constants'; 
import STRINGS from '../../config/localizedStrings';

const MobileSummary = ({
    user,
    pairs,
    coins,
    activeTheme,
    default_trader_account,
    currentTradingAccount,
    selectedAccount,
    balance,
    chartData,
    logout,
    totalAssets,
    lastMonthVolume,
    onFeesAndLimits,
    onUpgradeAccount,
    onAccountTypeChange,
    onInviteFriends
}) => {
    return (
        <div
            className={classnames(
                'flex-column',
                'd-flex',
                'justify-content-between',
                'f-1',
                'apply_rtl'
            )}
        >
            <div className="summary-section_1 trader-account-wrapper d-flex w-100">
                <SummaryBlock title={currentTradingAccount.fullName} wrapperClassname="w-100" >
                    <TraderAccounts
                        coins={coins}
                        pairs={pairs}
                        logout={logout}
                        activeTheme={activeTheme}
                        account={currentTradingAccount}
                        onInviteFriends={onInviteFriends}
                        onFeesAndLimits={onFeesAndLimits}
                        onUpgradeAccount={onUpgradeAccount} />
                </SummaryBlock>
            </div>
            <div className="summary-section_1 requirement-wrapper d-flex w-100">
                <SummaryBlock
                    title={STRINGS.SUMMARY.URGENT_REQUIREMENTS}
                    wrapperClassname="w-100" >
                    <SummaryRequirements user={user} coins={coins} lastMonthVolume={lastMonthVolume} contentClassName="requirements-content" />
                </SummaryBlock>
            </div>
            <div className="assets-wrapper w-100">
                <SummaryBlock
                    title={STRINGS.SUMMARY.ACCOUNT_ASSETS}
                    secondaryTitle={`${balance[`${BASE_CURRENCY.toLowerCase()}_balance`]} ${STRINGS[`${BASE_CURRENCY.toUpperCase()}_FULLNAME`]}`} >
                    <AccountAssets
                        user={user}
                        chartData={chartData}
                        totalAssets={totalAssets}
                        balance={balance}
                        coins={coins} />
                </SummaryBlock>
            </div>
        </div>
    );
};

export default MobileSummary;