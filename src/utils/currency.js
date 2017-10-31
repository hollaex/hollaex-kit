import math from 'mathjs';
import numbro from 'numbro';
import { CURRENCIES } from '../config/constants';

export const fiatSymbol = 'fiat';
export const fiatName = CURRENCIES[fiatSymbol].name;
export const fiatShortName = CURRENCIES[fiatSymbol].shortName;
export const fiatFormatToCurrency = CURRENCIES[fiatSymbol].formatToCurrency;

const WALLET_BUTTON_FIAT_DEPOSIT = 'deposit';
const WALLET_BUTTON_FIAT_WITHDRAW = 'withdraw';
const WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT = 'receive';
const WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW = 'send';


export const BTC_FORMAT = '0,0.[0000]';
export const FIAT_FORMAT = '0,0.[00]';

export const formatBtcAmount = (amount = 0) => numbro(math.number(amount)).format(BTC_FORMAT);
export const formatFiatAmount = (amount = 0) => numbro(math.number(amount)).format(FIAT_FORMAT);
export const formatNumber = (number, round = 0) => {
	return math.round(number, round);
}

export const calculatePrice = (value = 0, price = 1) => math.number(
  math.multiply(
    math.fraction(value),
    math.fraction(price)
  )
);

export const calculateBalancePrice = (balance, prices) => {
  let accumulated = math.fraction(0);
  Object.entries(prices).forEach(([key, value]) => {
    if (balance.hasOwnProperty(`${key}_balance`)) {
      accumulated = math.add(
        math.multiply(
          math.fraction(balance[`${key}_balance`]),
          math.fraction(value)
        ),
        accumulated
      )
    }
  })
  return math.number(accumulated);
}

export const generateWalletActionsText = (symbol, useFullName = false) => {
  const { name, fullName } = CURRENCIES[symbol];

  const nameToDisplay = useFullName ? fullName : name;

  const depositText = `${
    symbol === fiatSymbol ?
      WALLET_BUTTON_FIAT_DEPOSIT :
      WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT
  } ${nameToDisplay}s`;
  const withdrawText = `${
    symbol === fiatSymbol ?
      WALLET_BUTTON_FIAT_WITHDRAW :
      WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW
  } ${nameToDisplay}s`;

  return {
    depositText,
    withdrawText,
  };
}
