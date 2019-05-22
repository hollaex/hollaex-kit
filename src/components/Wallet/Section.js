import React from 'react';
import math from 'mathjs';
import STRINGS from '../../config/localizedStrings';
import { CURRENCIES } from '../../config/constants';
import { fiatSymbol } from '../../utils/currency';

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

const Section = ({ symbol = fiatSymbol, balance, orders, price }) => {
	const { shortName, formatToCurrency } = CURRENCIES[symbol];
	const ordersOfSymbol = orders.filter((order) => {
		if (symbol === fiatSymbol) {
			return order.side === 'buy';
		} else {
			return order.symbol === symbol && order.side === 'sell';
		}
	}).length;

	const amountFormat =
		symbol === fiatSymbol
			? STRINGS.FIAT_PRICE_FORMAT
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
							formatToCurrency(total),
							STRINGS[`${symbol.toUpperCase()}_CURRENCY_SYMBOL`]
						)}
					</div>
				</div>
				{ordersOfSymbol > 0 && (
					<TextHolders
						ordersOfSymbol={ordersOfSymbol}
						currencySymbol={STRINGS[`${symbol.toUpperCase()}_CURRENCY_SYMBOL`]}
						hold={formatToCurrency(hold)}
						name={shortName}
					/>
				)}
				<div className="d-flex flex-column">
					<div>{STRINGS.WALLET.AVAILABLE_WITHDRAWAL}:</div>
					<div>
						{STRINGS.formatString(
							amountFormat,
							formatToCurrency(available),
							STRINGS[`${symbol.toUpperCase()}_CURRENCY_SYMBOL`]
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section;
