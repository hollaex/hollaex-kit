import React from 'react';
import classnames from 'classnames';

const Orderbook = ({ asks, bids, marketPrice, symbol }) => {
  return (
    <div className="trade_orderbook-wrapper d-flex flex-column">
      <div className="trade_orderbook-market_price b">
        PRICE (USD) - AMOUNT (symbol)
      </div>
      <div className="trade_orderbook-asks d-flex flex-column-reverse c">
        {asks.map(([price, amount], index) => <div key={`ask-${index}`}>{price} - {amount}</div>)}
      </div>
      <div className="trade_orderbook-market_price b">
        {marketPrice}
      </div>
      <div className="trade_orderbook-bids d-flex flex-column c">
        {bids.map(([price, amount], index) => <div key={`bid-${index}`}>{price} - {amount}</div>)}
      </div>
    </div>
  );
}

Orderbook.defaultProps = {
  marketPrice: 0,
  asks: [],
  bids: [],
}
export default Orderbook;
