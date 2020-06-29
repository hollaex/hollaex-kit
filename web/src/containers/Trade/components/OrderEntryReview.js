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
	size = 0,
	currency,
	price,
	increment_price,
	formatToCurrency,
	type,
	onFeeStructureAndLimits
}) => {
	// const orderAmountReceived = math.add(
	// 	math.fraction(orderPrice),
	// 	math.fraction(fees)
	// );
	const upToMarket = !math.smaller(orderPrice, 0);
	return (
		<div className="trade_order_entry-review d-flex flex-column">
			<div className={classnames(...ROW_CLASSNAMES)}>
				<div>
					{type === 'market' ? STRINGS.MARKET_PRICE : STRINGS.ORDER_PRICE}:
				</div>
				<div className="text-price">
					{upToMarket
						?price ? renderAmount(formatToCurrency(price * size, increment_price), currency) :0
						: STRINGS.UP_TO_MARKET}
				</div>
			</div>
			<div className={classnames(...ROW_CLASSNAMES)}>
				<div>{STRINGS.FEES}:</div>
				<div className="text-price blue-link pointer" onClick={onFeeStructureAndLimits}>
					{STRINGS.VIEW_MY_FEES}
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
