import React from 'react';

import TermsForm from './Form';
import STRINGS from '../../config/localizedStrings';

const TermsOfSerivce = ({
    formFields,
    onSubmitTerms
}) => {
    return (
        <div>
            <div className='title_wrapper mb-3'>{STRINGS.TERMS_OF_SERVICES.TITLE}</div>
            <div className='agreement_wrapper mb-3 p-3'>
                {STRINGS.TERMS_OF_SERVICES.SERVICE_AGREEMENT}
            </div>
            <div className="w-100">
                <TermsForm formFields={formFields} onSubmit={onSubmitTerms} />
            </div>
        </div>
    );
}

export default TermsOfSerivce;
