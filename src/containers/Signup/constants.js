import { APP_TITLE } from '../../config/constants';
export const TEXTS = {
  TITLE: 'sign up',
  SIGNUP_TO: `Sign up to ${APP_TITLE}`,
  HELP: 'help',
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
        label: 'I have read and agree to the Terms of Use and Privacy Policy',
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
