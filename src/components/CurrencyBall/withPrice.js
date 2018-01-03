import React from 'react';
import { CurrencyBall, ActionNotification } from '../';
import { CURRENCIES } from '../../config/constants';
import {
	calculatePrice,
	fiatFormatToCurrency,
	fiatShortName,
	fiatSymbol
} from '../../utils/currency';

const CurrencyBallWithPrice = ({ symbol, amount, price, size = 'm' }) => {
	const { shortName, formatToCurrency } = CURRENCIES[symbol];
	return (
		<div className="with_price-block_amount d-flex direction_ltr">
			<CurrencyBall name={shortName} symbol={symbol} size={size} />
			<div className="with_price-block_amount-value d-flex">
				{`${formatToCurrency(amount)}`}
				{symbol !== fiatSymbol && (
					<div className="with_price-block_amount-value-fiat d-flex align-items-end">
						{` ~ ${fiatFormatToCurrency(
							calculatePrice(amount, price)
						)} ${fiatShortName}`}
					</div>
				)}
			</div>
		</div>
	);
};

export default CurrencyBallWithPrice;
