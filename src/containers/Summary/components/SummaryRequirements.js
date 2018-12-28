import React from 'react';
import ReactSvg from 'react-svg';
import classnames from 'classnames';
import { Link } from 'react-router';
import moment from 'moment';

import { Button } from '../../../components';
import { ICONS, TRADE_ACCOUNT_UPGRADE_MONTH, TRADING_VOLUME_CHART_LIMITS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const SucessStatus = ({ isAccountDetails }) => (
    <div className="d-flex">
        {isAccountDetails &&
            <div className="requirement-verified mr-2">
                {STRINGS.USER_VERIFICATION.COMPLETED.toUpperCase()}
            </div>
        }
        <ReactSvg path={ICONS.GREEN_CHECK} wrapperClassName="requirement-stauts" />
    </div>
);

const IncompleteStatus = ({ isAccountDetails }) => (
    <div className="d-flex">
        {isAccountDetails
            ? <div className="requirement-incomplete mr-2">
                {STRINGS.USER_VERIFICATION.INCOMPLETED.toUpperCase()}
            </div>
            : <ReactSvg path={ICONS.VERIFICATION_INCOMPLETE} wrapperClassName="requirement-stauts" />
        }
    </div>
);

const checkBankVerification = (accounts = []) => {
    return !!accounts.filter(acc => acc.status === 3).length;
};

const checkMonth = (currentDate, month) => {
    const diffMonth = moment().diff(moment(currentDate), 'months');
    return diffMonth >= month;
};

const getRequirements = (user, level, lastMonthVolume) => {
    const { phone_number, full_name, id_data = {}, bank_account } = user.userData;
    const bank_verified = checkBankVerification(bank_account);
    const verificationObj = {
        level_1: {
        },
        level_2: {
            '1': {
                title: STRINGS.USER_VERIFICATION.TITLE_USER_DOCUMENTATION,
                completed: user.verification_level < 1 && !full_name
            },
            '2': {
                title: STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS,
                completed: id_data.status === 3
            },
            '3': {
                title: STRINGS.USER_VERIFICATION.TITLE_MOBILE,
                completed: !!phone_number
            },
            '4': {
                title: STRINGS.USER_VERIFICATION.CONNECT_BANK_ACCOUNT,
                completed: !!bank_account.length && bank_verified
            }
        },
        level_3: {
            '1': {
                title: STRINGS.formatString(STRINGS.SUMMARY.ACCOUNT_AGE_OF_MONTHS, TRADE_ACCOUNT_UPGRADE_MONTH[0]).join(' '),
                completed: checkMonth(user.created_at, TRADE_ACCOUNT_UPGRADE_MONTH[0])
            },
            '2': {
                title: STRINGS.formatString(
                    STRINGS.SUMMARY.TRADING_VOLUME_EQUIVALENT,
                    TRADING_VOLUME_CHART_LIMITS[0],
                    STRINGS.FIAT_CURRENCY_SYMBOL
                ).join(' '),
                completed: TRADING_VOLUME_CHART_LIMITS[0] <= lastMonthVolume
            }
        },
        level_4: {
            '1': {
                title: STRINGS.formatString(STRINGS.SUMMARY.ACCOUNT_AGE_OF_MONTHS, TRADE_ACCOUNT_UPGRADE_MONTH[1]).join(' '),
                completed: checkMonth(user.created_at, TRADE_ACCOUNT_UPGRADE_MONTH[1])
            },
            '2': {
                title: STRINGS.formatString(
                    STRINGS.SUMMARY.TRADING_VOLUME_EQUIVALENT,
                    TRADING_VOLUME_CHART_LIMITS[1],
                    STRINGS.FIAT_CURRENCY_SYMBOL
                ).join(' '),
                completed: TRADING_VOLUME_CHART_LIMITS[1] <= lastMonthVolume
            }
        }
    };
    return verificationObj[`level_${level}`];
};

const getAllCompleted = requirement => {
    return Object.keys(requirement).length === Object.keys(requirement).filter(key => requirement[key].completed).length;
};

const SummaryRequirements = ({ user, isAccountDetails = false, contentClassName = "", verificationLevel, lastMonthVolume, onUpgradeAccount }) => {
    const { phone_number, full_name, id_data = {}, bank_account } = user.userData;
    const selectedLevel = verificationLevel || user.verification_level;
    const requirement = getRequirements(user, selectedLevel, lastMonthVolume);
    let requirementResolved = getAllCompleted(requirement);
    return (
        <div className="d-flex">
            {!isAccountDetails && <div>
                <ReactSvg path={ICONS.VERIFICATION_DOC_STATUS} wrapperClassName="requirement-doc-icon" />
            </div>}
            <div className={classnames(contentClassName, "requirements-content-text", "summary-content-txt")}>
                <div className="my-2">
                    {Object.keys(requirement).map((step, index) => {
                        let reqObj = requirement[step];
                        return (
                            <div
                                key={index}
                                className={classnames(
                                    "d-flex",
                                    "justify-content-between",
                                    {
                                        "requirement-verified": !isAccountDetails,
                                        "requirement-not-verified": !isAccountDetails && !reqObj.completed 
                                    })}
                            >
                                <div>{`${step}. ${reqObj.title}`}</div>
                                <div>
                                    {reqObj.completed
                                        ? <SucessStatus isAccountDetails={isAccountDetails} />
                                        : <IncompleteStatus isAccountDetails={isAccountDetails} />
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
                {!isAccountDetails && !user.otp_enabled && 
                    <div className="trade-account-link mb-2">
                        <Link to='/security'>
                            {STRINGS.SUMMARY.ACTIVE_2FA_SECURITY.toUpperCase()}
                        </Link>
                    </div>
                }
                {(!isAccountDetails && ((user.verification_level < 1 && !full_name) ||
                    !id_data.verified ||
                    !phone_number ||
                    !bank_account.verified))
                    ? <div className="trade-account-link mb-2">
                        <Link to='/verification'>
                            {STRINGS.USER_VERIFICATION.GOTO_VERIFICATION.toUpperCase()}
                        </Link>
                    </div>
                    : null
                }
                {isAccountDetails && user.verification_level > 2 && selectedLevel === user.verification_level
                    ? <div className="mt-2">
                        <Button
                            label={STRINGS.SUMMARY.REQUEST_ACCOUNT_UPGRADE}
                            disabled={!requirementResolved}
                            onClick={onUpgradeAccount} />
                    </div>
                    : null
                }
            </div>
        </div>
    );
};

export default SummaryRequirements;