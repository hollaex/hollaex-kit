import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import {
	getOrdersHistory,
	getUserOrders as getUserTrades,
	getUserDeposits,
	getUserWithdrawals,
	withdrawalCancel,
	downloadUserTrades,
} from '../../actions/walletActions';

import {
	IconTitle,
	TabController,
	Loader,
	// CheckTitle,
	Dialog,
	Button,
	CurrencyBallWithPrice,
} from '../../components';
import { FLEX_CENTER_CLASSES, BASE_CURRENCY } from '../../config/constants';
import {
	generateOrderHistoryHeaders,
	generateTradeHeaders,
	generateTradeHeadersMobile,
	generateDepositsHeaders,
	generateWithdrawalsHeaders,
} from './utils';
import TradeAndOrderFilters from './components/TradeAndOrderFilters';
import DepositAndWithdrawlFilters from './components/DepositAndWithdrawlFilters';
import { RECORD_LIMIT } from './constants';
import HistoryDisplay from './HistoryDisplay';

import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];

class TransactionsHistory extends Component {
	state = {
		headers: [],
		filters: {},
		activeTab: 0,
		dialogIsOpen: false,
		amount: 0,
		transactionId: 0,
		jumpToPage: 0,
		currency: BASE_CURRENCY,
		params: {},
	};

	UNSAFE_componentWillMount() {
		const { coins = {}, router } = this.props;
		if (Object.keys(coins).length === 0) {
			router.push('/summary');
		}
	}

	componentDidMount() {
		this.generateHeaders(
			this.props.symbol,
			this.props.coins,
			this.props.discount,
			this.props.prices
		);
		this.generateFilters();
		if (
			this.props.location &&
			this.props.location.query &&
			this.props.location.query.tab
		) {
			this.setActiveTab(parseInt(this.props.location.query.tab, 10));
		} else {
			this.setActiveTab();
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { pairs, coins, prices } = this.props;
		// if (nextProps.symbol !== this.props.symbol) {
		// this.requestData(nextProps.symbol);
		// this.generateHeaders(nextProps.symbol, nextProps.activeLanguage);
		// } else if (nextProps.activeLanguage !== this.props.activeLanguage) {
		if (
			nextProps.activeLanguage !== this.props.activeLanguage ||
			JSON.stringify(nextProps.prices) !== JSON.stringify(prices)
		) {
			this.generateHeaders(
				nextProps.symbol,
				nextProps.coins,
				nextProps.discount,
				nextProps.prices
			);
		}
		if (
			this.props.cancelData.dismissed !== nextProps.cancelData.dismissed &&
			nextProps.cancelData.dismissed === true
		) {
			this.onCloseDialog();
			this.requestData(nextProps.symbol);
		}
		if (
			JSON.stringify(nextProps.pairs) !== JSON.stringify(pairs) ||
			JSON.stringify(nextProps.coins) !== JSON.stringify(coins)
		) {
			this.generateFilters();
		}
	}

	onCloseDialog = () => {
		this.setState({
			dialogIsOpen: false,
		});
	};

	openDialog = () => {
		this.setState({ dialogIsOpen: true });
	};

	requestData = () => {
		const { params, activeTab } = this.state;
		const {
			getOrdersHistory,
			getUserTrades,
			getUserDeposits,
			getUserWithdrawals,
		} = this.props;

		switch (activeTab) {
			case 1:
				getOrdersHistory(RECORD_LIMIT, 1, { ...params, open: false });
				break;
			case 0:
				getUserTrades(RECORD_LIMIT, 1, params);
				break;
			case 2:
				getUserDeposits(RECORD_LIMIT, 1, params);
				break;
			case 3:
				getUserWithdrawals(RECORD_LIMIT, 1, params);
				break;
			default:
		}
	};

	onSearch = ({ range = [], ...rest }) => {
		const { jumpToPage } = this.state;
		if (jumpToPage !== 0) {
			this.setState({
				jumpToPage: 0,
			});
		}
		const [startDate, endDate] = range;
		const start_date = startDate ? moment.utc(startDate).format() : undefined;
		const end_date = endDate ? moment.utc(endDate).format() : undefined;
		this.setState(
			{ params: { start_date, end_date, ...rest } },
			this.requestData
		);
	};

	generateHeaders(symbol, coins, discount, prices) {
		const { withdrawalPopup } = this;
		const { pairs, icons: ICONS } = this.props;
		this.setState({
			headers: {
				orders: isMobile
					? generateOrderHistoryHeaders(symbol, pairs, coins, discount)
					: generateOrderHistoryHeaders(symbol, pairs, coins, discount, prices),
				trades: isMobile
					? generateTradeHeadersMobile(symbol, pairs, coins, discount)
					: generateTradeHeaders(symbol, pairs, coins, discount, prices),
				deposits: generateDepositsHeaders(
					symbol,
					coins,
					withdrawalPopup,
					ICONS
				),
				withdrawals: generateWithdrawalsHeaders(
					symbol,
					coins,
					withdrawalPopup,
					ICONS
				),
			},
		});
	}

	generateFilters = () => {
		const { pairs, coins } = this.props;
		this.setState({
			filters: {
				orders: (
					<TradeAndOrderFilters
						pairs={pairs}
						onSearch={this.onSearch}
						formName="orders"
					/>
				),
				trades: (
					<TradeAndOrderFilters
						pairs={pairs}
						onSearch={this.onSearch}
						formName="trades"
					/>
				),
				deposits: (
					<DepositAndWithdrawlFilters
						coins={coins}
						onSearch={this.onSearch}
						formName="deposits"
					/>
				),
				withdrawals: (
					<DepositAndWithdrawlFilters
						coins={coins}
						onSearch={this.onSearch}
						formName="withdrawals"
					/>
				),
			},
		});
	};

	setActiveTab = (activeTab = 0) => {
		const { symbol, orders, trades, withdrawals, deposits } = this.props;
		const { jumpToPage } = this.state;
		if (jumpToPage !== 0) {
			this.setState({
				jumpToPage: 0,
			});
		}
		this.setState({ activeTab }, () => {
			if (
				(orders.page === 1 && orders.fetched === false) ||
				(trades.page === 1 && trades.fetched === false) ||
				(withdrawals.page === 1 && withdrawals.fetched === false) ||
				(deposits.page === 1 && deposits.fetched === false)
			) {
				this.requestData(symbol);
			}
		});
	};
	withdrawalPopup = (id, amount, currency) => {
		if (id) {
			this.setState({ amount: amount, transactionId: id, currency: currency });
			this.openDialog();
		}
	};

	withdrawalCancel = () => {
		const { transactionId } = this.state;
		this.props.withdrawalCancel(transactionId);
	};
	onClose = () => {
		this.onCloseDialog();
	};

	handleNext = (pageCount, pageNumber) => {
		const { orders, trades, deposits, withdrawals } = this.props;
		const { params } = this.state;
		const pageTemp = pageNumber % 2 === 0 ? 2 : 1;
		const apiPageTemp = Math.floor((pageNumber + 1) / 2);
		switch (this.state.activeTab) {
			case 1:
				if (
					RECORD_LIMIT === pageCount * pageTemp &&
					apiPageTemp >= orders.page &&
					orders.isRemaining
				) {
					this.props.getOrdersHistory(RECORD_LIMIT, orders.page + 1, {
						...params,
						open: false,
					});
					this.setState({ jumpToPage: pageNumber });
				}
				break;
			case 0:
				if (
					RECORD_LIMIT === pageCount * pageTemp &&
					apiPageTemp >= trades.page &&
					trades.isRemaining
				) {
					this.props.getUserTrades(RECORD_LIMIT, trades.page + 1, {
						...params,
					});
					this.setState({ jumpToPage: pageNumber });
				}
				break;
			case 2:
				if (
					RECORD_LIMIT === pageCount * pageTemp &&
					apiPageTemp >= deposits.page &&
					deposits.isRemaining
				) {
					this.props.getUserDeposits(RECORD_LIMIT, deposits.page + 1, params);
					this.setState({ jumpToPage: pageNumber });
				}
				break;
			case 3:
				if (
					RECORD_LIMIT === pageCount * pageTemp &&
					apiPageTemp >= withdrawals.page &&
					withdrawals.isRemaining
				) {
					this.props.getUserWithdrawals(
						RECORD_LIMIT,
						withdrawals.page + 1,
						params
					);
					this.setState({ jumpToPage: pageNumber });
				}
				break;
			default:
		}
	};

	renderActiveTab = () => {
		const {
			orders,
			trades,
			deposits,
			withdrawals,
			symbol,
			downloadUserTrades,
			downloadUserOrders,
			downloadUserWithdrawal,
			downloadUserDeposit,
		} = this.props;
		const { headers, activeTab, filters, jumpToPage } = this.state;
		// const name = STRINGS[`${symbol.toUpperCase()}_NAME`];

		const props = {
			symbol,
			withIcon: true,
		};

		switch (activeTab) {
			case 1:
				props.stringId = 'ORDER_HISTORY';
				props.title = `${STRINGS['ORDER_HISTORY']}`;
				props.headers = headers.orders;
				props.data = orders;
				props.filename = `order-history-${moment().unix()}`;
				props.withIcon = false;
				props.handleNext = this.handleNext;
				props.jumpToPage = jumpToPage;
				props.handleDownload = downloadUserOrders;
				props.filters = filters.orders;
				break;
			case 0:
				props.stringId = 'TRANSACTION_HISTORY.TITLE_TRADES';
				props.title = `${STRINGS['TRANSACTION_HISTORY.TITLE_TRADES']}`;
				props.headers = headers.trades;
				props.data = trades;
				props.filename = `trade-history-${moment().unix()}`;
				props.withIcon = false;
				props.handleNext = this.handleNext;
				props.jumpToPage = jumpToPage;
				props.handleDownload = downloadUserTrades;
				props.filters = filters.trades;
				break;
			case 2:
				props.stringId = 'TRANSACTION_HISTORY.TITLE_DEPOSITS';
				props.title = STRINGS['TRANSACTION_HISTORY.TITLE_DEPOSITS'];
				props.headers = headers.deposits;
				props.data = deposits;
				props.filename = `deposit-history-${moment().unix()}`;
				props.handleNext = this.handleNext;
				props.jumpToPage = jumpToPage;
				props.handleDownload = downloadUserDeposit;
				props.filters = filters.deposits;
				break;
			case 3:
				props.stringId = 'TRANSACTION_HISTORY.TITLE_WITHDRAWALS';
				props.title = STRINGS['TRANSACTION_HISTORY.TITLE_WITHDRAWALS'];
				props.headers = headers.withdrawals;
				props.data = withdrawals;
				props.filename = `withdrawal-history-${moment().unix()}`;
				props.handleNext = this.handleNext;
				props.jumpToPage = jumpToPage;
				props.handleDownload = downloadUserWithdrawal;
				props.filters = filters.withdrawals;
				break;
			default:
				return <div />;
		}

		return <HistoryDisplay {...props} activeTab={activeTab} />;
	};

	render() {
		const { id, activeTheme, coins, icons: ICONS } = this.props;
		let { activeTab, dialogIsOpen, amount, currency } = this.state;
		const { onCloseDialog } = this;

		if (!id || Object.keys(coins).length === 0) {
			return <Loader />;
		}

		return (
			<div
				className={classnames(
					'presentation_container',
					'apply_rtl',
					'transaction-history-wrapper',
					isMobile && 'overflow-y'
				)}
			>
				{!isMobile && (
					<IconTitle
						stringId="TRANSACTION_HISTORY.TITLE"
						text={STRINGS['TRANSACTION_HISTORY.TITLE']}
						iconId="TRANSACTION_HISTORY"
						iconPath={ICONS['TAB_HISTORY']}
						textType="title"
					/>
				)}
				<TabController
					tabs={[
						{
							title: isMobile ? (
								STRINGS['TRANSACTION_HISTORY.TRADES']
							) : (
								// <CheckTitle
								// 	stringId="TRANSACTION_HISTORY.TRADES"
								// 	title={STRINGS['TRANSACTION_HISTORY.TRADES']}
								// 	iconId="TRADE_HISTORY"
								// 	icon={ICONS['TRADE_HISTORY']}
								// />
								<div>{STRINGS['TRANSACTION_HISTORY.TRADES']}</div>
							),
						},
						{
							title: isMobile ? (
								STRINGS['ORDER_HISTORY']
							) : (
								// <CheckTitle
								// 	stringId="ORDER_HISTORY"
								// 	title={STRINGS['ORDER_HISTORY']}
								// 	iconId="TRADE_HISTORY"
								// 	icon={ICONS['TRADE_HISTORY']}
								// />
								<div>{STRINGS['ORDER_HISTORY']}</div>
							),
						},
						{
							title: isMobile ? (
								STRINGS['TRANSACTION_HISTORY.DEPOSITS']
							) : (
								// <CheckTitle
								// 	stringId="TRANSACTION_HISTORY.DEPOSITS"
								// 	title={STRINGS['TRANSACTION_HISTORY.DEPOSITS']}
								// 	iconId="DEPOSIT_HISTORY"
								// 	icon={ICONS['DEPOSIT_HISTORY']}
								// />
								<div>{STRINGS['TRANSACTION_HISTORY.DEPOSITS']}</div>
							),
						},
						{
							title: isMobile ? (
								STRINGS['TRANSACTION_HISTORY.WITHDRAWALS']
							) : (
								// <CheckTitle
								// 	stringId="TRANSACTION_HISTORY.WITHDRAWALS"
								// 	title={STRINGS['TRANSACTION_HISTORY.WITHDRAWALS']}
								// 	iconId="WITHDRAW_HISTORY"
								// 	icon={ICONS['WITHDRAW_HISTORY']}
								// />
								<div>{STRINGS['TRANSACTION_HISTORY.WITHDRAWALS']}</div>
							),
						},
					]}
					activeTab={activeTab}
					setActiveTab={this.setActiveTab}
				/>
				<Dialog
					isOpen={dialogIsOpen}
					label="token-modal"
					theme={activeTheme}
					onCloseDialog={onCloseDialog}
					shouldCloseOnOverlayClick={true}
					showCloseText={false}
				>
					<div>
						<IconTitle
							iconId="CANCEL_WITHDRAW"
							iconPath={ICONS['CANCEL_WITHDRAW']}
							stringId="CANCEL_BASE_WITHDRAWAL"
							text={STRINGS.formatString(
								STRINGS['CANCEL_BASE_WITHDRAWAL'],
								coins[currency].fullname
							)}
							textType="title"
							underline={true}
							className="w-100"
						/>
						<div>
							<div className="text-center mt-5 mb-5">
								<div>{STRINGS['CANCEL_WITHDRAWAL_POPUP_CONFIRM']}</div>
								<div className={classnames(...GROUP_CLASSES)}>
									<CurrencyBallWithPrice
										symbol={coins[currency].symbol}
										amount={amount}
										price={1}
									/>
								</div>
							</div>
							<div className="w-100 buttons-wrapper d-flex">
								<Button label={STRINGS['BACK_TEXT']} onClick={this.onClose} />
								<div className="separator" />
								<Button
									label={STRINGS['CANCEL_WITHDRAWAL']}
									onClick={this.withdrawalCancel}
								/>
							</div>
						</div>
					</div>
				</Dialog>
				<div className={classnames('inner_container', 'with_border_top')}>
					{this.renderActiveTab()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	prices: store.asset.oraclePrices,
	pairs: store.app.pairs,
	coins: store.app.coins,
	id: store.user.id,
	orders: store.wallet.orderHistory,
	trades: store.wallet.trades,
	deposits: store.wallet.deposits,
	withdrawals: store.wallet.withdrawals,
	symbol: store.orderbook.symbol,
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	cancelData: store.wallet.withdrawalCancelData,
	discount: store.user.discount || 0,
});

const mapDispatchToProps = (dispatch) => ({
	getOrdersHistory: (limit, page = 1, params) =>
		dispatch(getOrdersHistory({ limit, page, ...params })),
	getUserTrades: (limit, page = 1, params) =>
		dispatch(getUserTrades({ limit, page, ...params })),
	getUserDeposits: (limit, page = 1, params) =>
		dispatch(getUserDeposits({ limit, page, ...params })),
	getUserWithdrawals: (limit, page = 1, params) =>
		dispatch(getUserWithdrawals({ limit, page, ...params })),
	withdrawalCancel: (transactionId) =>
		dispatch(withdrawalCancel({ transactionId })),
	downloadUserTrades: () => dispatch(downloadUserTrades('trade')),
	downloadUserDeposit: () => dispatch(downloadUserTrades('deposit')),
	downloadUserWithdrawal: () => dispatch(downloadUserTrades('withdrawal')),
	downloadUserOrders: () => dispatch(downloadUserTrades('orders')),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(TransactionsHistory));
