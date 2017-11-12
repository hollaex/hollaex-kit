import React, { Component } from 'react';
import classnames from 'classnames';
import { SubmissionError } from 'redux-form';
import { requestResetPassword } from '../../actions/authAction';
import ResetPasswordForm from './ResetPasswordForm';
import { IconTitle } from '../../components';
import { FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import { TEXTS, REQUEST_RESET_PASSWORD_SUCCESS } from './constants';

class RequestResetPassword extends Component {
  state = {
    success: false,
  }

  onSubmitRequestResetPassword = (values) => {
    return requestResetPassword(values)
      .then((res) => {
        this.setState({ success: true });
      })
      .catch((error) => {
        const errors = {};
        if (error.response) {
          const { message = '' } = error.response.data;
          errors._error = message || error.message;
        } else {
          errors._error = error.message;
        }
        throw new SubmissionError(errors);
      });
  }

  render() {
    const { success } = this.state;

    if (success) {
      return (
        <div className="signup_success-wrapper auth_wrapper">
          <IconTitle
            iconPath={REQUEST_RESET_PASSWORD_SUCCESS.ICON}
            text={REQUEST_RESET_PASSWORD_SUCCESS.TITLE}
            textType="title"
            className="w-100"
          />
          <div className="signup_success-content">
            {REQUEST_RESET_PASSWORD_SUCCESS.TEXT}
          </div>
        </div>
      );
    }

    return (
      <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
        <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'auth_wrapper', 'w-100')}>
          <IconTitle
            iconPath={TEXTS.ICON}
            text={TEXTS.TITLE}
            textType="title"
            underline={true}
            className="w-100"
            subtitle={TEXTS.SUBTITLE}
            actionProps={{
              text: TEXTS.SUPPORT,
              iconPath: ICONS.RED_ARROW,
              // onClick: this.redirectToResetPassword,
            }}
          />
          <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'auth_form-wrapper', 'w-100')}>
            <ResetPasswordForm onSubmit={this.onSubmitRequestResetPassword} />
          </div>
        </div>
      </div>
    );
  }
}

export default RequestResetPassword;
