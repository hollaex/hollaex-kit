import React, { Component } from 'react';
import classnames from 'classnames';
import { SubmissionError } from 'redux-form';
import { performSignup } from '../../actions/authAction';
import SignupForm, { generateFormFields } from './SignupForm';
import SignupSuccess from './SignupSuccess';
import { IconTitle, Dialog } from '../../components';
import { EXIR_LOGO, FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import { TEXTS } from './constants';

const TERM_LABELS_TEXT = TEXTS.FORM.FIELDS.terms;

class Signup extends Component {
  state = {
    success: false,
    dialogIsOpen: false,
    dialogContent: '',
    formFields: {},
  }
  componentWillMount() {
    this.generateFormFields();
  }

  generateFormFields = () => {
    const termsLabel = (
      <div className={classnames('d-flex', 'terms_label-wrapper')}>
        {TERM_LABELS_TEXT.label}
        <div className="dialog-link pointer" onClick={this.onOpenDialog('terms')}>{TERM_LABELS_TEXT.generalTerms}</div>
        {TERM_LABELS_TEXT.and}
        <div className="dialog-link pointer" onClick={this.onOpenDialog('policy')}>{TERM_LABELS_TEXT.privacyPolicy}</div>
      </div>
    );
    this.setState({ formFields: generateFormFields(termsLabel) });
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
          errors._error = error.response.body.message;
        } else {
          errors._error = error.message;
        }
        throw new SubmissionError(errors);
      });
  }

  onOpenDialog = (content = '') => () => {
    this.setState({ dialogIsOpen: true, dialogContent: content });
  }

  onCloseDialog = () => {
    this.setState({ dialogIsOpen: false, dialogContent: '' });
  }

  render() {
    const { success, formFields, dialogIsOpen, dialogContent } = this.state;

    if (success) {
      return <SignupSuccess />
    }

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
            <SignupForm onSubmit={this.onSubmitSignup} formFields={formFields} />
          </div>
        </div>
        <Dialog
          isOpen={dialogIsOpen}
          label="sigunp-modal"
          onCloseDialog={this.onCloseDialog}
          shouldCloseOnOverlayClick={false}
          showCloseText={true}
        >
          <div className="signup-modal-wrapper">
            {dialogContent}
          </div>
        </Dialog>
      </div>
    );
  }
}

export default Signup;
