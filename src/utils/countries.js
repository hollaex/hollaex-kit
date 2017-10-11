// https://github.com/OpenBookPrices/country-data
import { countries, callingCountries } from 'country-data';

const convertCountry = (value) => {
	return {
		value: value.ioc || value.alpha3 || value.alpha2 ,
		name: value.name,
		label: value.name,
		phoneCode: value.countryCallingCodes.length > 0 ? value.countryCallingCodes[0] : '',
		flag: value.emoji,
	}
}

const filterCountries = (country) => (country.status === 'assigned');

export default countries.all.filter(filterCountries).map(convertCountry);
