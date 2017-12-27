import STRINGS from '../../config/localizedStrings';
import countries, { initialCountry } from '../../utils/countries';

export const PHONE_OPTIONS = countries.map((country) => ({
  label: STRINGS.formatString(
    STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_CODE_DISPLAY,
   country.phoneCode, country.name
 ).join(''),
  value: country.phoneCode,
  icon: country.flag,
}));

export const COUNTRIES_OPTIONS = countries.map((country) => ({
  label: country.name,
  value: country.value,
  icon: country.flag,
}));

export const mobileInitialValues = ({
  phone_country: initialCountry.phoneCode,
})

export const identityInitialValues = ({ full_name }) => {
  const initialValues = {
    full_name,
    country: initialCountry.value,
    nationality: initialCountry.value,
  };

  return initialValues;
}
