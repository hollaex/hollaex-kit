import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { IconTitle, CurrencyBall, Button, ActionNotification } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';

const fiatName = CURRENCIES.fiat.name;
const fiatSymbol = CURRENCIES.fiat.currencySymbol;
const fiatShortName = CURRENCIES.fiat.shortName;
const fiatFormatToCurrency = CURRENCIES.fiat.formatToCurrency;

const WALLET_BUTTON_DEPOSIT = `deposit ${fiatName}s`;
const WALLET_BUTTON_WITHDRAW = 'withdraw';
const WALLET_BALANCE = 'Balance';
const WALLET_TRANSFER_HISTORY = 'transfer history';
const WALLET_TABLE_CURRENCY = 'Currency';
const WALLET_TABLE_AMOUNT = 'Amount';
const WALLET_TABLE_AMOUNT_IN_USD = `Amount in ${fiatShortName}`;
const WALLET_TABLE_TOTAL = 'Grand Total';

class Wallet extends Component {

  goToPage = (path = '') => {
    this.props.router.push(path);
  }
  goToDeposit = () => this.goToPage('deposit');
  goToWithdraw = () => this.goToPage('withdraw');
  goToTransferHistory = () => this.goToPage('transfers');

  renderWalletHeaderBlock = (symbol, balance) => {
    const { fullName, shortName, formatToCurrency } = CURRENCIES[symbol];
    return (
      <div className="wallet-header_block">
        <div className="wallet-header_block-currency_title">
          {`${fullName} ${WALLET_BALANCE}:`}
          <ActionNotification
            text={WALLET_TRANSFER_HISTORY}
            status="information"
            iconPath={ICONS.BLUE_CLIP}
            onClick={this.goToTransferHistory}
          />
        </div>
        <div className="wallet-header_block-amount d-flex">
          <CurrencyBall name={shortName} symbol={symbol} size="m" />
          <span className="wallet-header_block-amount-value">{`${formatToCurrency(balance[`${symbol}_balance`])}`}</span>
        </div>
      </div>
    );
  }

  renderAssetsBlock = (balance) => {
    return (
      <div className="wallet-assets_block">
        This are you assets
        <table className="wallet-assets_block-table">
          <thead>
            <tr className="table-bottom-border">
              <th></th>
              <th>{WALLET_TABLE_CURRENCY}</th>
              <th>{WALLET_TABLE_AMOUNT}</th>
              <th className="text-right">{WALLET_TABLE_AMOUNT_IN_USD}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(CURRENCIES)
              .filter(([key]) => balance.hasOwnProperty(`${key}_balance`))
              .map(([key, { shortName, fullName, formatToCurrency}]) => (
                <tr className="table-row table-bottom-border">
                  <td className="table-icon td-fit">
                    <CurrencyBall name={shortName} symbol={key} size="s" />
                  </td>
                  <td>{fullName}</td>
                  <td>{`${shortName} ${formatToCurrency(balance[`${key}_balance`])}`}</td>
                  <td className="text-right show-equals">
                    {`${fiatSymbol}${fiatFormatToCurrency(balance[`${key}_balance`])}`}
                  </td>
                </tr>
              ))
            }
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td>{WALLET_TABLE_TOTAL}</td>
              <td></td>
              <td className="text-right">
                {`${fiatSymbol}${fiatFormatToCurrency(12225.35)}`}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  render() {
    const { symbol, balance } = this.props;

    return (
      <div className="presentation_container">
        <IconTitle
          text="Wallet"
          iconPath={ICONS.LETTER}
          textType="title"
        />
        <div className={classnames('wallet-container')}>
          {this.renderWalletHeaderBlock(symbol, balance)}
          <div className={classnames(...FLEX_CENTER_CLASSES, 'wallet-buttons_action')}>
            <Button
              label={WALLET_BUTTON_DEPOSIT}
              onClick={this.goToDeposit}
            />
            <Button
              label={WALLET_BUTTON_WITHDRAW}
              onClick={this.goToWithdraw}
            />
          </div>
          {this.renderAssetsBlock(balance)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  symbol: store.orderbook.symbol,
  balance: store.user.balance,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
