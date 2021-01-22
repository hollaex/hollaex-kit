import React from 'react';
import STRINGS from '../../config/localizedStrings';
import { getErrorLocalized } from '../../utils/errors';
import renderFields from '../../components/Form/factoryFields';
import { tokenKeyValidation } from '../../components/Form/validations';
import { reduxForm } from 'redux-form';

import { TYPE_GENERATE } from './ApiKeyModal';
export const FORM_NAME = 'ApiKeyForm';

export const generateFormValues = (type) => {
	if (type === TYPE_GENERATE) {
		return {
			name: {
				type: 'text',
				validate: [tokenKeyValidation],
				stringId:
					'DEVELOPERS_TOKENS_POPUP.FORM_NAME_LABEL,DEVELOPERS_TOKENS_POPUP.FORM_LABLE_PLACEHOLDER',
				label: STRINGS['DEVELOPERS_TOKENS_POPUP.FORM_NAME_LABEL'],
				placeholder: STRINGS['DEVELOPERS_TOKENS_POPUP.FORM_LABLE_PLACEHOLDER'],
				fullWidth: true,
				maxLength: 64,
			},
		};
	} else {
		return {};
	}
};

const BasicTokenForm = ({ handleSubmit, error, formFields }) => (
	<form onSubmit={handleSubmit}>
		{renderFields(formFields)}
		{error && (
			<div className="warning_text error_text">{getErrorLocalized(error)}</div>
		)}
	</form>
);

export const TokenForm = reduxForm({
	form: FORM_NAME,
})(BasicTokenForm);
