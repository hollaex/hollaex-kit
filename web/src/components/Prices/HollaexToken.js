import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _get from 'lodash/get';
import math from 'mathjs';
import classnames from 'classnames';
import Image from 'components/Image';
import STRINGS from 'config/localizedStrings';
import { generateCoinIconId } from 'utils/icon';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { formatPercentage } from 'utils/currency';
import EditWrapper from 'components/EditWrapper';
import { Transition } from 'react-transition-group';
import SparkLine from 'containers/TradeTabs/components/SparkLine';
import { getSparklines } from 'actions/chartAction';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Select } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { isLoggedIn } from 'utils/token';
import { bindActionCreators } from 'redux';
import { addToFavourites, removeFromFavourites } from 'actions/appActions';

const Hollaextoken = (props) => {
	let currentPath = window?.location?.pathname.split('/');
	let currentPair = currentPath[currentPath.length - 1];
	const [data, setData] = useState([]);
	const [chartData, setChartData] = useState({});
	const [options, setOptions] = useState([]);
	const [selectedPair, setselectedPair] = useState([]);
	const [viewMoreContents, setViewMoreContents] = useState([]);
	const [viewMore, setViewMore] = useState(false);
	const [lineChartData, setLineChartData] = useState({});
	const {
		pairs,
		tickers,
		coins,
		icons: ICONS,
		router,
		available_balance,
	} = props;

	useEffect(() => {
		handleMarket();
		getSparklines(Object.keys(props?.pairs)).then((chartData) => {
			return setChartData(chartData);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		handleOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const handleOptions = () => {
		let pairOptions = [];
		let selectedPair = data?.filter((pair) => {
			return pair?.key === currentPair;
		});
		let pairBase = selectedPair[0]?.key.split('-')[0];
		Object.keys(pairs).forEach((pair) => {
			if (pair.includes(pairBase)) {
				pairOptions.push({
					value: pair.replace('-', '/'),
					label: pair.replace('-', '/'),
				});
			}
		});
		const defaultValue = pairOptions.filter(
			(filteredValue) => currentPair !== filteredValue.value.replace('/', '-')
		);
		const ChartData = {
			...chartData[selectedPair[0]?.key],
			name: 'Line',
			type: 'line',
		};
		setLineChartData(ChartData);
		setViewMoreContents(defaultValue);
		setOptions(pairOptions);
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
		let market = pairKeys.map((key) => {
			let pair = pairs[key] || {};
			let { fullname, symbol = '' } =
				coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
			const pairTwo = coins[pair.pair_2] || DEFAULT_COIN_DATA;
			const { increment_price, increment_size } = pair;
			let ticker = tickers[key] || {};
			const priceDifference =
				ticker.open === 0 ? 0 : (ticker.close || 0) - (ticker.open || 0);
			const tickerPercent =
				priceDifference === 0 || ticker.open === 0
					? 0
					: (priceDifference / ticker.open) * 100;
			const priceDifferencePercent = isNaN(tickerPercent)
				? formatPercentage(0)
				: formatPercentage(tickerPercent);
			return {
				key,
				pair,
				symbol,
				pairTwo,
				fullname,
				ticker,
				increment_price,
				increment_size,
				priceDifference,
				priceDifferencePercent,
			};
		});
		setData(market);
	};

	const handleChange = (value) => {
		let currentPair = value.replace('/', '-');
		let selectedPair = data?.filter((pair) => {
			return pair?.key === currentPair;
		});
		const filteredSelectField = options.filter((val) => val.label !== value);
		setViewMoreContents(filteredSelectField);
		setselectedPair(selectedPair);
	};

	const handleBack = () => {
		router.goBack();
	};

	let pairBase = selectedPair[0]?.key.split('-')[0];
	let pair_2 = selectedPair[0]?.key.split('-')[1];
	let pairBase_fullName;
	const tickerDiff = _get(props, 'market.ticker.close') - 0;
	Object.keys(coins).forEach((data) => {
		if (coins[data].symbol === pairBase) {
			pairBase_fullName = coins[data].fullname;
		}
	});
	const getClassnameForPriceDifferences = (priceDifferences) => {
		if (selectedPair?.[0]?.priceDifference === 0)
			return 'price-diff-none trade-tab-price_diff_none';
		if (selectedPair?.[0]?.priceDifference < 0)
			return 'price-diff-down trade-tab-price_diff_down';
		return 'price-diff-up trade-tab-price_diff_up';
	};

	const getClassnameForTickDifferences = (tickDifferences, state) => {
		if (tickDifferences === 0)
			return `glance-price-diff-none glance-trade-tab-price_diff_none ${state}`;
		if (tickDifferences < 0)
			return `glance-price-diff-down glance-trade-tab-price_diff_down ${state}`;
		return `glance-price-diff-up glance-trade-tab-price_diff_up ${state}`;
	};
	let ticker = {};
	if (selectedPair) {
		ticker = selectedPair?.[0]?.ticker;
	}

	const isFavourite = (pair) => {
		const { favourites } = props;
		return isLoggedIn() && favourites.includes(pair);
	};

	const toggleFavourite = (pair) => {
		const { addToFavourites, removeFromFavourites } = props;
		if (isLoggedIn()) {
			return isFavourite(pair)
				? removeFromFavourites(pair)
				: addToFavourites(pair);
		}
	};

	const handleViewMore = () => {
		setViewMore(true);
	};

	const handleTrade = (pair) => {
		router.push(`/trade/${pair}`);
	};

	return (
		<div className="hollaex-token-wrapper">
			{
				<div
					className="token-wrapper"
					style={{
						height: options.length > 5 ? '100%' : '80%',
						marginTop: options.length > 5 ? '10rem' : '3rem',
					}}
				>
					<div className="d-flex pb-30">
						<div className="image-container">
							<Image
								iconId={generateCoinIconId(pairBase)}
								icon={ICONS[generateCoinIconId(pairBase)]}
								wrapperClassName="coins-icon"
								imageWrapperClassName="currency-ball-image-wrapper"
							/>
						</div>
						<div className="pl-2 header-container">
							<div className="title">
								<div className="d-flex justify-content-between">
									<div>
										<span>{pairBase_fullName}</span> {pairBase?.toUpperCase()}
									</div>
									<div
										className="pl-3 pr-2"
										onClick={() => toggleFavourite(selectedPair[0]?.key)}
									>
										{isFavourite(selectedPair[0]?.key) ? (
											<div className="d-flex align-items-center star-icon">
												<span className="favourite-text">
													Remove from favourites
												</span>
												<StarFilled className="stared-market" />
											</div>
										) : (
											<div className="d-flex align-items-center">
												<span className="favourite-text-2">
													Add to favourites
												</span>
												<StarOutlined />
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="d-flex justify-content-between mt-3 mb-4">
								<div className="link" onClick={() => handleBack()}>
									&lt; Go back
								</div>
								<div className="d-flex">
									<img
										className="subHeader-icon"
										src={`${ICONS.TAB_WALLET}`}
										alt="wallet-icon"
									/>
									<div className="gray-text">
										Balance: {available_balance[`${pairBase}_available`]}{' '}
										{pairBase?.toUpperCase()}{' '}
										<Link className="link" to={'/wallet'}>
											(Open wallet)
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={`hollaex-container ${viewMore ? 'h-100' : ''}`}>
						<div className={`token-container ${viewMore ? 'h-100' : ''}`}>
							<div className="info-container">
								<div className="header-text">
									About {pairBase_fullName} ({pairBase?.toUpperCase()})
								</div>
								<div className="sub-text">
									{pairBase?.toUpperCase()} is the native token for HollaEx and
									powers the open-source white-label exchange software{' '}
									<span className="link">HollaEx Kit</span>. Holders of{' '}
									{pairBase?.toUpperCase()} are franted benefits when using the
									HollaEx system.
								</div>
								<div className="sub-text">
									With {pairBase?.toUpperCase()} anyone can create new coins and
									list tokens on their very own exchange. By donating{' '}
									{pairBase?.toUpperCase()}, new coins and trading pairs can be
									activated for trading, distribution, and price discovery.
								</div>
								{viewMore && (
									<div className="sub-text">
										{pairBase?.toUpperCase()} powers the HollaEx exchange
										ecosystem. It is used for coin activation, coin listing,
										staking and for discounts on purchases.
									</div>
								)}
								{!viewMore ? (
									<div className="sub-text">
										<span className="link" onClick={() => handleViewMore()}>
											View more
										</span>
									</div>
								) : (
									<div className="mt-3">
										{['xht', 'btc', 'eth'].includes(pairBase) ? (
											<div className="link text-left mb-4">
												<Link
													href="https://etherscan.io/token/0xD3c625F54dec647DB8780dBBe0E880eF21BA4329"
													target="blank"
												>
													View activity on blockchain
												</Link>
											</div>
										) : (
											<div>Coming Soon...</div>
										)}
										{['xht', 'btc', 'eth'].includes(pairBase) && <div>--</div>}
										<div>
											{pairBase === 'xht' && (
												<Link
													className="link text-left"
													to="/stake/details/xht?mystaking=true"
												>
													Stake {pairBase?.toUpperCase()}
												</Link>
											)}
										</div>
										{['xht', 'btc', 'eth'].includes(pairBase) && (
											<div>
												<Link
													className="link text-left"
													to={`/quick-trade/${currentPair}`}
												>
													Quick buy {pairBase?.toUpperCase()}
												</Link>
											</div>
										)}
										<div>
											{pairBase === 'xht' && (
												<Link
													className="link text-left"
													href="https://www.hollaex.com/hollaex-token-staking"
													target="blank"
												>
													More {pairBase?.toUpperCase()} info
												</Link>
											)}
										</div>
									</div>
								)}
								<div className="button-container">
									<Button
										className="button-3"
										onClick={() => handleTrade(selectedPair[0]?.key)}
									>
										TRADE {selectedPair[0]?.key.replace('-', '/')}
									</Button>
								</div>
							</div>
							<div className="trade-details-wrapper">
								<div className="trade-details-content">
									<div className="dropdown-container">
										{options.length > 1 && (
											<Select
												defaultValue={currentPair?.replace('-', '/')}
												style={{ width: '100%' }}
												className="coin-select"
												placeholder=""
												onChange={handleChange}
												options={options}
											/>
										)}
									</div>
									<div className="d-flex">
										<div>
											<div className="sub-title caps">
												<EditWrapper stringId="MARKETS_TABLE.LAST_PRICE">
													{STRINGS['MARKETS_TABLE.LAST_PRICE']}
												</EditWrapper>
											</div>
											<div className="d-flex">
												<div className="f-size-22 pr-2">{ticker?.last}</div>
												<div className="fullname white-txt">
													{coins[pair_2] && coins[pair_2].display_name}
												</div>
											</div>
										</div>
										<div className="pl-6 trade_tabs-container">
											<div className="sub-title caps">
												<EditWrapper stringId="QUICK_TRADE_COMPONENT.CHANGE_TEXT">
													{STRINGS['QUICK_TRADE_COMPONENT.CHANGE_TEXT']}
												</EditWrapper>
											</div>
											<Transition in={true} timeout={1000}>
												{(state) => (
													<div className="d-flex f-size-22">
														<div
															className={classnames(
																'title-font',
																getClassnameForPriceDifferences(
																	selectedPair?.[0]?.priceDifference
																),
																getClassnameForTickDifferences(
																	tickerDiff,
																	state
																)
															)}
														>
															{selectedPair?.[0]?.priceDifferencePercent}
														</div>
													</div>
												)}
											</Transition>
										</div>
									</div>
									<div className="chart w-100">
										<div className="fade-area"></div>
										<SparkLine
											data={
												!lineChartData ||
												!lineChartData.close ||
												(lineChartData &&
													lineChartData.close &&
													lineChartData.close.length < 2)
													? { close: [0.1, 0.1, 0.1], open: [] }
													: lineChartData
											}
											containerProps={{
												style: { height: '100%', width: '100%' },
											}}
											renderDefaultLine
										/>
									</div>
									<div className="d-flex pb-35">
										<div>
											<div className="sub-title">
												<EditWrapper stringId="QUICK_TRADE_COMPONENT.HIGH_24H">
													{STRINGS['QUICK_TRADE_COMPONENT.HIGH_24H']}
												</EditWrapper>
											</div>
											<div className="d-flex">
												<div className="f-size-16 pr-2">{ticker?.high}</div>
												<div className="fullname">
													{coins[pair_2] && coins[pair_2].display_name}
												</div>
											</div>
										</div>
										<div className="pl-6">
											<div className="sub-title">
												<EditWrapper stringId="QUICK_TRADE_COMPONENT.LOW_24H">
													{STRINGS['QUICK_TRADE_COMPONENT.LOW_24H']}
												</EditWrapper>
											</div>
											<div className="d-flex">
												<div className="f-size-16 pr-2">{ticker?.low}</div>
												<div className="fullname">
													{coins[pair_2] && coins[pair_2].display_name}
												</div>
											</div>
										</div>
									</div>
									<div className="d-flex pb-35">
										<div>
											<div className="sub-title">
												<EditWrapper stringId="QUICK_TRADE_COMPONENT.BEST_BID">
													{STRINGS['QUICK_TRADE_COMPONENT.BEST_BID']}
												</EditWrapper>
											</div>
											<div className="d-flex">
												<div className="f-size-16 pr-2">{ticker?.open}</div>
												<div className="fullname">
													{coins[pair_2] && coins[pair_2].display_name}
												</div>
											</div>
										</div>
										<div className="pl-6">
											<div className="sub-title">
												<EditWrapper stringId="QUICK_TRADE_COMPONENT.BEST_ASK">
													{STRINGS['QUICK_TRADE_COMPONENT.BEST_ASK']}
												</EditWrapper>
											</div>
											<div className="d-flex">
												<div className="f-size-16 pr-2">{ticker?.close}</div>
												<div className="fullname">
													{coins[pair_2] && coins[pair_2].display_name}
												</div>
											</div>
										</div>
									</div>
									<div>
										<div className="sub-title caps">
											<EditWrapper stringId="SUMMARY.VOLUME_24H">
												{STRINGS['SUMMARY.VOLUME_24H']}
											</EditWrapper>
										</div>
										<div className="d-flex">
											<div className="f-size-16 pr-2">{ticker?.volume}</div>
											<div className="fullname">
												{coins[pairBase] && coins[pairBase].display_name}
											</div>
										</div>
									</div>
									{viewMore && options.length > 1 && (
										<div className="paircoins-color mb-2 mt-3">MARKETS</div>
									)}
									{viewMore &&
										viewMoreContents.map((val, index) => {
											return (
												<div className="d-flex paircoins-color" key={index}>
													<Link
														to={`/trade/${val?.value?.replace('/', '-')}`}
														className="d-flex align-items-center"
													>
														<span>{val.value.toUpperCase()}</span>
														<span className="white-text pl-2">
															{
																props?.tickers[val?.value?.replace('/', '-')]
																	?.last
															}
														</span>
													</Link>
													<div className="pl-6 trade_tabs-container">
														<Transition in={true} timeout={1000}>
															{(state) => (
																<div className="d-flex f-size-22">
																	<div
																		className={classnames(
																			'title-font',
																			getClassnameForPriceDifferences(
																				selectedPair?.[0]?.priceDifference
																			),
																			getClassnameForTickDifferences(
																				tickerDiff,
																				state
																			)
																		)}
																	>
																		{selectedPair?.[0]?.priceDifferencePercent}
																	</div>
																</div>
															)}
														</Transition>
													</div>
												</div>
											);
										})}
								</div>
							</div>
						</div>
					</div>
					<div className="gray-text d-flex justify-content-center mt-5">
						Want to list your digital assets?
					</div>
					<div className="gray-text d-flex justify-content-center mt-3">
						Start your own market with HollaEx{' '}
						<Link className="link pl-2 pr-2" to="/white-label">
							white-label
						</Link>{' '}
						solutions.
					</div>
				</div>
			}
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	addToFavourites: bindActionCreators(addToFavourites, dispatch),
	removeFromFavourites: bindActionCreators(removeFromFavourites, dispatch),
});

const mapStateToProps = (store) => {
	return {
		pair: store.app.pair,
		pairs: store.app.pairs,
		tickers: store.app.tickers,
		coins: store.app.coins,
		favourites: store.app.favourites,
		available_balance: store.user.balance,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Hollaextoken));
