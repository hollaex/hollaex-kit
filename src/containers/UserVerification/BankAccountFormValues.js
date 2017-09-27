import React from 'react';
import { required } from '../../components/Form/validations';

const fields = {
  bank_name: {
    type: 'text',
    label: 'Bank Name',
    placeholder: 'Type the name of your bank',
    validate: [required]
  },
  bank_account_number: {
    type: 'text',
    label: 'Bank Account Number',
    placeholder: 'Type your bank account number',
    validate: [required],
  },
  bank_account_owner_name: {
    type: 'text',
    label: 'Bank Account Owner’s Name',
    placeholder: 'Type the name as on your bank account',
  }
};

export default fields;
