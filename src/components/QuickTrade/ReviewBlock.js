import React from 'react';
import classnames from 'classnames';
import { fiatShortName, fiatFormatToCurrency, fiatSymbol } from '../../utils/currency';
import { CurrencyBallWithPrice } from '../../components';

const ReviewBlock = ({ text,  value }) => (
  <div className={classnames('review-block-wrapper', 'd-flex', 'flex-column')}>
    <div className="input_block-title text-center">{text}</div>
    <div className="d-flex currency-wrapper">
      <CurrencyBallWithPrice
        symbol={fiatSymbol}
        amount={value}
        price={1}
      />
    </div>
  </div>
);

export default ReviewBlock;
