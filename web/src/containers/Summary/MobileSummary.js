import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';

import { BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../config/constants';
import { formatAverage, formatBaseAmount } from '../../utils/currency';
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
    isValidBase,
    lastMonthVolume,
    onFeesAndLimits,
    onUpgradeAccount,
    onAccountTypeChange,
    onInviteFriends
}) => {
    const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
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
                    <SummaryRequirements
                        coins={coins}
                        user={user}
                        lastMonthVolume={lastMonthVolume}
                        contentClassName="requirements-content" />
                </SummaryBlock>
            </div>
            <div className="assets-wrapper w-100">
                <SummaryBlock
                    title={STRINGS.SUMMARY.ACCOUNT_ASSETS}
                    secondaryTitle={
                        BASE_CURRENCY && isValidBase ?
                            <span>
                                <span className="title-font">
                                    {totalAssets}
                                </span>
                                {` ${fullname}`}
                            </span>
                            : null
                    } >
                    <AccountAssets
                        user={user}
                        chartData={chartData}
                        totalAssets={totalAssets}
                        balance={balance}
                        coins={coins}
                        activeTheme={activeTheme} />
                </SummaryBlock>
            </div>
            <div className="trading-volume-wrapper w-100">
                <SummaryBlock
                    title={STRINGS.SUMMARY.TRADING_VOLUME}
                    secondaryTitle={<span>
                        <span className="title-font">
                            {` ${formatAverage(formatBaseAmount(lastMonthVolume))}`}
                        </span>
                        {` ${fullname} ${STRINGS.formatString(STRINGS.SUMMARY.NOMINAL_TRADING_WITH_MONTH, moment().subtract(1, "month").startOf("month").format('MMMM')).join('')}`}
                    </span>
                    } >
                    <TradingVolume user={user} />
                </SummaryBlock>
            </div>
            <SummaryBlock
                title={STRINGS.SUMMARY.ACCOUNT_DETAILS}
                secondaryTitle={currentTradingAccount.name}
                wrapperClassname="w-100" >
                <AccountDetails
                    coins={coins}
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