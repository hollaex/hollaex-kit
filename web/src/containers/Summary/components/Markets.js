import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatPercentage } from 'utils/currency';

import MarketList from '../../TradeTabs/components/MarketList';
import withConfig from 'components/ConfigProvider/withConfig';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { getSparklines } from 'actions/chartAction';

class Markets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			chartData: {},
			pageSize: 12,
			page: 0,
			searchValue: '',
		};
	}

	componentDidMount() {
		this.constructData(this.state.page, this.state.searchValue);
		getSparklines(Object.keys(this.props.pairs)).then((chartData) =>
			this.setState({ chartData })
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(this.props.pairs) !== JSON.stringify(prevProps.pairs) ||
			JSON.stringify(this.props.tickers) !== JSON.stringify(prevProps.tickers)
		) {
			this.constructData(this.state.page, this.state.searchValue);
		}
	}

	constructData = (page, searchValue) => {
		const { tickers } = this.props;
		const { pageSize } = this.state;
		const pairs = searchValue
			? this.getSearchPairs(searchValue)
			: this.props.pairs;
		const pairKeys = Object.keys(pairs).sort((a, b) => {
			let tickA = tickers[a] || {};
			let tickB = tickers[b] || {};
			return tickB.volume - tickA.volume;
		});
		const count = pairKeys.length;
		const initItem = page * pageSize;
		if (initItem < count) {
			const data = pairKeys.slice(initItem, initItem + pageSize);
			this.setState({ data, page, count });
		} else {
			this.setState({ data: pairKeys, page, count });
		}
	};

	handleClick = (pair) => {};

	render() {
		const { pairs, tickers, coins } = this.props;
		const { data, chartData } = this.state;

		const processedData = data.map((key) => {
			let pair = pairs[key] || {};
			let { fullname, symbol = '' } =
				coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
			const pairTwo = coins[pair.pair_2] || DEFAULT_COIN_DATA;
			const { increment_price } = pair;
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
				priceDifference,
				priceDifferencePercent,
			};
		});

		return (
			<div>
				<MarketList
					markets={processedData}
					chartData={chartData}
					handleClick={this.handleClick}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	tickers: state.app.tickers,
});

export default connect(mapStateToProps)(withConfig(Markets));
