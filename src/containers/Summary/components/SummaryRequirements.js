import React from 'react';
import ReactSvg from 'react-svg';
import classnames from 'classnames';
import { Link } from 'react-router';

import { ICONS } from '../../../config/constants';
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
            : <div className="requirement-status-warning">!</div>
        }
    </div>
);

const checkBankVerification = (accounts = []) => {
    return !!accounts.filter(acc => acc.status === 3).length;
};

const SummaryRequirements = ({ user, isAccountDetails = false, contentClassName="" }) => {
    const { phone_number, full_name, id_data = {}, bank_account } = user.userData;
    const bank_verified = checkBankVerification(bank_account);
    return (
        <div className="d-flex">
            {!isAccountDetails && <div>
                <ReactSvg path={ICONS.VERIFICATION_DOC_STATUS} wrapperClassName="requirement-doc-icon" />
            </div>}
            <div className={classnames(contentClassName, "requirements-content-text", "summary-content-txt")}>
                <div
                    className={classnames(
                        "d-flex",
                        "justify-content-between",
                        {
                            "requirement-verified": !isAccountDetails,
                            "requirement-not-verified": !isAccountDetails && user.verification_level < 1 && !full_name 
                        })}
                >
                    <div>{`1. ${STRINGS.USER_VERIFICATION.TITLE_USER_DOCUMENTATION}`}</div>
                    <div>
                        {user.verification_level < 1 && !full_name
                            ? <IncompleteStatus isAccountDetails={isAccountDetails} />
                            : <SucessStatus isAccountDetails={isAccountDetails} />
                        }
                    </div>
                </div>
                <div
                    className={classnames(
                        "d-flex",
                        "justify-content-between",
                        { 
                            "requirement-verified": !isAccountDetails,
                            "requirement-not-verified": !isAccountDetails && !id_data.verified
                        })}
                >
                    <div>{`2. ${STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS}`}</div>
                    <div>
                        {id_data.verified
                            ? <SucessStatus isAccountDetails={isAccountDetails} />
                            : <IncompleteStatus isAccountDetails={isAccountDetails} />
                        }
                    </div>
                </div>
                <div
                    className={classnames(
                        "d-flex",
                        "justify-content-between",
                        {
                            "requirement-verified": !isAccountDetails,
                            "requirement-not-verified": !isAccountDetails && !phone_number
                        })}
                >
                    <div>{`3. ${STRINGS.USER_VERIFICATION.TITLE_MOBILE}`}</div>
                    <div>
                        {phone_number
                            ? <SucessStatus isAccountDetails={isAccountDetails} />
                            : <IncompleteStatus isAccountDetails={isAccountDetails} />
                        }
                    </div>
                </div>
                <div
                    className={classnames(
                        "d-flex",
                        "justify-content-between",
                        {
                            "requirement-verified": !isAccountDetails,
                            "requirement-not-verified": !isAccountDetails && !bank_verified
                        })}
                >
                    <div>{`4. ${STRINGS.USER_VERIFICATION.CONNECT_BANK_ACCOUNT}`}</div>
                    <div>
                        {bank_account.length && bank_verified
                            ? <SucessStatus isAccountDetails={isAccountDetails} />
                            : <IncompleteStatus isAccountDetails={isAccountDetails} />
                        }
                    </div>
                </div>
                <div
                    className={classnames(
                        "d-flex",
                        "justify-content-between",
                        "mb-2",
                        {
                            "requirement-verified": !isAccountDetails,
                            "requirement-not-verified": !isAccountDetails && !user.otp_enabled
                        })}
                >
                    <div>{`5. ${STRINGS.USER_VERIFICATION.ACTIVATE_2FA}`}</div>
                    <div>
                        {user.otp_enabled
                            ? <SucessStatus isAccountDetails={isAccountDetails} />
                            : <IncompleteStatus isAccountDetails={isAccountDetails} />
                        }
                    </div>
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
            </div>
        </div>
    );
};

export default SummaryRequirements;