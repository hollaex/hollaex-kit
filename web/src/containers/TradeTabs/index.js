import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { Paginator, SearchBox } from '../../components';
import {
	ICONS,
	BASE_CURRENCY,
	DEFAULT_COIN_DATA
} from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	formatPercentage,
	formatAverage,
	formatToCurrency
} from '../../utils/currency';

class AddTradeTab extends Component {
	state = {
		page: 0,
		pageSize: 9,
		data: [],
		count: 0,
		searchValue: ''
	};

	componentDidMount() {
		this.goToPage(
			this.props.pairs,
			this.props.tickers,
			this.state.page,
			this.state.searchValue
		);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			JSON.stringify(this.props.pairs) !== JSON.stringify(nextProps.pairs) ||
			JSON.stringify(this.props.tickers) !== JSON.stringify(nextProps.tickers)
		) {
			this.goToPage(
				nextProps.pairs,
				nextProps.tickers,
				this.state.page,
				this.state.searchValue
			);
		}
	}

	goToPage = (pairval, tickers, page, searchValue) => {
		const { pageSize } = this.state;
		const pairs = searchValue ? this.getSearchPairs(searchValue) : pairval;
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

	goToPreviousPage = () => {
		this.goToPage(
			this.props.pairs,
			this.props.tickers,
			this.state.page - 1,
			this.state.searchValue
		);
	};

	goToNextPage = () => {
		this.goToPage(
			this.props.pairs,
			this.props.tickers,
			this.state.page + 1,
			this.state.searchValue
		);
	};

	handleTabSearch = (_, value) => {
		if (value) {
			const result = this.getSearchPairs(value);
			this.goToPage(result, this.props.tickers, 0, value);
		} else {
			this.goToPage(
				this.props.pairs,
				this.props.tickers,
				this.state.page,
				value
			);
		}
		this.setState({ searchValue: value });
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

	handleClick = (pair) => {
		let tabs = localStorage.getItem('tabs');
		tabs = tabs ? JSON.parse(tabs) : [];
		tabs.push(pair);
		localStorage.setItem('tabs', JSON.stringify(tabs));
		this.props.router.push(`/trade/${pair}`);
	};

	render() {
		const {
			activeTheme,
			pairs,
			tickers,
			coins,
			constants = {}
		} = this.props;
		const { page, pageSize, count, data } = this.state;
		let quickPair = this.props.pair || '';
		if (!this.props.pair && Object.keys(pairs).length) {
			quickPair = Object.keys(pairs)[0];
		}
		let path = constants.logo_path;
		if (activeTheme === 'dark') {
			path = constants.logo_black_path;
		}
		return (
			<div className="trade_tabs-container">
				<div className="mb-5">
					<div
						style={{ backgroundImage: `url(${path})` }}
						className="app-icon d-flex"
					>
					</div>
					<div className="text-center trade-tab-app-title">
						{STRINGS.APP_SUB_TITLE.toUpperCase()}
					</div>
				</div>
				<div className="trade_tabs-content">
					<div className="d-flex justify-content-end">
						{constants.broker_enabled
							? <span className="trade_tabs-link link-separator">
								<Link to={`/quick-trade/${quickPair}`}>
									{STRINGS.QUICK_TRADE}
								</Link>
							</span>
							: null
						}
						<span className="trade_tabs-link link-separator">
							<Link to="/account">{STRINGS.ACCOUNTS.TITLE}</Link>
						</span>
						<span className="trade_tabs-link">
							<Link to="/wallet">{STRINGS.WALLET_TITLE}</Link>
						</span>
					</div>
					<div className="w-50">
						<SearchBox
							name={STRINGS.SEARCH_ASSETS}
							className="trade_tabs-search-field"
							outlineClassName="trade_tabs-search-outline"
							placeHolder={`${STRINGS.SEARCH_ASSETS}...`}
							handleSearch={this.handleTabSearch}
						/>
					</div>
					<div className="d-flex flex-wrap p-3 my-5">
						{data.map((key, index) => {
							let pair = pairs[key] || {};
							let { fullname, symbol = '' } =
								coins[pair.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
							const pairTwo = coins[pair.pair_2] || DEFAULT_COIN_DATA;
							const { increment_price } = pair;
							let ticker = tickers[key] || {};
							const priceDifference =
								ticker.open === 0
									? 0
									: (ticker.close || 0) - (ticker.open || 0);
							const tickerPercent =
								priceDifference === 0 || ticker.open === 0
									? 0
									: (priceDifference / ticker.open) * 100;
							const priceDifferencePercent = isNaN(tickerPercent)
								? formatPercentage(0)
								: formatPercentage(tickerPercent);
							return (
								<div
									key={index}
									className={classnames('d-flex', 'trade-tab-list', 'pointer', {
										'active-tab': index === 0
									})}
									onClick={() => this.handleClick(key)}
								>
									<div className="px-2">
										<ReactSVG
											path={
												ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
													? ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
													: ICONS.DEFAULT_ICON
											}
											wrapperClassName="trade_tab-icons"
										/>
									</div>
									<div className="tabs-pair-details">
										<div className="trade_tab-pair-title">
											{symbol.toUpperCase()}/
											{pairTwo.symbol ? pairTwo.symbol.toUpperCase() : ''}
										</div>
										<div>
											{fullname}/{pairTwo.fullname}
										</div>
										<div>
											{STRINGS.PRICE}:
											<span className="title-font ml-1">
												{formatToCurrency(ticker.close, increment_price)}
											</span>
										</div>
										<div className="d-flex">
											<div
												className={
													priceDifference < 0
														? 'price-diff-down trade-tab-price_diff_down'
														: 'trade-tab-price_diff_up price-diff-up'
												}
											>
												{formatAverage(formatToCurrency(priceDifference, increment_price))}
											</div>
											<div
												className={
													priceDifference < 0
														? 'title-font ml-1 price-diff-down'
														: 'title-font ml-1 price-diff-up'
												}
											>
												{`(${priceDifferencePercent})`}
											</div>
										</div>
										<div>{`${STRINGS.CHART_TEXTS.v}: ${
											ticker.volume
											} ${symbol.toUpperCase()}`}</div>
									</div>
								</div>
							);
						})}
					</div>
					<Paginator
						currentPage={page + 1}
						pageSize={pageSize}
						count={count}
						goToPreviousPage={this.goToPreviousPage}
						goToNextPage={this.goToNextPage}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme,
	pairs: store.app.pairs,
	tickers: store.app.tickers,
	pair: store.app.pair,
	coins: store.app.coins,
	constants: store.app.constants
});

export default connect(mapStateToProps)(AddTradeTab);
