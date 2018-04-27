import React from 'react';
import classnames from 'classnames';
import STRINGS from '../../config/localizedStrings';
import {
	formatFiatAmount,
	formatBtcAmount,
	formatPercentage
} from '../../utils/currency';

const getLimitValue = (limit = -1, format) => {
	if (limit === 0) {
		return STRINGS.LEVELS.UNLIMITED;
	} else if (limit === -1) {
		return STRINGS.LEVELS.BLOCKED;
	} else {
		return format ? format(limit) : limit;
	}
};

const LevelRow = ({ data = {}, isUserLevel = false }) => {
	const {
		verification_level,
		maker_fee,
		taker_fee,
		fiat_deposit_daily,
		fiat_withdraw_daily,
		btc_deposit_daily,
		btc_withdraw_daily
	} = data;
	return (
		<tr
			className={classnames('table-row table-bottom-border', {
				'user-level': isUserLevel
			})}
		>
			<td className="table-icon td-fit td-levelball">
				<div className="td-levelball-content d-flex justify-content-center align-items-center">
					{verification_level}
				</div>
			</td>
			<td className="td-name td-amount">
				{STRINGS.LEVELS[`LABEL_LEVEL_${verification_level}`]}
			</td>
			<td className="td-name td-amount">{formatPercentage(maker_fee)}</td>
			<td className="td-name td-amount">{formatPercentage(taker_fee)}</td>
			<td className="td-name td-amount">
				{getLimitValue(fiat_deposit_daily, formatFiatAmount)}
			</td>
			<td className="td-name td-amount">
				{getLimitValue(fiat_withdraw_daily, formatFiatAmount)}
			</td>
			<td className="td-name td-amount">
				{getLimitValue(btc_deposit_daily, formatBtcAmount)}
			</td>
			<td className="td-name td-amount">
				{getLimitValue(btc_withdraw_daily, formatBtcAmount)}
			</td>
		</tr>
	);
};

export const LevelsBlock = ({ userLevel, limits }) => (
	<div className="user-limits">
		<table className="user-limits-table">
			<thead>
				<tr className="table-bottom-border">
					<th />
					<th>{STRINGS.LEVELS.LABEL_LEVEL}</th>
					<th>{STRINGS.LEVELS.LABEL_MAKER_FEE}</th>
					<th>{STRINGS.LEVELS.LABEL_TAKER_FEE}</th>
					<th>{STRINGS.LEVELS.LABEL_FIAT_DEPOSIT}</th>
					<th>{STRINGS.LEVELS.LABEL_FIAT_WITHDRAWAL}</th>
					<th>{STRINGS.LEVELS.LABEL_BTC_DEPOSIT}</th>
					<th>{STRINGS.LEVELS.LABEL_BTC_WITHDRAWAL}</th>
				</tr>
			</thead>
			<tbody>
				{limits.map((limit, index) => (
					<LevelRow
						data={limit}
						key={index}
						isUserLevel={limit.verification_level === userLevel}
					/>
				))}
			</tbody>
		</table>
	</div>
);
