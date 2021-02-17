import React from 'react';

import { CurrencyBall } from '../../../components';
import STRINGS from '../../../config/localizedStrings';
import { formatPercentage } from '../../../utils/currency';
import { DEFAULT_COIN_DATA } from '../../../config/constants';
import { EditWrapper } from 'components';

const getMakerRow = (pairs, coins, pair, level, index, discount, tiers) => {
	const { pair_base, pair_2 } = pairs[pair];
	const { fees: { maker, taker } = {} } = tiers[level] || {};
	const makersFee = maker ? maker[pair] : 0;
	const takersFee = taker ? taker[pair] : 0;
	const pairBase = coins[pair_base] || DEFAULT_COIN_DATA;
	const pairTwo = coins[pair_2] || DEFAULT_COIN_DATA;
	const makersData = discount
		? makersFee - (makersFee * discount) / 100
		: makersFee;
	const takersData = discount
		? takersFee - (takersFee * discount) / 100
		: takersFee;
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
				{level ? formatPercentage(makersData) : 'N/A'}
			</td>
			<td className="account-limits-maker account-limits-value">
				{level ? formatPercentage(takersData) : 'N/A'}
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

const getRows = (pairs, level, coins, discount, tiers) => {
	const rowData = [];
	Object.keys(pairs).map((pair, index) => {
		rowData.push(
			getMakerRow(pairs, coins, pair, level, index, discount, tiers)
		);
		return '';
	});
	return rowData;
};

const FeesBlock = ({ pairs, coins, level, discount, tiers }) => {
	return (
		<div>
			<table className="account-limits">
				<thead>
					<tr>
						<th className="content-title limit-head-currency" colSpan={3}>
							<EditWrapper stringId="SUMMARY.TRADING_FEE_STRUCTURE">
								{STRINGS['SUMMARY.TRADING_FEE_STRUCTURE']}
							</EditWrapper>
						</th>
					</tr>
					<tr>
						<th className="limit-head-currency">
							<EditWrapper stringId="CURRENCY">
								{STRINGS['CURRENCY']}
							</EditWrapper>
						</th>
						<th className="limit-head-currency">
							<EditWrapper stringId="SUMMARY.MAKER">
								{STRINGS['SUMMARY.MAKER']}
							</EditWrapper>
						</th>
						<th className="limit-head-currency">
							<EditWrapper stringId="SUMMARY.TAKER">
								{STRINGS['SUMMARY.TAKER']}
							</EditWrapper>
						</th>
					</tr>
				</thead>
				<tbody className="account-limits-content font-weight-bold">
					{getRows(pairs, level, coins, discount, tiers)}
				</tbody>
			</table>
		</div>
	);
};

export default FeesBlock;
