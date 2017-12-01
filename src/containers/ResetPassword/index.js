import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { SubmissionError } from 'redux-form';
import { resetPassword } from '../../actions/authAction';
import ResetPasswordForm from './ResetPasswordForm';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import { IconTitle, Dialog } from '../../components';
import { ContactForm } from '../';
import { FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import { TEXTS } from './constants';


class ResetPassword extends Component {
  state = {
    success: false,
    showContactForm: false,
  }

  onSubmitResetPassword = ({ password }) => {
    const { code } = this.props.params;
    const values = {
      code,
      new_password: password,
    }
    return resetPassword(values)
      .then((res) => {
        this.setState({ success: true });
      })
      .catch((error) => {
        const errors = {};
        if (error.response) {
          const { message = '' } = error.response.data;
          if (message.toLowerCase().indexOf('password') > -1) {
            // TODO set error in constants for language
            errors.password = message;
          } else {
            errors._error = message || error.message;
          }
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
    const { languageClasses } = this.props;
    const { success, showContactForm } = this.state;

    if (success) {
      return <ResetPasswordSuccess onClick={this.onClickLogin} />
    }

    return (
      <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
        <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'auth_wrapper', 'w-100')}>
          <IconTitle
            iconPath={ICONS.SET_NEW_PASSWORD}
            text={TEXTS.TITLE}
            textType="title"
            underline={true}
            className="w-100"
            subtitle={TEXTS.SUBTITLE}
            actionProps={{
              text: TEXTS.HELP,
              iconPath: ICONS.RED_ARROW,
              onClick: this.onOpenDialog,
            }}
          />
          <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'auth_form-wrapper', 'w-100')}>
            <ResetPasswordForm onSubmit={this.onSubmitResetPassword} />
          </div>
        </div>
        <div className={classnames('f-1', 'link_wrapper')}>
          {TEXTS.NO_EMAIL}<Link to='/verify' className={classnames('blue-link')}>{TEXTS.REQUEST_EMAIL}</Link>
        </div>
        <Dialog
          isOpen={showContactForm}
          label="contact-modal"
          onCloseDialog={this.onCloseDialog}
          shouldCloseOnOverlayClick={false}
          showCloseText={true}
          style={{ 'z-index': 100 }}
          className={classnames(languageClasses)}
        >
          <ContactForm onSubmitSuccess={this.onCloseDialog} />
        </Dialog>
      </div>
    );
  }
}

export default ResetPassword;
