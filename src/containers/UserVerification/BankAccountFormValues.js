import STRINGS from '../../config/localizedStrings';
import { required, requiredWithCustomMessage, exactLength } from '../../components/Form/validations';

export const generateFormValues = () => ({
  bank_name: {
    type: 'text',
    label: STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_LABEL,
    placeholder: STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_PLACEHOLDER,
    validate: [required]
  },
  account_owner: {
    type: 'text',
    label: STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_OWNER_LABEL,
    placeholder: STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_OWNER_PLACEHOLDER,
    validate: [requiredWithCustomMessage(STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.VALIDATIONS.ACCOUNT_OWNER)]
  },
  account_number: {
    type: 'text',
    label: STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_LABEL,
    placeholder: STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_PLACEHOLDER,
    validate: [exactLength(24, STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.VALIDATIONS.ACCOUNT_NUMBER)],
  },
});
