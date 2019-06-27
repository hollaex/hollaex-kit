import React from 'react';
import { connect } from 'react-redux';
import STRINGS from '../../config/localizedStrings';
import { CurrencyBall } from '../';
import {
	formatToCurrency,
	calculatePrice,
	fiatFormatToCurrency,
	fiatShortName,
	fiatSymbol
} from '../../utils/currency';
import { BASE_CURRENCY } from '../../config/constants';

const CurrencyBallWithPrice = ({ symbol, amount, price, size = 'm', coins }) => {
	const { name, min } = coins[symbol] || {};
	const currencyShortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`]
		? STRINGS[`${symbol.toUpperCase()}_SHORTNAME`]
		: name;
	return (
		<div className="with_price-block_amount d-flex direction_ltr">
			<CurrencyBall name={currencyShortName} symbol={symbol} size={size} />
			<div className="with_price-block_amount-value d-flex">
				{`${formatToCurrency(amount, min)}`}
				{symbol !== fiatSymbol && (
					<div className={`with_price-block_amount-value-${BASE_CURRENCY.toLowerCase()} d-flex align-items-end`}>
						{` ~ ${fiatFormatToCurrency(
							calculatePrice(amount, price)
						)} ${fiatShortName}`}
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
