import React from 'react';
import { connect } from 'react-redux';
import { CurrencyBall } from '../';
import {
	formatToCurrency,
	calculatePrice
} from '../../utils/currency';
import { BASE_CURRENCY } from '../../config/constants';

const CurrencyBallWithPrice = ({ symbol, amount, price, size = 'm', coins = {} }) => {
	const { name, min, ...rest } = coins[symbol] || { symbol: '' };
	const baseCoin = coins[BASE_CURRENCY] || { symbol: '' };
	const currencyShortName = rest.symbol
		? rest.symbol.toUpperCase()
		: name;
	return (
		<div className="with_price-block_amount d-flex direction_ltr">
			<CurrencyBall name={currencyShortName} symbol={symbol} size={size} />
			<div className="with_price-block_amount-value d-flex">
				{`${formatToCurrency(amount, min)}`}
				{symbol !== BASE_CURRENCY && (
					<div className={`with_price-block_amount-value-${BASE_CURRENCY.toLowerCase()} d-flex align-items-end`}>
						{` ~ ${formatToCurrency(
							calculatePrice(amount, price), baseCoin.min
						)} ${baseCoin.symbol.toUpperCase()}`}
					</div>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins
});

export default connect(mapStateToProps)(CurrencyBallWithPrice);
