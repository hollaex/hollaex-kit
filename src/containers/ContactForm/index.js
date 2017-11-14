import React from 'react';
import createForm from '../../components/Form';
import { email, required } from '../../components/Form/validations';

import { TEXTS } from './constants';

export default ({ onSubmitSuccess }) => {
  const fields = {
    email: {
      type: 'email',
      label: TEXTS.EMAIL_LABEL,
      placeholder: TEXTS.EMAIL_PLACEHOLDER,
      validate: [required, email],
      fullWidth: true,
    },
    category: {
      type: 'select',
      label: TEXTS.CATEGORY_LABEL,
      placeholder: TEXTS.CATEGORY_PLACEHOLDER,
      options: [
        { value: 'verify', label: TEXTS.CATEGORY_OPTIONS.OPTION_VERIFY },
        { value: 'bug', label: TEXTS.CATEGORY_OPTIONS.OPTION_BUG },
      ],
      validate: [required],
      fullWidth: true,
    },
    subject: {
      type: 'text',
      label: TEXTS.SUBJECT_LABEL,
      placeholder: TEXTS.SUBJECT_PLACEHOLDER,
      validate: [required],
      fullWidth: true,
    },
    description: {
      type: 'text',
      label: TEXTS.SUBJECT_LABEL,
      placeholder: TEXTS.SUBJECT_PLACEHOLDER,
      validate: [required],
      fullWidth: true,
    },
    attachment: {
      type: 'file',
      label: TEXTS.ATTACHMENT_LABEL,
      placeholder: TEXTS.ATTACHMENT_PLACEHOLDER,
      fullWidth: true,
    }
  };

  const onSubmit = (values) => {
    // TODO
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        onSubmitSuccess();
        resolve();
      }, 2500)
    })
  }

  const Form = createForm('ContactForm', fields, onSubmit, 'Submit');
  return <Form />
}
