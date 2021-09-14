import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import mathjs from 'mathjs';
import { bindActionCreators } from 'redux';
import { approveAndStake } from 'actions/stakingActions';
import withConfig from 'components/ConfigProvider/withConfig';

import AmountContent from './AmountContent';
import PeriodContent from './PeriodContent';
import ReviewContent from './ReviewContent';

const CONTENT_TYPE = {
	AMOUNT: 'amount',
	PERIOD: 'period',
	REVIEW: 'review',
};

class StakeContent extends Component {
	constructor(props) {
		super(props);
		const { periods } = this.props;
		this.state = {
			type: CONTENT_TYPE.AMOUNT,
			amount: '',
			period: '',
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

	renderContent = (type) => {
		const {
			periods,
			currentBlock,
			tokenData,
			onCloseDialog,
			account,
		} = this.props;
		const { period, amount } = this.state;
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
							approveAndStake(symbol)({ amount, period, account })
						}
						currentBlock={currentBlock}
						period={period}
						amount={amount}
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

		return <div className="stake">{this.renderContent(type)}</div>;
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

const mapDispatchToProps = (dispatch) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(StakeContent));
