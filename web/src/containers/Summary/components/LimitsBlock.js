import React, { Fragment } from 'react';

// import { CurrencyBall } from '../../../components';
import { DEFAULT_COIN_DATA, BASE_CURRENCY } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';
import { formatToCurrency } from '../../../utils/currency';
import { EditWrapper } from 'components';
import Image from 'components/Image';
import { STATIC_ICONS } from 'config/icons';

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

const getRows = (coins, level, tiers) => {
	const { increment_unit } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;

	const { /*deposit_limit,*/ withdrawal_limit } = tiers[level] || {};

	return (
		<Fragment>
			<tr>
				<td className="account-limits-coin">
					<div className="d-flex align-items-center">
						<Image
							icon={STATIC_ICONS['WITHDRAW_TIERS_SECTION']}
							wrapperClassName="limit-status-icon mr-2"
						/>
						<div className="ml-2">{STRINGS['SUMMARY.WITHDRAWAL']}</div>
					</div>
				</td>
				<td className="account-limits-maker account-limits-value">
					{getLimitValue(withdrawal_limit, increment_unit)}
				</td>
			</tr>
			{/*Temporarily remove deposit limit row v 2.1*/}
			{/*<tr>
				<td className="account-limits-coin">
					<div className="d-flex align-items-center">
						<Image
							icon={STATIC_ICONS['DEPOSIT_TIERS_SECTION']}
							wrapperClassName="limit-status-icon mr-2"
						/>
						<div className="ml-2">{STRINGS['SUMMARY.DEPOSIT']}</div>
					</div>
				</td>
				<td className="account-limits-maker account-limits-value">
					{getLimitValue(null, increment_unit)}
				</td>
			</tr>*/}
		</Fragment>
	);
};

const LimitsBlock = ({ level, coins, tiers, title }) => {
	return (
		<div>
			<table className="account-limits">
				<thead>
					<tr>
						<th className="limit-head-currency content-title" colSpan={3}>
							<EditWrapper stringId="LIMITS_BLOCK.HEADER_ROW_DESCRIPTION">
								{STRINGS.formatString(
									STRINGS['LIMITS_BLOCK.HEADER_ROW_DESCRIPTION'],
									title
								)}
							</EditWrapper>
						</th>
					</tr>
					<tr>
						<th className="limit-head-currency">
							<EditWrapper stringId="LIMITS_BLOCK.HEADER_ROW_TYPE">
								{STRINGS['LIMITS_BLOCK.HEADER_ROW_TYPE']}
							</EditWrapper>
						</th>
						<th className="limit-head-currency">
							<EditWrapper stringId="LIMITS_BLOCK.HEADER_ROW_AMOUNT">
								{STRINGS.formatString(
									STRINGS['LIMITS_BLOCK.HEADER_ROW_AMOUNT'],
									BASE_CURRENCY.toUpperCase()
								)}
							</EditWrapper>
						</th>
					</tr>
				</thead>
				<tbody className="account-limits-content font-weight-bold">
					{getRows(coins, level, tiers)}
				</tbody>
			</table>
		</div>
	);
};

export default LimitsBlock;
