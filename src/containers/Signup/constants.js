import { APP_TITLE, ICONS } from '../../config/constants';

export const TEXTS = {
  TITLE: 'sign up',
  SIGNUP_TO: `Sign up to ${APP_TITLE}`,
  HELP: 'help',
  NO_EMAIL: 'Haven\'t receieved the email?',
  REQUEST_EMAIL: 'Request another one here',
  FORM: {
    FIELDS: {
      email: {
        label: 'Email',
        placeholder: 'Type your email',
      },
      password: {
        label: 'Password',
        placeholder: 'Type your password',
      },
      password_repeat: {
        label: 'Retype your password',
        placeholder: 'Retype your password',
      },
      terms: {
        label: 'I have read and agree to the',
        generalTerms: 'General Terms',
        and: ' and ',
        privacyPolicy: 'Privacy Policy',
      }
    },
    BUTTON: 'Sign up',
    VALIDATIONS: {
      USER_EXIST: 'Email has already been registered',
      PASSWORDS_DONT_MATCH: 'Password don\'t match',
      ACCEPT_TERMS: 'You have not agreed to the Terms of use and Privacy Policy',
      TYPE_EMAIL: 'Type your E-mail',
      INVALID_EMAIL: 'Invalid email address',
    },
  },
}

export const VERIFICATION_TEXTS = {
  TITLE: 'verification sent',
  TEXT_1: 'Check your email and click the link to verifiy yourself.',
  TEXT_2: 'If you have not receieved any email verification and you have checked your junk mail then you can try clicking resend below.',
  ICON: ICONS.CHECK,
}
