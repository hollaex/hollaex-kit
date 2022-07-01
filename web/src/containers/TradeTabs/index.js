import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getSparklines } from 'actions/chartAction';
import { isMobile } from 'react-device-detect';

import MarketCards from './components/MarketCards';
import MarketList from './components/MarketList';
import Toggle from './components/Toggle';
import { SearchBox } from 'components';
import { DEFAULT_COIN_DATA } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import { MARKET_OPTIONS } from 'config/options';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import Image from 'components/Image';
import { MarketsSelector } from 'containers/Trade/utils';

class AddTradeTab extends Component {
	state = {
		page: 0,
		pageSize: 12,
		data: [],
		count: 0,
		searchValue: '',
		selected: isMobile ? MARKET_OPTIONS[0].value : MARKET_OPTIONS[0].value,
		options: MARKET_OPTIONS,
		chartData: {},
	};

	componentDidMount() {
		const { pairs } = this.props;
		const { page, searchValue } = this.state;
		this.goToPage(page, searchValue);

		getSparklines(Object.keys(pairs)).then((chartData) =>
			this.setState({ chartData })
		);
		const value = localStorage.getItem('isMarketView');
		if (value) {
			this.setState({ selected: value });
		}
	}

	componentDidUpdate(prevProps) {
		const { markets } = this.props;
		const { page, searchValue } = this.state;

		if (JSON.stringify(markets) !== JSON.stringify(prevProps.markets)) {
			this.goToPage(page, searchValue);
		}
	}

	goToPage = (page, searchValue) => {
		const { pageSize } = this.state;
		const { markets } = this.props;

		const pairs = this.getSearchPairs(searchValue);
		const filteredData = markets.filter(({ key }) => pairs.includes(key));
		const count = filteredData.length;

		const initItem = page * pageSize;
		if (initItem < count) {
			const data = filteredData.slice(initItem, initItem + pageSize);
			this.setState({ data, page, count });
		} else {
			this.setState({ data: filteredData, page, count });
		}
	};

	goToPreviousPage = () => {
		const { page, searchValue } = this.state;
		this.goToPage(page - 1, searchValue);
	};

	goToNextPage = () => {
		const { page, searchValue } = this.state;
		this.goToPage(page + 1, searchValue);
	};

	handleTabSearch = (_, value) => {
		const { page } = this.state;
		if (value) {
			this.goToPage(0, value);
		} else {
			this.goToPage(page, value);
		}
		this.setState({ searchValue: value });
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

	handleClick = (pair) => {
		const { onRouteChange = () => {} } = this.props;
		let tabs = localStorage.getItem('tabs');
		tabs = tabs ? JSON.parse(tabs) : [];
		tabs.push(pair);
		localStorage.setItem('tabs', JSON.stringify(tabs));
		this.props.router.push(`/trade/${pair}`);
		// called to change the active tab in mobile version (temporary)
		onRouteChange();
	};

	onToggle = () => {
		const { options } = this.state;
		const selected =
			this.state.selected === options[0].value
				? options[1].value
				: options[0].value;
		localStorage.setItem('isMarketView', selected);
		this.setState({ selected });
	};

	render() {
		const { pairs, constants = {}, icons: ICONS } = this.props;
		const {
			page,
			pageSize,
			count,
			selected,
			options,
			chartData,
			data,
		} = this.state;
		const { handleClick, goToPreviousPage, goToNextPage } = this;

		let quickPair = this.props.pair || '';
		if (!this.props.pair && Object.keys(pairs).length) {
			quickPair = Object.keys(pairs)[0];
		}

		return (
			<Fragment>
				<div id="trade-header-section"></div>
				<div className="trade_tabs-container">
					{!isMobile && (
						<div className="mb-5">
							<Image
								iconId="EXCHANGE_LOGO"
								icon={ICONS['EXCHANGE_LOGO']}
								wrapperClassName="app-icon d-flex"
							/>
							<div className="text-center trade-tab-app-title">
								<EditWrapper stringId="APP_SUB_TITLE" iconId="EXCHANGE_LOGO">
									{STRINGS['APP_SUB_TITLE'].toUpperCase()}
								</EditWrapper>
							</div>
						</div>
					)}
					<div className="trade_tabs-content">
						{!isMobile && (
							<div className="d-flex justify-content-end">
								{constants &&
								constants.features &&
								constants.features.quick_trade ? (
									<span className="trade_tabs-link link-separator">
										<Link to={`/quick-trade/${quickPair}`}>
											{STRINGS['QUICK_TRADE']}
										</Link>
									</span>
								) : null}
								<span className="trade_tabs-link link-separator">
									<Link to="/account">{STRINGS['ACCOUNTS.TITLE']}</Link>
								</span>
								<span className="trade_tabs-link">
									<Link to="/wallet">{STRINGS['WALLET_TITLE']}</Link>
								</span>
							</div>
						)}
						<div className="d-flex align-items-center justify-content-between">
							<div className="w-50 pb-4">
								<SearchBox
									name={STRINGS['SEARCH_ASSETS']}
									className="trade_tabs-search-field"
									outlineClassName="trade_tabs-search-outline"
									placeHolder={`${STRINGS['SEARCH_ASSETS']}...`}
									handleSearch={this.handleTabSearch}
								/>
							</div>
							<div className="mt-2">
								<Toggle
									selected={selected}
									options={options}
									toggle={this.onToggle}
								/>
							</div>
						</div>
						<Fragment>
							{selected === options[0].value ? (
								<MarketList
									markets={data}
									chartData={chartData}
									handleClick={handleClick}
									page={page}
									pageSize={pageSize}
									count={count}
									goToNextPage={goToNextPage}
									goToPreviousPage={goToPreviousPage}
									showPaginator={true}
								/>
							) : (
								<MarketCards
									markets={data}
									chartData={chartData}
									page={page}
									pageSize={pageSize}
									count={count}
									handleClick={handleClick}
									goToNextPage={goToNextPage}
									goToPreviousPage={goToPreviousPage}
								/>
							)}
						</Fragment>
					</div>
				</div>
				<div id="trade-footer-section"></div>
			</Fragment>
		);
	}
}

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme,
	pairs: store.app.pairs,
	tickers: store.app.tickers,
	pair: store.app.pair,
	coins: store.app.coins,
	constants: store.app.constants,
	markets: MarketsSelector(store),
});

export default connect(mapStateToProps)(withConfig(AddTradeTab));
