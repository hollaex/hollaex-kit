import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IconTitle } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';
import { generateWalletActionsText, fiatSymbol } from '../../utils/currency';

import {
  openContactForm,
} from '../../actions/appActions';

import WithdrawFiat from './Fiat';
import WithdrawCryptocurrency from './Cryptocurrency';
import { renderInformation } from './utils';

const renderContent = ({ symbol, ...rest }) => {
  return symbol === fiatSymbol ?
    <WithdrawFiat
      {...rest}
    /> :
    <WithdrawCryptocurrency
      symbol={symbol}
      {...rest}
    />;
};

class Withdraw extends Component {
  openContactForm = () => {
    this.props.openContactForm();
  }

  render() {
    const { symbol, balance, ...rest } = this.props;

    const { withdrawText } = generateWalletActionsText(symbol);

    return (
      <div className="presentation_container">
        <IconTitle
          text={withdrawText}
          iconPath={ICONS.LETTER}
          textType="title"
        />
        <div className={classnames('inner_container', 'with_border_top')}>
          {renderInformation(symbol, balance, this.openContactForm)}
          {renderContent(this.props)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  symbol: store.orderbook.symbol,
  prices: store.orderbook.prices,
  balance: store.user.balance,
});

const mapDispatchToProps = (dispatch) => ({
  openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
