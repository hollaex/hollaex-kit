import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { HocForm } from '../../components';
import { email, required } from '../../components/Form/validations';
import STRINGS from '../../config/localizedStrings';
import { sendSupportMail } from '../../actions/appActions';

const FORM_NAME = 'ContactForm';

const ContactForm = HocForm(FORM_NAME);

export default ({ onSubmitSuccess }) => {
  const formFields = {
    email: {
      type: 'email',
      label: STRINGS.FORM_FIELDS.EMAIL_LABEL,
      placeholder: STRINGS.FORM_FIELDS.EMAIL_PLACEHOLDER,
      validate: [required, email],
      fullWidth: true,
    },
    category: {
      type: 'select',
      label: STRINGS.CONTACT_FORM.CATEGORY_LABEL,
      placeholder: STRINGS.CONTACT_FORM.CATEGORY_PLACEHOLDER,
      options: [
        { value: 'verify', label: STRINGS.CONTACT_FORM.CATEGORY_OPTIONS.OPTION_VERIFY },
        { value: 'bug', label: STRINGS.CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BUG },
      ],
      validate: [required],
      fullWidth: true,
    },
    subject: {
      type: 'text',
      label: STRINGS.CONTACT_FORM.SUBJECT_LABEL,
      placeholder: STRINGS.CONTACT_FORM.SUBJECT_PLACEHOLDER,
      validate: [required],
      fullWidth: true,
    },
    description: {
      type: 'text',
      label: STRINGS.CONTACT_FORM.DESCRIPTION_LABEL,
      placeholder: STRINGS.CONTACT_FORM.DESCRIPTION_PLACEHOLDER,
      validate: [required],
      fullWidth: true,
    },
    attachment: {
      type: 'file',
      label: STRINGS.CONTACT_FORM.ATTACHMENT_LABEL,
      placeholder: STRINGS.CONTACT_FORM.ATTACHMENT_PLACEHOLDER,
      fullWidth: true,
    }
  };

  const onSubmit = (values) => {
    return sendSupportMail(values)
      .then((data) => {
        onSubmitSuccess(data)
      })
      .catch((err) => {
        const _error = err.response.data ? err.response.data.message : err.message;
        throw new SubmissionError({ _error });
      });
  }

  return <ContactForm
    onSubmit={onSubmit}
    formFields={formFields}
    buttonLabel={STRINGS.CONTACT_US_TEXT}
  />
}
