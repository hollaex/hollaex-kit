import React from 'react';
import classnames from 'classnames';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';

import STRINGS from '../../config/localizedStrings';

const MobileSummary = ({
    user,
    fees,
    limits,
    pairs,
    activeTheme,
    default_trader_account,
    currentTradingAccount,
    selectedAccount,
    FIAT,
    balance,
    chartData,
    logout,
    totalAssets,
    lastMonthVolume,
    onFeesAndLimits,
    onUpgradeAccount,
    onAccountTypeChange
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
                        fees={fees}
                        limits={limits}
                        pairs={pairs}
                        logout={logout}
                        activeTheme={activeTheme}
                        account={currentTradingAccount}
                        onFeesAndLimits={onFeesAndLimits}
                        onUpgradeAccount={onUpgradeAccount} />
                </SummaryBlock>
            </div>
            <div className="summary-section_1 requirement-wrapper d-flex w-100">
                <SummaryBlock
                    title={STRINGS.SUMMARY.URGENT_REQUIREMENTS}
                    wrapperClassname="w-100" >
                    <SummaryRequirements user={user} lastMonthVolume={lastMonthVolume} contentClassName="requirements-content" />
                </SummaryBlock>
            </div>
            <div className="assets-wrapper w-100">
                <SummaryBlock
                    title={STRINGS.SUMMARY.ACCOUNT_ASSETS}
                    secondaryTitle={`${balance[`${FIAT}_balance`]} ${STRINGS.FIAT_FULLNAME}`} >
                    <AccountAssets
                        user={user}
                        chartData={chartData}
                        totalAssets={totalAssets}
                        balance={balance} />
                </SummaryBlock>
            </div>
            <div className="trading-volume-wrapper w-100">
                <SummaryBlock
                    title={STRINGS.SUMMARY.TRADING_VOLUME}
                    secondaryTitle={`${balance[`${FIAT}_balance`]} ${STRINGS.FIAT_FULLNAME}`} >
                    <TradingVolume user={user} />
                </SummaryBlock>
            </div>
            <SummaryBlock
                title={STRINGS.SUMMARY.ACCOUNT_DETAILS}
                secondaryTitle={currentTradingAccount.name}
                wrapperClassname="w-100" >
                <AccountDetails
                    fees={fees}
                    limits={limits}
                    pairs={pairs}
                    user={user}
                    activeTheme={activeTheme}
                    currentTradingAccount={currentTradingAccount.symbol}
                    selectedAccount={selectedAccount}
                    onAccountTypeChange={onAccountTypeChange}
                    onFeesAndLimits={onFeesAndLimits} />
            </SummaryBlock>
        </div>
    );
};

export default MobileSummary;