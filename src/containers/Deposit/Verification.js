import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import STRINGS from '../../config/localizedStrings';

import { verifyFiatDeposit } from '../../actions/walletActions';

import { Loader } from '../../components';

const ERROR_VERIFIED = 'Deposit already confirmed';
const ERROR_STATUS = 'Invalid status';
const ERROR_CONFIRMATION = 'Error confirming the payment';
const ERROR_USER_MATCH = 'Card used for payment does not match the user card';

class Verification extends Component {
	state = {
		error: '',
		ready: true,
		deposit_id: '',
		matchCardError: false
	};

	componentWillMount() {
		const { UID, Status } = this.props.location.query;

		this.setReady(UID);

		if (UID && Status === 'OK') {
			this.props.verifyFiatDeposit(UID, Status);
		} else {
			this.setErrorMessage(ERROR_STATUS);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.data.error && !this.props.data.error) {
			this.setErrorMessage(nextProps.data.error);
		} else if (nextProps.data.ready && !this.props.data.ready) {
			nextProps.router.replace('wallet');
		}
	}

	setReady = (deposit_id) => {
		this.setState({ ready: true, deposit_id });
	};

	setErrorMessage = (message) => {
		let error = '';
		let matchCardError = false;
		switch (message) {
			case ERROR_VERIFIED:
				error = STRINGS.DEPOSIT_VERIFICATION_ERROR_VERIFIED;
				break;
			case ERROR_STATUS:
				error = STRINGS.DEPOSIT_VERIFICATION_ERROR_STATUS;
				break;
			case ERROR_USER_MATCH:
				matchCardError = true;
				error = STRINGS.DEPOSIT_VERIFICATION_ERROR;
				break;
			case ERROR_CONFIRMATION:
			default:
				error = STRINGS.DEPOSIT_VERIFICATION_ERROR;
				break;
		}
		this.setState({ error, matchCardError });
	};

	render() {
		const { data } = this.props;
		const { error, ready, deposit_id, matchCardError } = this.state;

		const displayLoader = ready && data.loading && !error;

		return (
			<div className="verification-wrapper d-flex justify-content-center align-items-center f-1">
				<div className="verification-content-wrapper">
					{displayLoader && <Loader relative={true} background={false} />}
					{displayLoader && (
						<div className="verification-message-wrapper text-center">
							<div>{STRINGS.DEPOSIT_VERIFICATION_WAITING_TITLE}</div>
							<div>{STRINGS.DEPOSIT_VERIFICATION_WAITING_MESSAGE}</div>
						</div>
					)}
					{ready &&
						data.ready && (
							<div className="verification-message-wrapper">
								{STRINGS.DEPOSIT_VERIFICATION_SUCCESS}
							</div>
						)}
					{error && (
						<div className="verification-message-wrapper text-center">
							<div className="warning_text error pl-4 pr-4">{error}</div>
							{deposit_id && (
								<div className="block-wrapper pl-4 pr-4">
									{!matchCardError && (
										<div>{STRINGS.DEPOSIT_VERIFICATION_WARNING_MESSAGE}</div>
									)}
									<div>
										{matchCardError
											? STRINGS.DEPOSIT_VERIFICATION_ERROR_USER_MATCH
											: STRINGS.formatString(
													STRINGS.DEPOSIT_VERIFICATION_WARNING_INFORMATION,
													deposit_id
												)}
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	data: store.wallet.depositVerification
});

const mapDispatchToProps = (dispatch) => ({
	verifyFiatDeposit: bindActionCreators(verifyFiatDeposit, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
