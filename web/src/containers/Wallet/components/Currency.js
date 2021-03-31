import React from 'react';
import { Link } from 'react-router';
import { CurrencyBall } from '../../../components';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../../config/constants';
import { formatToCurrency } from '../../../utils/currency';

const Currency = ({ currency, balance, balanceValue, balanceText, coins }) => {
	const { min, symbol = '' } =
		coins[currency || BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const baseCurrency = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	return (
		<div className="d-flex justify-content-center align-items-center wallet-currency f-1">
			<Link to={`/wallet/${currency.toLowerCase()}`}>
				<CurrencyBall name={symbol.toUpperCase()} symbol={currency} size="m" />
			</Link>
			<div className="d-flex flex-row">
				<span className="balance-big mr-1">
					{formatToCurrency(balanceValue, min)}
				</span>
				{currency !== BASE_CURRENCY &&
					balanceText &&
					parseFloat(balanceText || 0) > 0 && (
						<span className="d-flex align-items-end balance-small pb-4">
							{BASE_CURRENCY &&
								`${BASE_CURRENCY.toUpperCase()}	${formatToCurrency(
									balanceText,
									baseCurrency.min
								)}`}
						</span>
					)}
			</div>
		</div>
	);
};

export default Currency;
