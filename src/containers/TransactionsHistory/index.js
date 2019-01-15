import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import {
	getUserTrades,
	getUserDeposits,
	getUserWithdrawals,
	withdrawalCancel
} from '../../actions/walletActions';

import { fiatSymbol } from '../../utils/currency';
import { IconTitle, TabController, Loader, CheckTitle, Dialog, Button, CurrencyBallWithPrice } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES } from '../../config/constants';
import {
	generateTradeHeaders,
	generateTradeHeadersMobile,
	generateDepositsHeaders,
	generateWithdrawalsHeaders
} from './utils';
import HistoryDisplay from './HistoryDisplay';

import STRINGS from '../../config/localizedStrings';

const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];

class TransactionsHistory extends Component {
	state = {
		headers: [],
		activeTab: 0,
		dialogIsOpen: false,
		amount: 0,
		transactionId:0
	};

	componentDidMount() {
		this.requestData(this.props.symbol);
		this.generateHeaders(this.props.symbol);
		if (this.props.location
			&& this.props.location.query
			&& this.props.location.query.tab) {
			this.setActiveTab(parseInt(this.props.location.query.tab, 10));
		}
	}

	componentWillReceiveProps(nextProps) {
		// if (nextProps.symbol !== this.props.symbol) {
		// this.requestData(nextProps.symbol);
		// this.generateHeaders(nextProps.symbol, nextProps.activeLanguage);
		// } else if (nextProps.activeLanguage !== this.props.activeLanguage) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateHeaders(nextProps.symbol);
		}
		if((this.props.cancelData.dismissed !== nextProps.cancelData.dismissed) && nextProps.cancelData.dismissed===true) {
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
		this.setState({ dialogIsOpen: true});
	};

	requestData = (symbol) => {
		// this.props.getUserTrades(symbol);
		this.props.getUserDeposits(symbol);
		this.props.getUserWithdrawals(symbol);
	};

	generateHeaders(symbol) {
		const {withdrawalPopup}=this
		const { pairs } = this.props;
		this.setState({
			headers: {
				trades: isMobile
					? generateTradeHeadersMobile(symbol, pairs)
					: generateTradeHeaders(symbol, pairs),
				deposits: generateDepositsHeaders(symbol),
				withdrawals: generateWithdrawalsHeaders(symbol, withdrawalPopup)
			}
		});
	}

	setActiveTab = (activeTab = 0) => {
		this.setState({ activeTab });
	};
	withdrawalPopup = (id, amount) => {
		if(id) {
			this.setState({ amount:amount, transactionId:id });
			this.openDialog()
		}
	};

	withdrawalCancel = () => {
		const {transactionId} =this.state
		this.props.withdrawalCancel(transactionId);
	}
	onClose = () => {
		this.onCloseDialog()
	}

	renderActiveTab = () => {
		const { trades, deposits, withdrawals, symbol } = this.props;
		const { headers, activeTab } = this.state;
		// const name = STRINGS[`${symbol.toUpperCase()}_NAME`];

		const props = {
			symbol,
			withIcon: true
		};

		switch (activeTab) {
			case 0:
				props.title = `${STRINGS.TRANSACTION_HISTORY.TITLE_TRADES}`;
				props.headers = headers.trades;
				props.data = trades;
				props.filename = `${symbol}-transfers_history`;
				props.withIcon = false;
				break;
			case 1:
				props.title = STRINGS.TRANSACTION_HISTORY.TITLE_DEPOSITS;
				props.headers = headers.deposits;
				props.data = deposits;
				props.filename = `${symbol}-deposits_history`;
				break;
			case 2:
				props.title = STRINGS.TRANSACTION_HISTORY.TITLE_WITHDRAWALS;
				props.headers = headers.withdrawals;
				props.data = withdrawals;
				props.filename = `${symbol}-withdrawals_history`;
				break;
			default:
				return <div />;
		}

		return <HistoryDisplay {...props} />;
	};

	render() {
		const { id, activeTheme, symbol, cancelData } = this.props;
		const { activeTab, dialogIsOpen, amount } = this.state;
		const {onCloseDialog} =this;
		const shortName = STRINGS[`${symbol.toUpperCase()}_SHORTNAME`];

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
						text={STRINGS.TRANSACTION_HISTORY.TITLE}
						iconPath={ICONS.TRANSACTION_HISTORY}
						textType="title"
						useSvg={true}
					/>
				)}
				<TabController
					tabs={[
						{
							title: isMobile ? (
								STRINGS.TRANSACTION_HISTORY.TRADES
							) : (
								<CheckTitle
									title={STRINGS.TRANSACTION_HISTORY.TRADES}
									icon={ICONS.TRADE_HISTORY}
								/>
							)
						},
						{
							title: isMobile ? (
								STRINGS.TRANSACTION_HISTORY.DEPOSITS
							) : (
								<CheckTitle
									title={STRINGS.TRANSACTION_HISTORY.DEPOSITS}
									icon={ICONS.DEPOSIT_HISTORY}
								/>
							)
						},
						{
							title: isMobile ? (
								STRINGS.TRANSACTION_HISTORY.WITHDRAWALS
							) : (
								<CheckTitle
									title={STRINGS.TRANSACTION_HISTORY.WITHDRAWALS}
									icon={ICONS.WITHDRAW_HISTORY}
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
							iconPath={activeTheme ==='dark' ? ICONS.CANCEL_WITHDRAW_DARK: ICONS.CANCEL_WITHDRAW_LIGHT }
							text={STRINGS.formatString(
								STRINGS.CANCEL_FIAT_WITHDRAWAL,
								STRINGS.FIAT_FULLNAME
							)}
							textType="title"
							underline={true}
							className="w-100"
						/>
						<div>
							<div className='text-center mt-5 mb-5'>
								<div>{STRINGS.CANCEL_WITHDRAWAL_POPUP_CONFIRM}</div> 
								<div className={classnames(...GROUP_CLASSES)}>
									<CurrencyBallWithPrice  symbol={fiatSymbol} amount={amount} price={1} />
								</div>
							</div>
							<div className='w-100 buttons-wrapper d-flex' >
								<Button label={STRINGS.BACK_TEXT} onClick={this.onClose}/>
								<div className='separator' />
								<Button label={STRINGS.CANCEL_WITHDRAWAL} onClick={this.withdrawalCancel}/>
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
	id: store.user.id,
	trades: store.wallet.trades,
	deposits: store.wallet.deposits,
	withdrawals: store.wallet.withdrawals,
	symbol: store.orderbook.symbol,
	activeLanguage: store.app.language,
	activeTheme: store.app.theme,
	cancelData: store.wallet.withdrawalCancelData,
});

const mapDispatchToProps = (dispatch) => ({
	getUserTrades: (symbol) => dispatch(getUserTrades({ symbol })),
	getUserDeposits: (symbol) => dispatch(getUserDeposits({ symbol })),
	getUserWithdrawals: (symbol) => dispatch(getUserWithdrawals({ symbol })),
	withdrawalCancel: (transactionId) => dispatch(withdrawalCancel({ transactionId }))
});

export default connect(mapStateToProps, mapDispatchToProps)(
	TransactionsHistory
);
