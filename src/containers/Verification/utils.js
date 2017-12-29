import { initialCountry } from '../../utils/countries';

export { PHONE_OPTIONS, COUNTRIES_OPTIONS } from '../../utils/countries';

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
