import { required, requiredWithCustomMessage, exactLength } from '../../components/Form/validations';

const ERROR_MESSAGE_ACCOUNT_NAME = 'Please type your first and last name as associated with your bank account';
const ERROR_MESSAGE_ACCOUNT_NUMBER_LENGTH = 'Your bank account number should be 24 digits';

const fields = {
  bank_name: {
    type: 'text',
    label: 'Bank Name',
    placeholder: 'Type the name of your bank',
    validate: [required]
  },
  account_owner: {
    type: 'text',
    label: 'Bank Account Owner’s Name',
    placeholder: 'Type the name as on your bank account',
    validate: [requiredWithCustomMessage(ERROR_MESSAGE_ACCOUNT_NAME)]
  },
  account_number: {
    type: 'text',
    label: 'Bank Account Number',
    placeholder: 'Type your bank account number',
    validate: [exactLength(24, ERROR_MESSAGE_ACCOUNT_NUMBER_LENGTH)],
  },
};

export default fields;
