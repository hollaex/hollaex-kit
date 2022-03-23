import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { withRouter } from 'react-router';
import _get from 'lodash/get';

import { SearchBox } from 'components';
import MarketList from '../../TradeTabs/components/MarketList';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { getSparklines } from 'actions/chartAction';
import { EditWrapper } from 'components';
import { MarketsSelector } from 'containers/Trade/utils';

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
		const { pairs } = this.props;
		const { page, searchValue } = this.state;
		this.constructData(page, searchValue);

		getSparklines(Object.keys(pairs)).then((chartData) =>
			this.setState({ chartData })
		);
	}

	componentDidUpdate(prevProps) {
		const { markets } = this.props;
		const { page, searchValue } = this.state;

		if (JSON.stringify(markets) !== JSON.stringify(prevProps.markets)) {
			this.constructData(page, searchValue);
		}
	}

	constructData = (page, searchValue) => {
		const { pageSize } = this.state;
		const { markets } = this.props;

		const pairs = this.getSearchPairs(searchValue);
		const filteredData = markets.filter(({ key }) => pairs.includes(key));
		const count = filteredData.length;

		const initItem = page * pageSize;
		if (initItem < count) {
			const data = filteredData.slice(0, initItem + pageSize);
			this.setState({ data, page, count });
		} else {
			this.setState({ data: filteredData, page, count });
		}
	};

	getSearchPairs = (value = '') => {
		const { pairs, coins } = this.props;
		const result = [];
		const searchValue = value ? value.toLowerCase().trim() : '';

		if (!value) {
			return Object.keys(pairs);
		} else {
			Object.entries(pairs).forEach(([key, pair]) => {
				const { pair_base, pair_2 } = pair;
				const { fullname = '' } = coins[pair_base] || DEFAULT_COIN_DATA;

				if (
					key.indexOf(searchValue) !== -1 ||
					pair_base.indexOf(searchValue) !== -1 ||
					pair_2.indexOf(searchValue) !== -1 ||
					fullname.toLowerCase().indexOf(searchValue) !== -1
				) {
					result.push(key);
				}
			});

			return result;
		}
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

	handleLoadMore = () => {
		const { page, searchValue } = this.state;
		this.constructData(page + 1, searchValue);
	};

	handleClick = (pair) => {
		const { router, constants } = this.props;
		if (pair && router) {
			if (_get(constants, 'features.pro_trade')) {
				router.push(`/trade/${pair}`);
			} else if (_get(constants, 'features.quick_trade')) {
				router.push(`/quick-trade/${pair}`);
			}
		}
	};

	render() {
		const {
			showSearch = true,
			showMarkets = false,
			router,
			isHome = false,
		} = this.props;
		const { data, chartData, page, pageSize, count } = this.state;
		if (isHome) {
			this.props.renderContent(data);
		}

		return (
			<div>
				{showSearch && (
					<div className="d-flex justify-content-end">
						<div className={isMobile ? '' : 'w-25 pb-4'}>
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
					markets={data}
					chartData={chartData}
					handleClick={this.handleClick}
				/>
				{!showMarkets && page * pageSize + pageSize < count && (
					<div className="text-right">
						<span
							className="trade-account-link pointer d-flex justify-content-center"
							onClick={this.handleLoadMore}
						>
							{STRINGS['STAKE_DETAILS.VIEW_MORE']}
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
	constants: state.app.constants,
	markets: MarketsSelector(state),
});

export default connect(mapStateToProps)(withRouter(withConfig(Markets)));
