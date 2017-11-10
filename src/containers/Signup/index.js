import React, { Component } from 'react';
import classnames from 'classnames';
import { SubmissionError } from 'redux-form';
import { performSignup } from '../../actions/authAction';
import SignupForm from './SignupForm';
import { IconTitle } from '../../components';
import { EXIR_LOGO, FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import { TEXTS } from './constants';

class Signup extends Component {
  state = {
    values: {},
    otpDialogIsOpen: false,
  }

  onSubmitSignup = (values) => {
    return performSignup(values)
      .then((res) => {
        this.redirectToHome();
      })
      .catch((error) => {
        const errors = {};
        if (error.response.status === 409) {
          errors.email = TEXTS.VALIDATIONS.USER_EXIST;
        } else if (error.response) {
          errors._error = error.response.body.message;
        } else {
          errors._error = error.message;
        }
        throw new SubmissionError(errors);
      });
  }

  onCloseDialog = () => {
    this.setState({ otpDialogIsOpen: false });
  }

  render() {
    const { otpDialogIsOpen } = this.state;

    return (
      <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1', 'login_container')}>
        <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'login_wrapper', 'auth_wrapper', 'w-100')}>
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
          <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'login_form-wrapper', 'auth_form-wrapper', 'w-100')}>
            <SignupForm onSubmit={this.onSubmitSignup} />
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
