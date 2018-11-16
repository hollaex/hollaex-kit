import React from 'react';
import ReactSvg from 'react-svg';
import classnames from 'classnames';

import { ICONS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const SummaryRequirements = ({ user }) => {
    const { phone_number, full_name, id_data = {}, bank_account = {} } = user.userData;
    return (
        <div className="summary-section_1 d-flex">
            <div>
                <ReactSvg path={ICONS.VERIFICATION_DOC_STATUS} wrapperClassName="requirement-doc-icon" />
            </div>
            <div className="requirements-content-text">
                <div
                    className={classnames(
                        "requirement-verified",
                        "d-flex",
                        "justify-content-between",
                        { "requirement-not-verified": user.verification_level < 1 && !full_name })}
                >
                    <div>{`1. ${STRINGS.USER_VERIFICATION.TITLE_USER_DOCUMENTATION}`}</div>
                    <div>
                        {user.verification_level < 1 && !full_name
                            ? <div className="requirement-status-warning">!</div>
                            : <ReactSvg path={ICONS.GREEN_CHECK} wrapperClassName="requirement-stauts" />
                        }
                    </div>
                </div>
                <div
                    className={classnames(
                        "requirement-verified",
                        "d-flex",
                        "justify-content-between",
                        { "requirement-not-verified": !id_data.verified })}
                >
                    <div>{`2. ${STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS}`}</div>
                    <div>
                        {id_data.verified
                            ? <ReactSvg path={ICONS.GREEN_CHECK} wrapperClassName="requirement-stauts" />
                            : <div className="requirement-status-warning">!</div>
                        }
                    </div>
                </div>
                <div
                    className={classnames(
                        "requirement-verified",
                        "d-flex",
                        "justify-content-between",
                        { "requirement-not-verified": !phone_number })}
                >
                    <div>{`3. ${STRINGS.USER_VERIFICATION.TITLE_MOBILE}`}</div>
                    <div>
                        {phone_number
                            ? <ReactSvg path={ICONS.GREEN_CHECK} wrapperClassName="requirement-stauts" />
                            : <div className="requirement-status-warning">!</div>
                        }
                    </div>
                </div>
                <div
                    className={classnames(
                        "requirement-verified",
                        "d-flex",
                        "justify-content-between",
                        { "requirement-not-verified": !bank_account.verified })}
                >
                    <div>{`4. ${STRINGS.USER_VERIFICATION.CONNECT_BANK_ACCOUNT}`}</div>
                    <div>
                        {bank_account.verified
                            ? <ReactSvg path={ICONS.GREEN_CHECK} wrapperClassName="requirement-stauts" />
                            : <div className="requirement-status-warning">!</div>
                        }
                    </div>
                </div>
                <div
                    className={classnames(
                        "requirement-verified",
                        "d-flex",
                        "justify-content-between",
                        "mb-2",
                        { "requirement-not-verified": !user.otp_enabled })}
                >
                    <div>{`5. ${STRINGS.USER_VERIFICATION.ACTIVATE_2FA}`}</div>
                    <div>
                        {user.otp_enabled
                            ? <ReactSvg path={ICONS.GREEN_CHECK} wrapperClassName="requirement-stauts" />
                            : <div className="requirement-status-warning">!</div>
                        }
                    </div>
                </div>
                <div className="trade-account-link mb-2">{STRINGS.SUMMARY.ACTIVE_2FA_SECURITY.toUpperCase()}</div>
                <div className="trade-account-link mb-2">{STRINGS.USER_VERIFICATION.GOTO_VERIFICATION.toUpperCase()}</div>
            </div>
        </div>
    );
};

export default SummaryRequirements;