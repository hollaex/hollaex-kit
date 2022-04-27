import React from 'react';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { isStakingAvailable } from 'config/contracts';

import {
	// CurrencyBall,
	ActionNotification,
	SearchBox,
	AssetsBlockForm,
	EditWrapper,
} from 'components';
import { formatToCurrency, calculateOraclePrice } from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import {
	BASE_CURRENCY,
	CURRENCY_PRICE_FORMAT,
	DEFAULT_COIN_DATA,
} from 'config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from 'components/Image';

const AssetsBlock = ({
	balance,
	prices,
	coins,
	pairs,
	totalAssets,
	onOpenDialog,
	bankaccount,
	navigate,
	handleSearch,
	searchResult,
	handleCheck,
	icons: ICONS,
	hasEarn,
	loading,
	contracts,
	broker,
}) => {
	const sortedSearchResults = Object.entries(searchResult)
		.filter(([key]) => balance.hasOwnProperty(`${key}_balance`))
		.sort(([key_a], [key_b]) => {
			const price_a = calculateOraclePrice(
				balance[`${key_a}_balance`],
				searchResult[key_a].oraclePrice
			);
			const price_b = calculateOraclePrice(
				balance[`${key_b}_balance`],
				searchResult[key_b].oraclePrice
			);
			return price_a < price_b ? 1 : -1; // descending order
		});

	const findPair = (key) => {
		let tempPair;
		const defaultPair = `${key.toLowerCase()}-${BASE_CURRENCY.toLowerCase()}`;
		if (isMarketAvailable(defaultPair)) {
			return defaultPair;
		}

		tempPair = findPairByPairBase(key);
		if (tempPair) return tempPair;

		tempPair = findPairByPair2(key);
		if (tempPair) return tempPair;
	};

	const isMarketAvailable = (pair) => {
		if (pair) {
			let flippedPair = pair.split('-');
			flippedPair.reverse().join('-');
			const isBroker = !!broker.filter(
				(item) => item.symbol === pair || item.symbol === flippedPair
			).length;
			if (isBroker) {
				return isBroker;
			} else {
				return pair && pairs[pair] && pairs[pair].active;
			}
		}
	};

	const findPairByPairBase = (key) => {
		const availableMarketsArray = [];

		Object.keys(pairs).map((pairKey) => {
			const pairObject = pairs[pairKey];

			if (
				pairObject &&
				pairObject.pair_base === key &&
				isMarketAvailable(pairKey)
			) {
				availableMarketsArray.push(pairKey);
			}

			return pairKey;
		});

		return availableMarketsArray[0];
	};

	const findPairByPair2 = (key) => {
		const availableMarketsArray = [];

		Object.keys(pairs).map((pairKey) => {
			const pairObject = pairs[pairKey];

			if (
				pairObject &&
				pairObject.pair_2 === key &&
				isMarketAvailable(pairKey)
			) {
				availableMarketsArray.push(pairKey);
			}

			return pairKey;
		});

		return availableMarketsArray[0];
	};

	const goToTrade = (pair) => {
		let flippedPair = pair.split('-');
		flippedPair.reverse().join('-');
		const isBroker = !!broker.filter(
			(item) => item.symbol === pair || item.symbol === flippedPair
		).length;
		if (pair && isBroker) {
			return navigate(`/quick-trade/${pair}`);
		} else if (pair && !isBroker) {
			return navigate(`/trade/${pair}`);
		}
	};

	return (
		<div className="wallet-assets_block">
			<section className="ml-4 pt-4">
				{totalAssets.length && loading ? (
					<EditWrapper stringId="WALLET_ESTIMATED_TOTAL_BALANCE">
						<div className="wallet-search-improvement">
							{BASE_CURRENCY ? (
								<div>
									<div>{STRINGS['WALLET_ESTIMATED_TOTAL_BALANCE']}</div>
									<div className="font-title">{totalAssets}</div>
								</div>
							) : null}
						</div>
					</EditWrapper>
				) : (
					<div>
						<div className="mb-2">{STRINGS['WALLET_BALANCE_LOADING']}</div>
						<div className="loading-anime"></div>
					</div>
				)}
				<div className="d-flex justify-content-between zero-balance-wrapper">
					<EditWrapper stringId="WALLET_ASSETS_SEARCH_TXT">
						<SearchBox
							name="search-assets"
							placeHolder={`${STRINGS['WALLET_ASSETS_SEARCH_TXT']}...`}
							handleSearch={handleSearch}
						/>
					</EditWrapper>
					<EditWrapper stringId="WALLET_HIDE_ZERO_BALANCE">
						<AssetsBlockForm
							label={STRINGS['WALLET_HIDE_ZERO_BALANCE']}
							handleCheck={handleCheck}
						/>
					</EditWrapper>
				</div>
			</section>
			<table className="wallet-assets_block-table">
				<thead>
					<tr className="table-bottom-border">
						<th />
						<th>
							<EditWrapper stringId="CURRENCY">
								{STRINGS['CURRENCY']}
							</EditWrapper>
						</th>
						<th>
							<EditWrapper stringId="AMOUNT">{STRINGS['AMOUNT']}</EditWrapper>
						</th>
						<th className="td-amount" />
						<th>
							<EditWrapper stringId="DEPOSIT_WITHDRAW,WALLET_BUTTON_BASE_DEPOSIT,WALLET_BUTTON_BASE_WITHDRAW,GENERATE_WALLET">
								{STRINGS['DEPOSIT_WITHDRAW']}
							</EditWrapper>
						</th>
						{!isMobile && (
							<th>
								<EditWrapper stringId="TRADE_TAB_TRADE">
									{STRINGS['TRADE_TAB_TRADE']}
								</EditWrapper>
							</th>
						)}
						{hasEarn && (
							<th>
								<EditWrapper stringId="STAKE.EARN">
									{STRINGS['STAKE.EARN']}
								</EditWrapper>
							</th>
						)}
					</tr>
				</thead>
				<tbody>
					{sortedSearchResults.map(
						(
							[key, { min, allow_deposit, allow_withdrawal, oraclePrice }],
							index
						) => {
							const balanceValue = balance[`${key}_balance`];
							let brokerPair = '';
							broker.forEach((item) => {
								const pairKey = item && item.symbol;
								const splitPair = pairKey && pairKey.split('-');

								if (splitPair[0] === key || splitPair[1] === key) {
									brokerPair = pairKey;
								}
							});
							const pair = brokerPair ? brokerPair : findPair(key);
							const { fullname, symbol = '', display_name, icon_id } =
								coins[key] || DEFAULT_COIN_DATA;
							const baseCoin = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
							const balanceText =
								key === BASE_CURRENCY
									? formatToCurrency(balanceValue, min)
									: formatToCurrency(
											calculateOraclePrice(balanceValue, oraclePrice),
											baseCoin.min
									  );
							return (
								<tr className="table-row table-bottom-border" key={key}>
									<td className="table-icon td-fit">
										{/* <Link to={`/wallet/${key.toLowerCase()}`}>
											<CurrencyBall
												name={symbol.toUpperCase()}
												symbol={key}
												size="s"
											/>
										</Link> */}
									</td>
									<td className="td-name td-fit">
										{sortedSearchResults && loading ? (
											<div className="d-flex align-items-center">
												<Link to={`/wallet/${key.toLowerCase()}`}>
													<Image
														iconId={icon_id}
														icon={ICONS[icon_id]}
														wrapperClassName="currency-ball"
														imageWrapperClassName="currency-ball-image-wrapper"
													/>
												</Link>
												<Link to={`/wallet/${key.toLowerCase()}`}>
													{fullname}
												</Link>
											</div>
										) : (
											<div
												className="loading-row-anime w-half"
												style={{
													animationDelay: `.${index + 1}s`,
												}}
											></div>
										)}
									</td>
									<td className="td-amount">
										{sortedSearchResults && baseCoin && loading ? (
											<div className="d-flex">
												<div className="mr-4">
													{STRINGS.formatString(
														CURRENCY_PRICE_FORMAT,
														formatToCurrency(balanceValue, min, true),
														display_name
													)}
												</div>
												{!isMobile &&
													key !== BASE_CURRENCY &&
													parseFloat(balanceText || 0) > 0 && (
														<div>
															{`(≈ ${baseCoin.display_name} ${balanceText})`}
														</div>
													)}
											</div>
										) : (
											<div
												className="loading-row-anime w-full"
												style={{
													animationDelay: `.${index + 1}s`,
												}}
											></div>
										)}
									</td>
									<th className="td-amount" />
									<td className="td-wallet">
										<div className="d-flex justify-content-between deposit-withdrawal-wrapper">
											<ActionNotification
												stringId="WALLET_BUTTON_BASE_DEPOSIT"
												text={STRINGS['WALLET_BUTTON_BASE_DEPOSIT']}
												iconId="BLUE_PLUS"
												iconPath={ICONS['BLUE_PLUS']}
												onClick={() => navigate(`wallet/${key}/deposit`)}
												className="csv-action action-button-wrapper"
												showActionText={isMobile}
												disable={!allow_deposit}
											/>
											<ActionNotification
												stringId="WALLET_BUTTON_BASE_WITHDRAW"
												text={STRINGS['WALLET_BUTTON_BASE_WITHDRAW']}
												iconId="BLUE_PLUS"
												iconPath={ICONS['BLUE_PLUS']}
												onClick={() => navigate(`wallet/${key}/withdraw`)}
												className="csv-action action-button-wrapper"
												showActionText={isMobile}
												disable={!allow_withdrawal}
											/>
										</div>
									</td>
									{!isMobile && (
										<td>
											<ActionNotification
												stringId="TRADE_TAB_TRADE"
												text={STRINGS['TRADE_TAB_TRADE']}
												iconId="BLUE_PLUS"
												iconPath={ICONS['BLUE_PLUS']}
												onClick={() => goToTrade(pair)}
												className="csv-action"
												showActionText={isMobile}
												disable={!isMarketAvailable(pair)}
											/>
										</td>
									)}
									{hasEarn && (
										<td>
											<ActionNotification
												stringId="STAKE.EARN"
												text={STRINGS['STAKE.EARN']}
												iconId="BLUE_PLUS"
												iconPath={ICONS['BLUE_PLUS']}
												onClick={() => navigate('/stake')}
												className="csv-action"
												showActionText={isMobile}
												disable={!isStakingAvailable(symbol, contracts)}
											/>
										</td>
									)}
								</tr>
							);
						}
					)}
				</tbody>
			</table>
		</div>
	);
};

export default withConfig(AssetsBlock);
