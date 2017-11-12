import { ICONS } from '../../config/constants';

export const TEXTS = {
  TITLE: 'Activation Email Request',
  FORM: {
    FIELDS: {
      email: {
        label: 'Email',
        placeholder: 'Type your email',
      },
    },
    BUTTON: 'Request Email',
    VALIDATIONS: {
      TYPE_EMAIL: 'Type your E-mail',
      INVALID_EMAIL: 'Invalid email address',
    },
  },
}

export const VERIFICATION_RESEND_TEXTS = {
  TITLE: 'Verification reset send',
  TEXT_1: 'If after a few minutes you still have not receieved an email verification then please contact us below.',
  BUTTON: 'CONTACT US',
  ICON: ICONS.CHECK,
}
