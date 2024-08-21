import React from 'react';
import math from 'mathjs';
import STRINGS from 'config/localizedStrings';
import {
	BASE_CURRENCY,
	// CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';
import { formatToCurrency } from 'utils/currency';

const TextHolders = ({ ordersOfSymbol, currencySymbol, hold, name }) => {
	const ordersText =
		ordersOfSymbol > 1
			? STRINGS['TOOLS.OPEN_ORDERS']
			: STRINGS['WALLET.OPEN_ORDERS_SINGULAR'];
	const symbolComponent = <span className="text-uppercase">{name}</span>;
	return (
		<div>
			{STRINGS.formatString(
				STRINGS['WALLET.ORDERS_HOLD'],
				<span className="hold-orders-text">{ordersOfSymbol}</span>,
				<span className="hold-orders-text text-lowercase">{ordersText}</span>,
				<span className="hold-orders-text">{hold}</span>,
				<span className="hold-orders-text">{currencySymbol}</span>,
				symbolComponent
			)}
		</div>
	);
};

const Section = ({ symbol = BASE_CURRENCY, balance, orders, price, coins }) => {
	const { fullname, min, display_name } = coins[symbol] || DEFAULT_COIN_DATA;
	const ordersOfSymbol = orders.filter((order) => {
		if (symbol === BASE_CURRENCY) {
			return order.side === 'buy';
		} else {
			return order.symbol.split('-')[0] === symbol && order.side === 'sell';
		}
	}).length;

	// const amountFormat = CURRENCY_PRICE_FORMAT;
	// const amountFormat =
	// 	symbol === BASE_CURRENCY
	// 		? STRINGS[`${BASE_CURRENCY.toUpperCase()}_PRICE_FORMAT`]
	// 		: STRINGS["BTC_PRICE_FORMAT"];
	const total = balance[`${symbol}_balance`] || 0;
	const available = balance[`${symbol}_available`] || 0;
	const hold = math.subtract(math.fraction(total), math.fraction(available));

	return (
		<div className="wallet_section-content-wrapper">
			<div className="wallet_section-content d-flex flex-column">
				{/* <div className="d-flex flex-column">
						<div>{STRINGS['WALLET.TOTAL_ASSETS']}:</div>
						<div>
							{STRINGS.formatString(
							amountFormat,
							formatToCurrency(total, min),
							display_name
							)}
						</div>
				</div> */}
				{ordersOfSymbol > 0 && (
					<TextHolders
						ordersOfSymbol={ordersOfSymbol}
						currencySymbol={display_name}
						hold={formatToCurrency(hold, min)}
						name={display_name || fullname}
					/>
				)}
				{/* <div className="d-flex flex-column">
						<div>{STRINGS['WALLET.AVAILABLE_WITHDRAWAL']}:</div>
						<div>
							{STRINGS.formatString(
							amountFormat,
							formatToCurrency(available, min),
							display_name
							)}
						</div>
				</div> */}
			</div>
		</div>
	);
};

export default Section;
