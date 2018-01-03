import React from 'react';
import { CurrencyBall } from '../../components';
import { CURRENCIES } from '../../config/constants';
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
						const shortName = STRINGS[`${key.toUpperCase()}_CURRENCY_SYMBOL`];
						const fullName = STRINGS[`${key.toUpperCase()}_FULLNAME`];
						const balanceValue = balance[`${key}_balance`];
						return (
							<tr className="table-row table-bottom-border" key={key}>
								<td className="table-icon td-fit">
									<CurrencyBall name={shortName} symbol={key} size="s" />
								</td>
								<td className="td-name td-fit">{fullName}</td>
								<td>{`${shortName} ${formatToCurrency(balanceValue)}`}</td>
								<td className="align-opposite show-equals">
									{`${STRINGS.FIAT_CURRENCY_SYMBOL}${
										key === fiatSymbol
											? fiatFormatToCurrency(balanceValue)
											: fiatFormatToCurrency(
													calculatePrice(balanceValue, prices[key])
												)
									}`}
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
					<td className="align-opposite">{totalAssets}</td>
				</tr>
			</tfoot>
		</table>
	</div>
);
