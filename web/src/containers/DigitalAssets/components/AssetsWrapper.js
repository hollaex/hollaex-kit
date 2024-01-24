import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
	formatPercentage,
	formatToCurrency,
	countDecimals,
} from 'utils/currency';
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
		};
	}

	getPricingData = (chartData) => {
		const { price = [] } = chartData || {};
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

	getCoinsData = (coinsList, chartValues) => {
		const { coins, quicktradePairs } = this.props;
		const coinsData = coinsList.map((name) => {
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
		});

		this.setState({ coinsData });
		this.constructData(this.state.page);
	};

	componentDidMount() {
		const { coins } = this.props;
		const { page } = this.state;
		this.constructData(page);

		const coinsList = Object.keys(coins).map((val) => coins[val].code);

		getMiniCharts(coinsList.toLocaleString()).then((chartValues) => {
			this.setState({ chartData: chartValues });
			this.getCoinsData(coinsList, chartValues);
		});
	}

	componentDidUpdate(prevProps) {
		const { data, selectedSource } = this.props;
		const { page } = this.state;

		if (
			JSON.stringify(data) !== JSON.stringify(prevProps.data) ||
			selectedSource !== prevProps.selectedSource
		) {
			this.constructData(page);
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

	getCoinsList = (coinsData) => {
		const { selectedSource } = this.props;

		if (!!selectedSource.length && selectedSource !== 'all') {
			return coinsData.filter(
				({ networkType }) => networkType === selectedSource
			);
		}

		return coinsData;
	};

	constructData = (page) => {
		const { pageSize, coinsData } = this.state;

		const allData = this.getCoinsList(coinsData);
		const count = allData.length;
		const initItem = page * pageSize;

		if (initItem < count) {
			const data = allData.slice(0, initItem + pageSize);
			this.setState({ data, page, count });
		} else {
			this.setState({ data: allData, page, count });
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
