import React from 'react';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import ReactSVG from 'react-svg';

import { TRADING_ACCOUNT_TYPE, ICONS, FLEX_CENTER_CLASSES } from '../../../config/constants';

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
                            <ReactSVG path={ICONS[key.toUpperCase()]} wrapperClassName="account-type-icon" />
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