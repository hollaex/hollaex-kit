import React from 'react';
import STRINGS from '../../config/localizedStrings';

const { WALLET } = STRINGS;

export const TEXTS = {
  TOTAL_ASSETS: WALLET.TOTAL_ASSETS,
  TEXT_AVAILABLE_TRADING: WALLET.AVAILABLE_TRADING,
  TEXT_AVAILABLE_WITHDRAWAL: WALLET.AVAILABLE_WITHDRAWAL,
  TEXT_HOLD_ORDERS: (ordersOfSymbol, currencySymbol, hold, symbol) => {
    const ordersText = ordersOfSymbol > 1 ? WALLET.ORDERS_PLURAL : WALLET.ORDERS_SINGULAR;
    const symbolComponent = <span className="text-uppercase">{symbol}</span>;
    const result = STRINGS.formatString(WALLET.HOLD_ORDERS, ordersOfSymbol, ordersText, currencySymbol, hold, symbolComponent);
    return result;
  }
}
