import { ICONS } from '../../config/constants';

export const TEXTS = {
  TITLE: 'Account Recovery',
  SUBTITLE: `Recover your account below`,
  SUPPORT: 'Contact Support',
  FORM: {
    FIELDS: {
      email: {
        label: 'Email',
        placeholder: 'Type your email',
      },
    },
    BUTTON: 'Send recovery link',
    VALIDATIONS: {
      TYPE_EMAIL: 'Type your E-mail',
    },
  },
  ICON: ICONS.LETTER,
}

export const REQUEST_RESET_PASSWORD_SUCCESS = {
  TITLE: 'Password reset sent',
  ICON: ICONS.LETTER,
  BUTTON_1: 'login',
  BUTTON_2: 'contact us',
  TEXT: 'If an account exists for the email address, an email has been sent to it with reset instructions. Please check your email and click the link to complete your password reset.',
}
