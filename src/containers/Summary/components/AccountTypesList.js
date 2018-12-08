import React from 'react';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';

import { TRADING_ACCOUNT_TYPE, SUMMMARY_ICON, FLEX_CENTER_CLASSES } from '../../../config/constants';

const AccountTypesList = ({
    accounts,
    activeTheme,
    selectedAccount,
    currentTradingAccount,
    onAccountTypeChange
}) => {
    return (
        <div className={classnames("account-type-container", { 'mobile-account-type': isMobile })}>
            {accounts.map((key, index) => {
                let account = TRADING_ACCOUNT_TYPE[key];
                let icon = activeTheme === 'dark' && SUMMMARY_ICON[`${key.toUpperCase()}_DARK`]
                    ? SUMMMARY_ICON[`${key.toUpperCase()}_DARK`] : SUMMMARY_ICON[key.toUpperCase()];
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
                            <img src={icon} alt={account.name} className="account-type-icon" />
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
    );
};

export default AccountTypesList;