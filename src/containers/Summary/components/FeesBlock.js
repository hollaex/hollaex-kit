import React from 'react';

import { CurrencyBall } from '../../../components';
import STRINGS from '../../../config/localizedStrings';
import { formatPercentage } from '../../../utils/currency';

const getMakerRow = (pairs, coins, pair, level, index) => {
	const { pair_base, pair_2, maker_fees } = pairs[pair];
	const feeData = maker_fees ? maker_fees[level] : 0;
	const pairBase = coins[pair_base] || { symbol: '' };
	const pairTwo = coins[pair_2] || {};
	return (
		<tr key={index}>
			<td className="account-limits-coin" rowSpan={2}>
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
			<td className="account-limits-maker account-limits-status">
				{STRINGS.SUMMARY.MAKER}:
			</td>
			<td className="account-limits-maker account-limits-value">
				{formatPercentage(feeData)}
			</td>
		</tr>
	);
};

const getTakerRow = (pairs, pair, level, index) => {
	const { taker_fees } = pairs[pair];
	const feeData = taker_fees ? taker_fees[level] : 0;
	return (
		<tr key={`${index}_1`}>
			<td className="account-limits-taker account-limits-status">
				{STRINGS.SUMMARY.TAKER}:
			</td>
			<td className="account-limits-taker account-limits-value">
				{formatPercentage(feeData)}
			</td>
		</tr>
	);
};

const getRows = (pairs, level, coins) => {
	const rowData = [];
	Object.keys(pairs).map((pair, index) => {
		rowData.push(getMakerRow(pairs, coins, pair, level, index));
		rowData.push(getTakerRow(pairs, pair, level, index));
		return '';
	});
	return rowData;
};

const FeesBlock = ({ pairs, coins, level }) => {
	return (
		<div>
			<table className="account-limits">
				<thead>
					<tr>
						<th className="limit-head-currency">{STRINGS.CURRENCY}</th>
						<th />
						<th className="limit-head">{STRINGS.FEES}</th>
					</tr>
				</thead>
				<tbody className="account-limits-content font-weight-bold">
					{getRows(pairs, level, coins)}
				</tbody>
			</table>
		</div>
	);
};

export default FeesBlock;
