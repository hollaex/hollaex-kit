import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventListener from 'react-event-listener';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';

import { FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import { submitOrder, cancelOrder, cancelAllOrders } from '../../actions/orderAction';
import { getUserTrades } from '../../actions/walletActions';

import { TITLES, TEXTS } from './constants';

import TradeBlock from './components/TradeBlock';
import TradeBlockTabs from './components/TradeBlockTabs';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import ActiveOrders from './components/ActiveOrders';
import UserTrades from './components/UserTrades';
import TradeHistory from './components/TradeHistory';
import PriceChart from './components/PriceChart';

import { ActionNotification } from '../../components';

class Trade extends Component {
  state = {
    chartHeight: 0,
    chartWidth: 0,
  }

  componentWillMount() {
    if (this.props.symbol === 'fiat') {
      this.redirectInFiat();
    }
  }

  componentDidMount() {
    if (!this.props.userTrades.fetched) {
      this.props.getUserTrades(this.props.symbol);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.symbol === 'fiat') {
      this.redirectInFiat();
    }
  }

  redirectInFiat = () => {
    this.props.router.replace('wallet');
  }

  onSubmitOrder = (values) => {
    return submitOrder(values)
      .then((body) => {
        // console.log('sucess', body)
      })
      .catch((err) => {
        console.log('error', err)
        const _error = err.response.data ? err.response.data.message : err.message;
        throw new SubmissionError({ _error });
      });
  }

  setChartRef = (el) => {
    if (el) {
      this.chartBlock = el;
      this.onResize();
    }
  }

  goToTransactionsHistory = () => {
    this.props.router.push('transactions');
  }

  onResize = () => {
    if (this.chartBlock) {
      this.setState({
        chartHeight: this.chartBlock.offsetHeight || 0,
        chartWidth: this.chartBlock.offsetWidth || 0,
      });
    }
  }

  render() {
    const {
      tradeHistory,
      orderbookReady,
      asks,
      bids,
      marketPrice,
      symbol,
      activeOrders,
      userTrades,
      cancelOrder,
      cancelAllOrders,
      balance,
    } = this.props;
    const { chartHeight, chartWidth } = this.state
    const USER_TABS = [
      {
        title: TITLES.ORDERS,
        children: <ActiveOrders orders={activeOrders} onCancel={cancelOrder} />,
        titleAction: activeOrders.length > 0  && (
          <ActionNotification
            text={TEXTS.CANCEL_ALL}
            iconPath={ICONS.CHECK}
            onClick={cancelAllOrders}
            status=""
          />
        ),
      },
      {
        title: TITLES.TRADES,
        children: <UserTrades trades={userTrades} symbol={symbol} />,
        titleAction: (
          <ActionNotification
            text={TEXTS.TRADE_HISTORY}
            status="information"
            iconPath={ICONS.RED_ARROW}
            onClick={this.goToTransactionsHistory}
          />
        ),
      },
    ]

    const orderbookProps = {
      symbol,
      fiatSymbol: 'USD',
      // asks: asks.concat(asks, asks, asks),
      // bids: bids.concat(asks, asks, asks),
      asks,
      bids,
    }

    return (
      <div className={classnames('trade-container', 'd-flex')}>
        <EventListener
          target="window"
          onResize={this.onResize}
        />
        <div className={classnames('trade-col_side_wrapper', 'flex-column', 'd-flex')}>
          <TradeBlock title={TITLES.ORDERBOOK}>
            {orderbookReady && <Orderbook {...orderbookProps} />}
          </TradeBlock>
        </div>
        <div className={classnames('trade-col_main_wrapper', 'flex-column', 'd-flex', 'flex-auto')}>
          <div className={classnames('trade-main_content', 'flex-auto', 'd-flex')}>
            <div className={classnames('trade-col_action_wrapper', 'flex-column', 'd-flex')}>
              <TradeBlock title={TITLES.ORDER_ENTRY}>
                <OrderEntry
                  submitOrder={this.onSubmitOrder}
                  symbol={symbol}
                  balance={balance}
                />
              </TradeBlock>
            </div>
            <TradeBlock title={TITLES.CHART} setRef={this.setChartRef}>
              {chartHeight > 0 &&
                <PriceChart
                  height={chartHeight}
                  width={chartWidth}
                />
              }
            </TradeBlock>
          </div>
          <div className={classnames('trade-tabs_content', 'd-flex', 'flex-column')}>
            <TradeBlockTabs content={USER_TABS} />
          </div>
        </div>
        <div className={classnames('trade-col_side_wrapper', 'flex-column', 'd-flex')}>
          <TradeBlock title={TITLES.TRADE_HISTORY}>
            <TradeHistory data={tradeHistory} />
          </TradeBlock>
        </div>
      </div>
    )
  }
}

Trade.defaultProps = {

}

const mapStateToProps = (store) => ({
  symbol: store.orderbook.symbol,
  balance: store.user.balance,
  tradeHistory: store.orderbook.trades,
  orderbookReady: store.orderbook.orderbookReady,
  asks: store.orderbook.asks,
  bids: store.orderbook.bids,
  marketPrice: store.orderbook.price,
  activeOrders: store.order.activeOrders,
  userTrades: store.wallet.trades.data,
});

const mapDispatchToProps = (dispatch) => ({
  getUserTrades: (symbol) => dispatch(getUserTrades({ symbol })),
  cancelOrder: bindActionCreators(cancelOrder, dispatch),
  cancelAllOrders: bindActionCreators(cancelAllOrders, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
