import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, reset } from 'redux-form';
import math from 'mathjs';
import { Button, Dialog, OtpForm, Loader } from '../../components';
import renderFields from '../../components/Form/factoryFields';
import { errorHandler } from '../../components/OtpForm/utils';
import { setWithdrawNotificationSuccess, setWithdrawNotificationError } from './notifications';
import { generateFeeMessage } from './utils';

import STRINGS from '../../config/localizedStrings';

import ReviewModalContent from './ReviewModalContent';

const FORM_NAME = 'WithdrawCryptocurrencyForm';

const selector = formValueSelector(FORM_NAME)

const validate = (values, props) => {
  const errors = {};
  const amount = math.fraction(values.amount || 0);
  const fee = math.fraction(values.fee || 0);
  const balance = math.fraction(props.balanceAvailable || 0);

  if (
    math.larger(fee, 0) &&
    math.larger(amount, 0)
  ) {
    const rate = math.divide(fee, amount);
    if (math.largerEq(rate, 0.2)) {
      errors.fee = 'Fee is larger than 20% of the transaction';
    }
  }

  if (math.larger(math.add(fee, amount), balance)) {
    errors.amount = 'Transaction is larger than balance';
  }
  return errors;
}
class Form extends Component {
  state = {
    dialogIsOpen: false,
    dialogOtpOpen: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.symbol !== this.props.symbol) {
      nextProps.dispatch(reset(FORM_NAME));
    }
    if (!nextProps.submitting && nextProps.submitting !== this.props.submitting) {
      this.onCloseDialog();
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
      // this.onCloseDialog();
      this.props.submit();
    }
  }

  onSubmitOtp = ({ otp_code = '' }) => {
    const values = this.props.data;
    return this.props.onSubmit({
        ...values,
        amount: math.eval(values.amount),
        fee: values.fee ? math.eval(values.fee) : 0,
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
              (!submitting ?
                <ReviewModalContent
                  symbol={symbol}
                  data={data}
                  onClickAccept={this.onAcceptDialog}
                  onClickCancel={this.onCloseDialog}
                /> :
                <Loader relative={true} background={false} />
              )
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
  enableReinitialize: true,
  validate,
})(Form);

const mapStateToForm = (state) => ({
  data: selector(state, 'address', 'amount', 'fee'),
});

const WithdrawFormWithValues = connect(mapStateToForm)(WithdrawForm);

const Withdraw = ({
  onSubmit, otp_enabled, openContactForm, formValues, symbol, initialValues, balanceAvailable,
}) => {
  const formProps = {
    onSubmit,
    formValues,
    initialValues,
    symbol,
    openContactForm,
    checkOtp: otp_enabled,
    balanceAvailable,
  };

  return (
    <WithdrawFormWithValues
      {...formProps}
    />
  );
}

export default Withdraw;
