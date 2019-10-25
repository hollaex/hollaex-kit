import React from 'react';
import { CurrencyBall } from '../../components';
import { ICONS, BASE_CURRENCY, CURRENCY_PRICE_FORMAT, DEFAULT_COIN_DATA } from '../../config/constants';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import {
	calculatePrice,
	formatToCurrency
} from '../../utils/currency';
import { ActionNotification } from '../../components';
import STRINGS from '../../config/localizedStrings';

export const AssetsBlock = ({
	balance,
	prices,
	coins,
	totalAssets,
	wallets,
	onOpenDialog,
	bankaccount,
	navigate,
	openContactUs
}) => (
	<div className="wallet-assets_block">
		<table className="wallet-assets_block-table">
			<thead>
				<tr className="table-bottom-border">
					<th />
					<th>{STRINGS.CURRENCY}</th>
					<th>{STRINGS.DEPOSIT_WITHDRAW}</th>
					<th className="td-amount" />
					<th className="text-center">{STRINGS.AMOUNT}</th>
				</tr>
			</thead>
			<tbody>
				{Object.entries(coins)
					.filter(([key]) => balance.hasOwnProperty(`${key}_balance`))
					.map(([key, { min, allow_deposit, allow_withdrawal }]) => {
						const balanceValue = balance[`${key}_balance`];
						const { fullname, symbol = '' } = coins[key] || DEFAULT_COIN_DATA;
						const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
						const balanceText =
							key === BASE_CURRENCY
								? formatToCurrency(balanceValue, min)
								: formatToCurrency(
										calculatePrice(balanceValue, prices[key]),
										baseCoin.min
									);
						return (
							<tr className="table-row table-bottom-border" key={key}>
								<td className="table-icon td-fit">
									<Link to={`/wallet/${key.toLowerCase()}`}>
										<CurrencyBall
											name={symbol.toUpperCase()}
											symbol={key}
											size="s"
										/>
									</Link>
								</td>
								<td className="td-name td-fit">
									<Link to={`/wallet/${key.toLowerCase()}`}>
										{fullname}
									</Link>
								</td>
								<td className="td-wallet">
									{wallets[key] ||
									(key === BASE_CURRENCY && bankaccount && bankaccount.verified) ? (
										<div className="d-flex justify-content-between deposit-withdrawal-wrapper">
											<ActionNotification
												text={STRINGS.WALLET_BUTTON_BASE_DEPOSIT}
												iconPath={ICONS.BLUE_PLUS}
												onClick={() => navigate(`wallet/${key}/deposit`)}
												useSvg={true}
												className="csv-action"
												showActionText={isMobile}
												disable={!allow_deposit}
											/>
											<ActionNotification
												text={STRINGS.WALLET_BUTTON_BASE_WITHDRAW}
												iconPath={ICONS.BLUE_PLUS}
												onClick={() => navigate(`wallet/${key}/withdraw`)}
												useSvg={true}
												className="csv-action"
												showActionText={isMobile}
												disable={!allow_withdrawal}
											/>
										</div>
									) : (
										key !== BASE_CURRENCY && (
											<ActionNotification
												text={STRINGS.GENERATE_WALLET}
												status="information"
												iconPath={ICONS.BLUE_PLUS}
												onClick={() => onOpenDialog(key)}
												className="need-help"
												useSvg={true}
												showActionText={true}
												disable={!allow_deposit}
											/>
										)
									)}
								</td>
								<td className="td-amount" />
								<td className="td-amount">
									<div className="d-flex">
										<div className="mr-4">
											{STRINGS.formatString(
												CURRENCY_PRICE_FORMAT,
												formatToCurrency(balanceValue, min),
												symbol.toUpperCase()
											)}
										</div>
										{key === 'hex' &&
											parseFloat(balanceText || 0) > 0 && (
												<div className="text-center base-amount">
													{`(≈ ${
														baseCoin.symbol.toUpperCase()
													} ${balanceText})`}
												</div>
											)}
									</div>
								</td>
							</tr>
						);
					})}
			</tbody>
			{BASE_CURRENCY && (
					<tfoot>
						<tr>
							<td colSpan={5}>
								{STRINGS.formatString(
									STRINGS.WALLET_DEPOSIT_USD,
									<span className="blue-link pointer" onClick={openContactUs}>{STRINGS.CONTACT_US_TEXT}</span>
								)}
							</td>
						</tr>
					</tfoot>
				)}
		</table>
	</div>
);
