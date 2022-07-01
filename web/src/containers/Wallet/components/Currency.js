import React from 'react';
import { Link } from 'react-router';
import { CurrencyBall } from 'components';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { calculateOraclePrice, formatToCurrency } from 'utils/currency';

const Currency = ({ currency, balance, coins, searchResult }) => {
	const baseCurrency = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;

	const sortedSearchResults = Object.entries(searchResult)
		.filter(([key]) => balance.hasOwnProperty(`${key}_balance`))
		.sort(([key_a], [key_b]) => {
			const price_a = calculateOraclePrice(
				balance[`${key_a}_balance`],
				searchResult[key_a].oraclePrice
			);
			const price_b = calculateOraclePrice(
				balance[`${key_b}_balance`],
				searchResult[key_b].oraclePrice
			);
			return price_a < price_b ? 1 : -1; // descending order
		});
	return (
		<div className="d-flex justify-content-center align-items-center wallet-currency f-1">
			{sortedSearchResults.map(([key, { min, oraclePrice }]) => {
				const balanceValue = balance[`${key}_balance`];
				const { display_name } = coins[key] || DEFAULT_COIN_DATA;
				const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
				const balanceText =
					key === BASE_CURRENCY
						? formatToCurrency(balanceValue, min)
						: formatToCurrency(
								calculateOraclePrice(balanceValue, oraclePrice),
								baseCoin.min
						  );
				if (key === currency) {
					return (
						<div className="d-flex align-items-center">
							<Link to={`/wallet/${currency.toLowerCase()}`}>
								<CurrencyBall name={display_name} symbol={currency} size="m" />
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
												`${baseCurrency.display_name}	${balanceText}`}
										</span>
									)}
							</div>
						</div>
					);
				} else {
					return null;
				}
			})}
		</div>
	);
};

export default Currency;
