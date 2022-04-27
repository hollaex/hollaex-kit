import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withConfig from 'components/ConfigProvider/withConfig';
import { withRouter } from 'react-router';
import { setSnackNotification } from 'actions/appActions';
import STRINGS from 'config/localizedStrings';

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

	onCopy = () => {
		const { icons: ICONS, setSnackNotification } = this.props;
		setSnackNotification({
			icon: ICONS.COPY_NOTIFICATION,
			content: STRINGS['COPY_SUCCESS_TEXT'],
		});
	};

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
						onCopy={this.onCopy}
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

const mapDispatchToProps = (dispatch) => ({
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(withConfig(MoveXHTContent)));
