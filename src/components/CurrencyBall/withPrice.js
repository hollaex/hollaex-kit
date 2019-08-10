import React from 'react';
import { connect } from 'react-redux';
import STRINGS from '../../config/localizedStrings';
import { CurrencyBall } from '../';
import {
	formatToCurrency,
	calculatePrice
} from '../../utils/currency';
import { BASE_CURRENCY } from '../../config/constants';

const CurrencyBallWithPrice = ({ symbol, amount, price, size = 'm', coins = {} }) => {
	const { name, min } = coins[symbol] || {};
	const baseCoin = coins[BASE_CURRENCY] || {};
	const currencyShortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`]
		? STRINGS[`${symbol.toUpperCase()}_SHORTNAME`]
		: name;
	return (
		<div className="with_price-block_amount d-flex direction_ltr">
			<CurrencyBall name={currencyShortName} symbol={symbol} size={size} />
			<div className="with_price-block_amount-value d-flex">
				{`${formatToCurrency(amount, min)}`}
				{symbol !== BASE_CURRENCY && (
					<div className={`with_price-block_amount-value-${BASE_CURRENCY.toLowerCase()} d-flex align-items-end`}>
						
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
