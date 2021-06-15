import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatPercentage } from 'utils/currency';
import { isMobile } from 'react-device-detect';
import { withRouter } from 'react-router';
import math from 'mathjs';

import { SearchBox } from 'components';
import MarketList from '../../TradeTabs/components/MarketList';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { getSparklines } from 'actions/chartAction';
import { EditWrapper } from 'components';

class Markets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			chartData: {},
			pageSize: 10,
			page: 0,
			searchValue: '',
		};
	}

	componentDidMount() {
		this.constructData(
			this.props.pairs,
			this.state.page,
			this.state.searchValue
		);
		getSparklines(Object.keys(this.props.pairs)).then((chartData) =>
			this.setState({ chartData })
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(this.props.pairs) !== JSON.stringify(prevProps.pairs) ||
			JSON.stringify(this.props.tickers) !== JSON.stringify(prevProps.tickers)
		) {
			this.constructData(
				this.props.pairs,
				this.state.page,
				this.state.searchValue
			);
		}
	}

	constructData = (pairData, page, searchValue) => {
		const { tickers } = this.props;
		const { pageSize } = this.state;
		const pairs = searchValue ? this.getSearchPairs(searchValue) : pairData;
		const pairKeys = Object.keys(pairs).sort((a, b) => {
			const { volume: volumeA = 0, close: closeA = 0 } = tickers[a] || {};
			const { volume: volumeB = 0, close: closeB = 0 } = tickers[b] || {};
			const marketCapA = math.multiply(volumeA, closeA);
			const marketCapB = math.multiply(volumeB, closeB);
			return marketCapB - marketCapA;
		});
		const count = pairKeys.length;
		const initItem = page * pageSize;
		if (initItem < count) {
			const data = pairKeys.slice(0, initItem + pageSize);
			this.setState({ data, page, count });
		} else {
			this.setState({ data: pairKeys, page, count });
		}
	};

	getSearchPairs = (value) => {
		const { pairs, coins } = this.props;
		let result = {};
		let searchValue = value.toLowerCase().trim();
		Object.keys(pairs).map((key) => {
			let temp = pairs[key];
			const { fullname } = coins[temp.pair_base] || DEFAULT_COIN_DATA;
			let cashName = fullname ? fullname.toLowerCase() : '';
			if (
				key.indexOf(searchValue) !== -1 ||
				temp.pair_base.indexOf(searchValue) !== -1 ||
				temp.pair_2.indexOf(searchValue) !== -1 ||
				cashName.indexOf(searchValue) !== -1
			) {
				result[key] = temp;
			}
			return key;
		});
		return result;
	};

	handleTabSearch = (_, value) => {
		if (value) {
			const result = this.getSearchPairs(value);
			this.constructData(result, 0, value);
		} else {
			this.constructData(this.props.pairs, this.state.page, value);
		}
		this.setState({ searchValue: value });
	};

	handleLoadMore = () => {
		this.constructData(
			this.props.pairs,
			this.state.page + 1,
			this.state.searchValue
		);
	};

	handleClick = (pair) => {
		const { router } = this.props;
		if (pair && router) {
			router.push(`/trade/${pair}`);
		}
	};

	render() {
		const {
			pairs,
			tickers,
			coins,
			showSearch = true,
			showMarkets = false,
			router,
		} = this.props;
		const { data, chartData, page, pageSize, count } = this.state;

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
				{showSearch && (
					<div className="d-flex justify-content-end">
						<div className={isMobile ? '' : 'w-25'}>
							<SearchBox
								name={STRINGS['SEARCH_ASSETS']}
								className="trade_tabs-search-field"
								outlineClassName="trade_tabs-search-outline"
								placeHolder={`${STRINGS['SEARCH_ASSETS']}...`}
								handleSearch={this.handleTabSearch}
							/>
						</div>
					</div>
				)}
				<MarketList
					markets={processedData}
					chartData={chartData}
					handleClick={this.handleClick}
				/>
				{!showMarkets && page * pageSize + pageSize < count && (
					<div className="text-right">
						<span
							className="trade-account-link pointer"
							onClick={this.handleLoadMore}
						>
							{STRINGS['SUMMARY.VIEW_MORE_MARKETS']}
						</span>
					</div>
				)}
				{showMarkets && (
					<div className="d-flex justify-content-center app_bar-link blue-link pointer py-2 underline-text market-list__footer">
						<EditWrapper stringId="MARKETS_TABLE.VIEW_MARKETS" />
						<div
							onClick={() => {
								router.push('/trade/add/tabs');
							}}
							className="pt-1"
						>
							{STRINGS['MARKETS_TABLE.VIEW_MARKETS']}
						</div>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	tickers: state.app.tickers,
});

const MarketWrapper = withConfig(Markets);

export default connect(mapStateToProps)(withRouter(MarketWrapper));
