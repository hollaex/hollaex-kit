import React from 'react';

import { CurrencyBall } from '../../../components';
import { DEFAULT_COIN_DATA } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';
import { formatToCurrency } from '../../../utils/currency';
import { EditWrapper } from 'components';

const getLimitValue = (limit, increment_unit) => {
	if (limit === undefined || limit === null || limit === '') {
		return 'N/A';
	} else if (limit === 0) {
		return (
			<EditWrapper stringId="LEVELS.UNLIMITED">
				{STRINGS['LEVELS.UNLIMITED']}
			</EditWrapper>
		);
	} else if (limit === -1) {
		return (
			<EditWrapper stringId="LEVELS.BLOCKED">
				{STRINGS['LEVELS.BLOCKED']}
			</EditWrapper>
		);
	} else {
		return increment_unit ? formatToCurrency(limit, increment_unit) : limit;
	}
};

const getDepositRow = (currency, index, coins, level) => {
	const {
		symbol = '',
		fullname,
		deposit_limits = {},
		withdrawal_limits = {},
		increment_unit,
	} = coins[currency] || DEFAULT_COIN_DATA;
	// const format = currency === BASE_CURRENCY ? formatBaseAmount : formatBtcAmount;
	return (
		<tr key={index}>
			<td className="account-limits-coin">
				<div className="d-flex align-items-center">
					<CurrencyBall name={symbol.toUpperCase()} symbol={symbol} size="m" />
					<div className="ml-2">{fullname}</div>
				</div>
			</td>
			<td className="account-limits-maker account-limits-value">
				{getLimitValue(deposit_limits[level], increment_unit)}
			</td>
			<td className="account-limits-maker account-limits-value">
				{getLimitValue(withdrawal_limits[level], increment_unit)}
			</td>
		</tr>
	);
};

// const getWithdrawalRow = (currency, index, coins, level) => {
//     const { withdrawal_limits = {} } = coins[currency] || DEFAULT_COIN_DATA;
//     const format = currency === BASE_CURRENCY ? formatBaseAmount : formatBtcAmount;
//     return (
//         <tr key={`${index}_1`}>
//             <td className="account-limits-taker account-limits-status">{STRINGS["SUMMARY.WITHDRAWAL"]}:</td>
//             <td className="account-limits-taker account-limits-value">{getLimitValue(withdrawal_limits[level], format)}</td>
//         </tr>
//     );
// };

const getRows = (coins, level) => {
	const rowData = [];
	Object.keys(coins).forEach((currency, index) => {
		rowData.push(getDepositRow(currency, index, coins, level));
	});
	return rowData;
};

const LimitsBlock = ({ level, coins }) => {
	return (
		<div>
			<table className="account-limits">
				<thead>
					<tr>
						<th className="limit-head-currency content-title" colSpan={3}>
							<EditWrapper stringId="SUMMARY.DEPOSIT_WITHDRAWAL_ALLOWENCE">
								{STRINGS['SUMMARY.DEPOSIT_WITHDRAWAL_ALLOWENCE']}
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
							<EditWrapper stringId="SUMMARY.DEPOSIT">
								{STRINGS['SUMMARY.DEPOSIT']}
							</EditWrapper>
						</th>
						<th className="limit-head-currency">
							<EditWrapper stringId="SUMMARY.WITHDRAWAL">
								{STRINGS['SUMMARY.WITHDRAWAL']}
							</EditWrapper>
						</th>
					</tr>
				</thead>
				<tbody className="account-limits-content font-weight-bold">
					{getRows(coins, level)}
				</tbody>
			</table>
		</div>
	);
};

export default LimitsBlock;
