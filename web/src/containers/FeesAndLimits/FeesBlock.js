import React from 'react';

import { Image, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import { formatPercentage } from 'utils/currency';
import withConfig from 'components/ConfigProvider/withConfig';

const getMakerRow = (
	pairs,
	coins,
	pair,
	level,
	index,
	discount,
	tiers,
	ICONS
) => {
	const { display_name, icon_id } = pairs[pair];
	const { fees: { maker, taker } = {} } = tiers[level] || {};
	const makersFee = maker ? maker[pair] : 0;
	const takersFee = taker ? taker[pair] : 0;

	const makersData = discount
		? makersFee - (makersFee * discount) / 100
		: makersFee;
	const takersData = discount
		? takersFee - (takersFee * discount) / 100
		: takersFee;
	return (
		<tr className="table-row table-bottom-border" key={index}>
			<td className="table-icon td-fit" />
			<td className="td-name td-fit">
				<div className="d-flex align-items-center wallet-hover cursor-pointer">
					<Image
						iconId={icon_id}
						icon={ICONS[icon_id]}
						wrapperClassName="currency-ball"
						imageWrapperClassName="currency-ball-image-wrapper"
					/>
					{display_name}
				</div>
			</td>
			<td>{level ? formatPercentage(makersData) : 'N/A'}</td>
			<td>{level ? formatPercentage(takersData) : 'N/A'}</td>
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

const getRows = (pairs, level, coins, discount, tiers, icons, search) => {
	const rowData = [];
	Object.keys(pairs)
		.filter((pair) => !search || (search && pair.includes(search)))
		.map((pair, index) => {
			rowData.push(
				getMakerRow(pairs, coins, pair, level, index, discount, tiers, icons)
			);
			return '';
		});
	return rowData;
};

const FeesBlock = ({ pairs, coins, level, discount, tiers, icons, search }) => {
	return (
		<div className="wallet-assets_block">
			<table className="wallet-assets_block-table">
				<thead>
					<tr className="table-bottom-border">
						<th />
						<th>
							<EditWrapper stringId="FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.HEADER.MARKET">
								{
									STRINGS[
										'FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.HEADER.MARKET'
									]
								}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.HEADER.MAKER">
								{
									STRINGS[
										'FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.HEADER.MAKER'
									]
								}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.HEADER.TAKER">
								{
									STRINGS[
										'FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.HEADER.TAKER'
									]
								}
							</EditWrapper>
						</th>
					</tr>
				</thead>
				<tbody>
					{getRows(pairs, level, coins, discount, tiers, icons, search)}
				</tbody>
			</table>
		</div>
	);
};

export default withConfig(FeesBlock);
