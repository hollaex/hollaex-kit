import React from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { formatFiatAmount } from '../../../utils/currency';

const substract = (a = 0, b = 0) => {
  const remaining = math.chain(a).subtract(b).done();
  return remaining;
}

const calculateSpread = (asks, bids) => {
  const lowerAsk = asks.length > 0 ? asks[0][0]: 0;
  const higherBid = bids.length > 0 ? bids[0][0]: 0;
  if (lowerAsk && higherBid) {
    return formatFiatAmount(substract(lowerAsk, higherBid));
  }
  return '-';
}
const Orderbook = ({ asks, bids, marketPrice, symbol, fiatSymbol }) => {
  return (
    <div className="trade_orderbook-wrapper d-flex flex-column f-1">
      <div className="trade_orderbook-headers d-flex">
        <div className="f-1">PRICE ({fiatSymbol})</div>
        <div className="f-1">AMOUNT ({symbol})</div>
      </div>
      <div className="trade_orderbook-content d-flex flex-column f-1">
        <div className="trade_orderbook-asks d-flex flex-column-reverse c">
          {asks.map(([price, amount], index) => (
            <div key={`ask-${index}`} className={classnames('d-flex', 'value-row', 'align-items-center')}>
              <div className="f-1 trade_orderbook-cell-price ask">{price}</div>
              <div className="f-1 trade_orderbook-cell-amount">{amount}</div>
            </div>
          ))}
        </div>
        <div className="trade_orderbook-market_price d-flex align-items-center">
          <div className="trade_orderbook-market_price-text">{`${calculateSpread(asks, bids)} ${fiatSymbol} `}</div>spread.
        </div>
        <div className="trade_orderbook-bids d-flex flex-column c">
          {bids.map(([price, amount], index) => (
            <div key={`bid-${index}`} className={classnames('d-flex', 'value-row', 'align-items-center')}>
              <div className="f-1 trade_orderbook-cell-price bid">{price}</div>
              <div className="f-1 trade_orderbook-cell-amount">{amount}</div>
            </div>
          ))}
        </div>
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
