import React from 'react';
import classnames from 'classnames';
import math from 'mathjs';

const TEXT_MARKET_PRICE = 'Market Price';
const TEXT_ORDER_PRICE = 'Order Price';
const TEXT_FEES = 'Fees';
const TEXT_ORDER_TOTAL = 'Order Total';

const ROW_CLASSNAMES = ['d-flex', 'justify-content-between'];

const renderAmount = (value, currency) => `${value}${currency && ` ${currency}`}`;

const Review = ({ orderPrice = 0, fees = 0, currency, formatToCurrency, type }) => {
  const orderTotal = math.add(
    math.fraction(orderPrice),
    math.fraction(fees)
  );
  return (
    <div className="trade_order_entry-review d-flex flex-column">
      <div className={classnames(...ROW_CLASSNAMES)}>
        <div>{type === 'market' ? TEXT_MARKET_PRICE : TEXT_ORDER_PRICE}:</div>
        <div className="text-price">{renderAmount(formatToCurrency(orderPrice), currency)}</div>
      </div>
      <div className={classnames(...ROW_CLASSNAMES)}>
        <div>{TEXT_FEES}:</div>
        <div className="text-price">{renderAmount(formatToCurrency(fees), currency)}</div>
      </div>
      <div className={classnames(...ROW_CLASSNAMES)}>
        <div>{TEXT_ORDER_TOTAL}:</div>
        <div className="text-price">{renderAmount(formatToCurrency(orderTotal), currency)}</div>
      </div>
    </div>
  );
}

Review.defaultProps = {
  orderPrice: 0,
  fees: 0,
  orderTotal: 0,
  currency: '',
  formatToCurrency: (value) => value,
}

export default Review;
