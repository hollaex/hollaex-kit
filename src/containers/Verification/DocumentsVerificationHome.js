import React from 'react';
import moment from 'moment';

import { Button, PanelInformationRow } from '../../components';
import STRINGS from '../../config/localizedStrings';

const DocumentsVerificationHome = ({ user, setActivePageContent }) => {
    const { id_data } = user;
    if (id_data.status === 0) {
        return (
            <div>
                <Button label={STRINGS.USER_VERIFICATION.START_DOCUMENTATION_SUBMISSION} onClick={() => setActivePageContent(4)} />
            </div>
        );
    } else {
        return <div className="my-3">
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
            {id_data.status !== 3 && <div className="my-2">
                <Button label={STRINGS.USER_VERIFICATION.START_DOCUMENTATION_SUBMISSION} onClick={() => setActivePageContent(4)} />
            </div>}
        </div>;
    }
};

export default DocumentsVerificationHome;