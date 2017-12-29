import React from 'react';
import moment from 'moment';
import { required, requiredBoolean, isBefore } from '../../components/Form/validations';
import { COUNTRIES_OPTIONS, PHONE_OPTIONS, initialCountry } from '../../utils/countries';
import { ICONS } from '../../config/constants';
import { getFormattedDate } from '../../utils/string';
import STRINGS from '../../config/localizedStrings';

export const generateFormValues = (language) => {
  return {
    full_name: {
      type: 'text',
      label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_LABEL,
      disabled: true,
    },
    gender: {
      type: 'select',
      label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL,
      options: [
        { value: false, label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN, icon: ICONS.GENDER_M },
        { value: true, label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN, icon: ICONS.GENDER_F },
      ],
      disabled: true,
    },
    dob: {
      type: 'date-dropdown',
      language,
      label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL,
      disabled: true,
    },
    nationality: {
      type: 'autocomplete',
      label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL,
      options: COUNTRIES_OPTIONS,
      disabled: true,
    },
    id_number: {
      type: 'text',
      label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ID_NUMBER_LABEL,
      placeholder: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ID_NUMBER_PLACEHOLDER,
      disabled: true,
    },
    id_issued_date: {
      type: 'date-dropdown',
      label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ISSUED_DATE_LABEL,
      disabled: true,
      language,
    },
    id_expiration_date: {
      type: 'date-dropdown',
      label: STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.EXPIRATION_DATE_PLACEHOLDER,
      disabled: true,
      language,
    },
    country: {
      type: 'autocomplete',
      label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL,
      options: COUNTRIES_OPTIONS,
      disabled: true,
    },
    city: {
      type: 'text',
      label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL,
      disabled: true,
    },
    address: {
      type: 'text',
      label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL,
      disabled: true,
    },
    postal_code: {
      type: 'text',
      label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL,
      disabled: true,
    },
  };
}

export const prepareInitialValues = ({ id_data, bank_account, address, ...rest, timestamp }) => {
  const initialValues = {
    ...rest,
    ...address,
    id_number: id_data.number,
    id_issued_date: id_data.issued_date,
    id_expiration_date: id_data.expiration_date,
  };
  return initialValues;
}
