import React from 'react';
import { CurrencyBall } from '../../components';
import { CURRENCIES } from '../../config/constants';
import { Link } from 'react-router';
import {
	calculatePrice,
	fiatFormatToCurrency,
	fiatSymbol
} from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

export const AssetsBlock = ({ balance, prices, totalAssets }) => (
	<div className="wallet-assets_block">
		<table className="wallet-assets_block-table">
			<thead>
				<tr className="table-bottom-border">
					<th />
					<th>{STRINGS.CURRENCY}</th>
					<th>{STRINGS.AMOUNT}</th>
					<th className="align-opposite">
						{STRINGS.formatString(
							STRINGS.WALLET_TABLE_AMOUNT_IN,
							STRINGS.FIAT_NAME
						)}
					</th>
				</tr>
			</thead>
			<tbody>
				{Object.entries(CURRENCIES)
					.filter(([key]) => balance.hasOwnProperty(`${key}_balance`))
					.map(([key, { formatToCurrency }]) => {
						const balanceValue = balance[`${key}_balance`];
						const balanceText =
							key === fiatSymbol
								? fiatFormatToCurrency(balanceValue)
								: fiatFormatToCurrency(
										calculatePrice(balanceValue, prices[key])
									);
						return (
							<tr className="table-row table-bottom-border" key={key}>
								<td className="table-icon td-fit">
									<Link to={`/wallet/${key.toLowerCase()}`}>
										<CurrencyBall
											name={CURRENCIES[key].shortName}
											symbol={key}
											size="s"
										/>
									</Link>
								</td>
								<td className="td-name td-fit">
									<Link to={`/wallet/${key.toLowerCase()}`}>
										{STRINGS[`${key.toUpperCase()}_FULLNAME`]}
									</Link>
								</td>
								<td className="td-amount">
									{STRINGS.formatString(
										STRINGS[`${key.toUpperCase()}_PRICE_FORMAT`],
										formatToCurrency(balanceValue),
										STRINGS[`${key.toUpperCase()}_CURRENCY_SYMBOL`]
									)}
								</td>
								<td className="align-opposite show-equals td-amount">
									{STRINGS.formatString(
										STRINGS.FIAT_PRICE_FORMAT,
										balanceText,
										STRINGS.FIAT_CURRENCY_SYMBOL
									)}
								</td>
							</tr>
						);
					})}
			</tbody>
			<tfoot>
				<tr>
					<td />
					<td>{STRINGS.WALLET_TABLE_TOTAL}</td>
					<td />
					<td className="align-opposite td-amount">{totalAssets}</td>
				</tr>
			</tfoot>
		</table>
	</div>
);
