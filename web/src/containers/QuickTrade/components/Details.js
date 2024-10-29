import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';
import { Radio } from 'antd';

import classNames from 'classnames';
import STRINGS from 'config/localizedStrings';
import { Coin, EditWrapper, PriceChange } from 'components';
import {
	formatPercentage,
	formatToCurrency,
	countDecimals,
} from 'utils/currency';
import { MiniSparkLine } from 'containers/TradeTabs/components/MiniSparkLine';
import { getLastValuesFromParts } from 'utils/array';

const Details = ({
	pair,
	coins,
	brokerUsed,
	networkName,
	isNetwork,
	router,
	coinChartData,
	showTradeFees,
	showOnlyTitle,
}) => {
	const [sevenDayData, setSevenDayData] = useState({});
	const [oneDayData, setOneDayData] = useState({});
	const [coinStats, setCoinStats] = useState({});
	const [oneDayChartData, setOneDayChartData] = useState([]);
	const [sevenDayChartData, setSevenDayChartData] = useState([]);
	const [chartData, setChartData] = useState([]);
	const [showSevenDay, setShowSevenDay] = useState(true);

	const [pairBase, pair_2] = pair.split('-');

	const { icon_id } = coins[pairBase];

	const getPricingData = (price) => {
		const firstPrice = price[0];
		const lastPrice = price[price.length - 1];
		const priceDifference = lastPrice - firstPrice;
		const priceDifferencePercent = formatPercentage(
			(priceDifference / firstPrice) * 100
		);
		const minVal = Math.min(...price);
		const high = Math.max(...price);

		const formattedNumber = (val) =>
			formatToCurrency(val, 0, val < 1 && countDecimals(val) > 8);

		return {
			priceDifference,
			priceDifferencePercent,
			low: formattedNumber(minVal),
			high: formattedNumber(high),
			lastPrice: formattedNumber(lastPrice),
		};
	};

	const getIndexofOneDay = (dates) => {
		const currentTime = new Date().getTime(); // Current time in milliseconds
		const oneDayAgoTime = currentTime - 24 * 60 * 60 * 1000; // Time 24 hours ago in milliseconds

		// Find the index in the dates array that is within the last 24 hours
		const index = dates.findIndex((dateString) => {
			const date = new Date(dateString).getTime(); // Time of each date in the array
			return date > oneDayAgoTime; // Check if the date is within the last 24 hours
		});

		return index;
	};

	useEffect(() => {
		const handleDataUpdate = () => {
			const { price, time } = coinChartData;
			if (price && time) {
				const indexOneDay = getIndexofOneDay(time);
				const oneDayChartPrices = price.slice(indexOneDay, price.length);
				setOneDayChartData(getLastValuesFromParts(oneDayChartPrices));
				setOneDayData(getPricingData(oneDayChartPrices));
				setSevenDayChartData(getLastValuesFromParts(price));
				setSevenDayData(getPricingData(price));
			}
		};

		handleDataUpdate();
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coinChartData, pair]);

	useEffect(() => {
		const renderSevenDays = () => {
			setTimeout(() => {
				setCoinStats(sevenDayData);
				setChartData([...sevenDayChartData]);
			}, 0);
		};

		const renderOneDay = () => {
			setTimeout(() => {
				setCoinStats(oneDayData);
				setChartData([...oneDayChartData]);
			}, 0);
		};

		showSevenDay ? renderSevenDays() : renderOneDay();
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showSevenDay, oneDayData, sevenDayData, pair]);

	const handleClick = () => {
		if (!isNetwork && !brokerUsed) {
			router.push(`/trade/${pair}`);
		} else if (isNetwork && brokerUsed) {
			router.push(`/quick-trade/${pair}`);
		} else {
			router.push(`/prices/coin/${pair.split('-')[0]}`);
		}
	};

	const handleDayChange = (e) => {
		const value = e.target.value;
		setShowSevenDay(value === 'seven');
	};

	const getLink = (linkUrl, linkText, noLine) => {
		return (
			<div
				className={classNames('blue-link pointer', {
					'underline-text': !noLine,
				})}
			>
				<Link to={linkUrl}>{linkText}</Link>
			</div>
		);
	};

	const getMarketName = () => {
		return (
			<div className="fullname">
				{isNetwork ? (
					<span>
						<EditWrapper stringId="QUICK_TRADE_COMPONENT.SOURCE_TEXT">
							{STRINGS['QUICK_TRADE_COMPONENT.SOURCE_TEXT_NETWORK']}
						</EditWrapper>
					</span>
				) : !brokerUsed ? (
					<span>
						<span>{networkName} </span>
						<span>
							<EditWrapper stringId="TYPES_VALUES.market">
								{STRINGS['TYPES_VALUES.market']}
							</EditWrapper>
						</span>
					</span>
				) : (
					<span>
						<EditWrapper stringId="QUICK_TRADE_COMPONENT.SOURCE_TEXT">
							{STRINGS['QUICK_TRADE_COMPONENT.SOURCE_TEXT']}
						</EditWrapper>
					</span>
				)}
			</div>
		);
	};

	return (
		<div className="trade-details-wrapper">
			<div className="trade-details-content">
				<div className="d-flex">
					<Coin iconId={icon_id} type="CS12" />
					<div className="pl-18">
						<div
							className={classNames('pairs pointer', {
								underline: !isNetwork && !brokerUsed,
							})}
							onClick={handleClick}
						>
							{coins[pairBase] && coins[pairBase].display_name}
						</div>
						{getMarketName()}
					</div>
				</div>
				{!showOnlyTitle && (
					<>
						<div className="day-change-block">
							<Radio.Group onChange={handleDayChange} defaultValue="seven">
								<Radio.Button value="seven">
									{STRINGS['QUICK_TRADE_COMPONENT.7D']}
								</Radio.Button>
								<Radio.Button value="one">
									{STRINGS['QUICK_TRADE_COMPONENT.1D']}
								</Radio.Button>
							</Radio.Group>
						</div>
						<div className="d-flex graph-row justify-content-between">
							<div>
								<div className="sub-title caps">
									{STRINGS['MARKETS_TABLE.LAST_PRICE']}
								</div>
								<div className="d-flex">
									<div className="f-size-22 pr-2">{coinStats.lastPrice}</div>
									<div className="fullname white-txt">
										{coins[pair_2] && coins[pair_2].display_name}
									</div>
								</div>
							</div>
							<div className="trade_tabs-container">
								<div className="sub-title caps">
									{
										STRINGS[
											showSevenDay
												? 'QUICK_TRADE_COMPONENT.CHANGE_TEXT_7D'
												: 'SUMMARY.CHANGE_24H'
										]
									}
								</div>
								<PriceChange
									market={{
										priceDifference: coinStats.priceDifference,
										priceDifferencePercent: coinStats.priceDifferencePercent,
									}}
									key={pair}
									large
								/>
							</div>
						</div>
						<div className="chart w-100">
							<div className="fade-area" />
							<MiniSparkLine chartData={chartData} isArea />
						</div>
						<div className="d-flex justify-content-between pb-24">
							<div>
								<div className="sub-title">
									{
										STRINGS[
											showSevenDay
												? 'QUICK_TRADE_COMPONENT.HIGH_7D'
												: 'QUICK_TRADE_COMPONENT.HIGH_24H'
										]
									}
								</div>
								<div className="d-flex">
									<div className="f-size-16 pr-2">{coinStats.high}</div>
									<div className="fullname">
										{coins[pair_2] && coins[pair_2].display_name}
									</div>
								</div>
							</div>
							<div className="trade_tabs-container">
								<div className="sub-title">
									{
										STRINGS[
											showSevenDay
												? 'QUICK_TRADE_COMPONENT.LOW_7D'
												: 'QUICK_TRADE_COMPONENT.LOW_24H'
										]
									}
								</div>
								<div className="d-flex">
									<div className="f-size-16 pr-2">{coinStats.low}</div>
									<div className="fullname">
										{coins[pair_2] && coins[pair_2].display_name}
									</div>
								</div>
							</div>
						</div>
						<div className="d-flex pb-40">
							{showTradeFees ? (
								<div>
									{getLink(
										`/fees-and-limits`,
										STRINGS['FEES_AND_LIMITS.COIN_PAGE_LINK'],
										true
									)}
								</div>
							) : (
								<div>
									<div className="sub-title caps">{STRINGS['ASSET_INFO']}</div>
									{getLink(
										`/prices/coin/${pairBase}`,
										STRINGS.formatString(
											STRINGS['QUICK_TRADE_COMPONENT.COIN_INFORMATION'],
											coins[pairBase].display_name
										)
									)}
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	pairs: store.app.pairs,
	coins: store.app.coins,
	constants: store.app.constants,
});

export default connect(mapStateToProps)(withRouter(Details));
