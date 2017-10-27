import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

import { FLEX_CENTER_CLASSES } from '../../config/constants';
import { submitOrder } from '../../actions/orderAction';

import { TITLES } from './constants';

import TradeBlock from './components/TradeBlock';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import ActiveOrders from './components/ActiveOrders';
import TradeHistory from './components/TradeHistory';

class Trade extends Component {

  onSubmitOrder = (values) => {
    return submitOrder(values)
      .then((body) => {
        console.log('sucess', body)
      })
      .then((error) => {
        console.log('error', error)
      });
  }
  render() {
    const {
      tradeHistory,
      asks,
      bids,
      marketPrice,
      symbol,
      activeOrders,
    } = this.props;

    return (
      <div className={classnames('trade-container', 'd-flex')}>
        <div className={classnames('trade-col_side_wrapper', 'flex-column', 'd-flex')}>
          <TradeBlock title={TITLES.ORDERBOOK}>
            <Orderbook
              symbol={symbol}
              asks={asks}
              bids={bids}
              marketPrice={marketPrice}
            />
          </TradeBlock>
        </div>
        <div className={classnames('trade-col_main_wrapper', 'flex-column', 'd-flex', 'flex-auto')}>
          <div className={classnames('trade-main_content', 'flex-auto', 'd-flex')}>
            <div className={classnames('trade-col_action_wrapper', 'flex-column', 'd-flex')}>
              <TradeBlock title={TITLES.ORDER_ENTRY}>
                <OrderEntry
                  submitOrder={this.onSubmitOrder}
                />
              </TradeBlock>
            </div>
            <TradeBlock title={TITLES.CHART}>
            </TradeBlock>
          </div>
          <div className={classnames('trade-tabs_content', 'd-flex', 'flex-column')}>
            <TradeBlock title={TITLES.ORDERS}>
              <ActiveOrders orders={activeOrders} />
            </TradeBlock>
            <TradeBlock title={TITLES.TRADES}>
            </TradeBlock>
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
  tradeHistory: store.orderbook.trades,
  asks: store.orderbook.asks,
  bids: store.orderbook.bids,
  marketPrice: store.orderbook.price,
  activeOrders: store.order.activeOrders,
});

const mapDispatchToProps = (dispatch) => ({
  // submitOrder: bindActionCreators(submitOrder, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
