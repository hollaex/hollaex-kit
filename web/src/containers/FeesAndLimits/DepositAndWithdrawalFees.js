import React from 'react';
import { browserHistory } from 'react-router';
import BigNumber from 'bignumber.js';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Coin, EditWrapper } from 'components';
import { getNetworkNameByKey } from 'utils/wallet';

const renderRow = (
	icon_id,
	display_name,
	deposit_text,
	withdrawal_text,
	index,
	ICONS
) => {
	const coin = display_name?.split(' ');

	return (
		<tr className="table-row table-bottom-border" key={index}>
			<td className="table-icon td-fit" />
			<td className="td-name td-fit">
				<div
					className="d-flex align-items-center wallet-hover cursor-pointer"
					onClick={() =>
						browserHistory?.push(`/prices/coin/${coin[0]?.toLowerCase()}`)
					}
				>
					<Coin iconId={icon_id} />
					<div className="px-2">{display_name}</div>
				</div>
			</td>
			{/*Temporarily dropped deposit fee for the scope of 2.5 release*/}
			{/*<td>{deposit_text}</td>*/}
			<td>{withdrawal_text}</td>
		</tr>
	);
};

const getFeeText = (data, level, type, coin_customizations, coins) => {
	const { symbol, value } = data;

	let fee = value;

	if (type === 'withdrawal') {
		const feeMarkup = coin_customizations?.[symbol]?.fee_markup;
		if (feeMarkup) {
			const incrementUnit = coins?.[symbol]?.increment_unit;
			const decimalPoint = new BigNumber(incrementUnit).dp();
			const roundedMarkup = new BigNumber(feeMarkup)
				.decimalPlaces(decimalPoint)
				.toNumber();

			fee = new BigNumber(fee || 0).plus(roundedMarkup || 0).toNumber();
		}
	}
	const text = `${fee} ${symbol?.toUpperCase()}`;

	return text;
};

const getRows = (
	level,
	coins,
	icons,
	search,
	strings,
	coin_customizations,
	fiat_fees
) => {
	const rowData = [];
	Object.entries(coins)
		.filter(([key]) => !search || (search && key.includes(search)))
		.forEach(([_, coin], c_index) => {
			const {
				icon_id,
				display_name,
				withdrawal_fees,
				withdrawal_fee,
				deposit_fees,
				symbol,
				network: networks,
				allow_withdrawal,
				type,
			} = coin;
			if (withdrawal_fees) {
				Object.keys(withdrawal_fees).forEach((network, n_index) => {
					const withdrawal_fees_data = withdrawal_fees[network];
					if (!Object.keys(withdrawal_fees_data).includes('symbol')) {
						withdrawal_fees_data['symbol'] = symbol;
					}
					const withdrawal_text = allow_withdrawal
						? getFeeText(
								withdrawal_fees_data,
								level,
								'withdrawal',
								coin_customizations,
								coins
						  )
						: strings['FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.NOT_ALLOWED'];
					const deposit_text =
						deposit_fees && deposit_fees[network]
							? getFeeText(
									deposit_fees[network],
									level,
									'deposit',
									coin_customizations,
									coins
							  )
							: 'N/A';
					const index = `${c_index}_${n_index}`;
					const display_text =
						networks && network
							? `${display_name} (${getNetworkNameByKey(network)})`
							: display_name;

					rowData.push(
						renderRow(
							icon_id,
							display_text,
							deposit_text,
							withdrawal_text,
							index,
							icons
						)
					);
				});
			} else {
				let customFee;
				if (type === 'fiat') {
					customFee = fiat_fees?.[symbol]?.withdrawal_fee;
				}

				const withdrawal_text = allow_withdrawal
					? `${
							type === 'fiat' ? customFee || withdrawal_fee : withdrawal_fee
					  } ${display_name}`
					: strings['FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.NOT_ALLOWED'];
				rowData.push(
					renderRow(
						icon_id,
						display_name,
						'N/A',
						withdrawal_text,
						c_index,
						icons
					)
				);
			}
		});
	return rowData;
};

const DepositAndWithdrawalFees = ({
	coins,
	level,
	icons,
	search,
	coin_customizations,
	fiat_fees,
}) => {
	return (
		<div className="wallet-assets_block">
			<table className="wallet-assets_block-table">
				<thead>
					<tr className="table-bottom-border">
						<th />
						<th>
							<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.HEADER.CURRENCY">
								{
									STRINGS[
										'FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.HEADER.CURRENCY'
									]
								}
							</EditWrapper>
						</th>
						{/*Temporarily dropped deposit fee for the scope of 2.5 release*/}
						{/*<th>*/}
						{/*<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.HEADER.DEPOSIT">*/}
						{/*{*/}
						{/*STRINGS[*/}
						{/*'FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.HEADER.DEPOSIT'*/}
						{/*]*/}
						{/*}*/}
						{/*</EditWrapper>*/}
						{/*</th>*/}
						<th>
							<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.HEADER.WITHDRAWAL">
								{
									STRINGS[
										'FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.HEADER.WITHDRAWAL'
									]
								}
							</EditWrapper>
						</th>
					</tr>
				</thead>
				<tbody>
					{getRows(
						level,
						coins,
						icons,
						search,
						STRINGS,
						coin_customizations,
						fiat_fees
					)}
				</tbody>
			</table>
		</div>
	);
};

export default withConfig(DepositAndWithdrawalFees);
