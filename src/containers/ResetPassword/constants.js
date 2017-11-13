import { ICONS } from '../../config/constants';

export const TEXTS = {
  TITLE: 'Set new password',
  SUBTITLE: `SSet new password`,
  HELP: 'help',
  ICON: ICONS.LETTER,
  FORM: {
    FIELDS: {
      password: {
        label: 'Password',
        placeholder: 'Type your password',
      },
      password_repeat: {
        label: 'Retype your password',
        placeholder: 'Retype your password',
      },
    },
    BUTTON: 'Set new password',
    VALIDATIONS: {
      PASSWORDS_DONT_MATCH: 'Password don\'t match',
    },
  },
}

export const RESET_PASSWORD_SUCCESS = {
  TITLE: 'Success',
  TEXT_1: 'You’ve successfully set up a new password.',
  TEXT_2: 'Click login below to proceed.',
  ICON: ICONS.CHECK,
  BUTTON: 'login'
}
