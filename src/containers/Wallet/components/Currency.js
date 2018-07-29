import React from 'react';
import { CurrencyBall } from '../../../components';
import { Link } from 'react-router';
import { CURRENCIES, BASE_CURRENCY } from '../../../config/constants';

const Currency = ({ currency, balance, balanceValue, balanceText }) => (
	<div className="d-flex justify-content-center align-items-center wallet-currency f-1">
		<Link to={`/wallet/${currency.toLowerCase()}`}>
			<CurrencyBall
				name={CURRENCIES[currency].shortName}
				symbol={currency}
				size="m"
			/>
		</Link>
		<div className="d-flex flex-row">
			<span className="balance-big mr-1">
				{CURRENCIES[currency].formatToCurrency(balanceValue)}
			</span>
			{currency !== BASE_CURRENCY &&
				balanceText &&
				parseFloat(balanceText || 0) > 0 && (
					<span className="d-flex align-items-end balance-small pb-4">
						{BASE_CURRENCY &&
							`${
								CURRENCIES.fiat.currencySymbol
							}	${CURRENCIES.fiat.formatToCurrency(balanceText)}`}
					</span>
				)}
		</div>
	</div>
);

export default Currency;
