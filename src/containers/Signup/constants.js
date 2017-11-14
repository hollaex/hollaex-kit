import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

const { FORM_FIELDS, SIGN_UP, VALIDATIONS, HELP_TEXT, SIGNUP_TEXT, APP_TITLE } = STRINGS;

const BlueLink = ({ text, ...rest}) => (
  <Link
    {...rest}
    target="_blank"
    className={classnames('blue-link', 'dialog-link', 'pointer')}
  >
    {text}
  </Link>
);

export const TEXTS = {
  TITLE: SIGNUP_TEXT,
  SIGNUP_TO: STRINGS.formatString(SIGN_UP.SIGNUP_TO, APP_TITLE),
  HELP: HELP_TEXT,
  NO_EMAIL: SIGN_UP.NO_EMAIL,
  REQUEST_EMAIL: SIGN_UP.REQUEST_EMAIL,
  FORM: {
    FIELDS: {
      email: {
        label: FORM_FIELDS.EMAIL_LABEL,
        placeholder: FORM_FIELDS.EMAIL_PLACEHOLDER,
      },
      password: {
        label: FORM_FIELDS.PASSWORD_LABEL,
        placeholder: FORM_FIELDS.PASSWORD_PLACEHOLDER,
      },
      password_repeat: {
        label: FORM_FIELDS.PASSWORD_REPEAT_LABEL,
        placeholder: FORM_FIELDS.PASSWORD_REPEAT_PLACEHOLDER,
      },
      terms: {
        label: STRINGS.formatString(
          SIGN_UP.TERMS.text,
          <BlueLink to="/general-terms" text={SIGN_UP.TERMS.terms} />,
          <BlueLink to="/privacy-policy" text={SIGN_UP.TERMS.policy} />,
        ),
      },
    },
    BUTTON: SIGNUP_TEXT,
    VALIDATIONS: {
      USER_EXIST: VALIDATIONS.USER_EXIST,
      PASSWORDS_DONT_MATCH: VALIDATIONS.PASSWORDS_DONT_MATCH,
      ACCEPT_TERMS: VALIDATIONS.ACCEPT_TERMS,
      TYPE_EMAIL: VALIDATIONS.TYPE_EMAIL,
      INVALID_EMAIL: VALIDATIONS.INVALID_EMAIL,
    },
  },
}

export const VERIFICATION_TEXTS = {
  ICON: ICONS.CHECK,
  ...STRINGS.VERIFICATION_TEXTS,
}
