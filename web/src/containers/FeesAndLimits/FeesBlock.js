import React from 'react';
import { browserHistory } from 'react-router';
import { ArrowUpOutlined } from '@ant-design/icons';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Coin, EditWrapper } from 'components';
import { formatPercentage } from 'utils/currency';

const getMakerRow = (
	pairs,
	coins,
	pair,
	level,
	index,
	discount,
	tiers,
	ICONS,
	quicktradePairs
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
	const tradePair = display_name?.toLowerCase()?.split('/')?.join('-');

	const onHandleNavigate = (tradePair) => {
		const path =
			quicktradePairs[pair]?.type === 'pro'
				? `/trade/${tradePair}`
				: `/quick-trade/${tradePair}`;

		browserHistory.push(path);
	};

	return (
		<tr className="table-row table-bottom-border" key={index}>
			<td className="table-icon td-fit" />
			<td className="td-name td-fit">
				<div
					className="d-flex align-items-center wallet-hover cursor-pointer"
					onClick={() => onHandleNavigate(tradePair)}
				>
					<Coin iconId={icon_id} />
					<div className="px-2">{display_name}</div>
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

const getRows = (
	pairs,
	level,
	coins,
	discount,
	tiers,
	icons,
	search,
	quicktradePairs
) => {
	const rowData = [];
	Object.keys(pairs)
		.filter((pair) => !search || (search && pair.includes(search)))
		.map((pair, index) => {
			rowData.push(
				getMakerRow(
					pairs,
					coins,
					pair,
					level,
					index,
					discount,
					tiers,
					icons,
					quicktradePairs
				)
			);
			return '';
		});
	return rowData;
};

const FeesBlock = ({
	pairs,
	coins,
	level,
	discount,
	tiers,
	icons,
	search,
	quicktradePairs,
	scrollToTop,
}) => {
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
					{getRows(
						pairs,
						level,
						coins,
						discount,
						tiers,
						icons,
						search,
						quicktradePairs
					)}
				</tbody>
			</table>
			<EditWrapper stringId="FEES_AND_LIMITS.RETURN_TO_TOP">
				<span
					className="pointer blue-link underline-text ml-2"
					onClick={() => scrollToTop()}
				>
					{STRINGS['FEES_AND_LIMITS.RETURN_TO_TOP']}
					<ArrowUpOutlined />
				</span>
			</EditWrapper>
		</div>
	);
};

export default withConfig(FeesBlock);
