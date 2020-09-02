import React from 'react';
import { oneOfType, string, number, bool } from 'prop-types';
import classnames from 'classnames';
import { CurrencyBallWithPrice } from 'components';

const ReviewBlock = ({ text, amount, symbol }) => {

	return (
		<div className={classnames('review-block-wrapper', 'd-flex', 'flex-column')}>
			{ text && (
				<div className="input_block-title text-center">
          {text}
				</div>
			)}
			<div className="d-flex currency-wrapper">
				<CurrencyBallWithPrice symbol={symbol} amount={amount} />
			</div>
		</div>
	);
}

ReviewBlock.propType = {
  text: oneOfType([string, bool]),
	amount: number,
	symbol: string.isRequired,
}

ReviewBlock.defaultProps = {
  text: false,
  amount: 0,
}

export default ReviewBlock;
