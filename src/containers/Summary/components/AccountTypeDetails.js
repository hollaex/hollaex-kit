import React from 'react';
import classnames from 'classnames';

import TraderAccounts from './TraderAccounts';
import SummaryRequirements from './SummaryRequirements';

import { TRADING_ACCOUNT_TYPE } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const AccountTypeDetails = ({
    user,
    fees,
    limits,
    pairs,
    className='',
    activeTheme,
    selectedAccount,
    lastMonthVolume,
    onFeesAndLimits,
    onUpgradeAccount
}) => {
    const currentAccount = TRADING_ACCOUNT_TYPE[selectedAccount];
    return (
        <div className={classnames(className, "mx-auto")}>
            <TraderAccounts
                fees={fees}
                limits={limits}
                pairs={pairs}
                activeTheme={activeTheme}
                account={currentAccount}
                isAccountDetails={true}
                onFeesAndLimits={onFeesAndLimits} />
            {currentAccount.level > 1 && <div>
                <div className="requirement-header d-flex justify-content-between">
                    <div>{STRINGS.SUMMARY.REQUIREMENTS}</div>
                    <div className="status-header">{STRINGS.STATUS}</div>
                </div>
                <SummaryRequirements
                    user={user}
                    isAccountDetails={true}
                    verificationLevel={currentAccount.level || user.verification_level}
                    lastMonthVolume={lastMonthVolume}
                    onUpgradeAccount={onUpgradeAccount}
                    contentClassName="w-100" />
            </div>}
        </div>
    );
};

export default AccountTypeDetails;