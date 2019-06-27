import React from 'react';
import { Link } from 'react-router';
import { CurrencyBall } from '../../../components';
import { BASE_CURRENCY } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';
import { formatToCurrency } from '../../../utils/currency';

const Currency = ({ currency, balance, balanceValue, balanceText, coins }) => {
	const { min } = coins[currency || BASE_CURRENCY] || {};
	const baseCurrency = coins[BASE_CURRENCY] || {};
	return (
		<div className="d-flex justify-content-center align-items-center wallet-currency f-1">
			<Link to={`/wallet/${currency.toLowerCase()}`}>
				<CurrencyBall
					name={STRINGS[`${currency.toUpperCase()}_SHORTNAME`]}
					symbol={currency}
					size="m"
				/>
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
								`${
									STRINGS[`${BASE_CURRENCY.toUpperCase()}_CURRENCY_SYMBOL`]
								}	${formatToCurrency(balanceText, baseCurrency.min)}`}
						</span>
					)}
			</div>
		</div>
	);
}

export default Currency;
