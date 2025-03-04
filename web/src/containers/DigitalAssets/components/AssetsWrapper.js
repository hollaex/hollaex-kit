import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import { withRouter } from 'react-router';
import { isMobile } from 'react-device-detect';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { throttle } from 'lodash';

import AssetsCards from './AssetsCards';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import AssetsList from 'containers/DigitalAssets/components/AssetsList';
import {
	formatPercentage,
	formatToCurrency,
	countDecimals,
} from 'utils/currency';
import { SearchBox } from 'components';
import { setCoinsData, setIsRefreshAssets } from 'actions/appActions';
import { quicktradePairSelector } from 'containers/QuickTrade/components/utils';
import { getMiniCharts } from 'actions/chartAction';

function onHandleInitialLoading(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

class AssetsWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			chartData: {},
			coinsData: [],
			pageSize: 50,
			page: 0,
			count: 0,
			searchValue: '',
			isLoading: true,
			isSearchActive: false,
			selectedButton: !isMobile
				? STRINGS['DIGITAL_ASSETS.CARDS.MARKET_CAP']
				: '',
			isSelectedSort: false,
			isInputFocus: false,
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
			(priceDifference / firstPrice) * 100
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
		const { coins, quicktradePairs, setCoinsData } = this.props;
		// const topAssets = [];
		// const remainingAssets = [];
		const coinsData = coinsList
			.map((name) => {
				const {
					code,
					icon_id,
					symbol,
					fullname,
					type,
					created_at,
					increment_unit,
				} = coins[name];

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
					increment_unit,
					networkType: quicktradePairs[key]?.type,
					created_at,
				};
			})
			?.filter(({ type }) => type === 'blockchain')
			?.sort(
				(a, b) =>
					(coins[b?.symbol]?.market_cap || 0) -
					(coins[a?.symbol]?.market_cap || 0)
			);
		// pinned_assets.forEach((pin) => {
		// 	const asset = coinsData.find(({ symbol }) => symbol === pin);
		// 	if (asset) {
		// 		topAssets.push(asset);
		// 	}
		// });
		// coinsData.filter((item) => {
		// 	if (!pinned_assets.includes(item.symbol)) {
		// 		remainingAssets.push(item);
		// 		return true;
		// 	}
		// 	return false;
		// });

		this.setState({ coinsData: coinsData });
		this.constructData(this.state.page);
		setCoinsData(coinsData);
	};

	getMinicharData = async () => {
		const { coins } = this.props;
		const coinsList = Object.keys(coins).map((val) => coins[val].code);
		try {
			this.setState({ isLoading: true });
			await getMiniCharts(coinsList.toLocaleString()).then((chartValues) => {
				this.setState({ chartData: chartValues });
				this.getCoinsData(coinsList, chartValues);
			});
			this.setState({ isLoading: false });
		} catch (error) {
			console.error(error);
		}
	};

	throttledGetMinicharData = throttle(this.getMinicharData, 1000);

	async componentDidMount() {
		const { page, searchValue } = this.state;
		this.constructData(page, searchValue);

		this.getMinicharData();
		this.interval = setInterval(this.throttledGetMinicharData, 60000);
		await onHandleInitialLoading(15 * 100);
		this.setState({ isLoading: false });
		window.addEventListener('keydown', this.handleKeyPress);
	}

	componentDidUpdate(prevProps) {
		const { data } = this.props;
		const { page, searchValue } = this.state;

		if (JSON.stringify(data) !== JSON.stringify(prevProps.data)) {
			this.constructData(page, searchValue);
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		window.removeEventListener('keydown', this.handleKeyPress);
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

	handleMarket = (value) => {
		const { page, searchValue } = this.state;
		const { coinsData, coins } = this.props;

		const sortFunctions = {
			[STRINGS['DIGITAL_ASSETS.CARDS.MARKET_CAP']]: (data) =>
				data.sort(
					(a, b) =>
						(coins[b?.symbol]?.market_cap || 0) -
						(coins[a?.symbol]?.market_cap || 0)
				),
			[STRINGS['DIGITAL_ASSETS.CARDS.GAINERS']]: (data) =>
				data
					?.filter(
						({ oneDayPriceDifferencePercenVal }) =>
							(oneDayPriceDifferencePercenVal || 0) >= 0
					)
					?.sort(
						(a, b) =>
							(b.oneDayPriceDifferencePercenVal || 0) -
							(a.oneDayPriceDifferencePercenVal || 0)
					),
			[STRINGS['DIGITAL_ASSETS.CARDS.LOSERS']]: (data) =>
				data
					?.filter(
						({ oneDayPriceDifferencePercenVal }) =>
							(oneDayPriceDifferencePercenVal || 0) <= 0
					)
					?.sort(
						(a, b) =>
							(a.oneDayPriceDifferencePercenVal || 0) -
							(b.oneDayPriceDifferencePercenVal || 0)
					),
			[STRINGS['DEPOSIT_STATUS.NEW']]: (data) =>
				data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
		};

		const updatedCoinsData = sortFunctions[value]
			? sortFunctions[value](coinsData)
			: coinsData;

		this.setState(
			{
				selectedButton: value,
				coinsData: updatedCoinsData,
				isSelectedSort: false,
			},
			() => {
				this.constructData(page, searchValue);
			}
		);
	};

	handleClose = () => {
		const FORM_NAME = 'SearchForm';
		this.handleTabSearch('');
		this.props.dispatch(reset(FORM_NAME));
		this.setState({ isSearchActive: false, isInputFocus: false }, () => {
			const inputElement = document.querySelector(
				'.trade_tabs-search-field input'
			);
			if (inputElement) {
				inputElement.blur();
			}
		});
	};

	handleSelectedSort = (value) => {
		this.setState({ isSelectedSort: value });
	};

	handleInput = () => {
		this.setState({ isSearchActive: true, isInputFocus: true }, () => {
			const inputElement = document.querySelector(
				'.trade_tabs-search-field input'
			);
			if (inputElement) {
				inputElement.focus();
			}
		});
	};

	handleKeyPress = (event) => {
		const { isSearchActive } = this.state;
		const key = event.key;
		if (!isSearchActive && key === '/') {
			event.preventDefault();
			this.handleInput();
		}
		if (isSearchActive && key === 'Escape') {
			this.handleClose();
		}
	};

	render() {
		const { data, page, pageSize, count, isLoading } = this.state;
		const listButton = [
			STRINGS['DIGITAL_ASSETS.CARDS.MARKET_CAP'],
			STRINGS['DIGITAL_ASSETS.CARDS.GAINERS'],
			STRINGS['DIGITAL_ASSETS.CARDS.LOSERS'],
			STRINGS['DEPOSIT_STATUS.NEW'],
		];

		if (this.props.isRefreshAssets) {
			this.getMinicharData();
			this.props.setIsRefreshAssets(false);
			this.setState({
				selectedButton: !isMobile
					? STRINGS['DIGITAL_ASSETS.CARDS.MARKET_CAP']
					: '',
			});
		}

		return (
			<div>
				<AssetsCards loading={isLoading} />
				<div>
					<div className="custom-carousel"></div>
					<div className="d-flex justify-content-start">
						<div
							className={
								isMobile
									? 'market-button-container'
									: 'market-button-container pb-4'
							}
						>
							{!this.state.isSearchActive && isMobile && (
								<div className="market-buttons">
									{listButton?.map((button, index) => {
										return (
											<div
												className={
													this.state.selectedButton === button
														? 'market-btn opacity-full'
														: 'market-btn opacity-half'
												}
												key={index}
												onClick={() => this.handleMarket(button)}
											>
												{button}
											</div>
										);
									})}
								</div>
							)}
							{!isMobile && (
								<div className="market-buttons">
									{listButton?.map((button, index) => {
										return (
											<div
												className={
													this.state.selectedButton === button
														? 'market-btn opacity-full'
														: 'market-btn opacity-half'
												}
												key={index}
												onClick={() => this.handleMarket(button)}
											>
												{button}
											</div>
										);
									})}
								</div>
							)}
							{!this.state.isSearchActive ? (
								!isMobile ? (
									<div
										className="search-field-container search"
										onClick={() => this.handleInput()}
									>
										<SearchBox
											name={STRINGS['SEARCH_ASSETS']}
											className="trade_tabs-search-field"
											outlineClassName="trade_tabs-search-outline"
											placeHolder={`${STRINGS['SEARCH_ASSETS']}...`}
											showCross={false}
											isFocus={this.state.isInputFocus}
										/>
										<span
											className="open-icon"
											onClick={() => this.handleInput()}
										>
											/
										</span>
									</div>
								) : (
									<span
										className="trade-tab-search-icon"
										onClick={() => this.handleInput()}
									>
										<SearchOutlined rotate={90} />
									</span>
								)
							) : !isMobile ? (
								<div className="search-field-container">
									<SearchBox
										name={STRINGS['DIGITAL_ASSETS.INPUT_LABEL']}
										className="trade_tabs-search-field"
										outlineClassName="trade_tabs-search-outline"
										placeHolder={`${STRINGS['DIGITAL_ASSETS.INPUT_LABEL']}...`}
										handleSearch={this.handleTabSearch}
										showCross={false}
										isFocus={this.state.isInputFocus}
									/>
									<span
										className="close-icon"
										onClick={() => this.handleClose()}
									>
										<CloseOutlined />
									</span>
								</div>
							) : (
								<div className="search-field-mobile-container">
									<div className="search-field-container">
										<SearchBox
											name={STRINGS['DIGITAL_ASSETS.INPUT_LABEL']}
											className="trade_tabs-search-field"
											outlineClassName="trade_tabs-search-outline"
											placeHolder={`${STRINGS['DIGITAL_ASSETS.INPUT_LABEL']}...`}
											handleSearch={this.handleTabSearch}
											showCross
											isFocus={this.state.isInputFocus}
										/>
									</div>
									<div onClick={() => this.handleClose()}>
										<span className="blue-link">{STRINGS['CLOSE_TEXT']}</span>
									</div>
								</div>
							)}
						</div>
					</div>
					<AssetsList
						loading={isLoading}
						coinsListData={data}
						page={page}
						pageSize={pageSize}
						count={count}
						goToNextPage={this.goToNextPage}
						goToPreviousPage={this.goToPreviousPage}
						showPaginator={count > pageSize}
						isSelectedSort={this.state.isSelectedSort}
						handleSelectedSort={this.handleSelectedSort}
						selectedButton={this.state.selectedButton}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => ({
	pairs: state.app.pairs,
	constants: state.app.constants,
	coins: state.app.coins,
	quicktradePairs: quicktradePairSelector(state),
	coinsData: state.app.coinsData,
	pinned_assets: state.app.pinned_assets,
	isRefreshAssets: state.app.isRefreshAssets,
});

const mapDispatchToProps = (dispatch) => ({
	setCoinsData: bindActionCreators(setCoinsData, dispatch),
	dispatch,
	setIsRefreshAssets: bindActionCreators(setIsRefreshAssets, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(AssetsWrapper)));
