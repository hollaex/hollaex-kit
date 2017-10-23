import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ICONS } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';

import {
  openContactForm,
} from '../../actions/appActions';

import {
  renderInformation,
  renderTitleSection
} from '../Wallet/components';

import {
  generateFiatInformation,
  renderContent,
  renderExtraInformation,
} from './utils';

import { DEPOSIT_LIMITS } from './constants';

class Deposit extends Component {

  render() {
    const { id, crypto_wallet, symbol, openContactForm, balance } = this.props;

    if (!id) {
      return <div></div>;
    }

    const limit = DEPOSIT_LIMITS[symbol] ? DEPOSIT_LIMITS[symbol].DAILY : 0;

    return (
      <div className="presentation_container">
        {renderTitleSection(symbol, 'deposit', ICONS.LETTER)}
        <div className={classnames('inner_container', 'with_border_top', 'with_border_bottom')}>
          {renderInformation(symbol, balance, openContactForm, generateFiatInformation)}
          {renderContent(symbol, crypto_wallet)}
          {renderExtraInformation(limit)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  id: store.user.id,
  symbol: store.orderbook.symbol,
  crypto_wallet: store.user.crypto_wallet,
  balance: store.user.balance,
});

const mapDispatchToProps = (dispatch) => ({
  openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
