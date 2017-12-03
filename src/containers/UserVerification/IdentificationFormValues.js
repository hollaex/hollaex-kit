import React from 'react';
import moment from 'moment';
import { required, requiredBoolean, isBefore } from '../../components/Form/validations';
import countries from '../../utils/countries';
import { ICONS } from '../../config/constants';
import { getFormattedDate } from '../../utils/string';
import { TEXTS } from './constants';

const { USER_DOCUMENTATION_FORM } = TEXTS;
const { FORM_FIELDS, INFORMATION } = USER_DOCUMENTATION_FORM;

const COUNTRIES_OPTIONS = countries.map((country) => ({
  label: country.name,
  value: country.value,
  icon: country.flag,
}));

const PHONE_OPTIONS = countries.map((country) => ({
  label: `${country.name} (${country.phoneCode})`,
  value: country.phoneCode,
  icon: country.flag,
}));

export const generateFormValues = (language) => {
  return {
    personalInformation: {
      first_name: {
        type: 'text',
        label: FORM_FIELDS.FIRST_NAME_LABEL,
        placeholder: FORM_FIELDS.FIRST_NAME_PLACEHOLDER,
        validate: [required],
      },
      last_name: {
        type: 'text',
        label: FORM_FIELDS.LAST_NAME_LABEL,
        placeholder: FORM_FIELDS.LAST_NAME_PLACEHOLDER,
        validate: [required],
      },
      gender: {
        type: 'select',
        label: FORM_FIELDS.GENDER_LABEL,
        placeholder: FORM_FIELDS.GENDER_PLACEHOLDER,
        options: [
          { value: false, label: FORM_FIELDS.GENDER_OPTIONS.MAN, icon: ICONS.GENDER_M },
          { value: true, label: FORM_FIELDS.GENDER_OPTIONS.WOMAN, icon: ICONS.GENDER_F },
        ],
        validate: [requiredBoolean],
      },
      nationality: {
        type: 'autocomplete',
        label: FORM_FIELDS.NATIONALITY_LABEL,
        placeholder: FORM_FIELDS.NATIONALITY_PLACEHOLDER,
        options: COUNTRIES_OPTIONS,
        validate: [required],
      },
      dob: {
        type: 'date-dropdown',
        language,
        label: FORM_FIELDS.DOB_LABEL,
        validate: [required, isBefore()],
        endDate: moment().add(1, 'days'),
        pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}'
      },
      country: {
        type: 'autocomplete',
        label: FORM_FIELDS.COUNTRY_LABEL,
        placeholder: FORM_FIELDS.COUNTRY_PLACEHOLDER,
        options: COUNTRIES_OPTIONS,
        validate: [required],
      },
      city: {
        type: 'text',
        label: FORM_FIELDS.CITY_LABEL,
        placeholder: FORM_FIELDS.CITY_PLACEHOLDER,
        validate: [required],
      },
      address: {
        type: 'text',
        label: FORM_FIELDS.ADDRESS_LABEL,
        placeholder: FORM_FIELDS.ADDRESS_PLACEHOLDER,
        validate: [required],
      },
      postal_code: {
        type: 'text',
        label: FORM_FIELDS.POSTAL_CODE_LABEL,
        placeholder: FORM_FIELDS.POSTAL_CODE_PLACEHOLDER,
        validate: [required],
      },
    },
    phone: {
      phone_country: {
        type: 'autocomplete',
        label: FORM_FIELDS.PHONE_NUMBER_LABEL,
        placeholder: FORM_FIELDS.PHONE_CODE_PLACEHOLDER,
        options: PHONE_OPTIONS,
        validate: [required],
      },
      phone_number: {
        type: 'text',
        label: FORM_FIELDS.PHONE_NUMBER_LABEL,
        placeholder: FORM_FIELDS.PHONE_NUMBER_PLACEHOLDER,
        validate: [required],
      },
    },
  };
}

const InformationSection = ({ title, children}) => (
  <div className="information_section">
    <span className="information_section_title">{title}</span>
    {children}
  </div>
)

export const information = {
  personalInformation: (
    <InformationSection title="Personal Information">
      <div>{INFORMATION.TEXT}</div>
    </InformationSection>
  ),
  phone: <InformationSection title="Phone" />,
}

export const prepareInitialValues = ({ id_data, bank_account, address, ...rest, timestamp }) => {
  const initialValues = {
    ...rest,
    ...address,
  };
  return initialValues;
}
