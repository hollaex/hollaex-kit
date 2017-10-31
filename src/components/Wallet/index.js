import React, { Component } from 'react';
import { connect } from 'react-redux';
import math from 'mathjs';
import { Accordion } from '../';
import { CURRENCIES } from '../../config/constants';
import { calculateBalancePrice, formatFiatAmount } from '../../utils/currency';
import WalletSection from './Section';

class Wallet extends Component {
  state = {
    sections: [],
    totalAssets: 0,
  }

  componentDidMount() {
    const { user_id, symbol, price } = this.props;
    if (user_id && symbol && price) {
      this.calculateSections(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.balance.timestamp, this.props.balance.timestamp)
    if (
      nextProps.user_id !== this.props.user_id ||
      nextProps.price !== this.props.price ||
      nextProps.orders.length !== this.props.orders.length ||
      nextProps.symbol !== this.props.symbol ||
      nextProps.balance.timestamp !== this.props.balance.timestamp
    ) {
      this.calculateSections(nextProps);
    }
  }

  generateSection = (symbol, price, balance, orders ) => {
    const { name, currencySymbol, formatToCurrency } = CURRENCIES[symbol];
    return ({
      accordionClassName: 'wallet_section-wrapper',
      title: name,
      titleClassName: 'wallet_section-title',
      titleInformation: (
        <div className="wallet_section-title-amount">
          <span>{currencySymbol}</span>{formatToCurrency(balance[`${symbol}_balance`])}
        </div>
      ),
      content: (
        <WalletSection
          symbol={symbol}
          balance={balance}
          orders={orders}
          price={price}
        />
      ),
    });
  }

  calculateSections = ({ symbol, price, balance, orders, prices }) => {
    const sections = [];

    if (symbol !== 'fiat') {
      sections.push(this.generateSection(symbol, price, balance, orders));
    }

    sections.push(this.generateSection('fiat', price, balance, orders));

    const totalAssets = formatFiatAmount(calculateBalancePrice(balance, prices));
    this.setState({ sections, totalAssets });
  }

  render() {
    const { sections, totalAssets } = this.state;

    if (Object.keys(this.props.balance).length === 0) {
      return <div></div>
    }

    return (
      <div className="wallet-wrapper">
        <Accordion
          sections={sections}
          allowMultiOpen={true}
        />
        <div className="wallet_section-wrapper wallet_section-total_asset d-flex flex-column">
          <div className="wallet_section-title">total assets</div>
          <div className="wallet_section-total_asset d-flex justify-content-end">
            $<span>{totalAssets}</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  balance: state.user.balance,
  prices: state.orderbook.prices,
  symbol: state.orderbook.symbol,
  price: state.orderbook.price,
  orders: state.order.activeOrders,
  user_id: state.user.id,
});

export default connect(mapStateToProps)(Wallet);
