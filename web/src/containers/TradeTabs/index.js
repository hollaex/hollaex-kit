import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getSparklines } from 'actions/chartAction';
import { isMobile } from 'react-device-detect';
import math from 'mathjs';

import MarketCards from './components/MarketCards';
import MarketList from './components/MarketList';
import Toggle from './components/Toggle';
import { SearchBox } from 'components';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import { formatPercentage } from 'utils/currency';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import Image from 'components/Image';

class AddTradeTab extends Component {
	state = {
		page: 0,
		pageSize: 12,
		data: [],
		count: 0,
		searchValue: '',
		selected: isMobile ? 'List' : 'Card',
		options: [{ value: 'List' }, { value: 'Card' }],
		chartData: {},
	};

	componentDidMount() {
		const { pairs, tickers } = this.props;
		this.goToPage(pairs, tickers, this.state.page, this.state.searchValue);

		getSparklines(Object.keys(pairs)).then((chartData) =>
			this.setState({ chartData })
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
			const { volume: volumeA = 0, close: closeA = 0 } = tickers[a] || {};
			const { volume: volumeB = 0, close: closeB = 0 } = tickers[b] || {};
			const marketCapA = math.multiply(volumeA, closeA);
			const marketCapB = math.multiply(volumeB, closeB);
			return marketCapB - marketCapA;
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
		this.setState({ selected });
	};

	render() {
		const { pairs, tickers, coins, constants = {}, icons: ICONS } = this.props;
		const {
			page,
			pageSize,
			count,
			data,
			selected,
			options,
			chartData,
		} = this.state;
		const { handleClick, goToPreviousPage, goToNextPage } = this;

		let quickPair = this.props.pair || '';
		if (!this.props.pair && Object.keys(pairs).length) {
			quickPair = Object.keys(pairs)[0];
		}

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
						<div className="w-50">
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
						{selected === 'List' ? (
							<MarketList
								markets={processedData}
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
								markets={processedData}
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
});

export default connect(mapStateToProps)(withConfig(AddTradeTab));
