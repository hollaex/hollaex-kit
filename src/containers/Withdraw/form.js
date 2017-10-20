import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, reset } from 'redux-form';
import math from 'mathjs';
import { Button, Dialog, OtpForm } from '../../components';
import renderFields from '../../components/Form/factoryFields';
import { required, minValue, maxValue, checkBalance, validAddress } from '../../components/Form/validations';
import { errorHandler } from '../../components/OtpForm/utils';
import { setWithdrawNotificationSuccess, setWithdrawNotificationError } from './notifications';
import { generateFeeMessage } from './utils';
import {
  MIN_VALUE_ERROR, MAX_VALUE_ERROR,
  MIN_VALUE_WITHDRAWAL, MAX_VALUE_WITHDRAWAL,
  LOWER_BALANCE, INVALID_ADDRESS,
  BUTTON_TEXT, STEP,

} from './constants';
import ReviewModalContent from './ReviewModalContent';
import { performWithdraw } from '../../actions/walletActions';
import { CURRENCIES } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';

const FORM_NAME = 'WithdrawCryptocurrencyForm';

const selector = formValueSelector(FORM_NAME)

const generateFormValues = (symbol, available = 0, fee = 0, minAmount = MIN_VALUE_WITHDRAWAL, maxAmount = MAX_VALUE_WITHDRAWAL) => {
  const { name } = CURRENCIES[symbol];
  const fields = {};

  if (symbol !== fiatSymbol) {
    fields.address = {
      type: 'text',
      label: 'Destination address:',
      placeholder: 'Type the address',
      validate: [required, validAddress(symbol, INVALID_ADDRESS)],
    }
  }

  fields.amount = {
    type: 'number',
    label: `${name} amount to withdraw`,
    placeholder: `Type the amount of ${name} you wish to withdraw`,
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
  }

  return fields;
};

class Form extends Component {
  state = {
    dialogIsOpen: false,
    dialogOtpOpen: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.symbol !== this.props.symbol) {
      nextProps.dispatch(reset(FORM_NAME));
    }
  }

  onOpenDialog = (ev) => {
    if (ev && ev.preventDefault) {
      ev.preventDefault();
    }
    this.setState({ dialogIsOpen: true })
  }

  onCloseDialog = (ev) => {
    if (ev && ev.preventDefault) {
      ev.preventDefault();
    }
    this.setState({ dialogIsOpen: false, dialogOtpOpen: false });
  }

  onAcceptDialog = () => {
    if (this.props.checkOtp) {
      this.setState({ dialogOtpOpen: true })
    } else {
      this.onCloseDialog();
      this.props.submit();
    }
  }

  onSubmitOtp = ({ otp_code = '' }) => {
    const values = this.props.data;

    return performWithdraw({
        ...values,
        amount: math.eval(values.amount),
        otp_code,
      })
      .then((data) => {
        this.onCloseDialog();
        setWithdrawNotificationSuccess({}, this.props.dispatch);
      })
      .catch(errorHandler)
      .catch((error) => {
        if (error.errors && !error.errors.otp_code) {
          setWithdrawNotificationError(error.errors, this.props.dispatch);
        }
        this.onCloseDialog();
        throw error;
      });
  }

  render() {
    const {
      handleSubmit,
      submitting,
      pristine,
      error,
      valid,
      initialValues,
      formValues,
      symbol,
      data,
      openContactForm
    } = this.props;

    const { dialogIsOpen, dialogOtpOpen } = this.state;

    return (
      <div>
        <form onSubmit={handleSubmit}>
          {renderFields(formValues)}
          {error && <div className="warning_text">{error}</div>}
          <Button
            label={BUTTON_TEXT}
            disabled={pristine || submitting || !valid}
            onClick={this.onOpenDialog}
          />
        </form>
        <Dialog
          isOpen={dialogIsOpen}
          label="withdraw-modal"
          onCloseDialog={this.onCloseDialog}
          shouldCloseOnOverlayClick={dialogOtpOpen}
        >
          {dialogOtpOpen ?
            <OtpForm onSubmit={this.onSubmitOtp} onClickHelp={openContactForm} /> :
            <ReviewModalContent
              symbol={symbol}
              data={data}
              onClickAccept={this.onAcceptDialog}
              onClickCancel={this.onCloseDialog}
            />
          }
        </Dialog>
      </div>

    );
  }
}

const WithdrawForm = reduxForm({
  form: FORM_NAME,
  onSubmitFail: setWithdrawNotificationError,
  onSubmitSuccess: setWithdrawNotificationSuccess,
})(Form);

const mapStateToForm = (state) => ({ data: selector(state, 'address', 'amount') });

const WithdrawFormWithValues = connect(mapStateToForm)(WithdrawForm);

const Withdraw = ({
  onSubmit, minAmount, maxAmount, balanceAvailable, fee, symbol, otp_enabled, openContactForm
}) => {
  const formValues = generateFormValues(symbol, balanceAvailable, fee, minAmount, maxAmount);
  const formProps = {
    onSubmit,
    formValues,
    symbol,
    openContactForm,
    checkOtp: otp_enabled,
  };

  return (
    <WithdrawFormWithValues
      {...formProps}
    />
  );
}

export default Withdraw;
