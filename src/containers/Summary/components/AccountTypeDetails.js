import React from 'react';
import classnames from 'classnames';

import TraderAccounts from './TraderAccounts';
import SummaryRequirements from './SummaryRequirements';
import { Button } from '../../../components';

import { TRADING_ACCOUNT_TYPE } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const AccountTypeDetails = ({
    user,
    className='',
    activeTheme,
    selectedAccount,
    onFeesAndLimits
}) => {
    return (
        <div className={classnames(className, "ml-5")}>
            <TraderAccounts
                activeTheme={activeTheme}
                account={TRADING_ACCOUNT_TYPE[selectedAccount]}
                isAccountDetails={true}
                onFeesAndLimits={onFeesAndLimits} />
            <div>
                <div className="requirement-header d-flex justify-content-between">
                    <div>{STRINGS.SUMMARY.REQUIREMENTS}</div>
                    <div className="status-header">{STRINGS.STATUS}</div>
                </div>
                <SummaryRequirements
                    user={user}
                    isAccountDetails={true}
                    contentClassName="w-100" />
                <Button label={STRINGS.SUMMARY.REQUEST_ACCOUNT_UPGRADE} />
            </div>
        </div>
    );
};

export default AccountTypeDetails;