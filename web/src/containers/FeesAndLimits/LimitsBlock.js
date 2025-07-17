import React, { Fragment } from 'react';
import { Link } from 'react-router';
import { ArrowUpOutlined } from '@ant-design/icons';

// import { CurrencyBall } from '../../../components';
// import { DEFAULT_COIN_DATA, BASE_CURRENCY } from 'config/constants';
import STRINGS from 'config/localizedStrings';
// import { formatToCurrency } from 'utils/currency';
import { Coin, EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

const getLimitValue = (
	transactionLimit,
	isDefault = false,
	period,
	setValuedLabel = false
) => {
	const amount =
		period === '24h'
			? transactionLimit?.amount
			: transactionLimit?.monthly_amount;
	if (
		amount === undefined ||
		amount === null ||
		amount === '' ||
		amount === 0
	) {
		return (
			<EditWrapper stringId="LEVELS.UNLIMITED">
				{STRINGS['LEVELS.UNLIMITED']}
			</EditWrapper>
		);
	} else if (amount === -1) {
		return (
			<EditWrapper stringId="LEVELS.BLOCKED">
				{STRINGS['LEVELS.BLOCKED']}
			</EditWrapper>
		);
	} else {
		return (
			<div>
				{amount} {transactionLimit?.currency?.toUpperCase()}{' '}
				<span style={{ fontWeight: '500' }}>
					{setValuedLabel && (
						<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.VALUED">
							{STRINGS['FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.VALUED']}
						</EditWrapper>
					)}
				</span>
			</div>
		);
	}
};

const getAccumulatedCoinList = (limits, coins, tier) => {
	const tierLimits = limits.filter(
		(coin) => coin.tier === tier && coin.type === 'withdrawal'
	);

	let accumulatedCoins = Object.values(coins || {}).map((coin) => coin?.symbol);

	for (const limit of tierLimits) {
		if (limit.limit_currency !== 'default') {
			const index = accumulatedCoins.indexOf(limit.limit_currency);
			if (index > -1) {
				accumulatedCoins.splice(index, 1);
			}
		}
	}

	return accumulatedCoins;
};

const getRows = (
	coins,
	level,
	tiers,
	ICONS,
	transaction_limits,
	type,
	search
) => {
	const individualLimits = transaction_limits.filter((limit) =>
		search
			? limit.limit_currency !== 'default' &&
			  limit.tier === Number(level) &&
			  limit.currency.toString().includes(search && search)
			: limit.limit_currency !== 'default' && limit.tier === Number(level)
	);
	return (
		<Fragment>
			{individualLimits.length > 0 ? (
				individualLimits.map((limit, index) => {
					const { icon_id, display_name } = Object.values(coins || {})?.find(
						(coin) => coin.symbol === limit.limit_currency
					);

					return (
						<tr className="table-row" key={index}>
							<td className="table-icon td-fit" />
							<td className="td-name td-fit">
								<Link
									to={`/prices/coin/${limit.currency}`}
									className="underline"
								>
									<div
										className="d-flex align-items-center wallet-hover cursor-pointer"
										style={{ cursor: 'pointer' }}
									>
										<Coin iconId={icon_id} />
										<div className="px-2">{display_name}</div>
									</div>
								</Link>
							</td>
							<td style={{ paddingRight: 25 }}>
								<div>{getLimitValue(limit, false, '24h')}</div>
							</td>

							<td>
								<div>{getLimitValue(limit, false, '1m')}</div>
							</td>
						</tr>
					);
				})
			) : (
				<tr className="table-row">
					<td className="table-icon td-fit" />
					<td className="td-name td-fit">
						<div
							className="d-flex align-items-center"
							style={{ cursor: 'default' }}
						>
							<div className="px-2">
								<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.NO_INDEPENDENT">
									{
										STRINGS[
											'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.NO_INDEPENDENT'
										]
									}
								</EditWrapper>
							</div>
						</div>
					</td>
				</tr>
			)}
		</Fragment>
	);
};

const getRowsCollectiveIcon = (
	coins,
	level,
	tiers,
	ICONS,
	transaction_limits,
	type
) => {
	return (
		<>
			{getAccumulatedCoinList(transaction_limits, coins, Number(level)).map(
				(coin_name, index) => {
					const { icon_id, display_name } = Object.values(coins || {})?.find(
						(coin) => coin.symbol === coin_name
					);

					return (
						<tr className="table-row" key={index}>
							<td className="table-icon td-fit" />
							<td className="td-name td-fit">
								<Link to={`/prices/coin/${coin_name}`} className="underline">
									<div
										className="d-flex align-items-center wallet-hover cursor-pointer"
										style={{ cursor: 'pointer' }}
									>
										<Coin iconId={icon_id} />
										<div className="px-2">{display_name}</div>
									</div>
								</Link>
							</td>
						</tr>
					);
				}
			)}
		</>
	);
};

const getRowsCollective = (
	coins,
	level,
	tiers,
	ICONS,
	transaction_limits,
	type
) => {
	return (
		<>
			{getAccumulatedCoinList(transaction_limits, coins, Number(level)).map(
				(coin_name, index) => {
					const limit = transaction_limits.find(
						(limit) =>
							limit.tier === Number(level) &&
							limit.type === 'withdrawal' &&
							limit.limit_currency === 'default'
					);

					return (
						<tr className="table-row" key={index}>
							<td className="table-icon td-fit" />
							{index === 0 && (
								<>
									<td style={{ paddingRight: 25 }}>
										<div>{getLimitValue(limit, true, '24h', true)}</div>
									</td>

									<td>
										<div>{getLimitValue(limit, true, '1m')}</div>
									</td>
								</>
							)}

							{index === 1 && (
								<>
									<td style={{ paddingRight: 25 }}>
										<div style={{ fontSize: 11, color: '#ccc' }}>
											<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT_3">
												{STRINGS.formatString(
													STRINGS[
														'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT_3'
													],
													limit?.currency?.toUpperCase() || 'USDT'
												)}
											</EditWrapper>
										</div>
									</td>

									<td>
										<div style={{ fontSize: 11, color: '#ccc' }}>
											<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT_4">
												{STRINGS.formatString(
													STRINGS[
														'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.LIMIT_TEXT_4'
													],
													limit?.currency?.toUpperCase() || 'USDT'
												)}
											</EditWrapper>
										</div>
									</td>
								</>
							)}
						</tr>
					);
				}
			)}
		</>
	);
};

const LimitsBlock = ({
	level,
	coins,
	tiers,
	icons,
	transaction_limits,
	type,
	search,
	scrollToTop,
}) => {
	return type === 'individual' ? (
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
					{getRows(
						coins,
						level,
						tiers,
						icons,
						transaction_limits,
						type,
						search
					)}
				</tbody>
			</table>
		</div>
	) : (
		<>
			<div className="wallet-assets_block" style={{ display: 'flex' }}>
				<table className="wallet-assets_block-table" style={{ width: 1 }}>
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
						</tr>
					</thead>
					<tbody className="account-limits-content font-weight-bold">
						{getRowsCollectiveIcon(
							coins,
							level,
							tiers,
							icons,
							transaction_limits,
							type
						)}
					</tbody>
				</table>
				<table
					className="wallet-assets_block-table"
					style={{ position: 'relative', left: -10 }}
				>
					<thead>
						<tr className="table-bottom-border">
							<th />
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
						{getRowsCollective(
							coins,
							level,
							tiers,
							icons,
							transaction_limits,
							type
						)}
					</tbody>
				</table>
			</div>
			<div className="ml-4">
				<EditWrapper stringId="FEES_AND_LIMITS.RETURN_TO_TOP">
					<span
						className="pointer blue-link underline-text"
						onClick={() => scrollToTop()}
					>
						{STRINGS['FEES_AND_LIMITS.RETURN_TO_TOP']}
						<ArrowUpOutlined />
					</span>
				</EditWrapper>
			</div>
		</>
	);
};

export default withConfig(LimitsBlock);
