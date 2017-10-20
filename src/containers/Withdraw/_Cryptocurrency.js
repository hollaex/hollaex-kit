import React from 'react';
import { reduxForm } from 'redux-form';
import { Button } from '../../components';
import renderFields from '../../components/Form/factoryFields';
import { required, minValue, maxValue, checkBalance, validAddress } from '../../components/Form/validations';
import { setNotification, NOTIFICATIONS } from '../../actions/appActions';
import { generateFeeMessage } from './utils';
import {
  MIN_VALUE_ERROR, MAX_VALUE_ERROR,
  MIN_VALUE_WITHDRAWAL, MAX_VALUE_WITHDRAWAL,
  LOWER_BALANCE, INVALID_ADDRESS,
  BUTTON_TEXT, STEP,

} from './constants';

const generateFormValues = (symbol, available = 0, fee = 0, minAmount = MIN_VALUE_WITHDRAWAL, maxAmount = MAX_VALUE_WITHDRAWAL) => ({
  address: {
    type: 'text',
    label: 'Destination address:',
    placeholder: 'Type the address',
    validate: [required, validAddress(symbol, INVALID_ADDRESS)],
  },
  amount: {
    type: 'number',
    label: 'Dollar amount to withdraw',
    placeholder: 'Type the amount of Dollars you wish to withdraw',
    information: fee ? generateFeeMessage(fee) : '',
    min: minAmount,
    max: maxAmount,
    step: STEP,
    validate: [
      required,
      minValue(minAmount, MIN_VALUE_ERROR),
      maxValue(maxAmount, MAX_VALUE_ERROR),
      checkBalance(available, LOWER_BALANCE, fee)
    ],
  },
});

const Form = (props) => {
  const {
    handleSubmit,
    submitting,
    pristine,
    error,
    valid,
    initialValues,
    formValues,
    setRef
  } = props;
  return (
    <form
      onSubmit={handleSubmit}
      ref={setRef}
    >
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
  form: 'WithdrawCryptocurrencyForm',
  onSubmitFail: (error, dispatch) => {
    // dispatch(setNotification(NOTIFICATIONS.ERROR, JSON.stringify(error)));
  },
  onSubmitSuccess: (result, dispatch) => {
    // const message = (
    //   <div className="text-center">
    //     <h2>Success!</h2>
    //     <p>Your bitcoins have been sent</p>
    //   </div>
    // )
    // dispatch(setNotification(NOTIFICATIONS.WITHDRAWAL, message));
  }
})(Form);

const Withdraw = ({
  onSubmit, minAmount, maxAmount, balanceAvailable, fee, symbol,
  setRef
}) => {
  const formValues = generateFormValues(symbol, balanceAvailable, fee, minAmount, maxAmount);
  const initialValues = {
    amount: minAmount,
  };

  return (
    <div>
      <WithdrawForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        formValues={formValues}
        setRef={setRef}
      />
    </div>
  );
}

export default Withdraw;
