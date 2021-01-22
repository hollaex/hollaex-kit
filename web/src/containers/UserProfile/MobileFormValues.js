import { PHONE_OPTIONS } from '../../utils/countries';
import STRINGS from '../../config/localizedStrings';
import { isMobile } from 'react-device-detect';

export const generateFormValues = () => ({
	phone_country: {
		type: 'autocomplete',
		label:
			STRINGS[
				'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_LABEL'
			],
		options: PHONE_OPTIONS,
		disabled: true,
		fullWidth: isMobile,
	},
	phone_number: {
		type: 'text',
		label:
			STRINGS[
				'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_LABEL'
			],
		disabled: true,
		fullWidth: isMobile,
	},
});
