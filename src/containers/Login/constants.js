import { APP_TITLE } from '../../config/constants';
export const TEXTS = {
  TITLE: 'login',
  LOGIN_TO: `Login to ${APP_TITLE}`,
  CANT_LOGIN: 'Can\'t login?',
  NO_ACCOUNT: 'Don\'t have an account?',
  CREATE_ACCOUNT: 'Create one here',
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
    },
    BUTTON: 'Login',
    VALIDATIONS: {
      OTP_LOGIN: 'Provide OTP code to login',
      INVALID_EMAIL: 'Invalid email address',
      TYPE_EMAIL: 'Type your E-mail',
    },
  },
}
