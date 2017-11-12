import React from 'react';
import classnames from 'classnames';
import { fiatShortName, fiatFormatToCurrency, fiatSymbol } from '../../utils/currency';
import { CurrencyBall } from '../../components';

const ReviewBlock = ({ text,  value }) => (
  <div className={classnames('review-block-wrapper', 'd-flex', 'flex-column')}>
    <div className="font-weight-bold text-center">{text}</div>
    <div className="d-flex currency-wrapper">
      <CurrencyBall symbol={fiatSymbol} name={fiatShortName} size="m" />
      {fiatFormatToCurrency(value)}
    </div>
  </div>
);

export default ReviewBlock;
