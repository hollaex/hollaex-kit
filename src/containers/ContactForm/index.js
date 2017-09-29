import React from 'react';
import createForm from '../../components/Form';
import { email, required } from '../../components/Form/validations';

export default ({ onSubmitSuccess }) => {
  const fields = {
    email: {
      type: 'email',
      label: 'Email',
      placeholder: 'Type your Email addres',
      validate: [required, email],
    },
    category: {
      type: 'select',
      label: 'Category',
      placeholder: 'Select the category that best suits your issue',
      options: [
        'Verify',
        'Bug'
      ],
      validate: [required],
    },
    subject: {
      type: 'text',
      label: 'Subject',
      placeholder: 'Type the subject of your issue',
      validate: [required],
    },
    description: {
      type: 'text',
      label: 'Description',
      placeholder: 'Type in detail what the issue is',
      validate: [required],
    },
    attachment: {
      type: 'file',
      label: 'Add an attachment',
      placeholder: 'Add a file to help communicate your issue. PDF, JPG, PNG and GIF files are accepted',
    }
  };

  const onSubmit = (values) => {
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
