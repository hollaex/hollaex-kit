import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeStake } from 'actions/stakingActions';
import withConfig from 'components/ConfigProvider/withConfig';

import WarningContent from './WarningContent';
import ReviewEarlyUnstake from './ReviewEarlyUnstake';

const CONTENT_TYPE = {
	WARNING: 'WARNING',
	REVIEW: 'REVIEW',
	WAITING: 'WAITING',
};

class StakeContent extends Component {
	state = {
		type: CONTENT_TYPE.WARNING,
	};

	renderContent = (type) => {
		const { account, stakeData, onCloseDialog } = this.props;

		const { index, symbol } = stakeData;

		switch (type) {
			case CONTENT_TYPE.WARNING:
				return (
					<WarningContent
						onBack={onCloseDialog}
						onReview={() => this.setContent(CONTENT_TYPE.REVIEW)}
					/>
				);
			case CONTENT_TYPE.REVIEW:
				return (
					<ReviewEarlyUnstake
						stakeData={stakeData}
						onCancel={() => this.setContent(CONTENT_TYPE.WARNING)}
						onProceed={() => removeStake(symbol)({ account, index })}
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

		return <Fragment>{this.renderContent(type)}</Fragment>;
	}
}

const mapStateToProps = (store) => ({
	account: store.stake.account,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(StakeContent));
