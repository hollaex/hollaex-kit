import React from 'react';

import TermsForm from './Form';
import { requiredWithCustomMessage } from '../../components/Form/validations';
import STRINGS from '../../config/localizedStrings';

const formFields = {
	agreeTerms: {
		type: 'checkbox',
		fullWidth: true,
		validate: [requiredWithCustomMessage(STRINGS['VALIDATIONS.ACCEPT_TERMS'])],
		label: STRINGS['TERMS_OF_SERVICES.AGREE_TERMS_LABEL'],
	},
	agreeRisk: {
		type: 'checkbox',
		fullWidth: true,
		validate: [requiredWithCustomMessage(STRINGS['VALIDATIONS.ACCEPT_RISKS'])],
		label: STRINGS['TERMS_OF_SERVICES.RISK_INVOLVED_LABEL'],
	},
};

const TermsOfServices = ({ onAcceptTerms }) => {
	return (
		<div className={'terms_wrapper m-auto'}>
			<div className="title_wrapper mb-3">
				{STRINGS['TERMS_OF_SERVICES.TITLE']}
			</div>
			<div className="agreement_wrapper mb-3 p-3">
				{STRINGS['TERMS_OF_SERVICES.SERVICE_AGREEMENT']}
			</div>
			<div className="w-100">
				<TermsForm formFields={formFields} onSubmit={onAcceptTerms} />
			</div>
		</div>
	);
};

export default TermsOfServices;
