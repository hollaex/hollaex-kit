import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Dialog } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';
import { generateWalletActionsText, fiatSymbol } from '../../utils/currency';
import { performWithdraw, requestFiatWithdraw } from '../../actions/walletActions';
import { errorHandler } from '../../components/OtpForm/utils';

import {
  openContactForm,
} from '../../actions/appActions';

import ReviewModalContent from './ReviewModalContent';
import WithdrawCryptocurrency, { generateFormValues } from './form';
import { generateFiatInformation, renderExtraInformation } from './utils';

import {
  renderInformation,
  renderTitleSection,
} from '../Wallet/components';

const renderChildren = (formProps) => <WithdrawCryptocurrency {...formProps} />;

class Withdraw extends Component {
  state = {
    dialogIsOpen: false,
    dialogData: {},
    formValues: {},
  }

  componentWillMount() {
    this.generateFormValues(this.props.symbol, this.props.balance, this.props.fee);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.symbol !== this.props.symbol || nextProps.activeLanguage !== this.props.activeLanguage) {
      this.generateFormValues(nextProps.symbol, nextProps.balance, nextProps.fee);
    }
  }

  generateFormValues = (symbol, balance, fee) => {
    const balanceAvailable = balance[`${symbol}_available`];
    const formValues = generateFormValues(symbol, balanceAvailable, fee);

    this.setState({ formValues });
  }

  onSubmitWithdraw = (values) => {
    const withdrawAction = this.props.symbol === fiatSymbol ?
      requestFiatWithdraw :
      performWithdraw;

    return withdrawAction({
        ...values,
        amount: math.eval(values.amount),
      })
      .catch(errorHandler);
  }

  render() {
    const { symbol, balance, fee, verification_level = 0, otp_enabled, bank_account, openContactForm, activeLanguage } = this.props;
    const { dialogIsOpen, dialogData, formValues } = this.state;

    const balanceAvailable = balance[`${symbol}_available`];

    if (balanceAvailable === undefined) {
      return <div></div>
    };

    const formProps = {
      symbol,
      onSubmit: this.onSubmitWithdraw,
      onOpenDialog: this.onOpenDialog,
      otp_enabled,
      openContactForm,
      formValues,
      activeLanguage
    };

    return (
      <div className="presentation_container apply_rtl">
        {renderTitleSection(symbol, 'withdraw', ICONS.WITHDRAW)}
        <div className={classnames('inner_container', 'with_border_top')}>
          {renderInformation(symbol, balance, openContactForm, generateFiatInformation)}
          {renderChildren(formProps)}
          {renderExtraInformation(symbol, bank_account)}
        </div>
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
});

const mapDispatchToProps = (dispatch) => ({
  openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
