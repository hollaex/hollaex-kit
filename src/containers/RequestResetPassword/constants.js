import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

const { FORM_FIELDS, REQUEST_RESET_PASSWORD, VALIDATIONS, LOGIN_TEXT, CONTACT_US_TEXT } = STRINGS;

export const TEXTS = {
  ...REQUEST_RESET_PASSWORD,
  FORM: {
    FIELDS: {
      email: {
        label: FORM_FIELDS.EMAIL_LABEL,
        placeholder: FORM_FIELDS.EMAIL_PLACEHOLDER,
      },
    },
    VALIDATIONS: {
      TYPE_EMAIL: VALIDATIONS.TYPE_EMAIL,
    },
  },
  ICON: ICONS.LETTER,
}

export const REQUEST_RESET_PASSWORD_SUCCESS = {
  ...STRINGS.REQUEST_RESET_PASSWORD_SUCCESS,
  ICON: ICONS.LETTER,
  BUTTON_1: LOGIN_TEXT,
  BUTTON_2: CONTACT_US_TEXT,
}
