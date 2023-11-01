import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import { quicktradePairSelector } from 'containers/QuickTrade/components/utils';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import math from 'mathjs';
import STRINGS from 'config/localizedStrings';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { Button, EditWrapper, Image, Coin } from 'components';
import { getMiniCharts } from 'actions/chartAction';
import withConfig from 'components/ConfigProvider/withConfig';
import { isLoggedIn } from 'utils/token';
import { addToFavourites, removeFromFavourites } from 'actions/appActions';
import Details from 'containers/QuickTrade/components/Details';

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
}) => {
	const {
		params: { token: currentCoin },
	} = router;
	const currentCoinUpper = currentCoin?.toUpperCase();
	
	const currentQuicktradePair =
		Object.keys(quicktradePairs).find((pair) =>
			pair.split('-').includes(currentCoin)
		);

	const isBroker =
		currentQuicktradePair &&
		['network', 'broker'].includes(quicktradePairs[currentQuicktradePair].type);

	const [data, setData] = useState([]);
	const [chartData, setChartData] = useState({});
	const [selectedPair, setselectedPair] = useState([]);
	const [lineChartData, setLineChartData] = useState({});
	const selectedPairCoins = selectedPair && selectedPair?.[0];

	useEffect(() => {
		handleMarket();
		const assetValues = Object.keys(coins).map((
			val) => coins[val].code).toLocaleString();

		getMiniCharts(assetValues)
			.then((chartValues) =>{
				setChartData(chartValues);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		handleOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, chartData]);

	const handleOptions = () => {
		const selectedPair = currentCoin+'-usdt';


		const ChartData = {
			...chartData[selectedPair],
			name: 'Line',
			type: 'line',
		};
		setLineChartData(ChartData);
		setselectedPair(selectedPair);
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

	const handleBack = () => {
		router.goBack();
	};

	const pairBase_fullName = coins[currentCoin].fullname;


	const isFavourite = (pair) => {
		return isLoggedIn() && favourites.includes(pair);
	};

	const toggleFavourite = (pair) => {
		if (isLoggedIn()) {
			return isFavourite(pair)
				? removeFromFavourites(pair)
				: addToFavourites(pair);
		}
	};

	const handleTrade = (pair) => {
		if (isBroker) {
			router.push(`/quick-trade/${pair}`);
		} else {
			router.push(`/trade/${pair}`);
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
				<div className="d-flex pb-30">
					<div>
						<Coin iconId={icon_id} type="CS11" />
					</div>
					<div className="pl-2 header-container">
						<div className="title">
							<div className="d-flex justify-content-between title-child-container">
								<div>
									<span>{pairBase_fullName}</span> {currentCoinUpper}
								</div>
								<div
									className="pl-3 pr-2 favourite-content"
									onClick={() => toggleFavourite(selectedPairCoins?.key)}
								>
									{isFavourite(selectedPairCoins?.key) ? (
										<div className="d-flex align-items-center star-icon">
											<div className="favourite-text">
												<EditWrapper stringId="HOLLAEX_TOKEN.REMOVE_FAVOURITES">
													{STRINGS['HOLLAEX_TOKEN.REMOVE_FAVOURITES']}
												</EditWrapper>
											</div>
											<StarFilled className="stared-market" />
										</div>
									) : (
										!isBroker && (
											<div className="d-flex align-items-center">
												<span className="favourite-text-2">
													<EditWrapper stringId="HOLLAEX_TOKEN.ADD_FAVOURITES">
														{STRINGS['HOLLAEX_TOKEN.ADD_FAVOURITES']}
													</EditWrapper>
												</span>
												<StarOutlined />
											</div>
										)
									)}
								</div>
							</div>
						</div>
						<div className="d-flex justify-content-between mt-3 mb-4 balance-wrapper">
							<div className="link" onClick={handleBack}>
								<EditWrapper stringId="HOLLAEX_TOKEN.GO_BACK">
									&lt; {STRINGS['HOLLAEX_TOKEN.GO_BACK']}
								</EditWrapper>
							</div>
							<div className="d-flex image-Wrapper">
								<Image
									iconId={''}
									stringId={''}
									icon={ICONS['TAB_WALLET']}
									alt={'text'}
									svgWrapperClassName="action_notification-svg"
								/>
								<div className="gray-text">
									<EditWrapper stringId="HOLLAEX_TOKEN.BALANCE">
										{STRINGS['HOLLAEX_TOKEN.BALANCE']}
									</EditWrapper>{' '}
									{available_balance[`${currentCoin}_available`]}{' '}
									{currentCoinUpper}{' '}
									<Link className="link" to={'/wallet'}>
										<EditWrapper stringId="HOLLAEX_TOKEN.OPEN_WALLET">
											{STRINGS['HOLLAEX_TOKEN.OPEN_WALLET']}
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
								<div className="d-flex justify-content-start pb-4">
									{topLinks
										.filter(({ link }) => !!link)
										.map(({ link, key }, index) => (
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

						<div className="button-container">
							<EditWrapper stringId="HOLLAEX_TOKEN.TRADE">
								<Button
									label={STRINGS.formatString(
										STRINGS['HOLLAEX_TOKEN.QUICK_TRADE'],
										currentCoinUpper
									)}
									type="button"
									onClick={() => handleTrade(currentQuicktradePair)}
									className="w-100"
								/>
							</EditWrapper>
						</div>
					</div>
					<div className="trade-details-wrapper">
						<Details 
							coinChartData={lineChartData} 
							pair={`${currentCoin}-usdt`}
							brokerUsed={isBroker}
							name={currentCoin}
						/>
					</div>
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
});

const mapDispatchToProps = (dispatch) => ({
	addToFavourites: bindActionCreators(addToFavourites, dispatch),
	removeFromFavourites: bindActionCreators(removeFromFavourites, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(CoinPage));
