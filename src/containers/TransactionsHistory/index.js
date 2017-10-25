import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { getUserTrades, getUserDeposits, getUserWithdrawals } from '../../actions/walletActions';
import { fiatSymbol } from '../../utils/currency';

import { ActionNotification, IconTitle, Table, CsvDownload, TabController } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';

import { TITLE, TITLE_TRADES, TITLE_DEPOSITS, TITLE_WITHDRAWAlS } from './constants';

import { generateTradeHeaders, generateDepositsHeaders, generateWithdrawalsHeaders } from './utils';
import HistoryDisplay from './HistoryDisplay';

class TransactionsHistory extends Component {
  state = {
    headers: [],
    activeTab: 0,
  }

  componentDidMount() {
    this.generateHeaders(this.props.symbol);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.symbol !== this.props.symbol) {
      this.generateHeaders(nextProps.symbol);
    }
  }

  generateHeaders(symbol) {
    this.props.getUserTrades(symbol);
    this.props.getUserDeposits(symbol);
    this.props.getUserWithdrawals(symbol);
    this.setState({ headers: {
      trades: generateTradeHeaders(symbol),
      deposits: generateDepositsHeaders(symbol),
      withdrawals: generateWithdrawalsHeaders(symbol),
    }});
  }

  setActiveTab = (activeTab = 0) => {
    this.setState({ activeTab });
  }

  renderActiveTab = () => {
    const { trades, deposits, withdrawals, symbol } = this.props;
    const { headers, activeTab } = this.state;
    const { name } = CURRENCIES[symbol];

    const props = {
      symbol,
    };

    switch (activeTab) {

      case 0:
        props.title = `${name} ${TITLE_TRADES}`;
        props.headers = headers.trades;
        props.data = trades;
        props.filename = `${symbol}-transfers_history`;
        break
      case 1:
        props.title = TITLE_DEPOSITS;
        props.headers = headers.deposits;
        props.data = deposits;
        props.filename = `${symbol}-deposits_history`;
        break;
      case 2:
        props.title = TITLE_WITHDRAWAlS;
        props.headers = headers.withdrawals;
        props.data = withdrawals;
        props.filename = `${symbol}-withdrawals_history`;
        break;
      default:
        return <div></div>
    }

    return <HistoryDisplay {...props} />;
  }

  render() {
    const { id } = this.props;
    const { activeTab } = this.state;

    if (!id) {
      return <div></div>;
    }

    return (
      <div className="presentation_container">
        <IconTitle
          text={TITLE}
          iconPath={ICONS.LETTER}
          textType="title"
        />
        <TabController
          tabs={[
            { title: 'Trades' },
            { title: 'Deposits' },
            { title: 'Withdrawals' },
          ]}
          activeTab={activeTab}
          setActiveTab={this.setActiveTab}
        />
        <div className={classnames('inner_container', 'with_border_top')}>
          {this.renderActiveTab()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  id: store.user.id,
  trades: store.wallet.trades,
  deposits: store.wallet.deposits,
  withdrawals: store.wallet.withdrawals,
  symbol: store.orderbook.symbol,
});

const mapDispatchToProps = (dispatch) => ({
  getUserTrades: (symbol) => dispatch(getUserTrades({ symbol })),
  getUserDeposits: (symbol) => dispatch(getUserDeposits({ symbol })),
  getUserWithdrawals: (symbol) => dispatch(getUserWithdrawals({ symbol })),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsHistory);
