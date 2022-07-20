import PhoneNumber from 'awesome-phonenumber';
import _get from 'lodash/get';
import { isMobile } from 'react-device-detect';

import STRINGS from 'config/localizedStrings';
import { required } from 'components/Form/validations';
import { initialCountry, COUNTRIES } from 'utils/countries';
import { generateDynamicStringKey } from 'utils/id';

export const mobileInitialValues = ({ country }, defaults) => {
	let countryVal = country ? country : _get(defaults, 'country');
	return { phone_country: getCountry(countryVal).phoneCodes[0] || '' };
};

export const identityInitialValues = (
	{ full_name, gender, nationality, dob, address, userData },
	constants
) => {
	const initialValues = {
		full_name: full_name || userData.full_name,
		country: getCountry(
			_get(constants, 'defaults.country', initialCountry.value)
		).value,
		nationality: getCountry(
			_get(constants, 'defaults.country', initialCountry.value)
		).value,
	};
	if (nationality) {
		initialValues.nationality = getCountry(nationality).value;
	}
	if (gender || gender === false) {
		initialValues.gender = gender;
	} else if (userData.gender || userData.gender === false) {
		initialValues.gender = userData.gender;
	}
	if (dob) {
		initialValues.dob = dob;
	} else if (userData.dob) {
		initialValues.dob = userData.dob;
	}
	if (address.city) {
		initialValues.country = getCountry(address.country).value;
		initialValues.city = address.city;
		initialValues.address = address.address;
		initialValues.postal_code = address.postal_code;
	}

	return initialValues;
};

export const documentInitialValues = ({ nationality, id_data = {} }) => {
	const { type, number, issued_date, expiration_date } = id_data;
	const initialValues = {};
	if (type) initialValues.type = type;
	else if (nationality === 'IR') initialValues.type = 'id';
	else initialValues.type = 'passport';

	if (number) initialValues.number = number;
	if (issued_date) initialValues.issued_date = issued_date;
	if (expiration_date) initialValues.expiration_date = expiration_date;

	return initialValues;
};

export const getCountry = (country) => {
	const filterValue = COUNTRIES.filter(
		({ value, name }) =>
			value?.toUpperCase() === country.toUpperCase() ||
			name?.toUpperCase() === country.toUpperCase()
	);
	if (filterValue.length) return filterValue[0];
	return initialCountry;
};

export const getCountryFromNumber = (phone = '') => {
	const alpha2 = PhoneNumber(phone).getRegionCode();
	const country =
		COUNTRIES.find(({ value }) => value === alpha2) || initialCountry;
	return country;
};

export const generateUserPaymentFormFields = ({ data = [] }, paymentKey) => {
	const formFields = {};
	const generateId = generateDynamicStringKey('ULTIMATE_FIAT', paymentKey);

	data.forEach(({ key, label, placeholder, required: is_required }) => {
		const [labelId, placeholderId] = [
			generateId(key),
			generateId(`${key}_placeholder`),
		];

		formFields[key] = {
			type: 'text',
			stringId: `${labelId},${placeholderId}`,
			label: STRINGS[labelId] || label,
			placeholder:
				STRINGS[placeholderId] || placeholder || STRINGS[labelId] || label,
			validate: is_required ? [required] : [],
			fullWidth: isMobile,
			ishorizontalfield: true,
		};
	});

	return formFields;
};
