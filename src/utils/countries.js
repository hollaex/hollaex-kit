// https://github.com/OpenBookPrices/country-data
import React from 'react';
import classnames from 'classnames';
import { countries } from 'country-data';

const convertCountry = (value) => {
	return {
		value: value.alpha2,
		name: value.name,
		label: value.name,
		phoneCode: value.countryCallingCodes.length > 0 ? value.countryCallingCodes[0] : '',
		flag: <span className={classnames('flag-icon', `flag-icon-${value.alpha2.toLowerCase()}`, 'icon')}></span>,
	}
}

const filterCountries = (country) => (country.status === 'assigned' && country.alpha2);

export default countries.all.filter(filterCountries).map(convertCountry);
