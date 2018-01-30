import React from 'react';
import classnames from 'classnames';
import math from 'mathjs';

import STRINGS from '../../../config/localizedStrings';

const ROW_CLASSNAMES = ['d-flex', 'justify-content-between'];

const renderAmount = (value, currency) =>
	`${value}${currency && ` ${currency}`}`;

const Review = ({
	orderPrice = 0,
	fees = 0,
	currency,
	formatToCurrency,
	type
}) => {
	const orderAmountReceived = math.subtract(
		math.fraction(orderPrice),
		math.fraction(fees)
	);
	return (
		<div className="trade_order_entry-review d-flex flex-column">
			<div className={classnames(...ROW_CLASSNAMES)}>
				<div>
					{type === 'market' ? STRINGS.MARKET_PRICE : STRINGS.ORDER_PRICE}:
				</div>
				<div className="text-price">
					{renderAmount(formatToCurrency(orderAmountReceived), currency)}
				</div>
			</div>
			<div className={classnames(...ROW_CLASSNAMES)}>
				<div>{STRINGS.FEES}:</div>
				<div className="text-price">
					{renderAmount(formatToCurrency(fees), currency)}
				</div>
			</div>
			<div className={classnames(...ROW_CLASSNAMES)}>
				<div>{STRINGS.TOTAL_ORDER}:</div>
				<div className="text-price">
					{renderAmount(formatToCurrency(orderPrice), currency)}
				</div>
			</div>
		</div>
	);
};

Review.defaultProps = {
	orderPrice: 0,
	fees: 0,
	orderTotal: 0,
	currency: '',
	formatToCurrency: (value) => value
};

export default Review;
