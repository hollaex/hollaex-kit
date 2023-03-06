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
import { replace } from 'utils/string';

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
}) => {
	const {
		params: { token: currentCoin },
	} = router;
	const currentCoinUpper = currentCoin?.toUpperCase();
	const currentPair = Object.keys(pairs).find((pair) =>
		pair.split('-').includes(currentCoin)
	);

	const [data, setData] = useState([]);
	const [chartData, setChartData] = useState({});
	const [options, setOptions] = useState([]);
	const [selectedPair, setselectedPair] = useState([]);
	const [lineChartData, setLineChartData] = useState({});
	const selectedPairCoins = selectedPair && selectedPair?.[0];

	useEffect(() => {
		handleMarket();
		getSparklines(Object.keys(pairs)).then((chartData) => {
			return setChartData(chartData);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pairs]);

	useEffect(() => {
		handleOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, chartData]);

	const handleOptions = () => {
		const pairOptions = [];
		const selectedPair = data.filter((pair) => {
			return pair?.key === currentPair;
		});
		const selectedPairCoin = selectedPair?.[0];
		const pairBase = selectedPairCoin?.key.split('-')[0];
		Object.keys(pairs).forEach((pair) => {
			if (pair.includes(pairBase)) {
				const replacedValue = replace(pair, '-', '/');
				pairOptions.push({
					value: replacedValue,
					label: replacedValue,
				});
			}
		});

		const ChartData = {
			...chartData[selectedPairCoin?.key],
			name: 'Line',
			type: 'line',
		};
		setLineChartData(ChartData);
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
		const currentPair = replace(value, '/', '-');
		const selectedPair = data.filter((pair) => {
			return pair?.key === currentPair;
		});
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
				<div className={`hollaex-container`}>
					<div className="info-container">
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
									label={`${STRINGS['HOLLAEX_TOKEN.TRADE']} ${replace(
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
										defaultValue={replace(currentPair, '-', '/')}
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
						</div>
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
});

const mapDispatchToProps = (dispatch) => ({
	addToFavourites: bindActionCreators(addToFavourites, dispatch),
	removeFromFavourites: bindActionCreators(removeFromFavourites, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(CoinPage));
