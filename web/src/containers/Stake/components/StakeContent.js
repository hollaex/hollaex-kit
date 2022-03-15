import React, { Component } from 'react';
import { connect } from 'react-redux';
import mathjs from 'mathjs';
import { bindActionCreators } from 'redux';
import { approve, addStake } from 'actions/stakingActions';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	generateTableData,
	getAllUserStakes,
	getPendingTransactions,
	getTokenAllowance,
} from 'actions/stakingActions';
import { open } from 'helpers/link';
import { STAKING_INDEX_COIN } from 'config/contracts';

import AllowanceLoader from './AllowanceLoader';
import AmountContent from './AmountContent';
import PeriodContent from './PeriodContent';
import ReviewContent from './ReviewContent';
import WaitingContent from './WaitingContent';
import SuccessfulStakeContent from './SuccessfulStakeContent';
import ErrorContent from './ErrorContent';

const CONTENT_TYPE = {
	AMOUNT: 'AMOUNT',
	PERIOD: 'PERIOD',
	REVIEW: 'REVIEW',
	WAITING: 'WAITING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
	LOADING: 'LOADING',
};

const ACTION_TYPE = {
	STAKE: 'STAKE',
	WITHDRAW: 'WITHDRAW',
};

class StakeContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: CONTENT_TYPE.AMOUNT,
			amount: '',
			period: '',
			action: ACTION_TYPE.STAKE,
			pending: false,
		};
	}

	setPeriod = ({ target: { value: period } }) => {
		this.setState({ period });
	};

	setAmount = ({ target: { value } }) => {
		const {
			tokenData: { available },
		} = this.props;
		let amount;
		if (mathjs.larger(value, available)) {
			amount = available;
		} else if (mathjs.smallerEq(value, 0)) {
			amount = 0;
		} else {
			amount = value;
		}
		this.setState({ amount });
	};

	approveAndStake = (symbol) => async ({ amount, period, account }) => {
		const {
			generateTableData,
			getAllUserStakes,
			getPendingTransactions,
		} = this.props;

		this.setContent(CONTENT_TYPE.LOADING);

		try {
			const allowance = await getTokenAllowance(symbol)(account);
			if (mathjs.larger(allowance, amount)) {
				this.setAction(ACTION_TYPE.STAKE, false);
				this.setContent(CONTENT_TYPE.WAITING);
				await addStake(symbol)({
					amount,
					period,
					account,
					cb: () => this.setAction(ACTION_TYPE.STAKE, true),
				});
				await Promise.all([
					generateTableData(account),
					getAllUserStakes(account),
					getPendingTransactions(account),
				]);
				this.setContent(CONTENT_TYPE.SUCCESS);
			} else {
				this.setAction(ACTION_TYPE.WITHDRAW, false);
				this.setContent(CONTENT_TYPE.WAITING);

				await approve(symbol)({
					amount,
					account,
					cb: () => this.setAction(ACTION_TYPE.WITHDRAW, true),
				});
				this.setAction(ACTION_TYPE.STAKE, false);
				await addStake(symbol)({
					amount,
					period,
					account,
					cb: () => this.setAction(ACTION_TYPE.STAKE, true),
				});
				await Promise.all([
					generateTableData(account),
					getAllUserStakes(account),
					getPendingTransactions(account),
				]);
				this.setContent(CONTENT_TYPE.SUCCESS);
			}
		} catch (err) {
			console.error(err);
			this.setContent(CONTENT_TYPE.ERROR);
		}
	};

	renderContent = (type) => {
		const {
			periods,
			currentBlock,
			tokenData,
			onCloseDialog,
			account,
			penalties,
		} = this.props;
		const { period, amount, action, isPending } = this.state;
		const { symbol } = tokenData;
		switch (type) {
			case CONTENT_TYPE.LOADING:
				return <AllowanceLoader symbol={symbol} />;
			case CONTENT_TYPE.AMOUNT:
				return (
					<AmountContent
						tokenData={tokenData}
						onClose={onCloseDialog}
						onBack={onCloseDialog}
						onNext={() => this.setContent(CONTENT_TYPE.PERIOD)}
						amount={amount}
						setAmount={this.setAmount}
					/>
				);
			case CONTENT_TYPE.PERIOD:
				return (
					<PeriodContent
						tokenData={tokenData}
						periods={periods}
						onClose={onCloseDialog}
						onBack={() => this.setContent(CONTENT_TYPE.AMOUNT)}
						onReview={() => this.setContent(CONTENT_TYPE.REVIEW)}
						setPeriod={this.setPeriod}
						currentBlock={currentBlock}
						period={period}
						amount={amount}
						openReadMore={this.openReadMore}
					/>
				);
			case CONTENT_TYPE.REVIEW:
				return (
					<ReviewContent
						tokenData={tokenData}
						onClose={onCloseDialog}
						onCancel={() => this.setContent(CONTENT_TYPE.PERIOD)}
						onProceed={() =>
							this.approveAndStake(symbol)({ amount, period, account })
						}
						currentBlock={currentBlock}
						period={period}
						amount={amount}
						penalty={penalties[symbol]}
					/>
				);
			case CONTENT_TYPE.WAITING:
				return (
					<WaitingContent
						isPending={isPending}
						action={action}
						amount={amount}
						symbol={symbol}
						onClose={onCloseDialog}
					/>
				);
			case CONTENT_TYPE.SUCCESS:
				return (
					<SuccessfulStakeContent
						tokenData={tokenData}
						account={account}
						action={action}
						period={period}
						amount={amount}
						symbol={symbol}
						currentBlock={currentBlock}
						onOkay={onCloseDialog}
					/>
				);
			case CONTENT_TYPE.ERROR:
				return <ErrorContent action={action} onOkay={onCloseDialog} />;
			default:
				return <div>No Content</div>;
		}
	};

	setContent = (type) => {
		this.setState({
			type,
		});
	};

	setAction = (action, isPending) => {
		this.setState({ action, isPending });
	};

	openReadMore = () => {
		const {
			contracts: {
				[STAKING_INDEX_COIN]: { whitepaper },
			},
		} = this.props;
		if (whitepaper) {
			open(whitepaper);
		}
	};

	render() {
		const { type } = this.state;

		return <div className="w-100">{this.renderContent(type)}</div>;
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
	account: store.stake.account,
	network: store.stake.network,
	currentBlock: store.stake.currentBlock,
	stakables: store.stake.stakables,
	periods: store.stake.periods,
	penalties: store.stake.penalties,
	contracts: store.app.contracts,
});

const mapDispatchToProps = (dispatch) => ({
	generateTableData: bindActionCreators(generateTableData, dispatch),
	getAllUserStakes: bindActionCreators(getAllUserStakes, dispatch),
	getPendingTransactions: bindActionCreators(getPendingTransactions, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(StakeContent));
