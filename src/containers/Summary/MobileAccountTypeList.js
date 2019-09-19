import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

import AccountTypeDetails from './components/AccountTypeDetails';
import { TRADING_ACCOUNT_TYPE, ICONS, FLEX_CENTER_CLASSES } from '../../config/constants';

const MobileAccountTypeList = ({
    user,
    coins,
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
                                <ReactSVG path={ICONS[key.toUpperCase()]} wrapperClassName="account-type-icon" />
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
                                    coins={coins}
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