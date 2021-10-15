import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	removeStake,
	generateTableData,
	getAllUserStakes,
	distribute,
} from 'actions/stakingActions';
import withConfig from 'components/ConfigProvider/withConfig';

import ReviewUnstake from './ReviewUnstake';
import WaitingContent from './WaitingContent';
import SuccessContent from './SuccessfulUnstakeContent';
import ErrorContent from './ErrorContent';
import ClearPendingEarningsContent from './ClearPendingEarningsContent';

const CONTENT_TYPE = {
	REVIEW: 'REVIEW',
	WAITING: 'WAITING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
	CLEAR: 'CLEAR',
};

const ACTION_TYPE = {
	UNSTAKE: 'UNSTAKE',
};

class UnstakeContent extends Component {
	state = {
		type: CONTENT_TYPE.REVIEW,
		action: ACTION_TYPE.UNSTAKE,
	};

	approveAndUnstake = (symbol) => async ({ account, index }) => {
		const { generateTableData, getAllUserStakes } = this.props;
		this.setContent(CONTENT_TYPE.WAITING);
		try {
			this.setState({ action: ACTION_TYPE.UNSTAKE });
			await removeStake(symbol)({ account, index });
			await Promise.all([
				generateTableData(account),
				getAllUserStakes(account),
			]);
			this.setContent(CONTENT_TYPE.SUCCESS);
		} catch (err) {
			console.error(err);
			this.setContent(CONTENT_TYPE.ERROR);
		}
	};

	clearPendingEarnings = (symbol) => async ({ account }) => {
		this.setContent(CONTENT_TYPE.WAITING);
		try {
			await distribute(symbol)({ account });
			await Promise.all([
				generateTableData(account),
				getAllUserStakes(account),
			]);
		} catch (err) {
			console.error(err);
			this.setContent(CONTENT_TYPE.ERROR);
		}
	};

	renderContent = (type) => {
		const { account, stakeData, onCloseDialog } = this.props;
		const { action } = this.state;

		const { index, symbol, amount } = stakeData;

		switch (type) {
			case CONTENT_TYPE.REVIEW:
				return (
					<ReviewUnstake
						stakeData={stakeData}
						onCancel={onCloseDialog}
						onProceed={() => this.approveAndUnstake(symbol)({ account, index })}
						onClear={() => this.setContent(CONTENT_TYPE.CLEAR)}
					/>
				);
			case CONTENT_TYPE.WAITING:
				return (
					<WaitingContent action={action} amount={amount} symbol={symbol} />
				);
			case CONTENT_TYPE.SUCCESS:
				return (
					<SuccessContent
						stakeData={stakeData}
						account={account}
						action={action}
						amount={amount}
						symbol={symbol}
						onOkay={onCloseDialog}
					/>
				);
			case CONTENT_TYPE.ERROR:
				return <ErrorContent action={action} onOkay={onCloseDialog} />;
			case CONTENT_TYPE.CLEAR:
				return (
					<ClearPendingEarningsContent
						stakeData={stakeData}
						onProceed={() => this.clearPendingEarnings(symbol)({ account })}
						onBack={() => this.setContent(CONTENT_TYPE.REVIEW)}
					/>
				);
			default:
				return <div>No Content</div>;
		}
	};

	setContent = (type) => {
		this.setState({
			type,
		});
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
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(UnstakeContent));
