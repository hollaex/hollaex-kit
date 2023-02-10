import React, { Fragment } from 'react';

// import { CurrencyBall } from '../../../components';
import { DEFAULT_COIN_DATA, BASE_CURRENCY } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import { formatToCurrency } from 'utils/currency';
import { Image, EditWrapper } from 'components';
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

const getRows = (coins, level, tiers, ICONS) => {
	const { display_name: baseName, increment_unit } =
		coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;

	const { /*deposit_limit,*/ withdrawal_limit } = tiers[level] || {};

	return (
		<Fragment>
			{Object.entries(coins).map(([_, { icon_id, display_name }], index) => {
				return (
					<tr className="table-row" key={index}>
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
						<td>
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
						</td>
					</tr>
				);
			})}
		</Fragment>
	);
};

const LimitsBlock = ({ level, coins, tiers, icons }) => {
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
					</tr>
				</thead>
				<tbody className="account-limits-content font-weight-bold">
					{getRows(coins, level, tiers, icons)}
				</tbody>
			</table>
		</div>
	);
};

export default withConfig(LimitsBlock);
