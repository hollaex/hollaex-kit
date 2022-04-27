import React from 'react';
import { connect } from 'react-redux';
import { CurrencyBall } from '../';
import { formatToCurrency } from '../../utils/currency';
import { DEFAULT_COIN_DATA } from '../../config/constants';

const CurrencyBallWithPrice = ({
	symbol,
	amount,
	size = 'm',
	coins = {},
	min,
	isExistBroker = false,
}) => {
	const { display_name, ...rest } = coins[symbol] || DEFAULT_COIN_DATA;
	const minValue = min ? min : rest.min;

	return (
		<div className="with_price-block_amount d-flex direction_ltr">
			<CurrencyBall name={display_name} symbol={symbol} size={size} />
			<div className="with_price-block_amount-value d-flex">
				{isExistBroker ? amount : `${formatToCurrency(amount, minValue)}`}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(CurrencyBallWithPrice);
