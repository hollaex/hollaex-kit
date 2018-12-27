import React from 'react';
import moment from 'moment';

import { Button, PanelInformationRow } from '../../components';
import { getCountry } from './utils';
import STRINGS from '../../config/localizedStrings';

const IdentityVerificationHome = ({ user, setActivePageContent, setActiveTab }) => {
    const { address, id_data } = user;
    if (!address.country) {
        return (
            <div>
                <Button label={STRINGS.USER_VERIFICATION.START_IDENTITY_VERIFICATION} onClick={() => setActivePageContent(2)} />
            </div>
        );
    } else {
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
                <div className="my-3">
                    <PanelInformationRow
                        label={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_LABEL}
                        information={user.full_name}
                        className="title-font"
                        disable />
                    <div className="d-flex">
                        <PanelInformationRow
                            label={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL}
                            information={
                                user.gender === false
                                    ? STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN
                                    : STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN
                            }
                            className="title-font mr-2"
                            disable />
                        <PanelInformationRow
                            label={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL}
                            information={moment(user.dob).format('DD, MMMM, YYYY')}
                            className="title-font"
                            disable />
                    </div>
                    <PanelInformationRow
                        label={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL}
                        information={getCountry(user.nationality).name}
                        className="title-font"
                        disable />
                    <div className="d-flex">
                        <PanelInformationRow
                            label={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL}
                            information={getCountry(address.country).name}
                            className="title-font mr-2"
                            disable />
                        <PanelInformationRow
                            label={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL}
                            information={address.city}
                            className="title-font"
                            disable />
                    </div>
                    <div className="d-flex">
                        <div className="w-75">
                            <PanelInformationRow
                                label={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL}
                                information={address.address}
                                className="title-font"
                                disable />
                        </div>
                        <PanelInformationRow
                            label={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL}
                            information={address.postal_code}
                            className="title-font ml-2"
                            disable />
                    </div>
                </div>
                {id_data.status === 3
                    ? null
                    :<Button
                        label={STRINGS.USER_VERIFICATION.REVIEW_IDENTITY_VERIFICATION}
                        onClick={() => setActivePageContent(2)} />
                }
            </div>
        );
    }
};

export default IdentityVerificationHome;