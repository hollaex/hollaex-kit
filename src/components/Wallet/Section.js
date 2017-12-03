import React from 'react';
import math from 'mathjs';

import { TEXTS } from './constants';
import { CURRENCIES } from '../../config/constants';

const {
  TEXT_AVAILABLE_WITHDRAWAL,
  TEXT_AVAILABLE_TRADING,
  TEXT_HOLD_ORDERS,
} = TEXTS;

const Section = ({ symbol = 'fiat', balance, orders, price }) => {
  const { currencySymbol, shortName, formatToCurrency } = CURRENCIES[symbol];
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
  console.log('symbol', symbol, shortName, total, available, hold)
  return (
    <div className="wallet_section-content-wrapper">
      <div className="wallet_section-content d-flex flex-column">
        <div className="d-flex flex-column">
          <div>{TEXT_AVAILABLE_TRADING}:</div>
          <div>{`${currencySymbol}${formatToCurrency(available)}`}</div>
        </div>
        {ordersOfSymbol > 0 &&
          <div>
            {TEXT_HOLD_ORDERS(ordersOfSymbol, currencySymbol, formatToCurrency(hold), shortName)}
          </div>
        }
        <div className="d-flex flex-column">
          <div>{TEXT_AVAILABLE_WITHDRAWAL}:</div>
          <div>{`${currencySymbol}${formatToCurrency(available)}`}</div>
        </div>
      </div>
    </div>
  );
}

export default Section;
