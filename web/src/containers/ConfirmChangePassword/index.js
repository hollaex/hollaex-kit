import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Dialog } from '../../components';
import ResetPasswordSuccess from 'containers/ResetPassword/ResetPasswordSuccess';
import STRINGS from '../../config/localizedStrings';

class ConfirmChangePassword extends Component {
	state = {
		showContactForm: false,
	};

	componentDidMount() {
		let paramsString = window.location.search.replace('?', '');
		let paramsData = {};
		if (paramsString.length) {
			let splitValue = paramsString.split('&');
			splitValue.forEach((value) => {
				let temp = value.split('=');
				paramsData[temp[0]] = temp[1];
			});
		}
		if (paramsData && paramsData.isSuccess) {
			this.setState({ showContactForm: true });
		}
	}

	onCloseDialog = () => {
		this.setState({ showContactForm: false });
		this.props.router.replace('/account');
	};

	render() {
		return (
			<div>
				<Dialog
					isOpen={this.state.showContactForm}
					label="confirm-change-pwd-modal"
					onCloseDialog={this.onCloseDialog}
					theme={this.props.activeTheme}
				>
					{this.state.showContactForm && (
						<div className="confirm-change-pwd-wrapper">
							<ResetPasswordSuccess
								label={STRINGS['CLOSE_TEXT']}
								onClick={this.onCloseDialog}
								is_loginText={false}
							/>
						</div>
					)}
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme,
});

export default connect(mapStateToProps)(ConfirmChangePassword);
