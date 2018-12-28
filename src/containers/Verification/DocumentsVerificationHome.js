import React from 'react';
import moment from 'moment';

import { Button, PanelInformationRow } from '../../components';
import STRINGS from '../../config/localizedStrings';

const DocumentsVerificationHome = ({ user, setActivePageContent }) => {
    const { id_data } = user;
    let note = '';
    if (id_data.status === 1) {
        note = STRINGS.USER_VERIFICATION.DOCUMENT_PENDING_NOTE;
    } else if (id_data.status === 2) {
        note = id_data.note;
    } else {
        note = STRINGS.USER_VERIFICATION.DOCUMENT_VERIFIED_NOTE;
    }
    return (
        <div>
            {id_data.status !== 0 &&
                <div className="my-3">
                    <PanelInformationRow
                        label={STRINGS.USER_VERIFICATION.CUSTOMER_SUPPORT_MESSAGE}
                        information={note}
                        className="title-font"
                        disable
                    />
                </div>
            }
            {id_data.status === 1 && <div className="my-3">
                <PanelInformationRow
                    label={STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.TYPE_LABEL}
                    information={id_data.type}
                    className="title-font"
                    disable />
                <PanelInformationRow
                    label={STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ID_NUMBER_LABEL}
                    information={id_data.number}
                    className="title-font"
                    disable />
                <div className="d-flex">
                    <PanelInformationRow
                        label={STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ISSUED_DATE_LABEL}
                        information={moment(id_data.issued_date).format('DD, MMMM, YYYY')}
                        className="title-font mr-2"
                        disable />
                    <PanelInformationRow
                        label={STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.EXPIRATION_DATE_LABEL}
                        information={moment(id_data.expiration_date).format('DD, MMMM, YYYY')}
                        className="title-font"
                        disable />
                </div>
            </div>}
            {id_data.status !== 3 && <div className="my-2">
                <Button
                    label={id_data.status === 0
                        ? STRINGS.USER_VERIFICATION.START_DOCUMENTATION_SUBMISSION
                        : STRINGS.USER_VERIFICATION.START_DOCUMENTATION_RESUBMISSION
                    }
                    onClick={() => setActivePageContent(4)} />
            </div>}
        </div>
    );
};

export default DocumentsVerificationHome;