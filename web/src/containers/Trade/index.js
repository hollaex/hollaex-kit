import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import mathjs from 'mathjs';
import EventListener from 'react-event-listener';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { SubmissionError, change } from 'redux-form';
import { isMobile } from 'react-device-detect';
import { createSelector } from 'reselect';
import debounce from 'lodash.debounce';
import { setOrderbooks } from 'actions/orderbookAction';
import { setWsHeartbeat } from 'ws-heartbeat/client';
import RGL, { WidthProvider } from 'react-grid-layout';

import { getToken } from 'utils/token';
import { WS_URL } from 'config/constants';
import { submitOrder } from 'actions/orderAction';
import { getUserTrades } from 'actions/walletActions';
import { storeLayout, getLayout, resetTools } from 'actions/toolsAction';
import {
	changePair,
	setNotification,
	NOTIFICATIONS,
	RISKY_ORDER,
	setTradeTab,
} from 'actions/appActions';
import { NORMAL_CLOSURE_CODE, isIntentionalClosure } from 'utils/webSocket';
import { isLoggedIn } from 'utils/token';
import TradeBlock from './components/TradeBlock';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import { FORM_NAME } from './components/OrderEntryForm';
import TradeHistory from './components/TradeHistory';
import MobileTrade from './MobileTrade';
import MobileChart from './MobileChart';
import TVChartContainer from './ChartContainer';
import MobileOrdersWrapper from './components/MobileOrdersWrapper';
import ActiveOrdersWrapper from './components/ActiveOrdersWrapper';
import RecentTradesWrapper from './components/RecentTradesWrapper';
import DepthChart from './components/DepthChart';
import { AddTradeTabs } from 'containers';
import { Loader, MobileBarTabs, SidebarHub } from 'components';
import STRINGS from 'config/localizedStrings';
import { playBackgroundAudioNotification } from 'utils/utils';
import withConfig from 'components/ConfigProvider/withConfig';
import { getViewport } from 'helpers/viewPort';

const GridLayout = WidthProvider(RGL);
const TOPBARS_HEIGHT = mathjs.multiply(36, 2);
const GRID_LAYOUT_MARGIN = 10; // RGL package default is 10
const PORT_ROWS_NUMBER = 34;

const defaultLayout = [
	{
		w: 5,
		h: 28,
		x: 19,
		y: 0,
		i: 'orderbook',
		isDraggable: true,
		isResizable: true,
		resizeHandles: ['se'],
	},
	{
		w: 14,
		h: 26,
		x: 0,
		y: 0,
		i: 'chart',
		isDraggable: true,
		isResizable: true,
		resizeHandles: ['se'],
	},
	{
		w: 5,
		h: 34,
		x: 14,
		y: 23,
		i: 'public_sales',
		isDraggable: true,
		isResizable: true,
		resizeHandles: ['se'],
	},
	{
		w: 5,
		h: 28,
		x: 14,
		y: 0,
		i: 'order_entry',
		isDraggable: true,
		isResizable: true,
		resizeHandles: ['se'],
	},
	{
		w: 14,
		h: 28,
		x: 0,
		y: 28,
		i: 'recent_trades',
		isDraggable: true,
		isResizable: true,
		resizeHandles: ['se'],
	},
	{
		w: 14,
		h: 26,
		x: 0,
		y: 17,
		i: 'open_orders',
		isDraggable: true,
		isResizable: true,
		resizeHandles: ['se'],
	},
	{
		w: 5,
		h: 34,
		x: 19,
		y: 23,
		i: 'wallet',
		isDraggable: true,
		isResizable: true,
		resizeHandles: ['se'],
	},
	{
		w: 10,
		h: 18,
		x: 14,
		y: 14,
		i: 'depth_chart',
		isDraggable: true,
		isResizable: true,
		resizeHandles: ['se'],
	},
];

const getDefaultLayoutByTool = (tool) =>
	defaultLayout.find(({ i }) => i === tool) || {};

const layout = getLayout().map(({ w, h, x, y, i }) => {
	const defaultItemLayout = getDefaultLayoutByTool(i);
	const itemLayout = { ...defaultItemLayout };
	if (defaultItemLayout.isResizable) {
		itemLayout.w = w;
		itemLayout.h = h;
	}

	if (defaultItemLayout.isDraggable) {
		itemLayout.x = x;
		itemLayout.y = y;
	}
	return itemLayout;
});

class Trade extends PureComponent {
	constructor(props) {
		super(props);

		const rowHeight = this.calculateRowHeight();
		this.state = {
			wsInitialized: false,
			orderbookFetched: false,
			orderbookWs: null,
			chartHeight: 0,
			chartWidth: 0,
			symbol: '',
			layout: layout.length > 0 ? layout : defaultLayout,
			rowHeight,
		};
		this.priceTimeOut = '';
		this.sizeTimeOut = '';
	}

	UNSAFE_componentWillMount() {
		const {
			isReady,
			router,
			constants: { features: { pro_trade = false } = {} } = {},
		} = this.props;
		if (!isReady || !pro_trade) {
			router.push('/summary');
		}
		this.setSymbol(this.props.routeParams.pair);
		this.initializeOrderbookWs(this.props.routeParams.pair, getToken());
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const {
			tools,
			recentTradesMarket,
			getUserTrades,
			routeParams,
		} = this.props;

		if (nextProps.routeParams.pair !== routeParams.pair) {
			this.setSymbol(nextProps.routeParams.pair);
			this.subscribe(nextProps.routeParams.pair);
			this.unsubscribe(routeParams.pair);
		} else if (nextProps.recentTradesMarket !== recentTradesMarket) {
			if (isLoggedIn()) {
				getUserTrades({ symbol: nextProps.recentTradesMarket });
			}
		}

		if (JSON.stringify(tools) !== JSON.stringify(nextProps.tools)) {
			const { layout } = this.state;
			const newItemsLayout = [];
			Object.entries(nextProps.tools)
				.filter(([, { is_visible }]) => !!is_visible)
				.forEach(([tool]) => {
					if (!layout.find(({ i }) => i === tool)) {
						const defaultItemLayout = getDefaultLayoutByTool(tool);
						newItemsLayout.push({ ...defaultItemLayout, x: 0, y: Infinity });
					}
				});
			this.setState({ layout: [...layout, ...newItemsLayout] });
		}
	}

	componentDidMount() {
		document.addEventListener('resetlayout', this.onResetLayout);
	}

	onResetLayout = () => {
		const { resetTools } = this.props;
		resetTools();
		setTimeout(
			() => this.onLayoutChange(defaultLayout, this.dispatchResizeEvent),
			1000
		);
	};

	componentWillUnmount() {
		document.removeEventListener('resetlayout', this.onResetLayout);
		clearTimeout(this.priceTimeOut);
		clearTimeout(this.sizeTimeOut);
		this.closeOrderbookSocket();
	}

	setSymbol = (symbol = '') => {
		if (isLoggedIn()) {
			this.props.getUserTrades({ symbol });
		}
		this.props.changePair(symbol);
		this.setState({ symbol: '', orderbookFetched: false }, () => {
			setTimeout(() => {
				this.setState({ symbol });
			}, 1000);
		});
	};

	onSubmitOrder = (values) => {
		return submitOrder(values)
			.then((body) => {})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;
				throw new SubmissionError({ _error });
			});
	};

	setChartRef = (el) => {
		if (el) {
			this.chartBlock = el;
			this.onResize();
		}
	};

	goToTransactionsHistory = (tab = '') => {
		this.props.router.push(`/transactions${tab ? `?${tab}` : ''} `);
	};

	goToPair = (pair) => {
		this.props.router.push(`/trade/${pair}`);
	};

	calculateRowHeight = () => {
		const [, height] = getViewport();
		const rowHeight = mathjs.subtract(
			mathjs.divide(mathjs.subtract(height, TOPBARS_HEIGHT), PORT_ROWS_NUMBER),
			GRID_LAYOUT_MARGIN
		);

		return rowHeight;
	};

	onResize = () => {
		const rowHeight = this.calculateRowHeight();
		this.setState(
			{
				rowHeight,
			},
			() => {
				if (this.chartBlock) {
					this.setState({
						chartHeight: this.chartBlock.offsetHeight || 0,
						chartWidth: this.chartBlock.offsetWidth || 0,
					});
				}
			}
		);
	};

	openCheckOrder = (order, onConfirm) => {
		const { setNotification, fees, pairData } = this.props;
		setNotification(NOTIFICATIONS.NEW_ORDER, {
			order,
			onConfirm,
			fees,
			pairData,
		});
	};

	onRiskyTrade = (order, onConfirm) => {
		const { setNotification, fees, pairData } = this.props;
		setNotification(RISKY_ORDER, {
			order,
			onConfirm,
			fees,
			pairData,
		});
	};

	onPriceClick = (price) => {
		this.props.change(FORM_NAME, 'price', price);
		playBackgroundAudioNotification(
			'orderbook_field_update',
			this.props.settings
		);
		if (this.priceRef) {
			this.priceRef.focus();
		}
	};

	onAmountClick = (size) => {
		this.props.change(FORM_NAME, 'size', size);
		playBackgroundAudioNotification(
			'orderbook_field_update',
			this.props.settings
		);
		if (this.sizeRef) this.sizeRef.focus();
	};

	focusOnSizeInput = () => {
		if (this.sizeRef) this.sizeRef.focus();
	};

	setPriceRef = (priceRef) => {
		if (priceRef) {
			this.priceRef = priceRef;
		}
	};

	setSizeRef = (sizeRef) => {
		if (sizeRef) {
			this.sizeRef = sizeRef;
		}
	};

	setActiveTab = (activeTab) => {
		const { setTradeTab } = this.props;
		setTradeTab(activeTab);
	};

	storeData = (data) => {
		this.props.setOrderbooks(data);
		this.orderCache = {};
	};

	storeOrderData = debounce(this.storeData, 250);

	initializeOrderbookWs = (symbol, token = '') => {
		let url = `${WS_URL}/stream`;
		if (token) {
			url = `${WS_URL}/stream?authorization=Bearer ${token}`;
		}

		const orderbookWs = new WebSocket(url);

		this.setState({ orderbookWs });

		orderbookWs.onopen = (evt) => {
			this.setState({ wsInitialized: true }, () => {
				const {
					routeParams: { pair },
				} = this.props;
				this.subscribe(pair);
			});

			setWsHeartbeat(orderbookWs, JSON.stringify({ op: 'ping' }), {
				pingTimeout: 60000,
				pingInterval: 25000,
			});
		};

		orderbookWs.onmessage = (evt) => {
			const data = JSON.parse(evt.data);
			if (data.topic === 'orderbook')
				switch (data.action) {
					case 'partial':
						const tempData = {
							...data,
							[data.symbol]: data.data,
						};
						delete tempData.data;
						this.orderCache = { ...this.orderCache, ...tempData };
						this.storeOrderData(this.orderCache);
						this.setState({ orderbookFetched: true });
						break;

					default:
						break;
				}
		};

		orderbookWs.onerror = (evt) => {
			console.error('orderbook socket error', evt);
		};

		orderbookWs.onclose = (evt) => {
			this.setState({ wsInitialized: false });

			if (!isIntentionalClosure(evt)) {
				setTimeout(() => {
					this.initializeOrderbookWs(this.props.routeParams.pair, getToken());
				}, 1000);
			}
		};
	};

	subscribe = (pair) => {
		const { orderbookWs, wsInitialized } = this.state;
		if (orderbookWs && wsInitialized) {
			orderbookWs.send(
				JSON.stringify({
					op: 'subscribe',
					args: [`orderbook:${pair}`],
				})
			);
		}
	};

	unsubscribe = (pair) => {
		const { orderbookWs, wsInitialized } = this.state;
		if (orderbookWs && wsInitialized) {
			orderbookWs.send(
				JSON.stringify({ op: 'unsubscribe', args: [`orderbook:${pair}`] })
			);
		}
	};

	closeOrderbookSocket = () => {
		const { orderbookWs, wsInitialized } = this.state;
		if (orderbookWs && wsInitialized) {
			orderbookWs.close(NORMAL_CLOSURE_CODE);
		}
	};

	renderTools = () => {
		const { tools } = this.props;

		return Object.entries(tools)
			.filter(([, { is_visible }]) => !!is_visible)
			.map(([key]) => this.getSectionByKey(key));
	};

	getSectionByKey = (key) => {
		const {
			pair,
			pairData,
			orderbookReady,
			balance,
			activeLanguage,
			activeTheme,
			settings,
			pairs,
			coins,
			discount,
			fees,
			recentTradesMarket,
			recentTradesMarketData,
			activeOrdersMarket,
			activeOrdersMarketData,
		} = this.props;
		const { chartHeight, symbol, orderbookFetched } = this.state;

		const orderbookProps = {
			symbol,
			pairData,
			onPriceClick: this.onPriceClick,
			onAmountClick: this.onAmountClick,
			orderbookFetched,
		};

		switch (key) {
			case 'orderbook': {
				return (
					<div key={key}>
						<TradeBlock
							stringId="TOOLS.ORDERBOOK"
							isLoggedIn={isLoggedIn()}
							title={STRINGS['TOOLS.ORDERBOOK']}
							pairData={pairData}
							pair={pair}
							tool={key}
						>
							{orderbookReady && <Orderbook {...orderbookProps} />}
						</TradeBlock>
					</div>
				);
			}
			case 'chart': {
				return (
					<div
						className={classnames('trade-main_content', 'flex-auto', 'd-flex')}
						key={key}
					>
						<TradeBlock
							stringId="TOOLS.CHART"
							title={STRINGS['TOOLS.CHART']}
							setRef={this.setChartRef}
							className="f-1 overflow-x"
							pairData={pairData}
							pair={pair}
							tool={key}
						>
							{pair && chartHeight > 0 && (
								<TVChartContainer
									activeTheme={activeTheme}
									symbol={symbol}
									// tradeHistory={tradeHistory}
									pairData={pairData}
								/>
							)}
						</TradeBlock>
					</div>
				);
			}
			case 'public_sales': {
				return (
					<div key={key}>
						<TradeBlock
							stringId="TOOLS.PUBLIC_SALES"
							title={STRINGS['TOOLS.PUBLIC_SALES']}
							pairData={pairData}
							pair={pair}
							tool={key}
						>
							<TradeHistory pairData={pairData} language={activeLanguage} />
						</TradeBlock>
					</div>
				);
			}
			case 'order_entry': {
				return (
					<div key={key}>
						<TradeBlock
							stringId="TOOLS.ORDER_ENTRY"
							title={STRINGS['TOOLS.ORDER_ENTRY']}
							pairData={pairData}
							pair={pair}
							tool={key}
						>
							<OrderEntry
								focusOnSizeInput={this.focusOnSizeInput}
								submitOrder={this.onSubmitOrder}
								openCheckOrder={this.openCheckOrder}
								onRiskyTrade={this.onRiskyTrade}
								symbol={symbol}
								balance={balance}
								fees={fees}
								showPopup={settings.notification.popup_order_confirmation}
								setPriceRef={this.setPriceRef}
								setSizeRef={this.setSizeRef}
							/>
						</TradeBlock>
					</div>
				);
			}
			case 'recent_trades': {
				return (
					<div key={key}>
						<RecentTradesWrapper
							pair={recentTradesMarket}
							pairData={recentTradesMarketData}
							discount={discount}
							pairs={pairs}
							coins={coins}
							activeTheme={activeTheme}
							isLoggedIn={isLoggedIn()}
							goToTransactionsHistory={this.goToTransactionsHistory}
							goToPair={this.goToPair}
							tool={key}
						/>
					</div>
				);
			}
			case 'open_orders': {
				return (
					<div key={key}>
						<ActiveOrdersWrapper
							pair={activeOrdersMarket}
							pairData={activeOrdersMarketData}
							discount={discount}
							pairs={pairs}
							coins={coins}
							activeTheme={activeTheme}
							isLoggedIn={isLoggedIn()}
							goToTransactionsHistory={this.goToTransactionsHistory}
							goToPair={this.goToPair}
							tool={key}
						/>
					</div>
				);
			}
			case 'wallet': {
				return (
					<div key={key}>
						<TradeBlock
							stringId="TOOLS.WALLET"
							title={STRINGS['TOOLS.WALLET']}
							className="f-1"
							tool={key}
						>
							<SidebarHub
								isLogged={isLoggedIn()}
								pair={pair}
								theme={activeTheme}
							/>
						</TradeBlock>
					</div>
				);
			}
			case 'depth_chart': {
				return (
					<div key={key}>
						<TradeBlock
							stringId="TOOLS.DEPTH_CHART"
							title={STRINGS['TOOLS.DEPTH_CHART']}
							className="f-1"
							tool={key}
						>
							<DepthChart
								containerProps={{ className: 'w-100 h-100 zoom-in' }}
							/>
						</TradeBlock>
					</div>
				);
			}
			default: {
				return null;
			}
		}
	};

	onLayoutChange = (layout = defaultLayout, cb) => {
		storeLayout(layout);
		this.setState({ layout }, () => {
			if (cb) {
				cb();
			}
		});
	};

	dispatchResizeEvent = () => window.dispatchEvent(new Event('resize'));

	onStopResize = () => {
		setTimeout(this.dispatchResizeEvent, 500);
	};

	render() {
		const {
			pair,
			pairData,
			orderbookReady,
			balance,
			activeLanguage,
			activeTheme,
			settings,
			orderLimits,
			pairs,
			coins,
			fees,
			icons,
			tools,
			activeTab,
		} = this.props;
		const { symbol, orderbookFetched, layout, rowHeight } = this.state;

		if (symbol !== pair || !pairData) {
			return <Loader background={false} />;
		}

		// TODO get right base pair
		const orderbookProps = {
			symbol,
			pairData,
			onPriceClick: this.onPriceClick,
			onAmountClick: this.onAmountClick,
			orderbookFetched,
		};

		const mobileTabs = [
			{
				title: STRINGS['TRADE_TAB_CHART'],
				content: (
					<MobileChart
						pair={pair}
						pairData={pairData}
						activeLanguage={activeLanguage}
						activeTheme={activeTheme}
						symbol={symbol}
						orderLimits={orderLimits}
					/>
				),
			},
			{
				title: STRINGS['TRADE_TAB_TRADE'],
				content: (
					<MobileTrade
						orderbookProps={orderbookProps}
						symbol={symbol}
						fees={fees}
						balance={balance}
						settings={settings}
						orderbookReady={orderbookReady}
						openCheckOrder={this.openCheckOrder}
						onRiskyTrade={this.onRiskyTrade}
						onSubmitOrder={this.onSubmitOrder}
						pair={pair}
						setPriceRef={this.setPriceRef}
						setSizeRef={this.setSizeRef}
					/>
				),
			},
			{
				title: STRINGS['TRADE_TAB_ORDERS'],
				content: (
					<MobileOrdersWrapper
						isLoggedIn={isLoggedIn()}
						goToTransactionsHistory={this.goToTransactionsHistory}
						pair={pair}
						pairData={pairData}
						pairs={pairs}
						coins={coins}
						activeTheme={activeTheme}
					/>
				),
			},
			{
				title: 'Market',
				content: (
					<AddTradeTabs
						router={this.props.router}
						onRouteChange={() => this.setActiveTab(0)}
					/>
				),
			},
		];
		return (
			<div className={classnames('trade-container', 'd-flex')}>
				{isMobile ? (
					<div className="">
						<MobileBarTabs
							showMarketSelector={activeTab !== 3}
							tabs={mobileTabs}
							activeTab={activeTab}
							setActiveTab={this.setActiveTab}
							pair={pair}
							icons={icons}
						/>
						<div className="content-with-bar d-flex">
							{mobileTabs[activeTab].content}
						</div>
					</div>
				) : (
					<div className={classnames('trade-container', 'd-flex')}>
						<EventListener target="window" onResize={this.onResize} />
						<GridLayout
							className="layout w-100"
							layout={layout}
							onLayoutChange={(layout) => this.onLayoutChange(layout)}
							onResizeStop={this.onStopResize}
							items={
								Object.entries(tools).filter(
									([, { is_visible }]) => !!is_visible
								).length
							}
							rowHeight={rowHeight}
							cols={24}
							draggableHandle=".drag-handle"
						>
							{this.renderTools()}
						</GridLayout>
					</div>
				)}
			</div>
		);
	}
}

Trade.defaultProps = {
	settings: {
		notification: {},
	},
};

const getPair = (state) => state.app.pair;
const getPairs = (state) => state.app.pairs;
const getVerificationLevel = (state) => state.user.verification_level;

const feesDataSelector = createSelector(
	getPairs,
	getPair,
	getVerificationLevel,
	(pairsData, pair, verification_level) => {
		const selectedPair = pairsData[pair] || { pair_base: '', pair_2: '' };
		const makerFee = selectedPair.maker_fees || {};
		const takerFee = selectedPair.taker_fees || {};
		const feesData = {
			maker_fee: makerFee[verification_level],
			taker_fee: takerFee[verification_level],
		};
		return feesData;
	}
);

const mapStateToProps = (state) => {
	const pair = state.app.pair;
	const pairData = state.app.pairs[pair] || { pair_base: '', pair_2: '' };

	const activeOrdersMarket = state.app.activeOrdersMarket;
	const activeOrdersMarketData = state.app.pairs[activeOrdersMarket] || {
		pair_base: '',
		pair_2: '',
	};

	const recentTradesMarket = state.app.recentTradesMarket;
	const recentTradesMarketData = state.app.pairs[recentTradesMarket] || {
		pair_base: '',
		pair_2: '',
	};

	return {
		pair,
		pairData,
		activeOrdersMarket,
		activeOrdersMarketData,
		recentTradesMarket,
		recentTradesMarketData,
		pairs: state.app.pairs,
		coins: state.app.coins,
		balance: state.user.balance,
		orderbookReady: true,
		activeLanguage: state.app.language,
		activeTheme: state.app.theme,
		fees: feesDataSelector(state),
		settings: state.user.settings,
		orderLimits: state.app.orderLimits,
		discount: state.user.discount || 0,
		isReady: state.app.isReady,
		constants: state.app.constants,
		tools: state.tools,
		activeTab: state.app.tradeTab,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getUserTrades: bindActionCreators(getUserTrades, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	change: bindActionCreators(change, dispatch),
	setOrderbooks: bindActionCreators(setOrderbooks, dispatch),
	resetTools: bindActionCreators(resetTools, dispatch),
	setTradeTab: bindActionCreators(setTradeTab, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Trade));
