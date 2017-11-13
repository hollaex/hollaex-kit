import React, { Component } from 'react';
import classnames from 'classnames';
import { SubmissionError } from 'redux-form';
import { requestResetPassword } from '../../actions/authAction';
import ResetPasswordForm from './ResetPasswordForm';
import { IconTitle, Dialog } from '../../components';
import { ContactForm } from '../';
import { FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import { TEXTS } from './constants';
import RequestResetPasswordSuccess from './RequestResetPasswordSuccess';

class RequestResetPassword extends Component {
  state = {
    success: false,
    showContactForm: false,
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


  onOpenDialog = () => {
    this.setState({ showContactForm: true });
  }

  onCloseDialog = () => {
    this.setState({ showContactForm: false });
  }

  onClickLogin = () => {
    this.props.router.replace('login');
  }

  render() {
    const { success, showContactForm } = this.state;

    return (
      <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
        {success ? (
          <RequestResetPasswordSuccess
            onLoginClick={this.onClickLogin}
            onContactUs={this.onOpenDialog}
          />
        ) : (
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
                onClick: this.onOpenDialog,
              }}
            />
            <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'auth_form-wrapper', 'w-100')}>
              <ResetPasswordForm onSubmit={this.onSubmitRequestResetPassword} />
            </div>
          </div>
        )}
        <Dialog
          isOpen={showContactForm}
          label="contact-modal"
          onCloseDialog={this.onCloseDialog}
          shouldCloseOnOverlayClick={false}
          showCloseText={true}
          style={{ 'z-index': 100 }}
        >
          <ContactForm onSubmitSuccess={this.onCloseDialog} />
        </Dialog>
      </div>
    );
  }
}

export default RequestResetPassword;
