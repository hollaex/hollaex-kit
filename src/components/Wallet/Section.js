import React from 'react';
import math from 'mathjs';

import { CURRENCIES } from '../../config/constants';

const Section = ({ symbol = 'fiat', balance, orders, price }) => {
  const { name, currencySymbol, formatToCurrency } = CURRENCIES[symbol];
  const ordersOfSymbol = orders.filter((order) => {
    if (symbol === 'fiat') {
      return order.side === 'buy';
    } else {
      return order.symbol === symbol && order.side === 'sell'
    }
  }).length;

  const total = balance[`${symbol}_balance`];
  const available = balance[`${symbol}_available`];
  const hold = math.subtract(math.fraction(total),math.fraction(available));

  return (
    <div className="wallet_section-content-wrapper">
      <div className="wallet_section-content d-flex flex-column">
        <div className="d-flex flex-column">
          <div>Available for trading:</div>
          <div>{`${currencySymbol}${formatToCurrency(total)}`}</div>
        </div>
        {ordersOfSymbol > 0 &&
          <div>You have {ordersOfSymbol} open order{ordersOfSymbol > 1 ? 's' : ''}, resulting in a hold of {currencySymbol}{formatToCurrency(hold)} placed on your <span className="text-uppercase">{symbol}</span> balance.</div>
        }
        <div className="d-flex flex-column">
          <div>Available for withdrawal:</div>
          <div>{`${currencySymbol}${formatToCurrency(available)}`}</div>
        </div>
      </div>
    </div>
  );
}

export default Section;
