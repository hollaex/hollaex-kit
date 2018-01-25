import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventListener from 'react-event-listener';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';

import { ICONS } from '../../config/constants';
import {
	submitOrder,
	cancelOrder,
	cancelAllOrders
} from '../../actions/orderAction';
import { getUserTrades } from '../../actions/walletActions';
import { setNotification, NOTIFICATIONS } from '../../actions/appActions';

import TradeBlock from './components/TradeBlock';
import TradeBlockTabs from './components/TradeBlockTabs';
import Orderbook from './components/Orderbook';
import OrderEntry from './components/OrderEntry';
import ActiveOrders from './components/ActiveOrders';
import UserTrades from './components/UserTrades';
import TradeHistory from './components/TradeHistory';
import PriceChart from './components/PriceChart';

import { ActionNotification } from '../../components';

import STRINGS from '../../config/localizedStrings';

class Trade extends Component {
	state = {
		chartHeight: 0,
		chartWidth: 0,
		symbol: 'btc'
	};

	componentWillMount() {
		this.setSymbol(this.props.symbol === 'fiat' ? 'btc' : this.props.symbol);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.symbol !== this.props.symbol) {
			this.setSymbol(nextProps.symbol === 'fiat' ? 'btc' : nextProps.symbol);
		}
	}

	setSymbol = (symbol = 'btc') => {
		this.setState({ symbol });
	};

	onSubmitOrder = (values) => {
		return submitOrder(values)
			.then((body) => {})
			.catch((err) => {
				// console.log('error', err);
				const _error = err.response.data
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

	onResize = () => {
		if (this.chartBlock) {
			this.setState({
				chartHeight: this.chartBlock.offsetHeight || 0,
				chartWidth: this.chartBlock.offsetWidth || 0
			});
		}
	};

	openCheckOrder = (order, onConfirm) => {
		const { setNotification, fees } = this.props;
		setNotification(NOTIFICATIONS.NEW_ORDER, { order, onConfirm, fees });
	}

	render() {
		const {
			tradeHistory,
			orderbookReady,
			asks,
			bids,
			activeOrders,
			userTrades,
			cancelOrder,
			cancelAllOrders,
			balance,
			marketPrice,
			activeLanguage
		} = this.props;
		const { chartHeight, chartWidth, symbol } = this.state;
		const USER_TABS = [
			{
				title: STRINGS.ORDERS,
				children: <ActiveOrders orders={activeOrders} onCancel={cancelOrder} />,
				titleAction: activeOrders.length > 0 && (
					<ActionNotification
						text={STRINGS.CANCEL_ALL}
						iconPath={ICONS.CANCEL_CROSS_ACTIVE}
						onClick={cancelAllOrders}
						status=""
					/>
				)
			},
			{
				title: STRINGS.TRADES,
				children: <UserTrades trades={userTrades} symbol={symbol} />,
				titleAction: (
					<ActionNotification
						text={STRINGS.TRADE_HISTORY}
						iconPath={ICONS.ARROW_TRANSFER_HISTORY_ACTIVE}
						onClick={this.goToTransactionsHistory}
						status=""
					/>
				)
			}
		];

		const orderbookProps = {
			symbol,
			fiatSymbol: STRINGS.FIAT_SHORTNAME,
			asks,
			bids
		};

		return (
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
					<TradeBlock title={STRINGS.ORDERBOOK}>
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
						className={classnames('trade-main_content', 'flex-auto', 'd-flex')}
					>
						<div
							className={classnames(
								'trade-col_action_wrapper',
								'flex-column',
								'd-flex',
								'apply_rtl'
							)}
						>
							<TradeBlock title={STRINGS.ORDER_ENTRY}>
								<OrderEntry
									submitOrder={this.onSubmitOrder}
									openCheckOrder={this.openCheckOrder}
									symbol={symbol}
									balance={balance}
									asks={asks}
									bids={bids}
									marketPrice={marketPrice}
								/>
							</TradeBlock>
						</div>
						<TradeBlock
							title={STRINGS.CHART}
							setRef={this.setChartRef}
							className="f-1 overflow-x"
						>
							{chartHeight > 0 && (
								<PriceChart height={chartHeight} width={chartWidth} />
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
					<TradeBlock title={STRINGS.TRADE_HISTORY}>
						<TradeHistory data={tradeHistory} language={activeLanguage} />
					</TradeBlock>
				</div>
			</div>
		);
	}
}

Trade.defaultProps = {};

const mapStateToProps = (store) => ({
	symbol: store.orderbook.symbol,
	balance: store.user.balance,
	tradeHistory: store.orderbook.trades,
	orderbookReady: store.orderbook.orderbookReady,
	asks: store.orderbook.asks,
	bids: store.orderbook.bids,
	marketPrice: store.orderbook.price,
	activeOrders: store.order.activeOrders,
	userTrades: store.wallet.latestUserTrades,
	activeLanguage: store.app.language,
	fees: store.user.fees
});

const mapDispatchToProps = (dispatch) => ({
	getUserTrades: (symbol) => dispatch(getUserTrades({ symbol })),
	cancelOrder: bindActionCreators(cancelOrder, dispatch),
	cancelAllOrders: bindActionCreators(cancelAllOrders, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
