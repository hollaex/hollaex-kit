import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	removeStake,
	generateTableData,
	getAllUserStakes,
	getPendingTransactions,
} from 'actions/stakingActions';
import withConfig from 'components/ConfigProvider/withConfig';
import mathjs from 'mathjs';

import ReviewUnstake from './ReviewUnstake';
import WaitingContent from './WaitingContent';
import SuccessContent from './SuccessfulUnstakeContent';
import ErrorContent from './ErrorContent';

const CONTENT_TYPE = {
	REVIEW: 'REVIEW',
	WAITING: 'WAITING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
};

const ACTION_TYPE = {
	UNSTAKE: 'UNSTAKE',
};

class UnstakeContent extends Component {
	state = {
		type: CONTENT_TYPE.REVIEW,
		action: ACTION_TYPE.UNSTAKE,
		isPending: false,
	};

	approveAndUnstake = (symbol) => async ({ account, index }) => {
		const {
			generateTableData,
			getAllUserStakes,
			getPendingTransactions,
		} = this.props;

		this.setAction(ACTION_TYPE.UNSTAKE, false);
		this.setContent(CONTENT_TYPE.WAITING);
		try {
			await removeStake(symbol)({
				account,
				index,
				cb: () => this.setAction(ACTION_TYPE.UNSTAKE, true),
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
		const { account, stakeData, onCloseDialog } = this.props;
		const { action, isPending } = this.state;

		const { index, symbol, amount, reward } = stakeData;
		const amountToReceive = mathjs.add(amount, reward);

		switch (type) {
			case CONTENT_TYPE.REVIEW:
				return (
					<ReviewUnstake
						stakeData={stakeData}
						onClose={onCloseDialog}
						onCancel={onCloseDialog}
						onProceed={() => this.approveAndUnstake(symbol)({ account, index })}
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
					<SuccessContent
						stakeData={stakeData}
						account={account}
						action={action}
						originalAmount={amount}
						amountToReceive={amountToReceive}
						symbol={symbol}
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
	account: store.stake.account,
});

const mapDispatchToProps = (dispatch) => ({
	generateTableData: bindActionCreators(generateTableData, dispatch),
	getAllUserStakes: bindActionCreators(getAllUserStakes, dispatch),
	getPendingTransactions: bindActionCreators(getPendingTransactions, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(UnstakeContent));
