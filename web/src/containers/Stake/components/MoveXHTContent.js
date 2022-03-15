import React, { Component } from 'react';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';
import { withRouter } from 'react-router';

import MovePrompt from './MovePrompt';

const CONTENT_TYPE = {
	PROMPT: 'PROMPT',
};

class MoveXHTContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: CONTENT_TYPE.PROMPT,
		};
	}

	onProceed = () => {
		const { router, account, onCloseDialog } = this.props;
		router.push(`/wallet/xht/withdraw?address=${account}&network=eth`);
		onCloseDialog();
	};

	renderContent = (type) => {
		const { account, onCloseDialog } = this.props;

		switch (type) {
			case CONTENT_TYPE.PROMPT:
			default:
				return (
					<MovePrompt
						account={account}
						onBack={onCloseDialog}
						onProceed={this.onProceed}
						onClose={onCloseDialog}
					/>
				);
		}
	};

	render() {
		const { type } = this.state;

		return <div className="w-100">{this.renderContent(type)}</div>;
	}
}

const mapStateToProps = (store) => ({
	account: store.stake.account,
});

export default connect(mapStateToProps)(withRouter(withConfig(MoveXHTContent)));
