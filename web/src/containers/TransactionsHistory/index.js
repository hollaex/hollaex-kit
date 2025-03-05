import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import moment from 'moment';
import { getFormatTimestamp } from 'utils/utils';

import {
	getOrdersHistory,
	getUserOrders as getUserTrades,
	getUserDeposits,
	getUserWithdrawals,
	withdrawalCancel,
	downloadUserTrades,
	activeTabFromWallet,
} from 'actions/walletActions';

import {
	IconTitle,
	TabController,
	Loader,
	Dialog,
	Button,
	CurrencyBallWithPrice,
	EditWrapper,
	NotLoggedIn,
} from 'components';
import { FLEX_CENTER_CLASSES, BASE_CURRENCY } from 'config/constants';
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
import {
	orderHistorySelector,
	tradeHistorySelector,
	depositHistorySelector,
	withdrawalHistorySelector,
} from './selectors';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { STATIC_ICONS } from 'config/icons';
import { Image } from 'hollaex-web-lib';
import { quicktradePairSelector } from 'containers/QuickTrade/components/utils';

const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];
const transactionTabs = ['trades', 'orders', 'deposits', 'withdrawals'];

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
		defaultExpand: false,
		current_order_id: '',
	};

	UNSAFE_componentWillMount() {
		const { coins = {}, router } = this.props;
		if (Object.keys(coins).length === 0) {
			router.push('/summary');
		}
	}

	updateParams(currTab) {
		const urlSearchParams = new URLSearchParams(window.location.search);
		urlSearchParams.set('tab', currTab);
		const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
		window.history.pushState({}, '', newUrl);
	}

	getActiveTabName() {
		const { activeTab } = this.state;

		if (!activeTab) {
			return transactionTabs[0];
		} else {
			return transactionTabs[activeTab];
		}
	}

	componentDidMount() {
		const {
			router: {
				location: { query, search },
			},
			getActiveTabFromWallet,
			isFromWallet,
			isDepositFromWallet,
		} = this.props;

		this.generateHeaders(
			this.props.symbol,
			this.props.coins,
			this.props.discount,
			this.props.prices
		);
		this.generateFilters();
		if (query && query.tab && !transactionTabs.includes(query.tab)) {
			this.setActiveTab(parseInt(query.tab, 10));
		} else {
			const activeTab = this.getTabBySearch(search);
			this.setActiveTab(
				getActiveTabFromWallet === 'deposit' || isDepositFromWallet
					? 2
					: getActiveTabFromWallet === 'withdraw' || isFromWallet
					? 3
					: activeTab
			);
		}
	}

	componentDidUpdate() {
		const { isFromWallet } = this.props;
		if (!isFromWallet) {
			const activeTabName = this.getActiveTabName();
			this.updateParams(activeTabName);
		}
	}

	componentWillUnmount() {
		this.props.activeTabFromWallet('');
	}

	getTabBySearch = (search) => {
		if (search) {
			if (search.includes('order-history')) {
				return 1;
			} else if (search.includes('deposit')) {
				return 2;
			} else if (search.includes('withdraw')) {
				return 3;
			}
		}

		return 0;
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { coins, pairs, prices, quicktradePairs } = this.props;
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
			JSON.stringify(nextProps.quicktradePairs) !==
				JSON.stringify(quicktradePairs) ||
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
		let open = false;
		let temp = params[`activeTab_${activeTab}`];
		if (temp && temp.type && temp.type === 'active') {
			open = true;
		} else if (temp && temp.type && temp.type === 'closed') {
			open = false;
		}
		switch (activeTab) {
			case 1:
				getOrdersHistory(RECORD_LIMIT, 1, { ...temp, open });
				break;
			case 0:
				getUserTrades(RECORD_LIMIT, 1, temp);
				break;
			case 2:
				getUserDeposits(RECORD_LIMIT, 1, temp);
				break;
			case 3:
				getUserWithdrawals(RECORD_LIMIT, 1, temp);
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
			(prevState) => ({
				params: {
					[`activeTab_${prevState.activeTab}`]: {
						start_date,
						end_date,
						status: 'processing',
						...rest,
					},
				},
			}),
			this.requestData
		);
	};

	generateHeaders(symbol, coins, discount, prices) {
		const { withdrawalPopup } = this;
		const { pairs, icons: ICONS } = this.props;
		let type = STRINGS['TIME'];

		this.setState({
			headers: {
				orders: isMobile
					? generateOrderHistoryHeaders(
							symbol,
							pairs,
							coins,
							discount,
							prices,
							ICONS
					  )
					: generateOrderHistoryHeaders(
							symbol,
							pairs,
							coins,
							discount,
							prices,
							ICONS,
							type
					  ),
				trades: isMobile
					? generateTradeHeadersMobile(
							symbol,
							pairs,
							coins,
							discount,
							prices,
							ICONS
					  )
					: generateTradeHeaders(
							symbol,
							pairs,
							coins,
							discount,
							prices,
							ICONS,
							this.setActiveTab
					  ),
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

	getExpandableRowContentForTrades = () => {
		return {
			expandedRowRender: (obj) => {
				return (
					<div
						className={`expandable-container flex-row ${
							isMobile ? 'text-center' : ''
						}`}
					>
						<div>
							<EditWrapper
								stringId="TRANSACTION_HISTORY.ORDERID"
								render={(string) => <p className="font-bold">{string}:</p>}
							>
								{STRINGS['TRANSACTION_HISTORY.ORDERID']}
							</EditWrapper>
							<p>{obj.order_id ? obj.order_id : STRINGS['NA']}</p>
						</div>
					</div>
				);
			},
			defaultExpanded: () => false,
			rowExpandable: () => true,
		};
	};

	getExpandableRowContentForOrderHistory = () => {
		return {
			expandedRowRender: (obj) => {
				return (
					<div
						className={`expandable-container ${isMobile ? 'text-center' : ''}`}
					>
						<div>
							<EditWrapper
								stringId="TRANSACTION_HISTORY.ORDERID"
								render={(string) => <p className="font-bold">{string}:</p>}
							>
								{STRINGS['TRANSACTION_HISTORY.ORDERID']}
							</EditWrapper>
							<p>{obj.id}</p>
						</div>
						<div>
							<EditWrapper
								stringId="TRANSACTION_HISTORY.TRIGGER_STOP_PRICE"
								render={(string) => <p className="font-bold">{string}:</p>}
							>
								{STRINGS['TRANSACTION_HISTORY.TRIGGER_STOP_PRICE']}
							</EditWrapper>
							<p>{obj.stop ? obj.stop : STRINGS['NA']}</p>
						</div>
						<div>
							<EditWrapper
								stringId="TRANSACTION_HISTORY.TRIGGER_STOP_PRICE"
								render={(string) => <p className="font-bold">{string}:</p>}
							>
								{STRINGS['TRANSACTION_HISTORY.TIME_OF_LAST_TRADE']}
							</EditWrapper>
							<p>{getFormatTimestamp(obj.updated_at)}</p>
						</div>
					</div>
				);
			},
			defaultExpanded: (data) =>
				this.state.defaultExpand && this.state.current_order_id === data.id
					? true
					: false,
			rowExpandable: () => true,
		};
	};

	getExpandableRowContentForDeposit = () => {
		return {
			expandedRowRender: (obj) => {
				return (
					<div
						className={`expandable-container ${isMobile ? 'text-center' : ''}`}
					>
						{obj?.address !== 'mint' && obj?.address !== 'burn' && (
							<div>
								<EditWrapper
									stringId="ACCORDIAN.ADDRESS"
									render={(string) => (
										<p className="font-bold text-capitalize">{string}</p>
									)}
								>
									{STRINGS['ACCORDIAN.ADDRESS']}
								</EditWrapper>
								<p>{obj.address}</p>
							</div>
						)}
						<div>
							<EditWrapper
								stringId="WITHDRAW_NOTIFICATION_TRANSACTION_ID"
								render={(string) => <p className="font-bold">{string}</p>}
							>
								{STRINGS['WITHDRAW_NOTIFICATION_TRANSACTION_ID']}
							</EditWrapper>
							<p>{obj?.transaction_id}</p>
						</div>
					</div>
				);
			},
			defaultExpanded: () => false,
			rowExpandable: () => true,
		};
	};

	generateFilters = () => {
		const { quicktradePairs, coins, icons } = this.props;
		this.setState({
			filters: {
				orders: (
					<TradeAndOrderFilters
						pairs={quicktradePairs}
						onSearch={this.onSearch}
						formName="orders"
						activeTab={1}
					/>
				),
				trades: (
					<TradeAndOrderFilters
						pairs={quicktradePairs}
						onSearch={this.onSearch}
						formName="trades"
						activeTab={0}
					/>
				),
				deposits: (
					<DepositAndWithdrawlFilters
						icons={icons}
						coins={coins}
						onSearch={this.onSearch}
						formName="deposits"
						activeTab={2}
					/>
				),
				withdrawals: (
					<DepositAndWithdrawlFilters
						icons={icons}
						coins={coins}
						onSearch={this.onSearch}
						formName="withdrawals"
						activeTab={3}
					/>
				),
			},
		});
	};

	setActiveTab = (activeTab = 0) => {
		const {
			symbol,
			orders,
			trades,
			withdrawals,
			deposits,
			activeTabFromWallet,
		} = this.props;
		const { jumpToPage } = this.state;
		if (jumpToPage !== 0) {
			this.setState({
				jumpToPage: 0,
			});
		}
		this.setState(
			{
				activeTab,
				params: {
					[`activeTab_${activeTab}`]: {
						end_date: '',
						start_date: '',
					},
				},
			},
			() => {
				if (
					(orders.page === 1 && orders.fetched === false) ||
					(trades.page === 1 && trades.fetched === false) ||
					(withdrawals.page === 1 && withdrawals.fetched === false) ||
					(deposits.page === 1 && deposits.fetched === false)
				) {
					this.requestData(symbol);
				}
			}
		);
		activeTabFromWallet('');
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
		const { params, activeTab } = this.state;
		const pageTemp = pageNumber % 2 === 0 ? 2 : 1;
		const apiPageTemp = Math.floor((pageNumber + 1) / 2);
		let temp = params[`activeTab_${activeTab}`];
		switch (activeTab) {
			case 1:
				if (
					RECORD_LIMIT === pageCount * pageTemp &&
					apiPageTemp >= orders.page &&
					orders.isRemaining
				) {
					this.props.getOrdersHistory(RECORD_LIMIT, orders.page + 1, {
						...temp,
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
						...temp,
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
					this.props.getUserDeposits(RECORD_LIMIT, deposits.page + 1, temp);
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
						temp
					);
					this.setState({ jumpToPage: pageNumber });
				}
				break;
			default:
		}
	};

	onHandleView = () => {
		const { router, activeTabFromWallet, isDepositFromWallet } = this.props;
		if (isDepositFromWallet) {
			activeTabFromWallet('deposit');
		} else {
			activeTabFromWallet('withdraw');
		}
		router.push('/transactions');
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
			isFromWallet,
			isDepositFromWallet,
			selectedAsset = '',
			params: { currency },
		} = this.props;

		const filterTransactions = (transactions = []) => {
			let count = 0;
			return transactions?.data?.filter((item, index) => {
				if (selectedAsset?.length > 0) {
					return item?.currency === currency && count++ < 5;
				}
				return selectedAsset === '' && index < 5;
			});
		};

		const filterForWallet = filterTransactions(withdrawals);
		const filterForDepositWallet = filterTransactions(deposits);

		const withdrawalsForWallet = {
			...withdrawals,
			count: filterForWallet?.length,
			data: filterForWallet,
		};
		const depositsForWallet = {
			...deposits,
			count: filterForDepositWallet?.length,
			data: filterForDepositWallet,
		};
		const { headers, activeTab, filters, jumpToPage, params } = this.state;
		let temp = params[`activeTab_${activeTab}`];

		const props = {
			symbol,
			withIcon: true,
			isFromWallet,
			isDepositFromWallet,
		};

		const prepareNoData = (tab) => {
			return (
				<div className="d-flex flex-column align-items-center">
					<Image
						iconId={tab}
						icon={STATIC_ICONS[tab]}
						alt={tab}
						width="40px"
						height="40px"
					/>
					<span>{STRINGS[tab]}</span>
				</div>
			);
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
				props.handleDownload = () => downloadUserOrders(temp);
				props.filters = filters.orders;
				props.noData = prepareNoData('NO_ACTIVE_ORDERS');
				props.refetchData = () => this.requestData(activeTab);
				props.expandableRow = true;
				props.expandableContent = this.getExpandableRowContentForOrderHistory;
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
				props.handleDownload = () => downloadUserTrades(temp);
				props.filters = filters.trades;
				props.noData = prepareNoData('NO_ACTIVE_TRADES');
				props.refetchData = () => this.requestData(activeTab);
				props.rowKey = ({ history_id }) => history_id;
				props.expandableRow = true;
				props.expandableContent = this.getExpandableRowContentForTrades;
				break;
			case 2:
				props.stringId = 'TRANSACTION_HISTORY.TITLE_DEPOSITS';
				props.title = STRINGS['TRANSACTION_HISTORY.TITLE_DEPOSITS'];
				props.headers = headers.deposits;
				props.data = isDepositFromWallet ? depositsForWallet : deposits;
				props.filename = `deposit-history-${moment().unix()}`;
				props.handleNext = this.handleNext;
				props.jumpToPage = jumpToPage;
				props.handleDownload = () => downloadUserDeposit(temp);
				props.filters = filters.deposits;
				props.noData = prepareNoData('NO_ACTIVE_DEPOSITS');
				props.refetchData = () => this.requestData(activeTab);
				props.onHandleView = () => this.onHandleView();
				props.expandableRow = true;
				props.expandableContent = this.getExpandableRowContentForDeposit;
				break;
			case 3:
				props.stringId = 'TRANSACTION_HISTORY.TITLE_WITHDRAWALS';
				props.title = STRINGS['TRANSACTION_HISTORY.TITLE_WITHDRAWALS'];
				props.headers = headers.withdrawals;
				props.data = isFromWallet ? withdrawalsForWallet : withdrawals;
				props.filename = `withdrawal-history-${moment().unix()}`;
				props.handleNext = this.handleNext;
				props.jumpToPage = jumpToPage;
				props.handleDownload = () => downloadUserWithdrawal(temp);
				props.filters = filters.withdrawals;
				props.noData = prepareNoData('NO_ACTIVE_WITHDRAWALS');
				props.refetchData = () => this.requestData(activeTab);
				props.onHandleView = () => this.onHandleView();
				props.expandableRow = true;
				props.expandableContent = this.getExpandableRowContentForDeposit;
				break;
			default:
				return <div />;
		}

		return <HistoryDisplay {...props} activeTab={activeTab} />;
	};

	render() {
		const { coins, icons: ICONS, isFromWallet = false } = this.props;
		let { activeTab, dialogIsOpen, amount, currency } = this.state;
		const { onCloseDialog } = this;

		if (Object.keys(coins).length === 0) {
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
				{!isMobile && !isFromWallet && (
					<IconTitle
						stringId="TRANSACTION_HISTORY.TITLE"
						text={STRINGS['TRANSACTION_HISTORY.TITLE']}
						iconId="TRANSACTION_HISTORY"
						iconPath={ICONS['TAB_HISTORY']}
						textType="title"
					/>
				)}
				{!isFromWallet && (
					<TabController
						tabs={[
							{
								title: isMobile ? (
									<EditWrapper>
										{STRINGS['TRANSACTION_HISTORY.TRADES']}
									</EditWrapper>
								) : (
									<EditWrapper
										stringId="TRANSACTION_HISTORY.TRADES"
										render={(string) => <div>{string}</div>}
									>
										{STRINGS['TRANSACTION_HISTORY.TRADES']}
									</EditWrapper>
								),
							},
							{
								title: isMobile ? (
									<EditWrapper>{STRINGS['ORDER_HISTORY']}</EditWrapper>
								) : (
									<EditWrapper
										stringId="ORDER_HISTORY"
										render={(string) => <div>{string}</div>}
									>
										{STRINGS['ORDER_HISTORY']}
									</EditWrapper>
								),
							},
							{
								title: isMobile ? (
									<EditWrapper>
										{STRINGS['TRANSACTION_HISTORY.DEPOSITS']}
									</EditWrapper>
								) : (
									<EditWrapper
										stringId="TRANSACTION_HISTORY.DEPOSITS"
										render={(string) => <div>{string}</div>}
									>
										{STRINGS['TRANSACTION_HISTORY.DEPOSITS']}
									</EditWrapper>
								),
							},
							{
								title: isMobile ? (
									<EditWrapper>
										{STRINGS['TRANSACTION_HISTORY.WITHDRAWALS']}
									</EditWrapper>
								) : (
									<EditWrapper
										stringId="TRANSACTION_HISTORY.WITHDRAWALS"
										render={(string) => <div>{string}</div>}
									>
										{STRINGS['TRANSACTION_HISTORY.WITHDRAWALS']}
									</EditWrapper>
								),
							},
						]}
						activeTab={activeTab}
						setActiveTab={this.setActiveTab}
					/>
				)}
				<Dialog
					isOpen={dialogIsOpen}
					label="token-modal"
					onCloseDialog={onCloseDialog}
					shouldCloseOnOverlayClick={true}
					showCloseText={false}
					className="cancel-withdraw-pop-up"
				>
					<div>
						<IconTitle
							iconId="CANCEL_WITHDRAW"
							iconPath={ICONS['CANCEL_WITHDRAW']}
							stringId="CANCEL_BASE_WITHDRAWAL"
							text={STRINGS.formatString(
								STRINGS['CANCEL_BASE_WITHDRAWAL'],
								coins && coins[currency] && coins[currency].fullname
									? `${coins[currency].fullname} ${STRINGS['SUMMARY.WITHDRAWAL']}`
									: ''
							)}
							textType="title"
							underline={true}
							className="w-100 cancel-widrawal-pop-up"
						/>
						<div>
							<div className="text-center mt-3 mb-3">
								<div>{STRINGS['CANCEL_WITHDRAWAL_POPUP_CONFIRM']}</div>
								<div className={classnames(...GROUP_CLASSES)}>
									<CurrencyBallWithPrice
										symbol={
											coins && coins[currency] && coins[currency].symbol
												? coins[currency].symbol
												: ''
										}
										amount={amount}
										price={1}
									/>
								</div>
							</div>
							<div className="w-100 buttons-wrapper d-flex">
								<Button label={STRINGS['BACK_TEXT']} onClick={this.onClose} />
								<div className="separator" />
								<Button
									label={STRINGS['USER_APPS.REMOVE.CONFIRM']}
									onClick={this.withdrawalCancel}
								/>
							</div>
						</div>
					</div>
				</Dialog>
				<div className={classnames('inner_container', 'with_border_top')}>
					<NotLoggedIn>{this.renderActiveTab()}</NotLoggedIn>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	prices: store.asset.oraclePrices,
	pairs: store.app.pairs,
	coins: store.app.coins,
	quicktradePairs: quicktradePairSelector(store),
	orders: orderHistorySelector(store),
	trades: tradeHistorySelector(store),
	deposits: depositHistorySelector(store),
	withdrawals: withdrawalHistorySelector(store),
	symbol: store.orderbook.symbol,
	activeLanguage: store.app.language,
	cancelData: store.wallet.withdrawalCancelData,
	discount: store.user.discount || 0,
	getActiveTabFromWallet: store.wallet.activeTabFromWallet,
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
	downloadUserTrades: (params) => dispatch(downloadUserTrades('trade', params)),
	downloadUserDeposit: (params) =>
		dispatch(downloadUserTrades('deposit', params)),
	downloadUserWithdrawal: (params) =>
		dispatch(downloadUserTrades('withdrawal', params)),
	downloadUserOrders: (params) =>
		dispatch(downloadUserTrades('orders', params)),
	activeTabFromWallet: bindActionCreators(activeTabFromWallet, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(TransactionsHistory)));
