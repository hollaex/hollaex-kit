import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';

import { Dialog, Loader, WarningVerification } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES, MIN_VERIFICATION_LEVEL_TO_WITHDRAW } from '../../config/constants';
import { generateWalletActionsText, fiatSymbol } from '../../utils/currency';
import { performBtcWithdraw, requestFiatWithdraw, requestBtcWithdrawFee } from '../../actions/walletActions';
import { errorHandler } from '../../components/OtpForm/utils';

import {
  openContactForm,
} from '../../actions/appActions';

import ReviewModalContent from './ReviewModalContent';
import WithdrawCryptocurrency from './form';
import { generateFormValues, generateInitialValues } from './formUtils';
import { generateFiatInformation, renderExtraInformation } from './utils';

import {
  renderInformation,
  renderTitleSection,
} from '../Wallet/components';

import { FORM_NAME } from './form';

class Withdraw extends Component {
  state = {
    dialogIsOpen: false,
    dialogData: {},
    formValues: {},
    initialValues: {},
  }

  componentWillMount() {
    if (this.props.verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW) {
      this.props.requestBtcWithdrawFee();
      this.generateFormValues(
        this.props.symbol, this.props.balance, this.props.btcFee
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW && (
        nextProps.symbol !== this.props.symbol ||
        nextProps.activeLanguage !== this.props.activeLanguage ||
        nextProps.btcFee.ready !== this.props.btcFee.ready
      )
    ) {
      this.generateFormValues(
        nextProps.symbol, nextProps.balance, nextProps.btcFee
      );
      if (!nextProps.btcFee.ready && !nextProps.btcFee.loading) {
        this.props.requestBtcWithdrawFee();
      }
    }
  }

  generateFormValues = (symbol, balance, fees) => {
    const balanceAvailable = balance[`${symbol}_available`];
    const formValues = generateFormValues(symbol, balanceAvailable, fees, this.onCalculateMax);
    const initialValues = generateInitialValues(symbol, fees);

    this.setState({ formValues, initialValues });
  }

  onSubmitWithdraw = (values) => {
    const withdrawAction = this.props.symbol === fiatSymbol ?
      requestFiatWithdraw :
      performBtcWithdraw;

    return withdrawAction({
        ...values,
        amount: math.eval(values.amount),
        fee: values.fee ? math.eval(values.fee) : 0,
      })
      .catch(errorHandler);
  }

  onCalculateMax = () => {
    const { balance, symbol, selectedFee = 0, dispatch } = this.props;
    const balanceAvailable = balance[`${symbol}_available`];
    const amount = math.number(math.subtract(math.fraction(balanceAvailable), math.fraction(selectedFee)));
    dispatch(change(FORM_NAME, 'amount', math.round(amount, 4)));
  }

  render() {
    const {
      symbol, balance, fee, verification_level, prices,
      otp_enabled, bank_account, openContactForm, activeLanguage,
      btcFee,
    } = this.props;
    const { dialogIsOpen, dialogData, formValues, initialValues } = this.state;

    const balanceAvailable = balance[`${symbol}_available`];

    if (verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW && (balanceAvailable === undefined || btcFee.loading || !btcFee.ready)) {
      return <Loader />
    };


    const formProps = {
      symbol,
      onSubmit: this.onSubmitWithdraw,
      onOpenDialog: this.onOpenDialog,
      otp_enabled,
      openContactForm,
      formValues,
      initialValues,
      activeLanguage,
      balanceAvailable,
      currentPrice: prices[symbol],
    };

    return (
      <div className="presentation_container apply_rtl">
        {renderTitleSection(symbol, 'withdraw', ICONS.WITHDRAW)}
          {verification_level >= MIN_VERIFICATION_LEVEL_TO_WITHDRAW ? (
            <div className={classnames('inner_container', 'with_border_top')}>
              {renderInformation(symbol, balance, openContactForm, generateFiatInformation)}
              <WithdrawCryptocurrency
                {...formProps}
              />
              {renderExtraInformation(symbol, bank_account)}
            </div>
          ) : (
            <div className={classnames('inner_container', 'with_border_top')}>
              <WarningVerification />
            </div>
          )}

      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  symbol: store.orderbook.symbol,
  prices: store.orderbook.prices,
  balance: store.user.balance,
  fee: store.user.fee,
  verification_level: store.user.verification_level,
  otp_enabled: store.user.otp_enabled,
  bank_account: store.user.userData.bank_account,
  activeLanguage: store.app.language,
  btcFee: store.wallet.btcFee,
  selectedFee: formValueSelector(FORM_NAME)(store, 'fee'),
});

const mapDispatchToProps = (dispatch) => ({
  openContactForm: bindActionCreators(openContactForm, dispatch),
  requestBtcWithdrawFee: bindActionCreators(requestBtcWithdrawFee, dispatch),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
