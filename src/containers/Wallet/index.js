import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { IconTitle, CurrencyBall, CurrencyBallWithPrice, Button, ActionNotification, Accordion } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';
import { calculatePrice, calculateBalancePrice, generateWalletActionsText } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

const fiatName = CURRENCIES.fiat.name;
const fiatSymbol = 'fiat';
const fiatCurrencySymbol = CURRENCIES.fiat.currencySymbol;
const fiatShortName = CURRENCIES.fiat.shortName;
const fiatFormatToCurrency = CURRENCIES.fiat.formatToCurrency;

class Wallet extends Component {
  state = {
    sections: [],
    isOpen: false,
    totalAssets: 0,
  };

  componentWillMount() {
    this.generateSections(this.props.balance, this.props.prices, this.state.isOpen);
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.generateSections(nextProps.balance, nextProps.prices, nextState.isOpen);
  }

  calculateTotalAssets = (balance, prices) => {
    const total = calculateBalancePrice(balance, prices);
    return `${fiatCurrencySymbol}${fiatFormatToCurrency(total)}`;
  }

  generateSections = (balance, prices, isOpen = false) => {
    const totalAssets = this.calculateTotalAssets(balance, prices);
    const sections = [
      {
        title: STRINGS.WALLET_ALL_ASSETS,
        content: this.renderAssetsBlock(balance, prices),
        notification: {
          text: isOpen ? STRINGS.HIDE_TEXT : totalAssets,
          status: 'information',
          iconPath: isOpen ? ICONS.BLUE_PLUS : ICONS.BLUE_CLIP,
          allowClick: true,
          className: isOpen ? '' : 'wallet-notification',
        }
      }
    ];
    this.setState({ sections, totalAssets, isOpen });
  }

  goToPage = (path = '') => {
    this.props.router.push(path);
  }
  goToDeposit = () => this.goToPage('deposit');
  goToWithdraw = () => this.goToPage('withdraw');
  goToTransactionsHistory = () => this.goToPage('transactions');

  notifyOnOpen = (index, isOpen) => {
    this.generateSections(this.props.balance, this.props.prices, isOpen);
  }

  renderWalletHeaderBlock = (symbol, price, balance) => {
    const { fullName, shortName, formatToCurrency } = CURRENCIES[symbol];
    const balanceValue = balance[`${symbol}_balance`] || 0;
    return (
      <div className="wallet-header_block">
        <div className="wallet-header_block-currency_title">
          {STRINGS.formatString(STRINGS.CURRENCY_BALANCE_TEXT, fullName)}
          <ActionNotification
            text={STRINGS.TRADE_HISTORY}
            status="information"
            iconPath={ICONS.BLUE_CLIP}
            onClick={this.goToTransactionsHistory}
          />
        </div>
        <CurrencyBallWithPrice
          symbol={symbol}
          amount={balanceValue}
          price={price}
        />
      </div>
    );
  }

  renderAssetsBlock = (balance, prices) => {
    return (
      <div className="wallet-assets_block">
        <table className="wallet-assets_block-table">
          <thead>
            <tr className="table-bottom-border">
              <th></th>
              <th>{STRINGS.CURRENCY}</th>
              <th>{STRINGS.AMOUNT}</th>
              <th className="align-opposite">{STRINGS.formatString(STRINGS.WALLET_TABLE_AMOUNT_IN, fiatName)}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(CURRENCIES)
              .filter(([key]) => balance.hasOwnProperty(`${key}_balance`))
              .map(([key, { shortName, fullName, formatToCurrency}]) => {
                const balanceValue = balance[`${key}_balance`];
                return (
                  <tr className="table-row table-bottom-border" key={key}>
                    <td className="table-icon td-fit">
                      <CurrencyBall name={shortName} symbol={key} size="s" />
                    </td>
                    <td className="td-name td-fit">{fullName}</td>
                    <td>{`${shortName} ${formatToCurrency(balanceValue)}`}</td>
                    <td className="align-opposite show-equals">
                      {`${fiatCurrencySymbol}${
                        key === fiatSymbol ?
                        fiatFormatToCurrency(balanceValue) :
                        fiatFormatToCurrency(calculatePrice(balanceValue, prices[key]))
                      }`}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td>{STRINGS.WALLET_TABLE_TOTAL}</td>
              <td></td>
              <td className="align-opposite">
                {this.state.totalAssets}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  renderButtonsBlock = (symbol) => {
    const { depositText, withdrawText } = generateWalletActionsText(symbol);

    return (
      <div className={classnames(...FLEX_CENTER_CLASSES, 'wallet-buttons_action')}>
        <Button
          label={depositText}
          onClick={this.goToDeposit}
        />
        <div className="separator" />
        <Button
          label={withdrawText}
          onClick={this.goToWithdraw}
        />
      </div>
    )
  }

  render() {
    const { symbol, balance, price } = this.props;
    const { sections } = this.state;

    return (
      <div className="presentation_container apply_rtl">
        <IconTitle
          text={STRINGS.WALLET_TITLE}
          iconPath={symbol === fiatSymbol ? ICONS.FIAT_WALLET : ICONS.BITCOIN_WALLET}
          textType="title"
        />
        <div className={classnames('wallet-container')}>
          {this.renderWalletHeaderBlock(symbol, price, balance)}
          {this.renderButtonsBlock(symbol)}
          <Accordion
            sections={sections}
            notifyOnOpen={this.notifyOnOpen}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  symbol: store.orderbook.symbol,
  price: store.orderbook.price,
  prices: store.orderbook.prices,
  balance: store.user.balance,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
