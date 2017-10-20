import React from 'react';
import { reduxForm } from 'redux-form';
import { Button } from '../../components';
import renderFields from '../../components/Form/factoryFields';
import { required, minValue, maxValue, checkBalance } from '../../components/Form/validations';

const MIN_AMOUNT = 2;
const MAX_AMOUNT = 10000;
const STEP = 0.0001;
const BUTTON_TEXT = 'review withdrawal';
const LOWER_BALANCE = 'You don’t have enough Bitcoins in your balance to send that transaction';

const generateFormValues = (available = 0, fee = 0, minAmount = MIN_AMOUNT, maxAmount = MAX_AMOUNT) => ({
  amount: {
    type: 'number',
    label: 'Dollar amount to withdraw',
    placeholder: 'Type the amount of Dollars you wish to withdraw',
    min: minAmount,
    max: maxAmount,
    step: STEP,
    validate: [
      required,
      minValue(minAmount),
      maxValue(maxAmount),
      checkBalance(available, LOWER_BALANCE, fee)
    ],
  },
});

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, initialValues, formValues } = props;
  return (
    <form onSubmit={handleSubmit}>
      {renderFields(formValues)}
      {error && <div className="warning_text">{error}</div>}
      <Button
        label={BUTTON_TEXT}
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

const WithdrawForm = reduxForm({
  form: 'WithdrawFiatForm',
})(Form);

const Withdraw = ({ onSubmit, minAmount, maxAmount, balanceAvailable, fee }) => {
  const formValues = generateFormValues(balanceAvailable, fee, minAmount, maxAmount);
  const initialValues = {
    amount: minAmount,
  };

  return (
    <div>
      <WithdrawForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        formValues={formValues}
      />
    </div>
  );
}

export default Withdraw;
