import { initialCountry, COUNTRIES } from '../../utils/countries';

export const mobileInitialValues = ({ country }) => {
	return { phone_country: getCountry(country).phoneCode };
};

export const identityInitialValues = ({ full_name, gender, nationality, dob, address }) => {
	const initialValues = {
		full_name,
		country: initialCountry.value,
		nationality: initialCountry.value
	};
	if (nationality) {
		initialValues.nationality = getCountry(nationality).value;
	}
	if (gender || gender === false) {
		initialValues.gender = gender;
	}
	if (dob) {
		initialValues.dob = dob;
	}
	if (address.city) {
		initialValues.country = getCountry(address.country).value;
		initialValues.city = address.city;
		initialValues.address = address.address;
		initialValues.postal_code = address.postal_code;
	}

	return initialValues;
};

export const getCountry = country => {
	const filterValue = COUNTRIES.filter(data => data.value === country);
	if (filterValue.length) return filterValue[0];
	return initialCountry;
};
