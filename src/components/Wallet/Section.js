import React from 'react';
import math from 'mathjs';
import STRINGS from '../../config/localizedStrings';
import { BASE_CURRENCY } from '../../config/constants';
import { formatToCurrency } from '../../utils/currency';

const TextHolders = ({ ordersOfSymbol, currencySymbol, hold, name }) => {
	const ordersText =
		ordersOfSymbol > 1
			? STRINGS.WALLET.ORDERS_PLURAL
			: STRINGS.WALLET.ORDERS_SINGULAR;
	const symbolComponent = <span className="text-uppercase">{name}</span>;
	return (
		<div>
			{STRINGS.formatString(
				STRINGS.WALLET.HOLD_ORDERS,
				ordersOfSymbol,
				ordersText,
				hold,
				currencySymbol,
				symbolComponent
			)}
		</div>
	);
};

const Section = ({ symbol = BASE_CURRENCY, balance, orders, price, coins }) => {
	const { name, min } = coins[symbol];
	const ordersOfSymbol = orders.filter((order) => {
		if (symbol === BASE_CURRENCY) {
			return order.side === 'buy';
		} else {
			return order.symbol === symbol && order.side === 'sell';
		}
	}).length;

	const amountFormat =
		symbol === BASE_CURRENCY
			? STRINGS[`${BASE_CURRENCY.toUpperCase()}_PRICE_FORMAT`]
			: STRINGS.BTC_PRICE_FORMAT;
	const total = balance[`${symbol}_balance`];
	const available = balance[`${symbol}_available`];
	const hold = math.subtract(math.fraction(total), math.fraction(available));

	return (
		<div className="wallet_section-content-wrapper">
			<div className="wallet_section-content d-flex flex-column">
				<div className="d-flex flex-column">
					<div>{STRINGS.WALLET.TOTAL_ASSETS}:</div>
					<div>
						{STRINGS.formatString(
							amountFormat,
							formatToCurrency(total, min),
							STRINGS[`${symbol.toUpperCase()}_CURRENCY_SYMBOL`]
						)}
					</div>
				</div>
				{ordersOfSymbol > 0 && (
					<TextHolders
						ordersOfSymbol={ordersOfSymbol}
						currencySymbol={STRINGS[`${symbol.toUpperCase()}_CURRENCY_SYMBOL`]}
						hold={formatToCurrency(hold, min)}
						name={STRINGS[`${symbol.toUpperCase()}_SHORTNAME`] || name}
					/>
				)}
				<div className="d-flex flex-column">
					<div>{STRINGS.WALLET.AVAILABLE_WITHDRAWAL}:</div>
					<div>
						{STRINGS.formatString(
							amountFormat,
							formatToCurrency(available, min),
							STRINGS[`${symbol.toUpperCase()}_CURRENCY_SYMBOL`]
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section;
