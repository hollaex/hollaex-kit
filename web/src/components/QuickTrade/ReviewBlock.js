import React from 'react';
import { oneOfType, string, number, bool } from 'prop-types';
import { CurrencyBallWithPrice } from 'components';

const ReviewBlock = ({ text, amount, symbol }) => {
	return (
		<div className="review-block-wrapper d-flex flex-column">
			{text && <div className="input_block-title text-left">{text}</div>}
			<div className="d-flex justify-content-end currency-wrapper">
				<CurrencyBallWithPrice symbol={symbol} amount={amount} />
			</div>
		</div>
	);
};

ReviewBlock.propType = {
	text: oneOfType([string, bool]),
	amount: number,
	symbol: string.isRequired,
};

ReviewBlock.defaultProps = {
	text: false,
	amount: 0,
};

export default ReviewBlock;
