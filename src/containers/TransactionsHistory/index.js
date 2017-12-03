import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { getUserTrades, getUserDeposits, getUserWithdrawals } from '../../actions/walletActions';
import { fiatSymbol } from '../../utils/currency';

import { ActionNotification, IconTitle, Table, CsvDownload, TabController, Loader } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES, CURRENCIES } from '../../config/constants';

import { generateTradeHeaders, generateDepositsHeaders, generateWithdrawalsHeaders } from './utils';
import HistoryDisplay from './HistoryDisplay';

import STRINGS from '../../config/localizedStrings';

const filterData = (symbol, { count = 0, data = [] }) => {
  const filteredData = data.filter((item) => item.symbol === symbol);
  return {
    count: filteredData.length,
    data: filteredData,
  }
}

class TransactionsHistory extends Component {
  state = {
    headers: [],
    activeTab: 0,
  }

  componentDidMount() {
    this.requestData(this.props.symbol);
    this.generateHeaders(this.props.symbol);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.symbol !== this.props.symbol) {
      this.requestData(nextProps.symbol);
      this.generateHeaders(nextProps.symbol, nextProps.activeLanguage);
    // } else if (nextProps.activeLanguage !== this.props.activeLanguage) {
    //   this.generateHeaders(nextProps.symbol, nextProps.activeLanguage);
    }

  }

  requestData = (symbol) => {
    // this.props.getUserTrades(symbol);
    this.props.getUserDeposits(symbol);
    this.props.getUserWithdrawals(symbol);
  }

  generateHeaders(symbol, language) {
    this.setState({ headers: {
      trades: generateTradeHeaders(symbol, language),
      deposits: generateDepositsHeaders(symbol, language),
      withdrawals: generateWithdrawalsHeaders(symbol, language),
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
        props.title = `${name} ${STRINGS.TRANSACTION_HISTORY.TITLE_TRADES}`;
        props.headers = headers.trades;
        props.data = filterData(symbol, trades);
        props.filename = `${symbol}-transfers_history`;
        break
      case 1:
        props.title = STRINGS.TRANSACTION_HISTORY.TITLE_DEPOSITS;
        props.headers = headers.deposits;
        props.data = deposits;
        props.filename = `${symbol}-deposits_history`;
        break;
      case 2:
        props.title = STRINGS.TRANSACTION_HISTORY.TITLE_WITHDRAWALS;
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
      return <Loader />;
    }

    return (
      <div className="presentation_container apply_rtl">
        <IconTitle
          text={STRINGS.TRANSACTION_HISTORY.TITLE}
          iconPath={ICONS.TRANSACTION_HISTORY}
          textType="title"
        />
        <TabController
          tabs={[
            { title: STRINGS.TRANSACTION_HISTORY.TRADES },
            { title: STRINGS.TRANSACTION_HISTORY.DEPOSITS },
            { title: STRINGS.TRANSACTION_HISTORY.WITHDRAWALS },
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
  activeLanguage: store.app.language,
});

const mapDispatchToProps = (dispatch) => ({
  getUserTrades: (symbol) => dispatch(getUserTrades({ symbol })),
  getUserDeposits: (symbol) => dispatch(getUserDeposits({ symbol })),
  getUserWithdrawals: (symbol) => dispatch(getUserWithdrawals({ symbol })),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsHistory);
