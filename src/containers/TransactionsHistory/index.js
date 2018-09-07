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

import { IconTitle, TabController, Loader, CheckTitle } from '../../components';
import { ICONS } from '../../config/constants';

import {
	generateTradeHeaders,
	generateTradeHeadersMobile,
	generateDepositsHeaders,
	generateWithdrawalsHeaders
} from './utils';
import HistoryDisplay from './HistoryDisplay';

import STRINGS from '../../config/localizedStrings';

class TransactionsHistory extends Component {
	state = {
		headers: [],
		activeTab: 0
	};

	componentDidMount() {
		this.requestData(this.props.symbol);
		this.generateHeaders(this.props.symbol);
	}

	componentWillReceiveProps(nextProps) {
		// if (nextProps.symbol !== this.props.symbol) {
		// this.requestData(nextProps.symbol);
		// this.generateHeaders(nextProps.symbol, nextProps.activeLanguage);
		// } else if (nextProps.activeLanguage !== this.props.activeLanguage) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateHeaders(nextProps.symbol);
		}
	}

	requestData = (symbol) => {
		// this.props.getUserTrades(symbol);
		this.props.getUserDeposits(symbol);
		this.props.getUserWithdrawals(symbol);
	};

	generateHeaders(symbol) {
		const {cancelWithdrawal}=this
		this.setState({
			headers: {
				trades: isMobile
					? generateTradeHeadersMobile(symbol)
					: generateTradeHeaders(symbol),
				deposits: generateDepositsHeaders(symbol),
				withdrawals: generateWithdrawalsHeaders(symbol, cancelWithdrawal)
			}
		});
	}

	setActiveTab = (activeTab = 0) => {
		this.setState({ activeTab });
	};
	cancelWithdrawal = (transactionId) => {
		this.props.withdrawalCancel(transactionId);
	};

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
		const { id } = this.props;
		const { activeTab } = this.state;

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
				<div className={classnames('inner_container', 'with_border_top')}>
					{this.renderActiveTab()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	id: store.user.id,
	trades: store.wallet.trades,
	deposits: store.wallet.deposits,
	withdrawals: store.wallet.withdrawals,
	symbol: store.orderbook.symbol,
	activeLanguage: store.app.language
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
