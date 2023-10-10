import React from 'react';
import { connect } from 'react-redux';
import { CurrencyBall, Coin } from 'components';
import { formatCurrencyByIncrementalUnit } from 'utils/currency';
import { DEFAULT_COIN_DATA } from 'config/constants';

const CurrencyBallWithPrice = ({
	symbol,
	amount,
	size = 'm',
	coins = {},
	min,
}) => {
	const { increment_unit, icon_id } = coins[symbol] || DEFAULT_COIN_DATA;
	const minValue = min ?? increment_unit;

	return (
		<div className="with_price-block_amount d-flex direction_ltr">
			<div className="with_price-block_coin_icon">
				<Coin iconId={icon_id} type="CS10" />
			</div>
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
