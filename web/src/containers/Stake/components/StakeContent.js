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
} from 'actions/stakingActions';

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
		} else if (mathjs.smaller(value, 0)) {
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

		this.setAction(ACTION_TYPE.WITHDRAW, false);
		this.setContent(CONTENT_TYPE.WAITING);
		try {
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
		} = this.props;
		const { period, amount, action, isPending } = this.state;
		const { symbol } = tokenData;
		switch (type) {
			case CONTENT_TYPE.AMOUNT:
				return (
					<AmountContent
						tokenData={tokenData}
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
						onBack={() => this.setContent(CONTENT_TYPE.AMOUNT)}
						onReview={() => this.setContent(CONTENT_TYPE.REVIEW)}
						setPeriod={this.setPeriod}
						currentBlock={currentBlock}
						period={period}
						amount={amount}
					/>
				);
			case CONTENT_TYPE.REVIEW:
				return (
					<ReviewContent
						tokenData={tokenData}
						onCancel={() => this.setContent(CONTENT_TYPE.PERIOD)}
						onProceed={() =>
							this.approveAndStake(symbol)({ amount, period, account })
						}
						currentBlock={currentBlock}
						period={period}
						amount={amount}
					/>
				);
			case CONTENT_TYPE.WAITING:
				return (
					<WaitingContent
						isPending={isPending}
						action={action}
						amount={amount}
						symbol={symbol}
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
