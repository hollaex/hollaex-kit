import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { FLEX_CENTER_CLASSES } from '../../config/constants';

import { TITLES } from './constants';

import TradeBlock from './components/TradeBlock';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import TradeHistory from './components/TradeHistory';

class Trade extends Component {

  render() {
    const { tradeHistory } = this.props;
    
    return (
      <div className={classnames('trade-container', 'd-flex')}>
        <div className={classnames('trade-col_1_wrapper', 'flex-column', 'd-flex', 'b')}>
          <TradeBlock title={TITLES.ORDERBOOK}>
            <Orderbook />
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
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
