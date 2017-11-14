import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { SubmissionError } from 'redux-form';
import { performSignup } from '../../actions/authAction';
import SignupForm from './SignupForm';
import SignupSuccess from './SignupSuccess';
import { IconTitle } from '../../components';
import { EXIR_LOGO, FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import { TEXTS } from './constants';

const TERM_LABELS_TEXT = TEXTS.FORM.FIELDS.terms;

class Signup extends Component {
  state = {
    success: false,
  }

  onSubmitSignup = (formValues) => {
    const values = {
      email: formValues.email,
      password: formValues.password,
    }
    return performSignup(values)
      .then((res) => {
        this.setState({ success: true })
      })
      .catch((error) => {
        const errors = {};
        if (error.response.status === 409) {
          errors.email = TEXTS.VALIDATIONS.USER_EXIST;
        } else if (error.response) {
          const { message = '' } = error.response.data;
          if (message.toLowerCase().indexOf('password') > -1) {
            // TODO set error in constants for language
            errors.password = TEXTS.VALIDATIONS.INVALID_PASSWORD;
          } else {
            errors._error = message || error.message;
          }
        } else {
          errors._error = error.message;
        }
        throw new SubmissionError(errors);
      });
  }

  render() {
    const { success } = this.state;

    if (success) {
      return <SignupSuccess />
    }

    return (
      <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
        <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'auth_wrapper', 'w-100')}>
          <IconTitle
            iconPath={EXIR_LOGO}
            text={TEXTS.TITLE}
            textType="title"
            underline={true}
            className="w-100"
            subtitle={TEXTS.SIGNUP_TO}
            actionProps={{
              text: TEXTS.HELP,
              iconPath: ICONS.RED_ARROW,
              onClick: this.redirectToResetPassword,
            }}
          />
          <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'auth_form-wrapper', 'w-100')}>
            <SignupForm onSubmit={this.onSubmitSignup} />
          </div>
        </div>
        <div className={classnames('f-1', 'link_wrapper')}>
          {TEXTS.NO_EMAIL}<Link to='/verify' className={classnames('blue-link')}>{TEXTS.REQUEST_EMAIL}</Link>
        </div>
      </div>
    );
  }
}

export default Signup;
