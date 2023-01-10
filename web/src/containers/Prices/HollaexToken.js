import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';

import { StarFilled, StarOutlined } from '@ant-design/icons';
import math from 'mathjs';
import STRINGS from 'config/localizedStrings';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { formatPercentage } from 'utils/currency';
import { Button, EditWrapper, IconTitle, Image, PriceChange } from 'components';
import SparkLine from 'containers/TradeTabs/components/SparkLine';
import { getSparklines } from 'actions/chartAction';
import withConfig from 'components/ConfigProvider/withConfig';
import { isLoggedIn } from 'utils/token';
import { addToFavourites, removeFromFavourites } from 'actions/appActions';
import { HandleReplace } from 'components/Utils/Utils';

const PAIR_2_COINS = ['xht', 'btc', 'eth'];
const ACTIVITY_BLOCKCHAIN =
	'https://etherscan.io/token/0xD3c625F54dec647DB8780dBBe0E880eF21BA4329';

const Hollaextoken = (props) => {
	const {
		pairs,
		tickers,
		coins,
		icons: ICONS,
		router,
		available_balance,
	} = props;
	const currentCoin = router.params.token;
	const currentCoinUpper = currentCoin?.toUpperCase();
	const currentPair = Object.keys(props?.pairs).find((d) =>
		d?.split('-').includes(currentCoin)
	);

	const [data, setData] = useState([]);
	const [chartData, setChartData] = useState({});
	const [options, setOptions] = useState([]);
	const [selectedPair, setselectedPair] = useState([]);
	const [viewMoreContents, setViewMoreContents] = useState([]);
	const [viewMore, setViewMore] = useState(false);
	const [lineChartData, setLineChartData] = useState({});
	const selectedPairCoins = selectedPair && selectedPair?.[0];

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
		const pairOptions = [];
		const selectedPair = data.filter((pair) => {
			return pair?.key === currentPair;
		});
		const selectedPairCoin = selectedPair?.[0];
		const pairBase = selectedPairCoin?.key.split('-')[0];
		Object.keys(pairs).forEach((pair) => {
			if (pair.includes(pairBase)) {
				const replacedValue = HandleReplace(pair, '-', '/');
				pairOptions.push({
					value: replacedValue,
					label: replacedValue,
				});
			}
		});
		const defaultValue = pairOptions.filter(
			(filteredValue) =>
				currentPair !== HandleReplace(filteredValue.value, '/', '-')
		);
		const ChartData = {
			...chartData[selectedPairCoin?.key],
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
		const market = pairKeys.map((key) => {
			const pair = pairs[key] || {};
			const { fullname, symbol = '' } =
				coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
			const pairTwo = coins[pair.pair_2] || DEFAULT_COIN_DATA;
			const { increment_price, increment_size } = pair;
			const ticker = tickers[key] || {};
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
		const currentPair = HandleReplace(value, '/', '-');
		const selectedPair = data.filter((pair) => {
			return pair?.key === currentPair;
		});
		const filteredSelectField = options.filter(({ label }) => label !== value);
		setViewMoreContents(filteredSelectField);
		setselectedPair(selectedPair);
	};

	const handleBack = () => {
		router.goBack();
	};

	const pairBase = selectedPairCoins?.key.split('-')[0];
	const pair_2 = selectedPairCoins?.key.split('-')[1];
	let pairBase_fullName;
	const pair_2_display_name = coins?.[pair_2] && coins?.[pair_2]?.display_name;
	Object.keys(coins).forEach((data) => {
		if (coins[data].symbol === currentCoin) {
			pairBase_fullName = coins[data].fullname;
		}
	});

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

	const handleTrade = (pair) => {
		router.push(`/trade/${pair}`);
	};

	const { icon_id } = coins[currentCoin];
	return (
		<div className="hollaex-token-wrapper">
			<div className="token-wrapper mt-8">
				<div className="d-flex pb-30">
					<div className="image-container">
						<IconTitle
							iconId={icon_id}
							iconPath={ICONS[icon_id]}
							wrapperClassName="coins-icon"
							imageWrapperClassName="currency-ball-image-wrapper"
						/>
					</div>
					<div className="pl-2 header-container">
						<div className="title">
							<div className="d-flex justify-content-between">
								<div>
									<span>{pairBase_fullName}</span> {currentCoinUpper}
								</div>
								<div
									className="pl-3 pr-2"
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
										<div className="d-flex align-items-center">
											<span className="favourite-text-2">
												<EditWrapper stringId="HOLLAEX_TOKEN.ADD_FAVOURITES">
													{STRINGS['HOLLAEX_TOKEN.ADD_FAVOURITES']}
												</EditWrapper>
											</span>
											<StarOutlined />
										</div>
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
				<div className={`hollaex-container ${viewMore ? 'h-100' : ''}`}>
					<div className={`token-container ${viewMore ? 'h-100' : ''}`}>
						<div className="info-container">
							<div className="header-text">
								<EditWrapper stringId="HOLLAEX_TOKEN.ABOUT">
									{STRINGS['HOLLAEX_TOKEN.ABOUT']} {pairBase_fullName} (
									{currentCoinUpper})
								</EditWrapper>
							</div>
							<div className="sub-text">
								{/* <EditWrapper stringId="HOLLAEX_TOKEN.HOLLA_INFO"> */}
								{currentCoinUpper} {STRINGS['HOLLAEX_TOKEN.HOLLA_INFO']}{' '}
								{/* </EditWrapper> */}
								<span className="link">
									{/* <EditWrapper stringId="HOLLAEX_TOKEN.HOLLAEX_KIT_TITLE"> */}
									{STRINGS['HOLLAEX_TOKEN.HOLLAEX_KIT_TITLE']}
									{/* </EditWrapper> */}
								</span>
								.{/* <EditWrapper stringId="HOLLAEX_TOKEN.HOLDER"> */}
								{STRINGS['HOLLAEX_TOKEN.HOLDER']} {/* </EditWrapper> */}{' '}
								{currentCoinUpper}
								{/* <EditWrapper stringId="HOLLAEX_TOKEN.HOLLA_INFO2"> */}
								{STRINGS['HOLLAEX_TOKEN.HOLLA_INFO2']}
								{/* </EditWrapper> */}
							</div>
							<div className="sub-text">
								{/* <EditWrapper stringId="HOLLAEX_TOKEN.WITH"> */}
								{STRINGS['HOLLAEX_TOKEN.WITH']}
								{/* </EditWrapper> */}
								{currentCoinUpper}
								{/* <EditWrapper stringId="HOLLAEX_TOKEN.HOLLA_INFO3"> */}
								{STRINGS['HOLLAEX_TOKEN.HOLLA_INFO3']} {/* </EditWrapper> */}
								{currentCoinUpper}
								{/* <EditWrapper stringId="HOLLAEX_TOKEN.HOLLA_INFO4"> */}
								{STRINGS['HOLLAEX_TOKEN.HOLLA_INFO4']}
								{/* </EditWrapper> */}
							</div>
							{viewMore && (
								<div className="sub-text">
									<EditWrapper stringId="HOLLAEX_TOKEN.HOLLA_INFO5">
										{currentCoinUpper}
										{STRINGS['HOLLAEX_TOKEN.HOLLA_INFO5']}
									</EditWrapper>
								</div>
							)}
							{!viewMore ? (
								<div
									className="link text-left mt-3"
									onClick={() => setViewMore(true)}
								>
									<EditWrapper stringId="HOLLAEX_TOKEN.VIEW">
										{STRINGS['HOLLAEX_TOKEN.VIEW']}
									</EditWrapper>
								</div>
							) : (
								<div className="mt-3">
									{PAIR_2_COINS?.includes(currentCoin) ? (
										<div className="link text-left mb-4">
											<Link href={ACTIVITY_BLOCKCHAIN} target="blank">
												<EditWrapper stringId="HOLLAEX_TOKEN.VIEW_ACTIVITY">
													{STRINGS['HOLLAEX_TOKEN.VIEW_ACTIVITY']}
												</EditWrapper>
											</Link>
										</div>
									) : (
										<EditWrapper stringId="HOLLAEX_TOKEN.COMING_SOON">
											{STRINGS['HOLLAEX_TOKEN.COMING_SOON']}
										</EditWrapper>
									)}
									{PAIR_2_COINS?.includes(currentCoin) && <div>--</div>}
									<div className="link text-left">
										{currentCoin === 'xht' && (
											<Link to="/stake/details/xht?name=mystaking">
												<EditWrapper stringId="HOLLAEX_TOKEN.STAKE">
													{STRINGS['HOLLAEX_TOKEN.STAKE']}
													{currentCoinUpper}
												</EditWrapper>
											</Link>
										)}
									</div>
									{PAIR_2_COINS?.includes(currentCoin) && (
										<div className="link text-left">
											<Link to={`/quick-trade/${currentPair}`}>
												<EditWrapper stringId="HOLLAEX_TOKEN.QUICK_BUY">
													{STRINGS['HOLLAEX_TOKEN.QUICK_BUY']}
													{currentCoinUpper}
												</EditWrapper>
											</Link>
										</div>
									)}
									<div className="link text-left">
										{currentCoin === 'xht' && (
											<Link
												href="https://www.hollaex.com/hollaex-token-staking"
												target="blank"
											>
												<EditWrapper stringId="HOLLAEX_TOKEN.MORE">
													{STRINGS['HOLLAEX_TOKEN.MORE']}
												</EditWrapper>
												{currentCoinUpper}
												<EditWrapper stringId="HOLLAEX_TOKEN.INFO">
													{STRINGS['HOLLAEX_TOKEN.INFO']}
												</EditWrapper>
											</Link>
										)}
									</div>
								</div>
							)}
							<div className="button-container">
								<EditWrapper stringId="HOLLAEX_TOKEN.TRADE">
									<Button
										label={`${STRINGS['HOLLAEX_TOKEN.TRADE']} ${HandleReplace(
											selectedPairCoins?.key,
											'-',
											'/'
										)}`}
										type="button"
										onClick={() => handleTrade(selectedPairCoins?.key)}
										className="w-100"
									/>
								</EditWrapper>
							</div>
						</div>
						<div className="trade-details-wrapper">
							<div className="trade-details-content">
								<div className="dropdown-container">
									{options?.length > 1 && (
										<Select
											defaultValue={HandleReplace(currentPair, '-', '/')}
											style={{ width: '100%' }}
											className="coin-select custom-select-input-style elevated w-100 mb-5"
											dropdownClassName="custom-select-style"
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
											<div className="fullname important-text">
												{pair_2_display_name}
											</div>
										</div>
									</div>
									<div className="pl-6 trade_tabs-container h1">
										<div className="sub-title caps">
											<EditWrapper stringId="QUICK_TRADE_COMPONENT.CHANGE_TEXT">
												{STRINGS['QUICK_TRADE_COMPONENT.CHANGE_TEXT']}
											</EditWrapper>
										</div>
										{selectedPair && selectedPair?.[0] && (
											<PriceChange market={selectedPair?.[0]} />
										)}
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
											<div className="fullname">{pair_2_display_name}</div>
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
											<div className="fullname">{pair_2_display_name}</div>
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
											<div className="fullname">{pair_2_display_name}</div>
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
											<div className="fullname">{pair_2_display_name}</div>
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
											{coins?.[pairBase] && coins?.[pairBase]?.display_name}
										</div>
									</div>
								</div>
								{viewMore && options?.length > 1 && (
									<div className="paircoins-color mb-2 mt-3">
										{STRINGS['HOLLAEX_TOKEN.MARKETS_TITLE']}
									</div>
								)}
								{viewMore &&
									viewMoreContents.map(({ value }, index) => {
										const replacedValue = HandleReplace(value, '/', '-');
										return (
											<div className="d-flex paircoins-color" key={index}>
												<Link
													to={`/trade/${replacedValue}`}
													className="d-flex align-items-center"
												>
													<span>{value.toUpperCase()}</span>
													<span className="white-text pl-2">
														{props?.tickers[replacedValue]?.last}
													</span>
												</Link>
												<div className="pl-6 trade_tabs-container h5">
													{selectedPair && selectedPair?.[0] && (
														<PriceChange market={selectedPair?.[0]} />
													)}
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</div>
				</div>
				<div className="gray-text d-flex justify-content-center mt-5">
					<EditWrapper stringId="HOLLAEX_TOKEN.LIST">
						{STRINGS['HOLLAEX_TOKEN.LIST']}
					</EditWrapper>
				</div>
				<div className="gray-text d-flex justify-content-center mt-3 pb-5">
					<EditWrapper stringId="HOLLAEX_TOKEN.START_HOLLAEX">
						{STRINGS.formatString(
							STRINGS['HOLLAEX_TOKEN.START_HOLLAEX'],
							<Link className="link pl-2 pr-2" to="/white-label">
								{STRINGS['HOLLAEX_TOKEN.WHITE_LABEL']}
							</Link>,
							STRINGS['HOLLAEX_TOKEN.SOLUTION']
						)}
					</EditWrapper>
				</div>
			</div>
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
