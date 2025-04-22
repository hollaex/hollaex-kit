import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';

import { quicktradePairSelector } from 'containers/QuickTrade/components/utils';
import { MarketsSelector } from 'containers/Trade/utils';
import math from 'mathjs';
import STRINGS from 'config/localizedStrings';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import {
	Button,
	EditWrapper,
	Image,
	Coin,
	Dialog,
	ActionNotification,
} from 'components';
import { getMiniCharts } from 'actions/chartAction';
import withConfig from 'components/ConfigProvider/withConfig';
import { addToFavourites, removeFromFavourites } from 'actions/appActions';
import Details from 'containers/QuickTrade/components/Details';
import { formatCurrency } from 'utils';
import { STATIC_ICONS } from 'config/icons';

const TYPES = {
	PRO: 'pro',
	BROKER: 'broker',
	NETWORK: 'network',
};

const CoinPage = ({
	pairs,
	tickers,
	coins,
	icons: ICONS,
	router,
	available_balance,
	favourites,
	addToFavourites,
	removeFromFavourites,
	quicktradePairs,
	markets,
}) => {
	const {
		params: { token: currentCoin },
	} = router;

	const currentCoinUpper = currentCoin?.toUpperCase();

	const currentQuicktradePair = Object.keys(quicktradePairs).find((pair) =>
		pair.split('-').includes(currentCoin)
	);

	const market = markets.find(({ symbol }) => currentCoin === symbol);

	const isBroker =
		currentQuicktradePair &&
		[TYPES.NETWORK, TYPES.BROKER].includes(
			quicktradePairs[currentQuicktradePair].type
		);

	const isNetwork =
		quicktradePairs[currentQuicktradePair]?.type === TYPES.NETWORK;

	const [data, setData] = useState([]);
	const [chartData, setChartData] = useState({});
	const [lineChartData, setLineChartData] = useState({});
	const [isDiaplayMarketDetail, setIsDisplayMarketDetail] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		handleMarket();
		getChartDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		handleOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, chartData]);

	const getChartDetails = async () => {
		const assetValues = Object.keys(coins)
			?.map((val) => coins[val]?.code)
			?.toLocaleString();
		try {
			setIsLoading(true);
			await getMiniCharts(assetValues).then((chartValues) => {
				setChartData(chartValues);
			});
			setIsLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleOptions = () => {
		const selectedPair = currentCoin + '-usdt';

		const ChartData = {
			...chartData[selectedPair],
			name: 'Line',
			type: 'line',
		};
		setLineChartData(ChartData);
	};

	const handleMarket = () => {
		const pairKeys = Object.keys(pairs).sort((a, b) => {
			const { volume: volumeA = 0, close: closeA = 0 } = tickers[a] || {};
			const { volume: volumeB = 0, close: closeB = 0 } = tickers[b] || {};
			const marketCapA = math.multiply(volumeA, closeA);
			const marketCapB = math.multiply(volumeB, closeB);
			return marketCapB - marketCapA;
		});
		const market = pairKeys.map((key) => {
			const pair = pairs[key] || {};
			const { fullname, symbol = '' } =
				coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
			const pairTwo = coins[pair.pair_2] || DEFAULT_COIN_DATA;

			return {
				key,
				pair,
				symbol,
				pairTwo,
				fullname,
			};
		});
		setData(market);
	};

	const pairBase_fullName = coins[currentCoin]?.fullname;

	const handleTrade = (pair) => {
		if (pair) {
			if (isBroker) {
				router.push(`/quick-trade/${pair}`);
			} else {
				router.push(`/trade/${pair}`);
			}
		} else {
			router.push('/wallet');
		}
	};

	const {
		icon_id,
		meta: { website, explorer },
	} = coins[currentCoin];

	const topLinks = [
		{ key: 'HOLLAEX_TOKEN.WEBSITE', link: website },
		{ key: 'HOLLAEX_TOKEN.EXPLORER', link: explorer },
	];

	return (
		<div className="hollaex-token-wrapper">
			<div className="token-wrapper mt-8">
				<div className={isMobile ? 'd-flex pb-30 ml-4' : 'd-flex pb-30'}>
					<div className={isMobile ? 'asset-icon' : ''}>
						<Coin iconId={icon_id} type="CS11" />
					</div>
					<div className="pl-2 header-container">
						<div className="title">
							<div className="d-flex justify-content-between title-child-container">
								<div>
									<span>{pairBase_fullName}</span> ({currentCoinUpper})
								</div>
								{!isMobile && (
									<ActionNotification
										stringId="REFRESH"
										text={STRINGS['REFRESH']}
										iconId="REFRESH"
										iconPath={STATIC_ICONS['REFRESH']}
										className="blue-icon refresh-link mr-3"
										onClick={() => getChartDetails()}
										disable={isLoading}
									/>
								)}
							</div>
						</div>
						<div className="d-flex justify-content-between mt-3 mb-4 balance-wrapper">
							<div className="link-wrapper">
								<EditWrapper stringId="VIEW_MY_WALLET">
									<span
										className="blue-link text-decoration-underline pointer"
										onClick={() => router.push('/wallet')}
									>
										{STRINGS['VIEW_MY_WALLET']}
									</span>
								</EditWrapper>
								<span
									className={
										isMobile ? 'link-separator mx-4' : 'link-separator mx-2'
									}
								></span>
								<EditWrapper stringId="VIEW_ALL_PRICES_LINK">
									<span
										className="blue-link text-decoration-underline pointer"
										onClick={() => router.push('/prices')}
									>
										{STRINGS['VIEW_ALL_PRICES_LINK']}
									</span>
								</EditWrapper>
							</div>
							<div className="d-flex image-Wrapper">
								<div
									className="d-flex align-items-start balance-link"
									onClick={() => router.push('/wallet')}
								>
									<Image
										iconId={''}
										stringId={''}
										icon={ICONS['TAB_WALLET']}
										alt={'text'}
										svgWrapperClassName="action_notification-svg"
									/>
									<EditWrapper stringId="HOLLAEX_TOKEN.BALANCE">
										{STRINGS['HOLLAEX_TOKEN.BALANCE']}
									</EditWrapper>
								</div>
								<div className="gray-text ml-2">
									{formatCurrency(
										available_balance[`${currentCoin}_available`]
									)}{' '}
									{currentCoinUpper}{' '}
									<Link className="link" to={`wallet/${currentCoin}/deposit`}>
										<EditWrapper stringId="SUMMARY.DEPOSIT">
											({STRINGS['SUMMARY.DEPOSIT']})
										</EditWrapper>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={`hollaex-container`}>
					<div className="info-container">
						<Fragment>
							{topLinks.filter(({ link }) => !!link).length !== 0 && (
								<div
									className={
										isMobile
											? 'd-flex justify-content-start pb-4 trade-link-wrapper info-link-wrapper'
											: 'd-flex justify-content-start pb-4 info-link-wrapper'
									}
								>
									<span
										className={
											isMobile
												? 'd-flex justify-content-start info-link-wrapper'
												: 'info-link-wrapper'
										}
									>
										{topLinks
											?.filter(({ link }) => !!link)
											?.map(({ link, key }, index) => (
												<span
													className={classnames('trade_tabs-link', {
														'link-separator': index !== topLinks.length - 1,
													})}
												>
													<a
														href={link}
														target="_blank"
														rel="noopener noreferrer"
													>
														{STRINGS[key]}
													</a>
												</span>
											))}
									</span>
									{isMobile && (
										<EditWrapper stringId="QUICK_TRADE_COMPONENT.VIEW_TREND">
											<span
												className="blue-link"
												onClick={() => {
													setIsDisplayMarketDetail(true);
												}}
											>
												<span className="mr-2">
													{STRINGS['QUICK_TRADE_COMPONENT.VIEW_TREND']}
												</span>
												<Image
													iconId={'STAKING_VARIABLE'}
													icon={ICONS['STAKING_VARIABLE']}
													wrapperClassName="stake-variable"
												/>
											</span>
										</EditWrapper>
									)}
								</div>
							)}
						</Fragment>
						<div className="header-text">
							<EditWrapper stringId="HOLLAEX_TOKEN.ABOUT">
								{STRINGS['HOLLAEX_TOKEN.ABOUT']} {pairBase_fullName} (
								{currentCoinUpper})
							</EditWrapper>
						</div>
						{coins[currentCoin].description ? (
							<div
								className="sub-text"
								dangerouslySetInnerHTML={{
									__html: `${coins[currentCoin].description}`,
								}}
							></div>
						) : (
							<div className="sub-text">
								{' '}
								<EditWrapper stringId="HOLLAEX_TOKEN.NO_DESCRIPTION">
									{STRINGS['HOLLAEX_TOKEN.NO_DESCRIPTION']}
								</EditWrapper>
							</div>
						)}

						{!isMobile && (
							<div className="button-container">
								<EditWrapper stringId="HOLLAEX_TOKEN.TRADE">
									<Button
										label={STRINGS.formatString(
											isBroker
												? STRINGS['HOLLAEX_TOKEN.QUICK_TRADE']
												: STRINGS['HOLLAEX_TOKEN.PRO_TRADE'],
											currentCoinUpper
										)}
										type="button"
										onClick={() => handleTrade(currentQuicktradePair)}
										className="w-100"
									/>
								</EditWrapper>
							</div>
						)}
					</div>
					{isMobile && (
						<div className="market-button-container">
							<EditWrapper stringId="HOLLAEX_TOKEN.TRADE">
								<Button
									label={STRINGS.formatString(
										isBroker
											? STRINGS['HOLLAEX_TOKEN.QUICK_TRADE']
											: STRINGS['HOLLAEX_TOKEN.PRO_TRADE'],
										currentCoinUpper
									)}
									type="button"
									onClick={() => handleTrade(currentQuicktradePair)}
									className="market-btn"
								/>
							</EditWrapper>
						</div>
					)}
					{!isMobile && (
						<div className="trade-details-wrapper">
							<Details
								isLoading={isLoading}
								coinChartData={lineChartData}
								pair={`${currentCoin}-usdt`}
								brokerUsed={isBroker}
								networkName={market?.display_name}
								isNetwork={isNetwork}
								isCoinPage={true}
								showTradeFees
							/>
						</div>
					)}
					<Dialog
						isOpen={isDiaplayMarketDetail}
						onCloseDialog={() => {
							setIsDisplayMarketDetail(false);
						}}
						className="market-chart-details-popup-wrapper"
						label="market-chart-details-popup"
					>
						<div className="market-chart-details-popup-container">
							<div className="price-trend-title">
								<span>
									<Image
										iconId={'STAKING_VARIABLE'}
										icon={ICONS['STAKING_VARIABLE']}
										wrapperClassName="stake-variable"
									/>
									<span className="ml-3">
										<EditWrapper stringId="QUICK_TRADE_COMPONENT.PRICE_TREND">
											<span className="d-flex align-items-center">
												{STRINGS['QUICK_TRADE_COMPONENT.PRICE_TREND']}
											</span>
										</EditWrapper>
									</span>
								</span>
								<span className="d-flex align=-items-center">
									{isMobile && (
										<ActionNotification
											stringId="REFRESH"
											text={STRINGS['REFRESH']}
											iconId="REFRESH"
											iconPath={STATIC_ICONS['REFRESH']}
											className="refresh-link mt-2"
											onClick={() => getChartDetails()}
											disable={isLoading}
										/>
									)}
									<span
										className="close-icon ml-3"
										onClick={() => setIsDisplayMarketDetail(false)}
									>
										x
									</span>
								</span>
							</div>
							<Details
								isLoading={isLoading}
								coinChartData={lineChartData}
								pair={`${currentCoin}-usdt`}
								brokerUsed={isBroker}
								networkName={market?.display_name}
								isNetwork={isNetwork}
								isCoinPage={true}
								showTradeFees
							/>
						</div>
					</Dialog>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	pair: store.app.pair,
	pairs: store.app.pairs,
	tickers: store.app.tickers,
	coins: store.app.coins,
	favourites: store.app.favourites,
	available_balance: store.user.balance,
	quicktradePairs: quicktradePairSelector(store),
	markets: MarketsSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
	addToFavourites: bindActionCreators(addToFavourites, dispatch),
	removeFromFavourites: bindActionCreators(removeFromFavourites, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(CoinPage));
