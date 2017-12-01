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

import STRINGS from '../../config/localizedStrings';

import ReviewModalContent from './ReviewModalContent';
import { performWithdraw } from '../../actions/walletActions';
import { CURRENCIES, WITHDRAW_LIMITS } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';

const FORM_NAME = 'WithdrawCryptocurrencyForm';

const selector = formValueSelector(FORM_NAME)

export const generateFormValues = (symbol, available = 0, fee = 0) => {
  const { name } = CURRENCIES[symbol];
  const { MIN, MAX, STEP = 1 } = WITHDRAW_LIMITS[symbol];

  const fields = {};

  if (symbol !== fiatSymbol) {
    fields.address = {
      type: 'text',
      label: 'Destination address:',
      placeholder: 'Type the address',
      validate: [required, validAddress(symbol, STRINGS.WITHDRAWALS_INVALID_ADDRESS)],
    }
  }

  const amountValidate = [ required ];
  if (MIN) {
    amountValidate.push(minValue(MIN, STRINGS.WITHDRAWALS_MIN_VALUE_ERROR));
  }
  if (MAX) {
    amountValidate.push(maxValue(MAX, STRINGS.WITHDRAWALS_MAX_VALUE_ERROR));
  }
  amountValidate.push(checkBalance(available, STRINGS.formatString(STRINGS.WITHDRAWALS_LOWER_BALANCE, name), fee));

  fields.amount = {
    type: 'number',
    label: STRINGS.formatString(STRINGS.WITHDRAWALS_FORM_AMOUNT_LABEL, name),
    placeholder: STRINGS.formatString(STRINGS.DEPOSITS_FORM_AMOUNT_PLACEHOLDER, name),
    information: fee ? generateFeeMessage(fee) : '',
    min: MIN,
    max: MAX,
    step: STEP,
    validate: amountValidate,
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
    return this.props.onSubmit({
        ...values,
        amount: math.eval(values.amount),
        otp_code,
      })
      .then(({ data }) => {
        this.onCloseDialog();
        this.props.dispatch(reset(FORM_NAME));
      })
      .catch((error) => {
        if (error.errors && !error.errors.otp_code) {
          setWithdrawNotificationError(error.errors, this.props.dispatch);
          this.onCloseDialog();
        }
        console.log(error.errors)
        // this.onCloseDialog();
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
      symbol,
      data,
      openContactForm,
      formValues,
    } = this.props;

    const { dialogIsOpen, dialogOtpOpen } = this.state;

    return (
      <div>
        <form onSubmit={handleSubmit}>
          {renderFields(formValues)}
          {error && <div className="warning_text">{error}</div>}
          <Button
            label={STRINGS.DEPOSITS_BUTTON_TEXT}
            disabled={pristine || submitting || !valid}
            onClick={this.onOpenDialog}
          />
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
        </form>
      </div>

    );
  }
}

const WithdrawForm = reduxForm({
  form: FORM_NAME,
  onSubmitFail: setWithdrawNotificationError,
  onSubmitSuccess: (result, dispatch) => dispatch(reset(FORM_NAME)),
})(Form);

const mapStateToForm = (state) => ({
  data: selector(state, 'address', 'amount'),
});

const WithdrawFormWithValues = connect(mapStateToForm)(WithdrawForm);

const Withdraw = ({
  onSubmit, otp_enabled, openContactForm, formValues, symbol,
}) => {
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
