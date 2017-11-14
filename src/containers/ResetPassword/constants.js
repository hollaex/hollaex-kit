import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

const { FORM_FIELDS, RESET_PASSWORD, VALIDATIONS, HELP_TEXT, LOGIN_TEXT, SUCCESS_TEXT } = STRINGS;

export const TEXTS = {
  ...RESET_PASSWORD,
  HELP: HELP_TEXT,
  ICON: ICONS.LETTER,
  FORM: {
    FIELDS: {
      password: {
        label: FORM_FIELDS.PASSWORD_LABEL,
        placeholder: FORM_FIELDS.PASSWORD_PLACEHOLDER,
      },
      password_repeat: {
        label: FORM_FIELDS.PASSWORD_REPEAT_LABEL,
        placeholder: FORM_FIELDS.PASSWORD_REPEAT_PLACEHOLDER,
      },
    },
    VALIDATIONS: {
      PASSWORDS_DONT_MATCH: VALIDATIONS.PASSWORDS_DONT_MATCH,
    },
  },
}

export const RESET_PASSWORD_SUCCESS = {
  TITLE: SUCCESS_TEXT,
  ICON: ICONS.CHECK,
  BUTTON: LOGIN_TEXT,
  ...STRINGS.RESET_PASSWORD_SUCCESS,
}
