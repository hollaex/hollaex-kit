import math from 'mathjs';
import numbro from 'numbro';

export const BTC_FORMAT = '0,0.[0000]';
export const FIAT_FORMAT = '0,0.[00]';

export const formatBtcAmount = (amount = 0) => numbro(math.number(amount)).format(BTC_FORMAT);
export const formatFiatAmount = (amount = 0) => numbro(math.number(amount)).format(FIAT_FORMAT);

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
