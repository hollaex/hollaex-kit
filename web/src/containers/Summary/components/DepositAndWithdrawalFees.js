import React from 'react';

import { CurrencyBall, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import { formatPercentage } from 'utils/currency';

const renderRow = (display_name, deposit_text, withdrawal_text, index) => {
	return (
		<tr key={index}>
			<td className="account-limits-coin">
				<div className="d-flex align-items-center">
					<div className="coin-section-wrapper">
						<CurrencyBall
							name={display_name}
							symbol={display_name.toLowerCase()}
							size="m"
						/>
					</div>
					<div className="ml-2">{display_name}</div>
				</div>
			</td>
			<td className="account-limits-maker account-limits-value">
				{deposit_text}
			</td>
			<td className="account-limits-maker account-limits-value">
				{withdrawal_text}
			</td>
		</tr>
	);
};

const getFeeText = (data, level) => {
	const { symbol, type = 'static', value, levels } = data;

	const fee = levels && levels[level] ? levels[level] : value;
	const text =
		type === 'percentage'
			? formatPercentage(fee)
			: `${fee} ${symbol?.toUpperCase()}`;

	return text;
};

const getRows = (level, coins) => {
	const rowData = [];
	Object.entries(coins).forEach(([_, coin], c_index) => {
		const {
			display_name,
			withdrawal_fees,
			withdrawal_fee,
			deposit_fees,
		} = coin;
		if (withdrawal_fees) {
			Object.keys(withdrawal_fees).forEach((network, n_index) => {
				const withdrawal_text = getFeeText(withdrawal_fees[network], level);
				const deposit_text =
					deposit_fees && deposit_fees[network]
						? getFeeText(deposit_fees[network], level)
						: 'N/A';
				const index = `${c_index}_${n_index}`;

				rowData.push(
					renderRow(display_name, deposit_text, withdrawal_text, index)
				);
			});
		} else {
			const withdrawal_text = `${withdrawal_fee} ${display_name}`;
			rowData.push(renderRow(display_name, 'N/A', withdrawal_text, c_index));
		}
	});
	return rowData;
};

const DepositAndWithdrawalFees = ({ coins, level }) => {
	return (
		<div>
			<table className="account-limits">
				<thead>
					<tr>
						<th className="content-title limit-head-currency" colSpan={3}>
							<EditWrapper stringId="SUMMARY.DEPOSIT_AND_WITHDRAWAL_FEES">
								{STRINGS['SUMMARY.DEPOSIT_AND_WITHDRAWAL_FEES']}
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
							<EditWrapper stringId="SUMMARY.DEPOSITS">
								{STRINGS['SUMMARY.DEPOSITS']}
							</EditWrapper>
						</th>
						<th className="limit-head-currency">
							<EditWrapper stringId="SUMMARY.WITHDRAWALS">
								{STRINGS['SUMMARY.WITHDRAWALS']}
							</EditWrapper>
						</th>
					</tr>
				</thead>
				<tbody className="account-limits-content font-weight-bold">
					{getRows(level, coins)}
				</tbody>
			</table>
		</div>
	);
};

export default DepositAndWithdrawalFees;
