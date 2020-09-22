import React from 'react';

import { CurrencyBall } from '../../../components';
import STRINGS from '../../../config/localizedStrings';
import { formatPercentage } from '../../../utils/currency';
import { DEFAULT_COIN_DATA } from '../../../config/constants';

const getMakerRow = (pairs, coins, pair, level, index, discount) => {
	const { pair_base, pair_2, maker_fees, taker_fees } = pairs[pair];
	const makersFee = maker_fees ? maker_fees[level] : 0;
	const takersFee = taker_fees ? taker_fees[level] : 0;
	const pairBase = coins[pair_base] || DEFAULT_COIN_DATA;
	const pairTwo = coins[pair_2] || DEFAULT_COIN_DATA;
	const makersData = discount
		? (makersFee - (makersFee * discount / 100)) : makersFee;
	const takersData = discount
		? (takersFee - (takersFee * discount / 100)) : takersFee;
	return (
		<tr key={index}>
			<td className="account-limits-coin">
				<div className="d-flex align-items-center">
					<CurrencyBall
						name={pairBase.symbol.toUpperCase()}
						symbol={pair_base}
						size="m"
					/>
					<div className="ml-2">
						{`${pairBase.fullname} / ${pairTwo.fullname}`}
					</div>
				</div>
			</td>
			<td className="account-limits-maker account-limits-value">
				{level
					? formatPercentage(makersData)
					: 'N/A'
				}
			</td>
			<td className="account-limits-maker account-limits-value">
				{level
					? formatPercentage(takersData)
					: 'N/A'
				}
			</td>
		</tr>
	);
};

// const getTakerRow = (pairs, pair, level, index) => {
// 	const { taker_fees } = pairs[pair];
// 	const feeData = taker_fees ? taker_fees[level] : 0;
// 	return (
// 		<tr key={`${index}_1`}>
// 			<td className="account-limits-taker account-limits-status">
// 				{STRINGS["SUMMARY.TAKER"]}:
// 			</td>
// 			<td className="account-limits-taker account-limits-value">
// 				{formatPercentage(feeData)}
// 			</td>
// 		</tr>
// 	);
// };

const getRows = (pairs, level, coins, discount) => {
	const rowData = [];
	Object.keys(pairs).map((pair, index) => {
		rowData.push(getMakerRow(pairs, coins, pair, level, index, discount));
		return '';
	});
	return rowData;
};

const FeesBlock = ({ pairs, coins, level, discount }) => {
	return (
		<div>
			<table className="account-limits">
				<thead>
					<tr>
						<th className="content-title limit-head-currency" colSpan={3}>
							{STRINGS["SUMMARY.TRADING_FEE_STRUCTURE"]}
						</th>
					</tr>
					<tr>
						<th className="limit-head-currency">{STRINGS["CURRENCY"]}</th>
						<th className="limit-head-currency">{STRINGS["SUMMARY.MAKER"]}</th>
						<th className="limit-head-currency">{STRINGS["SUMMARY.TAKER"]}</th>
					</tr>
				</thead>
				<tbody className="account-limits-content font-weight-bold">
					{getRows(pairs, level, coins, discount)}
				</tbody>
			</table>
		</div>
	);
};

export default FeesBlock;
