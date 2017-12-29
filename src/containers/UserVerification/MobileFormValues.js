import React from 'react';
import countries from '../../utils/countries';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const PHONE_OPTIONS = countries.map((country) => ({
  label: STRINGS.formatString(
    STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_CODE_DISPLAY,
   country.phoneCode, country.name
 ).join(''),
  value: country.phoneCode,
  icon: country.flag,
}));

export const generateFormValues = () => ({
  phone_country: {
    type: 'autocomplete',
    label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_LABEL,
    options: PHONE_OPTIONS,
    disabled: true,
  },
  phone_number: {
    type: 'text',
    label: STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_LABEL,
    disabled: true,
  },
})

export const generateEmailFormValues = () => ({
  email: {
    type: 'text',
    label: STRINGS.FORM_FIELDS.EMAIL_LABEL,
    disabled: true,
  }
})
