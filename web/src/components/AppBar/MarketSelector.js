import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { object, string, func } from 'prop-types';
import Image from 'components/Image';
import classnames from 'classnames';
import { StarFilled, StarOutlined } from '@ant-design/icons';

import { Slider } from 'components';
import { DEFAULT_COIN_DATA } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { formatToCurrency } from 'utils/currency';
import SearchBox from './SearchBox';
import { removeFromFavourites, addToFavourites } from 'actions/appActions';
import { isLoggedIn } from 'utils/token';
import EditWrapper from 'components/EditWrapper';
import { MarketsSelector } from 'containers/Trade/utils';

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
		};
	}

	componentDidMount() {
		const { selectedTabMenu, searchValue } = this.state;

		this.onAddTabClick(selectedTabMenu);
		this.handleSearch(undefined, searchValue);
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
		const { symbols, selectedTabMenu } = this.state;

		return symbols.map((symbol, index) => (
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
				{symbol === 'all' ? STRINGS['ALL'] : symbol.toUpperCase()}
			</div>
		));
	};

	getSymbols = (pairs) => {
		const obj = {};
		Object.entries(pairs).forEach(([key, pair]) => {
			obj[pair.pair_2] = '';
		});

		return Object.keys(obj).map((key) => key);
	};

	onAddTabClick = (symbol) => {
		const { pairs } = this.props;

		const tabResult = [];
		if (symbol === 'all') {
			this.setState({ tabResult: Object.keys(pairs), selectedTabMenu: symbol });
		} else {
			Object.entries(pairs).forEach(([key, { pair_2 }]) => {
				if (pair_2 === symbol) {
					tabResult.push(key);
				}
			});

			this.setState({ tabResult, selectedTabMenu: symbol });
		}
	};

	handleSearch = (_, value = '') => {
		const { pairs, coins } = this.props;
		const result = [];
		const searchValue = value ? value.toLowerCase().trim() : '';

		if (!value) {
			this.setState({ searchResult: Object.keys(pairs), searchValue: '' });
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

			this.setState({ searchResult: result, searchValue: value });
		}
	};

	onViewMarketsClick = () => {
		this.props.onViewMarketsClick();
		this.closeAddTabMenu();
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

	render() {
		const {
			addTradePairTab,
			wrapperClassName,
			icons: ICONS,
			constants,
			markets: allMarkets,
		} = this.props;

		const { searchResult, tabResult } = this.state;
		const { handleSearch } = this;

		const markets = allMarkets.filter(
			({ key }) => searchResult.includes(key) && tabResult.includes(key)
		);

		const tabMenuLength = markets.length;
		const hasTabMenu = tabMenuLength !== 0;

		return (
			<div className={classnames('app-bar-add-tab-menu', wrapperClassName)}>
				<div className="app-bar-tab-menu">
					<Slider small>{this.tabListMenuItems()}</Slider>
				</div>
				<div className="app-bar-add-tab-content">
					<div className="app-bar-add-tab-search">
						<SearchBox
							name={STRINGS['SEARCH_TXT']}
							placeHolder={`${STRINGS['SEARCH_TXT']}...`}
							className="app-bar-search-field"
							handleSearch={handleSearch}
						/>
					</div>
					<div
						className={classnames({
							'scroll-view': markets.length >= 10,
						})}
					>
						{hasTabMenu ? (
							markets
								.slice(0, Math.min(tabMenuLength, 10))
								.map(
									(
										{
											key,
											pair,
											symbol,
											pairTwo,
											ticker,
											increment_price,
											priceDifference,
											priceDifferencePercent,
										},
										index
									) => {
										return (
											<div
												key={index}
												className="app-bar-add-tab-content-list d-flex align-items-center justify-content-start pointer"
											>
												<div
													className="pl-3 pr-2 pointer"
													onClick={() => this.toggleFavourite(key)}
												>
													{this.isFavourite(key) ? (
														<StarFilled className="stared-market" />
													) : (
														<StarOutlined />
													)}
												</div>
												<div
													className="d-flex align-items-center justify-content-between w-100"
													onClick={() => addTradePairTab(key)}
												>
													<div className="d-flex align-items-center">
														<Image
															iconId={
																ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
																	? `${pair.pair_base.toUpperCase()}_ICON`
																	: 'DEFAULT_ICON'
															}
															icon={
																ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
																	? ICONS[
																			`${pair.pair_base.toUpperCase()}_ICON`
																	  ]
																	: ICONS.DEFAULT_ICON
															}
															wrapperClassName="app-bar-add-tab-icons"
															imageWrapperClassName="currency-ball-image-wrapper"
														/>
														<div className="app_bar-pair-font">
															{symbol.toUpperCase()}/
															{pairTwo.symbol.toUpperCase()}:
														</div>
														<div className="title-font ml-1 app-bar_add-tab-price">
															{formatToCurrency(ticker.close, increment_price)}
														</div>
													</div>
													<div className="d-flex align-items-center mr-4">
														<div
															className={
																priceDifference < 0
																	? 'app-price-diff-down app-bar-price_diff_down'
																	: 'app-bar-price_diff_up app-price-diff-up'
															}
														>
															{/* {formatAverage(formatToCurrency(priceDifference, increment_price))} */}
														</div>
														<div
															className={
																priceDifference < 0
																	? 'title-font app-price-diff-down'
																	: priceDifference > 0
																	? 'title-font app-price-diff-up'
																	: 'title-font'
															}
														>
															{priceDifferencePercent}
														</div>
													</div>
												</div>
											</div>
										);
									}
								)
						) : (
							<div className="app-bar-add-tab-content-list d-flex align-items-center">
								No data...
							</div>
						)}
					</div>
					<div className="d-flex justify-content-center app_bar-link blue-link pointer">
						{constants && constants.features && constants.features.pro_trade && (
							<div onClick={this.onViewMarketsClick}>
								<EditWrapper stringId="VIEW_MARKET">
									{STRINGS['VIEW_MARKET']}
								</EditWrapper>
							</div>
						)}
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
		app: { pairs, coins, favourites, constants },
	} = store;

	return {
		pairs,
		coins,
		favourites,
		constants,
		markets: MarketsSelector(store),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(MarketSelector));
