import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import {
	getUserTrades,
	getUserDeposits,
	getUserWithdrawals,
	withdrawalCancel,
	downloadUserTrades,
} from '../../actions/walletActions';

import { IconTitle, TabController, Loader, CheckTitle, Dialog, Button, CurrencyBallWithPrice } from '../../components';
import { FLEX_CENTER_CLASSES, BASE_CURRENCY } from '../../config/constants';
import {
	generateTradeHeaders,
	generateTradeHeadersMobile,
	generateDepositsHeaders,
	generateWithdrawalsHeaders
} from './utils';
import { RECORD_LIMIT } from './constants';
import HistoryDisplay from './HistoryDisplay';

import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];

class TransactionsHistory extends Component {
	state = {
		headers: [],
		activeTab: 0,
		dialogIsOpen: false,
		amount: 0,
		transactionId: 0,
		jumpToPage: 0,
		currency: BASE_CURRENCY
	};

	componentDidMount() {
		this.requestData(this.props.symbol);
		this.generateHeaders(this.props.symbol, this.props.coins, this.props.discount);
		if (this.props.location
			&& this.props.location.query
			&& this.props.location.query.tab) {
			this.setActiveTab(parseInt(this.props.location.query.tab, 10));
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		// if (nextProps.symbol !== this.props.symbol) {
		// this.requestData(nextProps.symbol);
		// this.generateHeaders(nextProps.symbol, nextProps.activeLanguage);
		// } else if (nextProps.activeLanguage !== this.props.activeLanguage) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateHeaders(nextProps.symbol, nextProps.coins, nextProps.discount);
		}
		if ((this.props.cancelData.dismissed !== nextProps.cancelData.dismissed) && nextProps.cancelData.dismissed === true) {
			this.onCloseDialog()
			this.requestData(nextProps.symbol);

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

	requestData = (symbol) => {
		switch (this.state.activeTab) {
			case 0:
				this.props.getUserTrades(RECORD_LIMIT);
				break;
			case 1:
				this.props.getUserDeposits(symbol, RECORD_LIMIT);
				break;
			case 2:
				this.props.getUserWithdrawals(symbol, RECORD_LIMIT);
				break;
			default:
		}
	};

	generateHeaders(symbol, coins, discount) {
		const { withdrawalPopup } = this
		const { pairs } = this.props;
		this.setState({
			headers: {
				trades: isMobile
					? generateTradeHeadersMobile(symbol, pairs, coins, discount)
					: generateTradeHeaders(symbol, pairs, coins, discount),
				deposits: generateDepositsHeaders(symbol, coins, withdrawalPopup),
				withdrawals: generateWithdrawalsHeaders(symbol, coins, withdrawalPopup)
			}
		});
	}

	setActiveTab = (activeTab = 0) => {
		const { symbol, trades, withdrawals, deposits } = this.props;
		const { jumpToPage } = this.state
		if (jumpToPage !== 0) {
			this.setState({
				jumpToPage: 0,
			})
		}
		this.setState({ activeTab }, () => {
			if ((trades.page === 1 && trades.fetched === false)
				|| (withdrawals.page === 1 && withdrawals.fetched === false)
				|| (deposits.page === 1 && deposits.fetched === false)) {
				this.requestData(symbol);
			}
		});
	};
	withdrawalPopup = (id, amount, currency) => {
		if (id) {
			this.setState({ amount: amount, transactionId: id, currency: currency });
			this.openDialog()
		}
	};

	withdrawalCancel = () => {
		const { transactionId } = this.state
		this.props.withdrawalCancel(transactionId);
	}
	onClose = () => {
		this.onCloseDialog()
	}

	handleNext = (pageCount, pageNumber) => {
		const { trades, symbol, deposits, withdrawals } = this.props;
		const pageTemp = (pageNumber % 2) === 0 ? 2 : 1;
		const apiPageTemp = Math.floor(((pageNumber + 1) / 2));
		switch (this.state.activeTab) {
			case 0:
				if (RECORD_LIMIT === (pageCount * pageTemp)
					&& apiPageTemp >= trades.page
					&& trades.isRemaining) {
					this.props.getUserTrades(RECORD_LIMIT, trades.page + 1);
					this.setState({ jumpToPage: pageNumber });
				}
				break;
			case 1:
				if (RECORD_LIMIT === (pageCount * pageTemp)
					&& apiPageTemp >= deposits.page
					&& deposits.isRemaining) {
					this.props.getUserDeposits(symbol, RECORD_LIMIT, deposits.page + 1);
					this.setState({ jumpToPage: pageNumber });
				}
				break;
			case 2:
				if (RECORD_LIMIT === (pageCount * pageTemp)
					&& apiPageTemp >= withdrawals.page
					&& withdrawals.isRemaining) {
					this.props.getUserWithdrawals(symbol, RECORD_LIMIT, withdrawals.page + 1);
					this.setState({ jumpToPage: pageNumber });
				}
				break;
			default:
		}
	};

	renderActiveTab = () => {
		const {
			trades,
			deposits,
			withdrawals,
			symbol,
			downloadUserTrades,
			downloadUserWithdrawal,
			downloadUserDeposit
		} = this.props;
		const { headers, activeTab } = this.state;
		// const name = STRINGS[`${symbol.toUpperCase()}_NAME`];

		const props = {
			symbol,
			withIcon: true
		};

		switch (activeTab) {
			case 0:
				props.title = `${STRINGS["TRANSACTION_HISTORY.TITLE_TRADES"]}`;
				props.headers = headers.trades;
				props.data = trades;
				props.filename = `trade-history-${moment().unix()}`;
				props.withIcon = false;
				props.handleNext = this.handleNext;
				props.jumpToPage = this.state.jumpToPage;
				props.handleDownload = downloadUserTrades;
				break;
			case 1:
				props.title = STRINGS["TRANSACTION_HISTORY.TITLE_DEPOSITS"];
				props.headers = headers.deposits;
				props.data = deposits;
				props.filename = `deposit-history-${moment().unix()}`;
				props.handleNext = this.handleNext;
				props.jumpToPage = this.state.jumpToPage;
				props.handleDownload = downloadUserDeposit;
				break;
			case 2:
				props.title = STRINGS["TRANSACTION_HISTORY.TITLE_WITHDRAWALS"];
				props.headers = headers.withdrawals;
				props.data = withdrawals;
				props.filename = `withdrawal-history-${moment().unix()}`;
				props.handleNext = this.handleNext;
				props.jumpToPage = this.state.jumpToPage;
				props.handleDownload = downloadUserWithdrawal;
				break;
			default:
				return <div />;
		}

		return <HistoryDisplay {...props} />;
	};

	render() {
		const { id, activeTheme, coins, icons: ICONS } = this.props;
		let { activeTab, dialogIsOpen, amount, currency } = this.state;
		const { onCloseDialog } = this;

		if (!id) {
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
						text={STRINGS["TRANSACTION_HISTORY.TITLE"]}
						iconId="TRANSACTION_HISTORY"
						iconPath={ICONS["TRANSACTION_HISTORY"]}
						textType="title"
					/>
				)}
				<TabController
					tabs={[
						{
							title: isMobile ? (
								STRINGS["TRANSACTION_HISTORY.TRADES"]
							) : (
									<CheckTitle
										stringId="TRANSACTION_HISTORY.TRADES"
										title={STRINGS["TRANSACTION_HISTORY.TRADES"]}
										iconId="TRADE_HISTORY"
										icon={ICONS["TRADE_HISTORY"]}
									/>
								)
						},
						{
							title: isMobile ? (
								STRINGS["TRANSACTION_HISTORY.DEPOSITS"]
							) : (
									<CheckTitle
										stringId="TRANSACTION_HISTORY.DEPOSITS"
										title={STRINGS["TRANSACTION_HISTORY.DEPOSITS"]}
										iconId="DEPOSIT_HISTORY"
										icon={ICONS["DEPOSIT_HISTORY"]}
									/>
								)
						},
						{
							title: isMobile ? (
								STRINGS["TRANSACTION_HISTORY.WITHDRAWALS"]
							) : (
									<CheckTitle
										stringId="TRANSACTION_HISTORY.WITHDRAWALS"
										title={STRINGS["TRANSACTION_HISTORY.WITHDRAWALS"]}
										iconId="WITHDRAW_HISTORY"
										icon={ICONS["WITHDRAW_HISTORY"]}
									/>
								)
						}
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
							iconId="CANCEL_WITHDRAW_DARK,CANCEL_WITHDRAW_LIGHT"
							iconPath={activeTheme === 'dark' ? ICONS["CANCEL_WITHDRAW_DARK"] : ICONS["CANCEL_WITHDRAW_LIGHT"]}
							stringId="CANCEL_BASE_WITHDRAWAL"
							text={STRINGS.formatString(
								STRINGS["CANCEL_BASE_WITHDRAWAL"],
								coins[currency].fullname
							)}
							textType="title"
							underline={true}
							className="w-100"
						/>
						<div>
							<div className='text-center mt-5 mb-5'>
								<div>{STRINGS["CANCEL_WITHDRAWAL_POPUP_CONFIRM"]}</div>
								<div className={classnames(...GROUP_CLASSES)}>
									<CurrencyBallWithPrice symbol={coins[currency].symbol} amount={amount} price={1} />
								</div>
							</div>
							<div className='w-100 buttons-wrapper d-flex' >
								<Button label={STRINGS["BACK_TEXT"]} onClick={this.onClose} />
								<div className='separator' />
								<Button label={STRINGS["CANCEL_WITHDRAWAL"]} onClick={this.withdrawalCancel} />
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
	pairs: store.app.pairs,
	coins: store.app.coins,
	id: store.user.id,
	trades: store.wallet.trades,
	deposits: store.wallet.deposits,
	withdrawals: store.wallet.withdrawals,
	symbol: store.orderbook.symbol,
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	cancelData: store.wallet.withdrawalCancelData,
	discount: store.user.discount || 0
});

const mapDispatchToProps = (dispatch) => ({
	getUserTrades: (limit, page = 1) => dispatch(getUserTrades({ limit, page })),
	getUserDeposits: (coin, limit, page = 1) => dispatch(getUserDeposits({ coin, limit, page })),
	getUserWithdrawals: (coin, limit, page = 1) => dispatch(getUserWithdrawals({ coin, limit, page })),
	withdrawalCancel: (transactionId) => dispatch(withdrawalCancel({ transactionId })),
	downloadUserTrades: () => dispatch(downloadUserTrades('trade')),
	downloadUserDeposit: () => dispatch(downloadUserTrades('deposit')),
	downloadUserWithdrawal: () => dispatch(downloadUserTrades('withdrawal')),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withConfig(TransactionsHistory)
);
