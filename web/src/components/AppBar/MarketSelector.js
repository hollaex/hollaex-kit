import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { StarFilled, StarOutlined, ThunderboltFilled } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import { object, string, func } from 'prop-types';
import debounce from 'lodash.debounce';

import SearchBox from './SearchBox';
import STRINGS from 'config/localizedStrings';
import classnames from 'classnames';
import EditWrapper from 'components/EditWrapper';
import { Slider, PriceChange, Coin } from 'components';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { formatToCurrency } from 'utils/currency';
import { removeFromFavourites, addToFavourites } from 'actions/appActions';
import { isLoggedIn } from 'utils/token';
import { MarketsSelector } from 'containers/Trade/utils';
import { unique } from 'utils/data';
import { Loading } from 'containers/DigitalAssets/components/utils';

class MarketSelector extends Component {
	constructor(props) {
		super(props);

		const { pairs } = this.props;
		const symbols = ['all', ...this.getSymbols(pairs)];
		const selectedTabMenu = symbols[0];

		this.state = {
			symbols,
			selectedTabMenu,
			searchValue: '',
			searchResult: [],
			tabResult: [],
			isLoading: true,
		};
	}

	debouncedSetLoadingFalse = debounce(() => {
		this.setState({ isLoading: false });
	}, 2000);

	componentDidMount() {
		const { selectedTabMenu, searchValue } = this.state;

		this.onAddTabClick(selectedTabMenu);
		this.handleSearch(searchValue);
		this.debouncedSetLoadingFalse();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { pairs } = this.props;

		if (JSON.stringify(pairs) !== JSON.stringify(nextProps.pairs)) {
			const symbols = ['all', ...this.getSymbols(pairs)];
			const selectedTabMenu = symbols[0];
			this.setState({ symbols, selectedTabMenu });
		}
	}

	tabListMenuItems = () => {
		const { symbols, selectedTabMenu, isLoading } = this.state;
		const { coins } = this.props;

		return symbols.map((symbol, index) => {
			const { display_name } = coins[symbol] || DEFAULT_COIN_DATA;
			return (
				<div
					key={index}
					className={classnames(
						'app-bar-tab-menu-list',
						'd-flex',
						'align-items-center',
						'pointer',
						{ 'active-tab': symbol === selectedTabMenu }
					)}
					onClick={() => this.onAddTabClick(symbol)}
				>
					{symbol === 'all' ? (
						isLoading ? (
							STRINGS['LOADING']
						) : (
							<span>{STRINGS['ALL']}</span>
						)
					) : isLoading ? (
						<Loading index={index} />
					) : (
						display_name
					)}
				</div>
			);
		});
	};

	getSymbols = (pairs) => {
		return unique(Object.entries(pairs).map(([_, { pair_2 }]) => pair_2));
	};

	filterData = (data, filterValue, key1, key2, key3) => {
		return data.filter((item) => {
			const value1 = item[key1] || item[key2];
			const value2 = item[key3];

			return (
				value1.toLowerCase().indexOf(filterValue) !== -1 ||
				value2?.toLowerCase()?.indexOf(filterValue) !== -1
			);
		});
	};

	onAddTabClick = (tabSymbol) => {
		const { quicktrade, markets } = this.props;
		const coinsData = this.getCoinsData(quicktrade, markets);

		const tabResult =
			tabSymbol === 'all'
				? coinsData
				: this.filterData(coinsData, tabSymbol, 'key', 'symbol', 'fullname');

		this.setState({ searchResult: tabResult, selectedTabMenu: tabSymbol });
	};

	handleSearch = (value = '') => {
		const { quicktrade, markets } = this.props;
		const { selectedTabMenu } = this.state;
		const coinsData = this.getCoinsData(quicktrade, markets);

		const searchValue = value ? value.toLowerCase().trim() : '';
		const tabResult =
			selectedTabMenu === 'all'
				? coinsData
				: this.filterData(
						coinsData,
						selectedTabMenu,
						'key',
						'symbol',
						'fullname'
				  );
		const result = !value
			? tabResult
			: this.filterData(tabResult, searchValue, 'key', 'symbol', 'fullname');

		this.setState({ searchResult: result, searchValue: value });
	};

	onViewMarketsClick = () => {
		this.props.onViewMarketsClick();
		this.closeAddTabMenu();
	};

	onViewAssetsClick = () => {
		browserHistory.push('/prices');
		if (isMobile) {
			window.location.reload();
		}
	};

	closeAddTabMenu = () => {
		const { pairs } = this.props;
		this.setState(
			{
				searchValue: '',
				searchResult: Object.keys(pairs),
			},
			() => {
				const { closeAddTabMenu = () => {} } = this.props;
				closeAddTabMenu();
			}
		);
	};

	isFavourite = (pair) => {
		const { favourites } = this.props;
		return isLoggedIn() && favourites.includes(pair);
	};

	toggleFavourite = (pair) => {
		const { addToFavourites, removeFromFavourites } = this.props;

		if (isLoggedIn()) {
			return this.isFavourite(pair)
				? removeFromFavourites(pair)
				: addToFavourites(pair);
		}
	};

	onMarketClick = (key, isQuickTrade) => {
		const { addTradePairTab } = this.props;

		addTradePairTab(key, isQuickTrade);
		this.closeAddTabMenu();
	};

	getTypeSortedData = (array) => {
		return array.sort((a, b) => {
			// Custom sorting logic: "pro" comes first
			if (a.type === 'pro' && b.type !== 'pro') {
				return -1;
			} else if (a.type !== 'pro' && b.type === 'pro') {
				return 1;
			} else {
				return 0;
			}
		});
	};

	movePinnedItems = (array) => {
		const pinnedMarkets = this.props.pinned_markets;
		const sortedArray = array.sort((a, b) => {
			// Find the first ID that differs between the two objects
			const id = pinnedMarkets.find((i) => a?.key !== b?.key);

			if (id) {
				// If a has the ID, move it to the top
				return a?.key === id ? -1 : 1;
			}

			return 0;
		});
		return sortedArray;
	};

	getCoinsData = (quicktrade, markets) =>
		this.getTypeSortedData(quicktrade).map((data) =>
			data.type === 'pro'
				? markets.find(({ key }) => key === data.symbol) || { ...data }
				: { ...data }
		);

	onHandleNavigate = () => {
		const { closeAddTabMenu = () => {} } = this.props;
		closeAddTabMenu();
		return browserHistory?.push('/prices');
	};

	render() {
		const {
			wrapperClassName,
			constants,
			markets,
			pair: activeMarket,
			quicktrade,
		} = this.props;

		const { searchResult, isLoading } = this.state;

		const tabMenuLength = markets.length;
		const hasTabMenu = tabMenuLength !== 0;
		const coinsData = this.movePinnedItems(
			searchResult || this.getCoinsData(quicktrade, markets)
		);

		return (
			<div className={classnames(wrapperClassName)}>
				<div className="app-bar-tab-menu">
					<Slider small>{this.tabListMenuItems()}</Slider>
				</div>
				<div className="app-bar-add-tab-content">
					<div className="app-bar-add-tab-search market-selector-search-wrapper">
						<SearchBox
							name={STRINGS['SEARCH_TXT']}
							placeHolder={STRINGS['SEARCH_TXT']}
							className="app-bar-search-field"
							handleSearch={(e) =>
								this.handleSearch(e.target && e.target.value)
							}
							showCross
							isFocus={true}
						/>
						{coinsData?.length > 0 && (
							<div
								className="blue-link text-underline text-align-center"
								onClick={() => this.onHandleNavigate()}
							>
								<EditWrapper stringId="VIEW_ALL_PRICES">
									<span className="text-decoration-underline">
										{STRINGS['VIEW_ALL_PRICES']}
									</span>
								</EditWrapper>
							</div>
						)}
					</div>
					<div className="scroll-view">
						{hasTabMenu && coinsData.length > 0 ? (
							coinsData.map((market, index) => {
								const {
									key,
									pair,
									ticker,
									increment_price,
									display_name,
									symbol,
									icon_id,
									type,
								} = market;

								return (
									<div
										key={index}
										className={classnames(
											'app-bar-add-tab-content-list',
											'd-flex align-items-center justify-content-start',
											'pointer',
											{ 'active-market': pair?.name === activeMarket }
										)}
									>
										{isLoading ? (
											<Loading index={index} />
										) : (
											<div
												className="pl-3 pr-2 pointer"
												onClick={() => this.toggleFavourite(key || symbol)}
											>
												{this.isFavourite(key || symbol) ? (
													<StarFilled className="stared-market" />
												) : (
													<StarOutlined />
												)}
											</div>
										)}
										<div
											className="d-flex align-items-center justify-content-between w-100"
											onClick={() =>
												this.onMarketClick(
													key || symbol,
													type && type !== 'pro'
												)
											}
										>
											{isLoading ? (
												<Loading index={index} />
											) : (
												<div className="d-flex align-items-center">
													<Coin
														iconId={pair?.icon_id || icon_id}
														type={isMobile ? 'CS8' : 'CS2'}
													/>
													<div className="app_bar-pair-font ml-1">
														{display_name}
													</div>
													{ticker && (
														<>
															<span className="app_bar-pair-font">:</span>
															<div className="title-font ml-1 mr-5 app-bar_add-tab-price">
																{formatToCurrency(
																	ticker?.close,
																	increment_price
																)}
															</div>
														</>
													)}
												</div>
											)}
											{isLoading ? (
												<Loading index={index} />
											) : (
												<span>
													<div className="d-flex align-items-center">
														<PriceChange market={market} key={key || symbol} />
													</div>
													{type && type !== 'pro' && (
														<div className="d-flex align-items-center mr-4 summary-quick-icon">
															<ThunderboltFilled />
														</div>
													)}
												</span>
											)}
										</div>
									</div>
								);
							})
						) : (
							<div className="app-bar-add-tab-content-no-market">
								{STRINGS['CANT_FIND_MARKETS']}
								<br />
								{STRINGS.formatString(
									STRINGS['TRY_VISITING_ASSETS'],
									<span
										onClick={() => this.onViewAssetsClick()}
										className="text-underline blue-link pointer"
									>
										{STRINGS['ASSETS_PAGE']}
									</span>
								)}
							</div>
						)}
						<div className="d-flex justify-content-center app_bar-link blue-link pointer view-market-btn">
							{constants && constants.features && constants.features.pro_trade && (
								<div onClick={this.onViewMarketsClick}>
									<EditWrapper stringId="VIEW_MARKET">
										<span className="text-decoration-underline">
											{STRINGS['VIEW_MARKET']}
										</span>
									</EditWrapper>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

MarketSelector.propTypes = {
	pairs: object.isRequired,
	coins: object.isRequired,
	onViewMarketsClick: func,
	addTradePairTab: func,
	wrapperClassName: string,
};

MarketSelector.defaultProps = {
	addTradePairTab: () => {},
	onViewMarketsClick: () => {},
	wrapperClassName: '',
};

const mapDispatchToProps = (dispatch) => ({
	addToFavourites: bindActionCreators(addToFavourites, dispatch),
	removeFromFavourites: bindActionCreators(removeFromFavourites, dispatch),
});

const mapStateToProps = (store) => {
	const {
		app: {
			pairs,
			coins,
			favourites,
			constants,
			pair,
			quicktrade,
			pinned_markets,
		},
	} = store;

	return {
		pair,
		pairs,
		coins,
		favourites,
		constants,
		markets: MarketsSelector(store),
		quicktrade,
		pinned_markets,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketSelector);
