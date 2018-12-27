import React from 'react';
import classnames from 'classnames';

import AccountTypeDetails from './components/AccountTypeDetails';
import { TRADING_ACCOUNT_TYPE, SUMMMARY_ICON, FLEX_CENTER_CLASSES } from '../../config/constants';

const MobileAccountTypeList = ({
    user,
    accounts,
    activeTheme,
    selectedAccount,
    currentTradingAccount,
    lastMonthVolume,
    onAccountTypeChange,
    onFeesAndLimits,
    onUpgradeAccount
}) => {
    return (
        <div className="mobile-account-type my-4">
            {accounts.map((key, index) => {
                let account = TRADING_ACCOUNT_TYPE[key];
                let icon = activeTheme === 'dark' && SUMMMARY_ICON[`${key.toUpperCase()}_DARK`]
                    ? SUMMMARY_ICON[`${key.toUpperCase()}_DARK`] : SUMMMARY_ICON[key.toUpperCase()];
                return (
                    <div
                        key={index}
                        className={
                            classnames(
                                "account-type-menu",
                                {
                                    "account-type-menu-active": selectedAccount === key,
                                    "accounnt-type-menu-last-active": index === (accounts.length - 1)
                                }
                            )
                        }
                        onClick={() => onAccountTypeChange(key)}
                    >
                        <div className="d-flex">
                            <div className="mr-4">
                                <img src={icon} alt={account.name} className="account-type-icon" />
                            </div>
                            <div className={classnames(FLEX_CENTER_CLASSES)}>
                                {account.name}
                                {(key === currentTradingAccount) &&
                                    <div className="account-current summary-content-txt ml-2"> (current) </div>
                                }
                            </div>
                        </div>
                        {key === selectedAccount
                            && <div className="my-4">
                                <AccountTypeDetails
                                    user={user}
                                    activeTheme={activeTheme}
                                    selectedAccount={selectedAccount}
                                    lastMonthVolume={lastMonthVolume}
                                    onFeesAndLimits={onFeesAndLimits}
                                    onUpgradeAccount={onUpgradeAccount} />
                            </div>
                        }
                    </div>
                )
            })}
        </div>
    );
};

export default MobileAccountTypeList;