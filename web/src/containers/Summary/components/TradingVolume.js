import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import STRINGS from '../../../config/localizedStrings';
import { getTradeVolume } from '../../../actions/userAction';
import { BarChart } from '../../../components';
import { calculatePrice, formatToCurrency } from '../../../utils/currency';
import {
	TRADING_VOLUME_CHART_LIMITS,
	CHART_MONTHS,
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
} from '../../../config/constants';

import withConfig from 'components/ConfigProvider/withConfig';

class TradingVolume extends Component {
	state = {
		chartData: [],
		limits: TRADING_VOLUME_CHART_LIMITS,
		limitContent: [],
		peakVolume:
			TRADING_VOLUME_CHART_LIMITS[TRADING_VOLUME_CHART_LIMITS.length - 1],
		totalVolume: 0,
	};

	componentDidMount() {
		this.props.getTradeVolume();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			JSON.stringify(this.props.tradeVolumes) !==
			JSON.stringify(nextProps.tradeVolumes)
		) {
			this.constructData(nextProps.tradeVolumes.data, nextProps.coins);
		}
	}

	constructData = (tradeValues, coins) => {
		const { pairs, prices, activeTheme, icons: ICONS } = this.props;
		const chartData = [];
		let totalVolume = 0;
		let peakVolume = this.state.peakVolume;
		const { min } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const currentMonth = moment().month();
		let chartMonths = [...CHART_MONTHS];
		for (let i = 0; i <= currentMonth; i++) {
			let temp = chartMonths.shift();
			chartMonths = [...chartMonths, temp];
		}

		if (Object.keys(tradeValues).length) {
			chartMonths.map((obj, key) => {
				let trade = tradeValues[obj.key];
				let data = {
					key: obj.key,
					month: obj.value,
				};
				if (trade) {
					let total = 0;
					let pairWisePrice = {};
					let pairVolume = {};
					Object.keys(trade).map((pair) => {
						let pairValue = pairs[pair] || {};
						let volumeObj = trade[pair] || {};
						let pairPrice = calculatePrice(
							volumeObj.volume,
							pairValue.pair_base
						);
						pairWisePrice[pairValue.pair_base] = pairPrice;
						pairVolume[pairValue.pair_base] = volumeObj.volume;
						total += pairPrice;
						return total;
					});
					data.pairVolume = pairVolume;
					data.pairWisePrice = pairWisePrice;
					data.total = total;
				} else {
					data.pairVolume = {};
					data.pairWisePrice = {};
					data.total = 0;
				}
				if (peakVolume < data.total) {
					peakVolume = data.total;
				}
				totalVolume += data.total;
				chartData.push(data);
				return chartData;
			});
			const limitContent = [];
			TRADING_VOLUME_CHART_LIMITS.map((_, index) => {
				if (index === 0) {
					limitContent.push({
						icon: ICONS['SUMMARY_LEVEL_3'],
						text: STRINGS.formatString(
							STRINGS['SUMMARY.TRADER_ACCOUNT_ELIGIBILITY'],
							3
						),
					});
				} else if (index === 1) {
					limitContent.push({
						icon: ICONS['SUMMARY_LEVEL_4'],
						text: STRINGS.formatString(
							STRINGS['SUMMARY.TRADER_ACCOUNT_ELIGIBILITY'],
							4
						),
					});
				}
				return index;
			});
			peakVolume += peakVolume * 0.1;

			if (Object.keys(tradeValues).length) {
				chartMonths.map((obj, key) => {
					let trade = tradeValues[obj.key];
					let data = {
						key: obj.key,
						month: obj.value,
					};
					if (trade) {
						let total = 0;
						let pairWisePrice = {};
						let pairVolume = {};
						Object.keys(trade).map((pair) => {
							let pairValue = pairs[pair] || {};
							let volumeObj = trade[pair] || {};
							let pairPrice = calculatePrice(
								volumeObj.volume,
								pairValue.pair_base
							);
							pairWisePrice[pairValue.pair_base] = pairPrice;
							pairVolume[pairValue.pair_base] = volumeObj.volume;
							total += pairPrice;
							return total;
						});
						data.pairVolume = pairVolume;
						data.pairWisePrice = pairWisePrice;
						data.total = total;
					} else {
						data.pairVolume = {};
						data.pairWisePrice = {};
						data.total = 0;
					}
					if (peakVolume < data.total) {
						peakVolume = data.total;
					}
					totalVolume += data.total;
					chartData.push(data);
					return chartData;
				});
				const limitContent = [];
				TRADING_VOLUME_CHART_LIMITS.map((_, index) => {
					if (index === 0) {
						limitContent.push({
							icon: ICONS['SUMMARY_LEVEL_3'],
							text: STRINGS.formatString(
								STRINGS['SUMMARY.TRADER_ACCOUNT_ELIGIBILITY'],
								3
							).join(''),
						});
					} else if (index === 1) {
						limitContent.push({
							icon: ICONS['SUMMARY_LEVEL_4'],
							text: STRINGS.formatString(
								STRINGS['SUMMARY.TRADER_ACCOUNT_ELIGIBILITY'],
								4
							).join(''),
						});
					}
					return index;
				});
				peakVolume += peakVolume * 0.1;

				this.setState({
					chartData,
					limitContent,
					peakVolume,
					totalVolume: formatToCurrency(totalVolume, min),
				});
			}
		}
	};

	render() {
		const { chartData, limits, limitContent, peakVolume } = this.state;
		const { tradeVolumes, coins } = this.props;
		const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		return (
			<div className="summary-section_2">
				<div className="w-100 h-100">
					<div className="summary-content-txt">
						<div>
							{STRINGS.formatString(
								STRINGS['SUMMARY.TRADING_VOLUME_TXT_1'],
								fullname
							)}
						</div>
						<div>{STRINGS['SUMMARY.TRADING_VOLUME_TXT_2']}</div>
					</div>
					<BarChart
						loading={tradeVolumes.fetching && !tradeVolumes.fetched}
						chartData={chartData}
						peakVolume={peakVolume}
						yAxisLimits={limits}
						limitContent={limitContent}
						activeTheme={this.props.activeTheme}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	tradeVolumes: state.user.tradeVolumes,
	pairs: state.app.pairs,
	coins: state.app.coins,
	prices: state.orderbook.prices,
	activeTheme: state.app.theme,
});

const mapDispatchToProps = (dispatch) => ({
	getTradeVolume: bindActionCreators(getTradeVolume, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(TradingVolume));
