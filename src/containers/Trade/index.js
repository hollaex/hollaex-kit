import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventListener from 'react-event-listener';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { SubmissionError, change } from 'redux-form';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router';

import { ICONS, BASE_CURRENCY } from '../../config/constants';
import { IconTitle } from '../../components';
import {
	submitOrder,
	cancelOrder,
	cancelAllOrders
} from '../../actions/orderAction';
import { getUserTrades } from '../../actions/walletActions';
import {
	changePair,
	setNotification,
	NOTIFICATIONS,
	RISKY_ORDER
} from '../../actions/appActions';

import { isLoggedIn } from '../../utils/token';
import TradeBlock from './components/TradeBlock';
import TradeBlockTabs from './components/TradeBlockTabs';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import { FORM_NAME } from './components/OrderEntryForm';
import ActiveOrders from './components/ActiveOrders';
import UserTrades from './components/UserTrades';
import TradeHistory from './components/TradeHistory';
// import PriceChart from './components/PriceChart';
import MobileTrade from './MobileTrade';
import MobileChart from './MobileChart';
import MobileOrders from './MobileOrders';
import TVChartContainer from './Chart'

import { ActionNotification, Loader, MobileBarTabs } from '../../components';

import STRINGS from '../../config/localizedStrings';
import { playBackgroundAudioNotification } from '../../utils/utils';

let priceTimeOut = '';
let sizeTimeOut = '';

class Trade extends Component {
	state = {
		activeTab: 0,
		chartHeight: 0,
		chartWidth: 0,
		symbol: '',
		cancelDelayData: [],
		priceInitialized: false,
		sizeInitialized: false
	};

	componentWillMount() {
		this.setSymbol(this.props.routeParams.pair);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.pair !== this.props.routeParams.pair) {
			this.setSymbol(nextProps.routeParams.pair);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	setSymbol = (symbol = '') => {
		this.props.getUserTrades(symbol);
		this.props.changePair(symbol);
		this.setState({ symbol: '' }, () => {
			setTimeout(() => {
				this.setState({ symbol });
			}, 1000);
		});
	};

	onSubmitOrder = (values) => {
		return submitOrder(values)
			.then((body) => {})
			.catch((err) => {
				// console.log('error', err);
				const _error = err.response
					&& err.response.data
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

	goToTransactionsHistory = () => {
		this.props.router.push('transactions');
	};

	goToPair = (pair) => {
		this.props.router.push(`/trade/${pair}`);
	};

	onResize = () => {
		if (this.chartBlock) {
			this.setState({
				chartHeight: this.chartBlock.offsetHeight || 0,
				chartWidth: this.chartBlock.offsetWidth || 0
			});
		}
	};

	openCheckOrder = (order, onConfirm) => {
		const { setNotification, fees, pairData } = this.props;
		setNotification(NOTIFICATIONS.NEW_ORDER, {
			order,
			onConfirm,
			fees,
			pairData
		});
	};

	onRiskyTrade = (order, onConfirm) => {
		const { setNotification, fees, pairData } = this.props;
		setNotification(RISKY_ORDER, {
			order,
			onConfirm,
			fees,
			pairData
		});
	};

	onPriceClick = (price) => {
		this.props.change(FORM_NAME, 'price', price);
		playBackgroundAudioNotification('orderbook_field_update');
		this.setState({ priceInitialized: true });
		priceTimeOut = setTimeout(() => {
			this.setState({ priceInitialized: false });
		}, 1500);
	};

	onAmountClick = (size) => {
		this.props.change(FORM_NAME, 'size', size);
		playBackgroundAudioNotification('orderbook_field_update');
		this.setState({ sizeInitialized: true });
		sizeTimeOut = setTimeout(() => {
			this.setState({ sizeInitialized: false });
		}, 1500);
	};

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	cancelAllOrders = () => {
		let cancelDelayData = [];
		this.props.activeOrders.map((order) => {
			cancelDelayData = [ ...cancelDelayData, order.id ];
			return '';
		});
		this.setState({ cancelDelayData });
		setTimeout(() => {
			this.props.cancelAllOrders(this.state.symbol);
		}, 700);
	}

	handleCancelOrders = (id) => {
		this.setState({ cancelDelayData: this.state.cancelDelayData.concat(id) });
		setTimeout(() => {
			this.props.cancelOrder(id);
		}, 700);
	}

	render() {
		const {
			pair,
			pairData,
			tradeHistory,
			orderbookReady,
			asks,
			bids,
			activeOrders,
			userTrades,
			balance,
			marketPrice,
			activeLanguage,
			activeTheme,
			settings,
			orderLimits,
			pairs,
			coins
		} = this.props;
		const { chartHeight, symbol, activeTab, cancelDelayData, priceInitialized, sizeInitialized } = this.state;

		if (symbol !== pair || !pairData) {
			return <Loader background={false} />;
		}

		const USER_TABS = [
			{
				title: STRINGS.ORDERS,
				children: isLoggedIn() ? <ActiveOrders cancelDelayData= {cancelDelayData} orders={activeOrders} onCancel={this.handleCancelOrders} /> :
				<div className='text-center'>
					<IconTitle
						iconPath={activeTheme==='white' ? ICONS.ACTIVE_TRADE_LIGHT : ICONS.ACTIVE_TRADE_DARK}
						textType="title"
						className="w-100"
						useSvg={true}
					/>
					<div>
						{STRINGS.formatString(
							STRINGS.ACTIVE_TRADES,
							<Link to="/login" className={classnames('blue-link', 'dialog-link', 'pointer')} >
								{STRINGS.SIGN_IN}
							</Link>
						)}
					</div>
				</div>,
				titleAction: isLoggedIn() ? (activeOrders.length > 0 && (
					<ActionNotification
						text={STRINGS.CANCEL_ALL}
						iconPath={ICONS.CANCEL_CROSS_ACTIVE}
						onClick={this.cancelAllOrders}
						status="information"
						useSvg={true}
					/>)
				
				) : ''
			},
			{
				title: STRINGS.RECENT_TRADES,
				children:   (
					isLoggedIn() ?
						<UserTrades pageSize={10} trades={userTrades} pair={pair} pairData={pairData} pairs={pairs} coins={coins} /> :
					<div className='text-center'>
						<IconTitle
							iconPath={activeTheme ==='dark' ? ICONS.TRADE_HISTORY_DARK: ICONS.TRADE_HISTORY_LIGHT }
							textType="title"
							className="w-100"
							useSvg={true}
						/>
						<div>
							{STRINGS.formatString(
								STRINGS.ACTIVE_TRADES,
								<Link to="/login" className={classnames('blue-link', 'dialog-link', 'pointer')} >
									{STRINGS.SIGN_IN}
								</Link>
							)}
						</div>
					</div>
				),
				titleAction:  isLoggedIn() ? (
					<ActionNotification
						text={STRINGS.TRANSACTION_HISTORY.TITLE}
						iconPath={ICONS.ARROW_TRANSFER_HISTORY_ACTIVE}
						onClick={this.goToTransactionsHistory}
						status="information"
						useSvg={true}
					/>
				) : ''
			}
		];

		// TODO get right base pair
		const orderbookProps = {
			symbol,
			pairData,
			baseSymbol: STRINGS[`${BASE_CURRENCY.toUpperCase()}_SHORTNAME`],
			asks,
			bids,
			onPriceClick: this.onPriceClick,
			onAmountClick: this.onAmountClick
		};

		const mobileTabs = [
			{
				title: STRINGS.TRADE_TAB_CHART,
				content: (
					<MobileChart
						pair={pair}
						pairData={pairData}
						tradeHistory={tradeHistory}
						activeLanguage={activeLanguage}
						activeTheme={activeTheme}
						symbol={symbol}
						goToPair={this.goToPair}
						orderLimits={orderLimits}
					/>
				)
			},
			{
				title: STRINGS.TRADE_TAB_TRADE,
				content: (
					<MobileTrade
						orderbookProps={orderbookProps}
						symbol={symbol}
						asks={asks}
						bids={bids}
						balance={balance}
						marketPrice={marketPrice}
						settings={settings}
						orderbookReady={orderbookReady}
						openCheckOrder={this.openCheckOrder}
						onRiskyTrade={this.onRiskyTrade}
						onSubmitOrder={this.onSubmitOrder}
						goToPair={this.goToPair}
						pair={pair}
						priceInitialized={priceInitialized}
						sizeInitialized={sizeInitialized}
					/>
				)
			},
			{
				title: STRINGS.TRADE_TAB_ORDERS,
				content: (
					<MobileOrders
						isLoggedIn={isLoggedIn()}
						activeOrders={activeOrders}
						cancelOrder={this.handleCancelOrders}
						cancelDelayData={cancelDelayData}
						cancelAllOrders={cancelAllOrders}
						goToTransactionsHistory={this.goToTransactionsHistory}
						pair={pair}
						pairData={pairData}
						pairs={pairs}
						coins={coins}
						goToPair={this.goToPair}
						userTrades={userTrades}
						activeTheme={activeTheme}
					/>
				)
			}
		];
		return (
			<div className={classnames('trade-container', 'd-flex')}>
				{isMobile ? (
					<div className="">
						<MobileBarTabs
							tabs={mobileTabs}
							activeTab={activeTab}
							setActiveTab={this.setActiveTab}
						/>
						<div className="content-with-bar d-flex">
							{mobileTabs[activeTab].content}
						</div>
					</div>
				) : (
					<div className={classnames('trade-container', 'd-flex')}>
						<EventListener target="window" onResize={this.onResize} />
						<div
							className={classnames(
								'trade-col_side_wrapper',
								'flex-column',
								'd-flex',
								'apply_rtl'
							)}
						>
							<TradeBlock isLoggedIn={isLoggedIn()} title={STRINGS.ORDERBOOK} pairData={pairData} pair={pair}>
								{orderbookReady && <Orderbook {...orderbookProps} />}
							</TradeBlock>
						</div>
						<div
							className={classnames(
								'trade-col_main_wrapper',
								'flex-column',
								'd-flex',
								'f-1',
								'overflow-x'
							)}
						>
							<div
								className={classnames(
									'trade-main_content',
									'flex-auto',
									'd-flex'
								)}
							>
								<div
									className={classnames(
										'trade-col_action_wrapper',
										'flex-column',
										'd-flex',
										'apply_rtl'
									)}
								>
									<TradeBlock title={STRINGS.ORDER_ENTRY} pairData={pairData} pair={pair}>
										<OrderEntry
											submitOrder={this.onSubmitOrder}
											openCheckOrder={this.openCheckOrder}
											onRiskyTrade={this.onRiskyTrade}
											symbol={symbol}
											balance={balance}
											asks={asks}
											bids={bids}
											marketPrice={marketPrice}
											showPopup={settings.notification.popup_order_confirmation}
											priceInitialized={priceInitialized}
											sizeInitialized={sizeInitialized}
										/>
									</TradeBlock>
								</div>
								<TradeBlock
									title={STRINGS.CHART}
									setRef={this.setChartRef}
									className="f-1 overflow-x"
									pairData={pairData} 
									pair={pair}
								>
									{pair &&
										chartHeight > 0 && (
											<TVChartContainer activeTheme={activeTheme} symbol={symbol} tradeHistory={tradeHistory} pairData={pairData}/>
										)}
								</TradeBlock>
							</div>
							<div
								className={classnames(
									'trade-tabs_content',
									'd-flex',
									'flex-column',
									'apply_rtl'
								)}
							>
								<TradeBlockTabs content={USER_TABS} /> 
							</div>
						</div>
						<div
							className={classnames(
								'trade-col_side_wrapper',
								'flex-column',
								'd-flex',
								'apply_rtl'
							)}
						>
							<TradeBlock title={STRINGS.PUBLIC_SALES} pairData={pairData} pair={pair}>
								<TradeHistory data={tradeHistory} language={activeLanguage} />
							</TradeBlock>
						</div>
					</div>
				)}
			</div>
		);
	}
}

Trade.defaultProps = {};

const mapStateToProps = (store) => {
	const pair = store.app.pair;
	const pairData = store.app.pairs[pair] || {};
	const { asks = [], bids = [] } = store.orderbook.pairsOrderbooks[pair];
	const tradeHistory = store.orderbook.pairsTrades[pair];
	const marketPrice = tradeHistory && tradeHistory.length > 0 ? tradeHistory[0].price : 1;
	let count = 0;
	const userTrades = store.wallet.trades.data.filter(
		({ symbol }) => symbol === pair && count++ < 10
	);
	count = 0;
	// const activeOrders = store.order.activeOrders.filter(
	// 	({ symbol }) => symbol === pair && count++ < 10
	// );
	const activeOrders = store.order.activeOrders.filter(
		({ symbol }) => symbol === pair
	);
	const makerFee = pairData.maker_fees || {};
	const takerFee = pairData.taker_fees || {};
	const feesData = {
		maker_fee: makerFee[store.user.verification_level],
		taker_fee: takerFee[store.user.verification_level]
	};
	const orderBookLevels = store.user.settings.interface.order_book_levels;
	const asksFilter = asks.filter(
		(ask, index) => index < orderBookLevels
	);
	const bidsFilter = bids.filter(
		(bid, index) => index < orderBookLevels
	);

	return {
		pair,
		pairData,
		pairs: store.app.pairs,
		coins: store.app.coins,
		balance: store.user.balance,
		orderbookReady: true,
		tradeHistory,
		asks: asksFilter,
		bids: bidsFilter,
		marketPrice,
		activeOrders,
		userTrades,
		activeLanguage: store.app.language,
		activeTheme: store.app.theme,
		fees: feesData,
		settings: store.user.settings,
		orderLimits: store.app.orderLimits
	};
};

const mapDispatchToProps = (dispatch) => ({
	getUserTrades: (symbol) => dispatch(getUserTrades({ symbol })),
	cancelOrder: bindActionCreators(cancelOrder, dispatch),
	cancelAllOrders: bindActionCreators(cancelAllOrders, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	changePair: bindActionCreators(changePair, dispatch),
	change: bindActionCreators(change, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
