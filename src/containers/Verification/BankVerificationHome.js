import React from 'react';
import ReactSVG from 'react-svg';

import { Button, PanelInformationRow } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS, MAX_NUMBER_BANKS } from '../../config/constants';

const BankVerificationHome = ({ user, setActivePageContent, setActiveTab }) => {
    const { bank_account } = user;
    if (!bank_account.length) {
        return <div>
            <Button label={STRINGS.USER_VERIFICATION.START_BANK_VERIFICATION} onClick={() => setActivePageContent(1)} />
        </div>;
    } else {
        const lastVerified = bank_account[bank_account.length - 1];
        return (
            <div>
                <div className="font-weight-bold text-lowercase">
                    {STRINGS.formatString(
                        STRINGS.USER_VERIFICATION.BANK_VERIFICATION_HELP_TEXT,
                        <span className="verification_link pointer" onClick={() => setActiveTab(4)}>
                            {STRINGS.USER_VERIFICATION.DOCUMENT_SUBMISSION}
                        </span>)
                    }
                </div>
                {bank_account.map((account, index) => {
                    return <div key={index} className="d-flex my-4">
                        {account.status === 1 && <div className="d-flex align-items-center mr-3">
                            <ReactSVG path={ICONS.PENDING_TIMER} wrapperClassName="account-pending-icon" />
                        </div>}
                        <div className="w-100">
                            <PanelInformationRow
                                label={STRINGS.USER_VERIFICATION.BANK_NAME}
                                information={account.bank_name}
                                className="title-font"
                                disable />
                            <div className="d-flex">
                                <PanelInformationRow
                                    label={STRINGS.USER_VERIFICATION.ACCOUNT_NUMBER}
                                    information={account.account_number}
                                    className="mr-3 title-font"
                                    disable />
                                <PanelInformationRow
                                    label={STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.SHABA_NUMBER_LABEL}
                                    information={account.shaba_number}
                                    className="mr-3 title-font"
                                    disable />
                                <PanelInformationRow
                                    label={STRINGS.USER_VERIFICATION.CARD_NUMBER}
                                    information={account.card_number}
                                    className="title-font"
                                    disable />
                            </div>
                        </div>
                    </div>
                })}
                {lastVerified.status === 3 && MAX_NUMBER_BANKS > bank_account.length
                    ? <Button label={STRINGS.USER_VERIFICATION.ADD_ANOTHER_BANK_ACCOUNT} onClick={() => setActivePageContent(1)} />
                    : null}
            </div>
        );
    }
};

export default BankVerificationHome;