import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { browserHistory } from 'react-router';
import { Dropdown } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';

import TabList from './TabList';
import MarketSelector from './MarketSelector';
import ToolsSelector from './ToolsSelector';
import STRINGS from 'config/localizedStrings';
import { Slider, EditWrapper, PriceChange, Image, Coin } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { formatToCurrency } from 'utils/currency';
import { MarketsSelector } from 'containers/Trade/utils';
import SparkLine from 'containers/TradeTabs/components/SparkLine';
import { getSparklines } from 'actions/chartAction';
import {
	changePair,
	changeSparkLineChartData,
	setIsActiveFavQuickTrade,
	setIsMarketDropdownVisible,
	setIsToolsVisible,
	setMarketRefresh,
	setTransactionPair,
} from 'actions/appActions';
import icons from 'config/icons/dark';
import { Loading } from 'containers/DigitalAssets/components/utils';
import { flipPair } from 'containers/QuickTrade/components/utils';

let isMounted = false;
class PairTabs extends Component {
	state = {
		activePairTab: '',
		refreshPairTab: 0,
		isLoading: false,
		// sparkLine: [],
	};

	componentDidMount() {
		const { router, pairs } = this.props;
		let active = '';
		if (router && router.params.pair) {
			active = router.params.pair;
		}
		const activePair =
			Object.keys(pairs).find(
				(data) => data === active || data === flipPair(active)
			) || null;
		this.setState({ activePairTab: activePair });
		this.initTabs(pairs, active);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { activePath, pairs, router, location } = nextProps;
		let active = this.state.activePairTab;

		if (this.props.activePath !== activePath && activePath !== 'trade') {
			active = '';
			this.setState({ activePairTab: active });
		}

		if (JSON.stringify(this.props.pairs) !== JSON.stringify(pairs)) {
			this.initTabs(pairs, active);
		}

		if (
			this.props.location &&
			location &&
			this.props.location.pathname !== location.pathname
		) {
			if (
				router &&
				router.params.pair &&
				location.pathname.indexOf('/trade/') === 0
			) {
				active = router.params.pair;
				this.setState({ activePairTab: active });
			} else if (router && !router.params.pair) {
				active = '';
				this.setState({ activePairTab: active });
			}
			this.initTabs(pairs, active);
		}
		if (this.props.activeLanguage !== nextProps.activeLanguage) {
			this.initTabs(pairs, active);
		}
	}

	initTabs = (pairs, activePair) => {};

	onTabClick = (pair, isQuickTrade) => {
		const {
			router,
			pairs,
			setIsActiveFavQuickTrade,
			setTransactionPair,
			changePair,
		} = this.props;
		const activePair =
			Object.keys(pairs).find(
				(data) => data === pair || data === flipPair(pair)
			) || null;
		if (pair) {
			setTransactionPair(null);
			if (isQuickTrade) {
				setIsActiveFavQuickTrade(true);
				changePair(pair);
				router.push(`/quick-trade/${pair}`);
			} else {
				router.push(`/trade/${pair}`);
			}
			this.setState({ activePairTab: activePair });
		}
	};

	onHandleMarketSelector = (visible) => {
		const { setIsToolsVisible, setIsMarketDropdownVisible } = this.props;
		setIsMarketDropdownVisible(visible);
		setIsToolsVisible(false);
	};

	onHandleToolsVisible = (visible) => {
		const { setIsToolsVisible, setIsMarketDropdownVisible } = this.props;
		setIsToolsVisible(visible);
		setIsMarketDropdownVisible(false);
	};

	setIsLoading = debounce(() => {
		this.setState({ isLoading: false });
	}, 250);

	marketRefreshHandler = () => {
		this.setState((prev) => ({
			refreshPairTab: prev.refreshPairTab + 1,
			isLoading: true,
		}));
		this.props.setMarketRefresh(true);
		this.setIsLoading();
	};

	componentWillUnmount = () => {
		this.setIsLoading && this.setIsLoading.cancel();
	};

	render() {
		const {
			activePairTab,
			// isMarketSelectorVisible,
			// isToolsSelectorVisible,
			// sparkLine,
		} = this.state;

		const {
			location,
			favourites,
			markets,
			quicktrade,
			sparkLineChartData,
			pairs,
			isMarketDropdownVisible,
			setIsMarketDropdownVisible,
			isToolsVisible,
		} = this.props;
		const market = markets.find(({ key }) => key === activePairTab) || {};
		const {
			key,
			pair: { increment_price } = {},
			ticker: { close } = {},
			display_name,
			icon_id,
		} = market;

		if (activePairTab && !isMounted) {
			isMounted = true;
			getSparklines(Object.keys(pairs)).then((chartData) =>
				this.props.changeSparkLineChartData(chartData)
			);
		}

		const filterQuickTrade = quicktrade.filter(({ type }) => type !== 'pro');
		return (
			<div className="d-flex justify-content-between">
				<div className="market-bar d-flex align-items-center title-font apply_rtl">
					<div className="d-flex h-100">
						<div
							className={classnames(
								'app_bar-pair-content',
								'd-flex',
								'justify-content-between',
								'market-trigger',
								{
									'active-tab-pair': location.pathname === '/markets',
								},
								{
									'active-market-trigger': activePairTab,
								}
							)}
						>
							<Dropdown
								key={this.state.refreshPairTab}
								id="selector-nav-container"
								className="market-selector-dropdown"
								overlayClassName="market-selector-dropdown-wrapper"
								overlay={
									<MarketSelector
										onViewMarketsClick={() => browserHistory.push('/markets')}
										addTradePairTab={this.onTabClick}
										closeAddTabMenu={() => {
											setIsMarketDropdownVisible(!isMarketDropdownVisible);
										}}
										wrapperClassName="app-bar-add-tab-menu"
									/>
								}
								destroyPopupOnHide={true}
								mouseEnterDelay={0}
								mouseLeaveDelay={0.05}
								trigger={['click']}
								visible={isMarketDropdownVisible}
								onVisibleChange={(visible) =>
									this.onHandleMarketSelector(visible)
								}
							>
								<div
									className={
										activePairTab
											? 'selected-market-tab selector-trigger market-dropdown-selector app_bar-pair-tab'
											: 'selector-trigger market-dropdown-selector market-dropdown-selector-inactive app_bar-pair-tab'
									}
								>
									{activePairTab ? (
										<div className="app_bar-pair-font d-flex align-items-center justify-content-between">
											{!this.state.isLoading ? (
												<span className="d-flex align-items-center justify-content-between">
													<Coin iconId={icon_id} type="CS4" />
													<div className="app_bar-currency-txt ml-1">
														{display_name}:
													</div>
													<div className="title-font ml-1">
														{formatToCurrency(close, increment_price)}
													</div>
													<PriceChange
														className="markets-drop-down"
														market={market}
														key={key}
													/>
												</span>
											) : (
												<Loading index={0} />
											)}
											<SparkLine
												data={
													!sparkLineChartData[key] ||
													(sparkLineChartData[key] &&
														sparkLineChartData[key].close &&
														sparkLineChartData[key].close.length < 2)
														? { close: [0.1, 0.1, 0.1], open: [] }
														: sparkLineChartData[key]
												}
												containerProps={{
													style: { height: '100%', width: '100%' },
												}}
												key={this.state.refreshPairTab}
											/>
										</div>
									) : (
										<div className="d-flex align-items-center">
											<Image
												icon={icons['FOOTER_TRADING_ACTIVE']}
												wrapperClassName="trading-icon"
											/>
											<span className="ml-1">
												<EditWrapper stringId="ADD_TRADING_PAIR">
													<span className="market-select-text">
														{STRINGS['ADD_TRADING_PAIR']}
													</span>
												</EditWrapper>
											</span>
										</div>
									)}
									{!this.state.activePairTab && isMarketDropdownVisible ? (
										<CaretUpOutlined />
									) : (
										!this.state.activePairTab && <CaretDownOutlined />
									)}
								</div>
							</Dropdown>
						</div>
					</div>
					<div
						id="favourite-nav-container"
						className="h-100 w-100 favourite-list border-left"
					>
						<Slider small autoHideArrows={true} containerClass="h-100">
							{favourites && favourites.length > 0 && (
								<TabList
									items={favourites}
									markets={[...filterQuickTrade, ...markets]}
									activePairTab={activePairTab}
									onTabClick={this.onTabClick}
									isLoading={this.state.isLoading}
									key={this.state.refreshPairTab}
								/>
							)}
						</Slider>
					</div>
					{location.pathname.indexOf('/trade/') === 0 && (
						<div className="d-flex h-100 tools-button border-left">
							<div
								className={classnames(
									'app_bar-pair-content',
									'market-trigger',
									'd-flex',
									'justify-content-between',
									'px-2'
								)}
							>
								<div
									className="selector-trigger narrow app_bar-pair-tab tools w-100 h-100"
									onClick={() => this.marketRefreshHandler()}
								>
									<Image
										icon={icons['REFRESH_ICON']}
										wrapperClassName="trading-icon"
									/>
								</div>
							</div>
						</div>
					)}
					{location.pathname.indexOf('/trade/') === 0 && (
						<div className="d-flex h-100 tools-button border-left">
							<div
								className={classnames(
									'app_bar-pair-content',
									'market-trigger',
									'd-flex',
									'justify-content-between',
									'px-2'
								)}
							>
								<Dropdown
									className="market-selector-dropdown"
									overlay={<ToolsSelector />}
									mouseEnterDelay={0}
									mouseLeaveDelay={0.05}
									trigger={['click']}
									visible={isToolsVisible}
									onVisibleChange={(visible) =>
										this.onHandleToolsVisible(visible)
									}
								>
									<div className="selector-trigger narrow app_bar-pair-tab tools w-100 h-100">
										<Image
											icon={icons['INTERFACE_OPTION_ICON']}
											wrapperClassName="trading-icon"
										/>
									</div>
								</Dropdown>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		app: {
			language: activeLanguage,
			pairs,
			favourites,
			constants,
			quicktrade,
			sparkLineChartData,
			isMarketDropdownVisible,
			isToolsVisible,
			isMarketRefresh,
		},
		orderbook: { prices },
	} = state;

	return {
		activeLanguage,
		pairs,
		prices,
		favourites,
		constants,
		markets: MarketsSelector(state),
		quicktrade,
		sparkLineChartData,
		isMarketDropdownVisible,
		isToolsVisible,
		isMarketRefresh,
	};
};

const mapDispatchToProps = (dispatch) => ({
	changeSparkLineChartData: bindActionCreators(
		changeSparkLineChartData,
		dispatch
	),
	setIsMarketDropdownVisible: bindActionCreators(
		setIsMarketDropdownVisible,
		dispatch
	),
	setIsToolsVisible: bindActionCreators(setIsToolsVisible, dispatch),
	setMarketRefresh: bindActionCreators(setMarketRefresh, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	setIsActiveFavQuickTrade: bindActionCreators(
		setIsActiveFavQuickTrade,
		dispatch
	),
	setTransactionPair: bindActionCreators(setTransactionPair, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(PairTabs));
