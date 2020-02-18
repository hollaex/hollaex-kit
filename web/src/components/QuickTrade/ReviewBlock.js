import React from 'react';
import classnames from 'classnames';
import { DEFAULT_COIN_DATA } from '../../config/constants';
import { CurrencyBallWithPrice } from '../../components';

const ReviewBlock = ({ text, value, symbol, pairs, coins }) => {
	const pair = pairs[symbol] || {};
	const baseCoin = coins[pair.pair_2] || DEFAULT_COIN_DATA;
	const shortName = baseCoin.symbol.toUpperCase();
	return (
		<div className={classnames('review-block-wrapper', 'd-flex', 'flex-column')}>
			<div className="input_block-title text-center">{text}</div>
			<div className="d-flex currency-wrapper">
				<CurrencyBallWithPrice symbol={pair.pair_2} name={shortName} amount={value} price={1} />
			</div>
		</div>
	);
}

export default ReviewBlock;
