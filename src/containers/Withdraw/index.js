import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IconTitle, Dialog } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';
import { generateWalletActionsText, fiatSymbol } from '../../utils/currency';
import { performWithdraw } from '../../actions/walletActions';
import { errorHandler } from '../../components/OtpForm/utils';

import {
  openContactForm,
} from '../../actions/appActions';

import ReviewModalContent from './ReviewModalContent';
import WithdrawFiat from './Fiat';
import WithdrawCryptocurrency from './Cryptocurrency';
import { renderInformation } from './utils';

const renderContent = ({ symbol, ...rest }) => {
  console.log(rest)
  return symbol === fiatSymbol ?
    <WithdrawFiat
      {...rest}
    /> :
    <WithdrawCryptocurrency
      symbol={symbol}
      {...rest}
    />;
};

const renderVerificationLevel = () => {
  return (
    <div className="warning_text">
      You have to provided your data to withdraw money
    </div>
  );
}

class Withdraw extends Component {
  state = {
    dialogIsOpen: false,
    dialogData: {},
  }

  openContactForm = () => {
    this.props.openContactForm();
  }

  onSubmitWithdraw = (values) => {
    console.log('heeeerssssssssse', values)
    return performWithdraw({
        ...values,
        amount: math.eval(values.amount),
      })
      .catch(errorHandler);
  }

  render() {
    const { symbol, balance, fee, verification_level = 0, otp_enabled } = this.props;
    const { dialogIsOpen, dialogData } = this.state;

    const balanceAvailable = balance[`${symbol}_available`];

    if (balanceAvailable === undefined) {
      return <div></div>
    };

    const { withdrawText } = generateWalletActionsText(symbol);

    const formProps = {
      symbol,
      minAmount: 2,
      maxAmount: 10000,
      // balanceAvailable: balance[`${symbol}_available`],
      balanceAvailable,
      fee,
      onSubmit: this.onSubmitWithdraw,
      verification_level,
      onOpenDialog: this.onOpenDialog,
      otp_enabled,
      openContactForm: this.openContactForm
    };

    return (
      <div className="presentation_container">
        <IconTitle
          text={withdrawText}
          iconPath={ICONS.LETTER}
          textType="title"
        />
        <div className={classnames('inner_container', 'with_border_top')}>
          {renderInformation(symbol, balance, this.openContactForm)}
          {renderContent(formProps)}
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
});

const mapDispatchToProps = (dispatch) => ({
  openContactForm: bindActionCreators(openContactForm, dispatch),

});

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
