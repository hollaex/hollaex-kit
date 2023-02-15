import React from 'react';
import { connect } from 'react-redux';
import { CurrencyBall } from 'components';
import { formatCurrencyByIncrementalUnit } from 'utils/currency';
import { DEFAULT_COIN_DATA } from 'config/constants';

const CurrencyBallWithPrice = ({
	symbol,
	amount,
	size = 'm',
	coins = {},
	min,
}) => {
	const { display_name, ...rest } = coins[symbol] || DEFAULT_COIN_DATA;
	const minValue = rest.increment_unit ?? min;

	return (
		<div className="with_price-block_amount d-flex direction_ltr">
			<CurrencyBall name={display_name} symbol={symbol} size={size} />
			<div className="with_price-block_amount-value d-flex">
				{formatCurrencyByIncrementalUnit(amount, minValue)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(CurrencyBallWithPrice);
