import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
	formatPercentage,
	formatToCurrency,
	countDecimals,
} from 'utils/currency';
import { isMobile } from 'react-device-detect';
import { SearchBox } from 'components';
import STRINGS from 'config/localizedStrings';
import { quicktradePairSelector } from 'containers/QuickTrade/components/utils';
import withConfig from 'components/ConfigProvider/withConfig';
import { getMiniCharts } from 'actions/chartAction';
import AssetsList from 'containers/DigitalAssets/components/AssetsList';

class AssetsWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			chartData: {},
			coinsData: [],
			pageSize: 10,
			page: 0,
			count: 0,
			searchValue: '',
		};
	}

	getIndexofOneDay = (dates) => {
		const currentTime = new Date().getTime(); // Current time in milliseconds
		const oneDayAgoTime = currentTime - 24 * 60 * 60 * 1000; // Time 24 hours ago in milliseconds

		// Find the index in the dates array that is within the last 24 hours
		const index = dates.findIndex((dateString) => {
			const date = new Date(dateString).getTime(); // Time of each date in the array
			return date > oneDayAgoTime; // Check if the date is within the last 24 hours
		});

		return index;
	};

	getPriceDetails = (price) => {
		const firstPrice = price[0];
		const lastPrice = price[price.length - 1];
		const priceDifference = lastPrice - firstPrice;
		const priceDifferencePercent = formatPercentage(
			priceDifference / firstPrice
		);
		const formattedNumber = (val) =>
			formatToCurrency(val, 0, val < 1 && countDecimals(val) > 8);

		const priceDifferencePercentVal = Number(
			priceDifferencePercent.replace('%', '')
		);

		return {
			priceDifference,
			priceDifferencePercent,
			priceDifferencePercentVal,
			lastPrice: formattedNumber(lastPrice),
		};
	};

	getPricingData = (chartData) => {
		const { price = [], time } = chartData || {};

		if (time?.length > 0 && price?.length > 0) {
			const {
				priceDifference,
				priceDifferencePercent,
				priceDifferencePercentVal,
				lastPrice,
			} = this.getPriceDetails(price);

			const indexOneDay = this.getIndexofOneDay(time);
			const oneDayChartPrices = price.slice(indexOneDay, price.length);

			const {
				priceDifference: oneDayPriceDifference,
				priceDifferencePercent: oneDayPriceDifferencePercent,
				priceDifferencePercentVal: oneDayPriceDifferencePercenVal,
			} = this.getPriceDetails(oneDayChartPrices);

			return {
				oneDayPriceDifference,
				oneDayPriceDifferencePercent,
				oneDayPriceDifferencePercenVal,
				priceDifference,
				priceDifferencePercent,
				priceDifferencePercentVal,
				lastPrice,
			};
		}
		return {};
	};

	getCoinsData = (coinsList, chartValues) => {
		const { coins, quicktradePairs } = this.props;
		const coinsData = coinsList
			.map((name) => {
				const { code, icon_id, symbol, fullname, type } = coins[name];

				const key = `${code}-usdt`;
				const pricingData = this.getPricingData(chartValues[key]);

				return {
					...pricingData,
					chartData: chartValues[key],
					code,
					icon_id,
					symbol,
					fullname,
					type,
					key,
					networkType: quicktradePairs[key]?.type,
				};
			})
			.filter(({ type }) => type === 'blockchain');

		this.setState({ coinsData });
		this.constructData(this.state.page);
	};

	componentDidMount() {
		const { coins } = this.props;
		const { page, searchValue } = this.state;
		this.constructData(page, searchValue);

		const coinsList = Object.keys(coins).map((val) => coins[val].code);

		getMiniCharts(coinsList.toLocaleString()).then((chartValues) => {
			this.setState({ chartData: chartValues });
			this.getCoinsData(coinsList, chartValues);
		});
	}

	componentDidUpdate(prevProps) {
		const { data } = this.props;
		const { page, searchValue } = this.state;

		if (JSON.stringify(data) !== JSON.stringify(prevProps.data)) {
			this.constructData(page, searchValue);
		}
	}

	goToPreviousPage = () => {
		const { page } = this.state;
		this.constructData(page - 1);
	};

	goToNextPage = () => {
		const { page } = this.state;
		this.constructData(page + 1);
	};

	handleTabSearch = (_, value) => {
		const { page } = this.state;
		if (value) {
			this.constructData(0, value);
		} else {
			this.constructData(page, value);
		}
		this.setState({ searchValue: value });
	};

	constructData = (page, searchValue) => {
		const { pageSize, coinsData } = this.state;
		const searchResults = this.getSearchPairs(searchValue);
		const count = coinsData.length;

		const initItem = page * pageSize;

		if (initItem < count) {
			const data = searchResults.slice(0, initItem + pageSize);
			this.setState({ data, page, count });
		} else {
			this.setState({ data: searchResults, page, count });
		}
	};

	getSearchPairs = (value = '') => {
		const { coinsData } = this.state;

		const result = [];
		const searchValue = value ? value.toLowerCase().trim() : '';

		if (!value) {
			return coinsData;
		} else {
			coinsData.forEach((data) => {
				const { key, fullname } = data;

				if (
					key.indexOf(searchValue) !== -1 ||
					fullname.toLowerCase().indexOf(searchValue) !== -1
				) {
					result.push(data);
				}
			});

			return result;
		}
	};

	handleClick = (pair) => {
		const {
			router,
			constants: { features: { pro_trade, quick_trade } = {} },
		} = this.props;
		if (pair && router) {
			if (pro_trade) {
				router.push(`/trade/${pair}`);
			} else if (quick_trade) {
				router.push(`/quick-trade/${pair}`);
			}
		}
	};

	handleAssetsClick = (pair) => {
		const { router } = this.props;
		if (pair && router) {
			router.push(`/assets/coin/${pair.split('-')[0]}`);
		}
	};

	render() {
		const { data, page, pageSize, count } = this.state;

		return (
			<div>
				<div className="d-flex justify-content-start">
					<div className={isMobile ? '' : 'w-25 pb-4'}>
						<SearchBox
							name={STRINGS['SEARCH_ASSETS']}
							className="trade_tabs-search-field"
							outlineClassName="trade_tabs-search-outline"
							placeHolder={`${STRINGS['SEARCH_ASSETS']}...`}
							handleSearch={this.handleTabSearch}
							showCross
						/>
					</div>
				</div>
				<AssetsList
					loading={!data.length}
					coinsListData={data}
					handleClick={this.handleAssetsClick}
					page={page}
					pageSize={pageSize}
					count={count}
					goToNextPage={this.goToNextPage}
					goToPreviousPage={this.goToPreviousPage}
					showPaginator={count > pageSize}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => ({
	pairs: state.app.pairs,
	constants: state.app.constants,
	coins: state.app.coins,
	quicktradePairs: quicktradePairSelector(state),
});

export default connect(mapStateToProps)(withRouter(withConfig(AssetsWrapper)));
