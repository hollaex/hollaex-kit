import React from 'react';
import moment from 'moment';
import { required, requiredBoolean, isBefore } from '../../components/Form/validations';
import countries, { initialCountry } from '../../utils/countries';
import { ICONS } from '../../config/constants';
import { getFormattedDate } from '../../utils/string';
import STRINGS from '../../config/localizedStrings';
import { InformationSection } from './InformationSection';

const COUNTRIES_OPTIONS = countries.map((country) => ({
  label: country.name,
  value: country.value,
  icon: country.flag,
}));

const PHONE_OPTIONS = countries.map((country) => ({
  label: STRINGS.formatString(
    STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_CODE_DISPLAY,
   country.phoneCode, country.name
 ).join(''),
  value: country.phoneCode,
  icon: country.flag,
}));

export const generateFormValues = (language) => {
  return {
    personalInformation: {
      first_name: {
        type: 'text',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FIRST_NAME_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FIRST_NAME_PLACEHOLDER,
        validate: [required],
      },
      last_name: {
        type: 'text',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.LAST_NAME_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.LAST_NAME_PLACEHOLDER,
        validate: [required],
      },
      gender: {
        type: 'select',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_PLACEHOLDER,
        options: [
          { value: false, label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN, icon: ICONS.GENDER_M },
          { value: true, label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN, icon: ICONS.GENDER_F },
        ],
        validate: [requiredBoolean],
      },
      nationality: {
        type: 'autocomplete',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_PLACEHOLDER,
        options: COUNTRIES_OPTIONS,
        validate: [required],
      },
      dob: {
        type: 'date-dropdown',
        language,
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL,
        validate: [required, isBefore()],
        endDate: moment().add(1, 'days'),
        pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}'
      },
      country: {
        type: 'autocomplete',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_PLACEHOLDER,
        options: COUNTRIES_OPTIONS,
        validate: [required],
      },
      city: {
        type: 'text',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_PLACEHOLDER,
        validate: [required],
      },
      address: {
        type: 'text',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_PLACEHOLDER,
        validate: [required],
      },
      postal_code: {
        type: 'text',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_PLACEHOLDER,
        validate: [required],
      },
    },
    phone: {
      phone_country: {
        type: 'autocomplete',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_CODE_PLACEHOLDER,
        options: PHONE_OPTIONS,
        validate: [required],
      },
      phone_number: {
        type: 'text',
        label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_LABEL,
        placeholder: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_PLACEHOLDER,
        validate: [required],
      },
    },
  };
}

const PersonalInformationSection = () => (
  <InformationSection title={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PERSONAL_INFORMATION}>
    <div>{STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TEXT}</div>
  </InformationSection>
);

const PhoneSection = () => <InformationSection title={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PHONE} />;

export const information = {
  personalInformation: <PersonalInformationSection />,
  phone: <PhoneSection />,
}

export const prepareInitialValues = ({ id_data, bank_account, address, ...rest, timestamp }) => {
  const initialValues = {
    ...rest,
    ...address,
    country: address.country || initialCountry.value,
    nationality: rest.nationality || initialCountry.value,
    phone_country: rest.phone_country || initialCountry.phoneCode,
  };
  return initialValues;
}
