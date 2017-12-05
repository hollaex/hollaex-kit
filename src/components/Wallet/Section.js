import React from 'react';
import math from 'mathjs';
import STRINGS from '../../config/localizedStrings';
import { CURRENCIES } from '../../config/constants';

const TextHolders = ({ ordersOfSymbol, currencySymbol, hold, name }) => {
  const ordersText = ordersOfSymbol > 1 ?
    STRINGS.WALLET.ORDERS_PLURAL :
    STRINGS.WALLET.ORDERS_SINGULAR;
  const symbolComponent = <span className="text-uppercase">{name}</span>;
  return (
    <div>
      {STRINGS.formatString(STRINGS.WALLET.HOLD_ORDERS,
        ordersOfSymbol, ordersText,
        currencySymbol, hold, symbolComponent
      )}
    </div>
  );
}

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
  
  return (
    <div className="wallet_section-content-wrapper">
      <div className="wallet_section-content d-flex flex-column">
        <div className="d-flex flex-column">
          <div>{STRINGS.WALLET.TOTAL_ASSETS}:</div>
          <div>{`${currencySymbol}${formatToCurrency(available)}`}</div>
        </div>
        {ordersOfSymbol > 0 &&
          <TextHolders
            ordersOfSymbol={ordersOfSymbol}
            currencySymbol={currencySymbol}
            hold={formatToCurrency(hold)}
            name={shortName}
          />
        }
        <div className="d-flex flex-column">
          <div>{STRINGS.WALLET.AVAILABLE_WITHDRAWAL}:</div>
          <div>{`${currencySymbol}${formatToCurrency(available)}`}</div>
        </div>
      </div>
    </div>
  );
}

export default Section;
