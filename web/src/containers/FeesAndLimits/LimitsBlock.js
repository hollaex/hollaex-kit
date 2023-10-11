import React, { Fragment } from 'react';

// import { CurrencyBall } from '../../../components';
import { DEFAULT_COIN_DATA, BASE_CURRENCY } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import { formatToCurrency } from 'utils/currency';
import { Coin, EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

const getLimitValue = (limit, increment_unit, baseName) => {
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
		return increment_unit
			? `${formatToCurrency(limit, increment_unit)} ${baseName}`
			: `${limit} ${baseName}`;
	}
};

/*const getDepositRow = (currency, index, coins, level, tier) => {
	const { symbol = '', fullname, increment_unit } =
		coins[currency] || DEFAULT_COIN_DATA;

	const { deposit_limit, withdrawal_limit } = tier[level] || {};
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
				{getLimitValue(deposit_limit, increment_unit)}
			</td>
			<td className="account-limits-maker account-limits-value">
				{getLimitValue(withdrawal_limit, increment_unit)}
			</td>
		</tr>
	);
};*/

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

const getRows = (coins, level, tiers, ICONS, transaction_limits) => {
	const { display_name: baseName, increment_unit } =
		coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;

	// const { /*deposit_limit,*/ withdrawal_limit } = transaction_limits?.find(limit => limit.tier === level)?.amount || {};
	return (
		<Fragment>
			{Object.entries(coins).map(
				([_, { icon_id, display_name, symbol }], index) => {
					const limit_24h = transaction_limits?.find(
						(limit) =>
							limit.limit_currency === symbol &&
							limit.tier === Number(level) &&
							limit.period === '24h' &&
							limit.type === 'withdrawal'
					);
					const limit_24h_default = transaction_limits?.find(
						(limit) =>
							limit.limit_currency === 'default' &&
							limit.tier === Number(level) &&
							limit.period === '24h' &&
							limit.type === 'withdrawal'
					);
					const limit_1mo = transaction_limits?.find(
						(limit) =>
							limit.limit_currency === symbol &&
							limit.tier === Number(level) &&
							limit.period === '1mo' &&
							limit.type === 'withdrawal'
					);
					const limit_1mo_default = transaction_limits?.find(
						(limit) =>
							limit.limit_currency === 'default' &&
							limit.tier === Number(level) &&
							limit.period === '1mo' &&
							limit.type === 'withdrawal'
					);
					return (
						<tr className="table-row" key={index}>
							<td className="table-icon td-fit" />
							<td className="td-name td-fit">
								<div className="d-flex align-items-center wallet-hover cursor-pointer">
									<Coin iconId={icon_id} />
									<div className="px-2">{display_name}</div>
								</div>
							</td>
							<td>
								{limit_24h ? (
									getLimitValue(limit_24h.amount, increment_unit, baseName)
								) : limit_24h_default ? (
									<div style={{ width: '80%' }}>
										<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT">
											{
												STRINGS[
													'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT'
												]
											}
										</EditWrapper>
									</div>
								) : (
									'N/A'
								)}
							</td>

							<td>
								{limit_1mo ? (
									getLimitValue(limit_1mo.amount, increment_unit, baseName)
								) : limit_1mo_default ? (
									<div style={{ width: '80%' }}>
										<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT">
											{
												STRINGS[
													'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT'
												]
											}
										</EditWrapper>
									</div>
								) : (
									'N/A'
								)}
							</td>

							{/* <td>
							{index === 0 ? (
								getLimitValue(withdrawal_limit, increment_unit, baseName)
							) : index === 1 ? (
								<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT">
									{
										STRINGS[
											'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT'
										]
									}
								</EditWrapper>
							) : null}
						</td> */}
						</tr>
					);
				}
			)}
		</Fragment>
	);
};

const LimitsBlock = ({ level, coins, tiers, icons, transaction_limits }) => {
	return (
		<div className="wallet-assets_block">
			<table className="wallet-assets_block-table">
				<thead>
					<tr className="table-bottom-border">
						<th />
						<th>
							<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.HEADER.CURRENCY">
								{
									STRINGS[
										'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.HEADER.CURRENCY'
									]
								}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.HEADER.LIMIT">
								{
									STRINGS[
										'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.HEADER.LIMIT'
									]
								}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.HEADER.LIMIT_2">
								{
									STRINGS[
										'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.HEADER.LIMIT_2'
									]
								}
							</EditWrapper>
						</th>
					</tr>
				</thead>
				<tbody className="account-limits-content font-weight-bold">
					{getRows(coins, level, tiers, icons, transaction_limits)}
				</tbody>
			</table>
		</div>
	);
};

export default withConfig(LimitsBlock);
