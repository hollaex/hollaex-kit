import React from 'react';
import { PHONE_OPTIONS } from '../../utils/countries';
import STRINGS from '../../config/localizedStrings';

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
