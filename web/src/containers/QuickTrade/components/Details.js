import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _get from 'lodash/get';
import { Coin, EditWrapper, PriceChange } from 'components';
import STRINGS from 'config/localizedStrings';
import { Radio } from 'antd';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { formatPercentage } from 'utils/currency';

const DEFAULT_CHART_OPTIONS = {
	tooltip: {
		enabled: false,
	},
	title: {
		text: null,
	},
	legend: {
		enabled: false,
	},
	chart: {
		styledMode: true,
	},
	xAxis: {
		type: 'linear',
		allowDecimals: false,
		visible: false,
	},
	yAxis: {
		visible: false,
	},
	plotOptions: {
		series: {
			className: 'main-color',
			negativeColor: true,
			marker: {
				enabled: false,
				states: {
					hover: {
						enabled: false,
					},
				},
			},
		},
	},
	pane: {
		size: '100%',
	},
	
};


const Details = ({ coins, constants, market, router, lineChartData, coinData, selectedSource, selectedTarget }) => {
	const [sevenDayData, setSevenDayData] = useState({});
	const [oneDayData, setOneDayData] = useState({});
	const [coinStats, setCoinStats] = useState({});
	const [oneDayChartData, setOneDayChartData] = useState([]);
	const [charData, setChartData] = useState([]);
	const [showSevenDay, setShowSevenDay] = useState(true);

	const { fullMarketName} = market || {};
	const { icon_id } = coinData;

	const pairBase = selectedTarget;
	const pair_2 = selectedSource;

	const getPricingData = (price) => {
		const firstPrice = price[0];
		const lastPrice = price[price.length-1];
		const priceDifference = lastPrice - firstPrice;
		const priceDifferencePercent = formatPercentage(priceDifference/firstPrice);

		const low = Math.min(...price);
		const high = Math.max(...price);

		return {
			priceDifference,
			priceDifferencePercent,
			low,
			high,
			lastPrice
		};
	}

	const getIndexofOneDay = (dates) => {
		const today = new Date(); // Current date
		const oneDayAgo = new Date(today.setDate(today.getDate() - 1)); // One day ago

		const index = dates.findIndex(dateString => {
			const date = new Date(dateString);
			return date.toDateString() === oneDayAgo.toDateString();
		});

		return index;
	}

	useEffect(() => {
		const { price, time } = lineChartData;
		if(price && time) {

			const indexOneDay = getIndexofOneDay(time);
			const oneDayChartPrices = price.slice(indexOneDay,price.length-1);
			setOneDayChartData(oneDayChartPrices);
			setOneDayData(getPricingData(oneDayChartPrices))
			setSevenDayData(getPricingData(price));

			!charData.length && setChartData(price);
			!Object.keys(coinStats).length && setCoinStats(sevenDayData);
		}
		 
	}, [lineChartData]);

	const handleClick = () => {
		if (selectedTarget && selectedSource  && router && _get(constants, 'features.pro_trade')) {
			router.push(`/trade/${selectedTarget}-${selectedSource}`);
		}
	};

	const handleDayChange = (e) => {
		const value = e.target.value;
		
		if(value === 'seven'){
			setChartData(lineChartData.price);
			setCoinStats(sevenDayData);
			setShowSevenDay(true);
			return
		}

		setShowSevenDay(false);
		setCoinStats(oneDayData);
		setChartData(oneDayChartData);
	}

	return (
		<div className="trade-details-wrapper">
			<div className="trade-details-content">
				<div className="d-flex pb-30">
					<Coin iconId={icon_id} type="CS11" />
					<div className="pl-2">
						<div className="pairs pointer" onClick={() => handleClick()}>
							{coins[pairBase] && coins[pairBase].display_name}/
							{coins[pair_2] && coins[pair_2].display_name}
						</div>
						<div className="fullname">{fullMarketName}</div>
					</div>
				</div>
				<div className="d-flex day-change-block">
					<Radio.Group onChange={handleDayChange} defaultValue="seven">
						<Radio.Button value="seven">
							{STRINGS['QUICK_TRADE_COMPONENT.7D']}
						</Radio.Button>
						<Radio.Button value="one">{STRINGS['QUICK_TRADE_COMPONENT.1D']}</Radio.Button>
					</Radio.Group>
				</div>
				<div className="d-flex">
					<div>
						<div className="sub-title caps">
							<EditWrapper stringId="MARKETS_TABLE.LAST_PRICE">
								{STRINGS['MARKETS_TABLE.LAST_PRICE']}
							</EditWrapper>
						</div>
						<div className="d-flex">
							<div className="f-size-22 pr-2">{coinStats.lastPrice}</div>
							<div className="fullname white-txt">
								{coins[pair_2] && coins[pair_2].display_name}
							</div>
						</div>
					</div>
					<div className="pl-6 trade_tabs-container">
						<div className="sub-title caps">
								{STRINGS[
									showSevenDay ? 'QUICK_TRADE_COMPONENT.CHANGE_TEXT_7D' : 
									'SUMMARY.CHANGE_24H'
								]}
						</div>
						<PriceChange 
							market={{
								priceDifference: coinStats.priceDifference,
								priceDifferencePercent: coinStats.priceDifferencePercent
							}} 
							key={selectedTarget + '-' + selectedSource} 
							large 
						/>
					</div>
				</div>
				<div className="chart w-100">
					<div className="fade-area" />
					<HighchartsReact
						highcharts={Highcharts}
						options={{
							...DEFAULT_CHART_OPTIONS,
							series: [{
								name: 'price',
								data: charData,
								pointStart: 0
							}
						]}}
						containerProps={{
							style: { height: '100%', width: '100%' },
						}}
					/>
				</div>
				<div className="d-flex pb-35">
					<div>
						<div className="sub-title">
							{STRINGS[showSevenDay ? 
								'QUICK_TRADE_COMPONENT.HIGH_7D' : 
								'QUICK_TRADE_COMPONENT.HIGH_24H'
							]}
						</div>
						<div className="d-flex">
							<div className="f-size-16 pr-2">{coinStats.high}</div>
							<div className="fullname">
								{coins[pair_2] && coins[pair_2].display_name}
							</div>
						</div>
					</div>
					<div className="pl-6">
						<div className="sub-title">
							{STRINGS[showSevenDay ?
								 'QUICK_TRADE_COMPONENT.LOW_7D' : 
								 'QUICK_TRADE_COMPONENT.LOW_24H' 
								]}
						</div>
						<div className="d-flex">
							<div className="f-size-16 pr-2">{coinStats.low}</div>
							<div className="fullname">
								{coins[pair_2] && coins[pair_2].display_name}
							</div>
						</div>
					</div>
				</div>
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
