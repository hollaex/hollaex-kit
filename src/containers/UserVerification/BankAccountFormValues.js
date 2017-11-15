import { TEXTS } from './constants';
import { required, requiredWithCustomMessage, exactLength } from '../../components/Form/validations';

const { BANK_ACCOUNT_FORM } = TEXTS;
const { VALIDATIONS, FORM_FIELDS } = BANK_ACCOUNT_FORM;

const fields = {
  bank_name: {
    type: 'text',
    label: FORM_FIELDS.BANK_NAME_LABEL,
    placeholder: FORM_FIELDS.BANK_NAME_PLACEHOLDER,
    validate: [required]
  },
  account_owner: {
    type: 'text',
    label: FORM_FIELDS.ACCOUNT_OWNER_LABEL,
    placeholder: FORM_FIELDS.ACCOUNT_OWNER_PLACEHOLDER,
    validate: [requiredWithCustomMessage(VALIDATIONS.ACCOUNT_OWNER)]
  },
  account_number: {
    type: 'text',
    label: FORM_FIELDS.ACCOUNT_NUMBER_LABEL,
    placeholder: FORM_FIELDS.ACCOUNT_NUMBER_PLACEHOLDER,
    validate: [exactLength(24, VALIDATIONS.ACCOUNT_NUMBER)],
  },
};

export default fields;
