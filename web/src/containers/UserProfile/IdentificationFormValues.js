import {
	COUNTRIES_OPTIONS,
	NATIONAL_COUNTRY_VALUE,
} from '../../utils/countries';
import STRINGS from '../../config/localizedStrings';
import { isMobile } from 'react-device-detect';

export const generateFormValues = (
	language,
	nationality = NATIONAL_COUNTRY_VALUE,
	ICONS
) => {
	const ID_NUMBER_TYPE =
		nationality === NATIONAL_COUNTRY_VALUE ? 'NATIONAL' : 'PASSPORT';
	const formValues = {
		full_name: {
			type: 'text',
			label:
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_LABEL'
				],
			disabled: true,
			fullWidth: isMobile,
		},
		gender: {
			type: 'select',
			label:
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL'
				],
			options: [
				{
					value: false,
					label:
						STRINGS[
							'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN'
						],
					icon: ICONS['GENDER_MALE'],
				},
				{
					value: true,
					label:
						STRINGS[
							'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN'
						],
					icon: ICONS['GENDER_FEMALE'],
				},
			],
			disabled: true,
			fullWidth: isMobile,
		},
		dob: {
			type: 'date-dropdown',
			language,
			label:
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL'
				],
			disabled: true,
			fullWidth: isMobile,
		},
		nationality: {
			type: 'autocomplete',
			label:
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL'
				],
			options: COUNTRIES_OPTIONS,
			disabled: true,
			fullWidth: isMobile,
		},
		id_number: {
			type: 'text',
			label:
				STRINGS[
					`USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ID_${ID_NUMBER_TYPE}_NUMBER_LABEL`
				],
			placeholder:
				STRINGS[
					`USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ID_${ID_NUMBER_TYPE}_NUMBER_PLACEHOLDER`
				],
			disabled: true,
			fullWidth: isMobile,
		},
		id_issued_date: {
			type: 'date-dropdown',
			label:
				STRINGS[
					'USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ISSUED_DATE_LABEL'
				],
			disabled: true,
			language,
			fullWidth: isMobile,
		},
		id_expiration_date: {
			type: 'date-dropdown',
			label:
				STRINGS[
					'USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.EXPIRATION_DATE_LABEL'
				],
			disabled: true,
			language,
			fullWidth: isMobile,
		},
		country: {
			type: 'autocomplete',
			label:
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL'
				],
			options: COUNTRIES_OPTIONS,
			disabled: true,
			fullWidth: isMobile,
		},
		city: {
			type: 'text',
			label:
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL'
				],
			disabled: true,
			fullWidth: isMobile,
		},
		address: {
			type: 'text',
			label:
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL'
				],
			disabled: true,
			fullWidth: isMobile,
		},
		postal_code: {
			type: 'text',
			label:
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL'
				],
			disabled: true,
			fullWidth: isMobile,
		},
	};

	if (nationality === NATIONAL_COUNTRY_VALUE) {
		delete formValues.id_issued_date;
	}
	return formValues;
};

export const prepareInitialValues = ({
	id_data,
	bank_account,
	address,
	timestamp,
	...rest
}) => {
	const initialValues = {
		...rest,
		...address,
		id_number: id_data.number,
		id_issued_date: id_data.issued_date,
		id_expiration_date: id_data.expiration_date,
	};
	return initialValues;
};
