import React from 'react';
import math from 'mathjs';

import { CURRENCIES } from '../../config/constants';

const TEXT_AVAILABLE_TRADING = 'Available for trading';
const TEXT_AVAILABLE_WITHDRAWAL = 'Available for withdrawal';
const TEXT_HOLD_ORDERS = (ordersOfSymbol, currencySymbol, hold) =>
  `You have ${ordersOfSymbol} open order${ordersOfSymbol > 1 ? 's' : ''},
  resulting in a hold of ${currencySymbol}${hold} placed on your `;
const TEXT_BALANCE = ' balance.';

const Section = ({ symbol = 'fiat', balance, orders, price }) => {
  const { currencySymbol, formatToCurrency } = CURRENCIES[symbol];
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
          <div>{TEXT_AVAILABLE_TRADING}:</div>
          <div>{`${currencySymbol}${formatToCurrency(available)}`}</div>
        </div>
        {ordersOfSymbol > 0 &&
          <div>
            {TEXT_HOLD_ORDERS(ordersOfSymbol, currencySymbol, formatToCurrency(hold))}
            <span className="text-uppercase">{symbol}</span>{TEXT_BALANCE}
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
