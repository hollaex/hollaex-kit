import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { FLEX_CENTER_CLASSES } from '../../config/constants';

import { TITLES } from './constants';

import TradeBlock from './components/TradeBlock';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import ActiveOrders from './components/ActiveOrders';
import TradeHistory from './components/TradeHistory';

class Trade extends Component {

  render() {
    const { tradeHistory, asks, bids, marketPrice, symbol, activeOrders } = this.props;

    return (
      <div className={classnames('trade-container', 'd-flex')}>
        <div className={classnames('trade-col_1_wrapper', 'flex-column', 'd-flex', 'b')}>
          <TradeBlock title={TITLES.ORDERBOOK}>
            <Orderbook
              symbol={symbol}
              asks={asks}
              bids={bids}
              marketPrice={marketPrice}
            />
          </TradeBlock>
        </div>
        <div className={classnames('trade-col_2_wrapper', 'flex-column', 'd-flex', 'b')}>
          <TradeBlock title={TITLES.ORDER_ENTRY}>
            <OrderEntry />
          </TradeBlock>
          <TradeBlock title={TITLES.TRADE_HISTORY}>
            <TradeHistory data={tradeHistory} />
          </TradeBlock>
        </div>
        <div className={classnames('trade-col_3_wrapper', 'flex-column', 'd-flex', 'b')}>
          <TradeBlock title={TITLES.CHART}>
          </TradeBlock>
          <TradeBlock title={TITLES.ORDERS}>
            <ActiveOrders orders={activeOrders} />
          </TradeBlock>
          <TradeBlock title={TITLES.TRADES}>
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

});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
