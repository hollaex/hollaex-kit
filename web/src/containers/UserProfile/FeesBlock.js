import React from 'react';
import classnames from 'classnames';
import STRINGS from '../../config/localizedStrings';
import { formatPercentage } from '../../utils/currency';

const FeeRow = ({ data = {}, headers = [], isUserLevel = false, row }) => {
	const { verification_level, ...rest } = data;
	return (
		<tr
			className={classnames('table-row table-bottom-border', {
				'user-level': isUserLevel,
			})}
		>
			<td className="table-icon td-fit td-levelball">
				<div className="td-levelball-content d-flex justify-content-center align-items-center">
					{verification_level}
				</div>
			</td>
			<td className="td-name td-amount">
				{STRINGS[`LEVELS.LABEL_LEVEL_${verification_level}]`]}
			</td>
			{headers.map((headerKey, index) => (
				<td className="td-name td-amount" key={`row-${index}-${row}`}>
					{formatPercentage(rest[headerKey])}
				</td>
			))}
		</tr>
	);
};

const generateRowsData = (pairsFees) => {
	const headers = [STRINGS['LEVELS.LABEL_LEVEL']];
	const keys = [];
	const temporalData = {};
	Object.entries(pairsFees).forEach(
		([pairName, { maker_fees, taker_fees }]) => {
			headers.push(
				STRINGS.formatString(
					STRINGS['LEVELS.LABEL_PAIR_MAKER_FEE'],
					pairName.toUpperCase()
				)
			);
			keys.push(`${pairName}_maker_fee`);
			headers.push(
				STRINGS.formatString(
					STRINGS['LEVELS.LABEL_PAIR_TAKER_FEE'],
					pairName.toUpperCase()
				)
			);
			keys.push(`${pairName}_taker_fee`);

			Object.entries(maker_fees).forEach(([level, value]) => {
				if (!temporalData[level]) {
					temporalData[level] = {
						verification_level: parseInt(level, 10),
					};
				}
				temporalData[level][`${pairName}_maker_fee`] = value;
			});
			Object.entries(taker_fees).forEach(([level, value]) => {
				if (!temporalData[level]) {
					temporalData[level] = {
						verification_level: parseInt(level, 10),
					};
				}
				temporalData[level][`${pairName}_taker_fee`] = value;
			});
		}
	);

	const arrayData = Object.values(temporalData).sort(
		(a, b) => a.verification_level > b.verification_level
	);
	return { headers, keys, data: arrayData };
};

export const FeesBlock = ({ userLevel, fees }) => {
	const { headers, keys, data } = generateRowsData(fees);
	return (
		<div className="user-limits">
			<table className="user-limits-table">
				<thead>
					<tr className="table-bottom-border">
						<th />
						{headers.map((headerLabel, index) => (
							<th key={index}>{headerLabel}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((fees, index) => (
						<FeeRow
							row={index}
							data={fees}
							headers={keys}
							key={index}
							isUserLevel={fees.verification_level === userLevel}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};
