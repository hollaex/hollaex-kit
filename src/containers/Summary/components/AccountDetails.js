import React from 'react';
import classnames from 'classnames';

import TraderAccounts from './TraderAccounts';
import SummaryRequirements from './SummaryRequirements';
import { TRADING_ACCOUNT_TYPE, SUMMMARY_ICON, FLEX_CENTER_CLASSES } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';
import { Button } from '../../../components';

const AccountDetails = ({ user, selectedAccount, onAccountTypeChange, currentTradingAccount, onFeesAndLimits }) => {
    const accounts = Object.keys(TRADING_ACCOUNT_TYPE);
    return (
        <div className="account-details-wrapper summary-content-txt">
            <div>
                <div>{STRINGS.SUMMARY.ACCOUNT_DETAILS_TXT_1}</div>
                <div>{STRINGS.SUMMARY.ACCOUNT_DETAILS_TXT_2}</div>
                <div className="mt-2">{STRINGS.SUMMARY.ACCOUNT_DETAILS_TXT_3}</div>
                <div className="mt-2">{STRINGS.SUMMARY.ACCOUNT_DETAILS_TXT_4}</div>
            </div>
            <div className="d-flex mt-5">
                <div className="account-type-container">
                    {accounts.map((key, index) => {
                        let account = TRADING_ACCOUNT_TYPE[key];
                        return (
                            <div
                                key={index}
                                className={
                                    classnames(
                                        "d-flex",
                                        "account-type-menu",
                                        {
                                            "account-type-menu-active": selectedAccount === key,
                                            "accounnt-type-menu-last-active": index === (accounts.length - 1)
                                        }
                                    )
                                }
                                onClick={() => onAccountTypeChange(key)}
                            >
                                <div className="mr-4">
                                    <img src={SUMMMARY_ICON[key.toUpperCase()]} alt={account.name} className="account-type-icon" />
                                </div>
                                <div className={classnames(FLEX_CENTER_CLASSES)}>
                                    {account.name}
                                    {(key === currentTradingAccount) &&
                                        <div className="account-current summary-content-txt ml-2"> (current) </div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="w-50 ml-5">
                    <TraderAccounts
                        account={TRADING_ACCOUNT_TYPE[selectedAccount]}
                        isAccountDetails={true}
                        onFeesAndLimits={onFeesAndLimits} />
                    <div>
                        <div className="requirement-header d-flex justify-content-between">
                            <div>{STRINGS.SUMMARY.REQUIREMENTS}</div>
                            <div>{STRINGS.STATUS}</div>
                        </div>
                        <SummaryRequirements
                            user={user}
                            isAccountDetails={true}
                            contentClassName="w-100" />
                        <Button label={STRINGS.SUMMARY.REQUEST_ACCOUNT_UPGRADE} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;