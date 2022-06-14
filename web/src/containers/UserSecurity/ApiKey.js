import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setNotification } from 'actions/appActions';
import {
	requestTokens,
	revokeToken,
	generateToken,
	tokenGenerated,
	tokenRevoked,
	editToken,
} from 'actions/userAction';
import { Table, Dialog, Loader, EmailCodeForm } from 'components';
import { generateHeaders } from './ApiKeyHeaders';
import ApiKeyModal, { TYPE_GENERATE, TYPE_REVOKE } from './ApiKeyModal';
import { openContactForm, NOTIFICATIONS } from 'actions/appActions';
import { NoOtpEnabled, OtpEnabled } from './DeveloperSection';
import withConfig from 'components/ConfigProvider/withConfig';
import EditToken from './EditToken';

const INITIAL_STATE = {
	dialogIsOpen: false,
	dialogType: '',
	tokenId: -1,
	isCodeDialog: false,
	editData: {},
	pending: false,
};
class ApiKey extends Component {
	state = INITIAL_STATE;

	componentDidMount() {
		this.requestTokens();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!nextProps.submitting &&
			nextProps.submitting !== this.props.submitting
		) {
			this.onCloseDialog();
		}
	}

	requestTokens = () => {
		this.props.requestTokens();
	};

	openDialog = () => {
		this.setState({ dialogIsOpen: true, dialogType: TYPE_GENERATE });
	};

	onCloseDialog = () => {
		this.setState(INITIAL_STATE);
	};

	onClickRevokeToken = (tokenId) => {
		this.setState({ dialogIsOpen: true, dialogType: TYPE_REVOKE, tokenId });
	};

	onRevokeToken = (otp_code, email_code) => {
		this.setPending();
		return revokeToken(this.state.tokenId, otp_code, email_code)
			.then((resp) => {
				const { data } = resp;
				this.props.tokenRevoked(data);
				this.onCloseDialog();
				this.requestTokens();
			})
			.catch(this.onError);
	};

	onGenerateToken = (otp_code, email_code, name) => {
		this.setPending();
		return generateToken({ otp_code, name, email_code })
			.then(({ data: { key: apiKey, ...rest } }) => {
				const response = { apiKey, ...rest };
				this.props.tokenGenerated(response);
				return response;
			})
			.catch(this.onError);
	};

	onEditToken = (values) => {
		this.setPending();
		return editToken({ ...values })
			.then(({ data }) => {
				this.requestTokens();
				return data;
			})
			.catch(this.onError);
	};

	onSubmitEmail = ({ email_code, otp_code }) => {
		const { editData } = this.state;

		this.onEditToken({ ...editData, email_code, otp_code }).then(() => {
			this.onCloseDialog();
		});
	};

	onEdit = (editData) => {
		this.setState({
			editData,
			isCodeDialog: true,
		});
	};

	onError = (err) => {
		this.onCloseDialog();
		const message =
			err.response && err.response.data && err.response.data.message
				? err.response.data.message
				: err.message || JSON.stringify(err);
		this.props.setNotification(NOTIFICATIONS.ERROR, message);
	};

	setPending = (pending = true) => this.setState({ pending });

	render() {
		const {
			tokens,
			openContactForm,
			fetching,
			otp_enabled,
			openOtp,
			activeTheme,
			icons: ICONS,
		} = this.props;

		const { dialogIsOpen, dialogType, isCodeDialog, pending } = this.state;
		return (
			<div>
				{otp_enabled ? (
					<OtpEnabled fetching={fetching} openDialog={this.openDialog} />
				) : (
					<NoOtpEnabled openOtp={openOtp} />
				)}
				<div>
					{!fetching ? (
						!otp_enabled && tokens.count === 0 ? (
							<div />
						) : (
							<Table
								rowClassName="pt-2 pb-2"
								headers={generateHeaders(
									this.onClickRevokeToken,
									otp_enabled,
									ICONS
								)}
								data={tokens.data}
								rowKey={(data) => {
									return data.id;
								}}
								count={tokens.count}
								expandable={{
									rowExpandable: () => true,
									defaultExpanded: (row, index) => index === 0,
									expandedRowRender: (record) => (
										<EditToken
											{...record}
											onEdit={this.onEdit}
											otp_enabled={otp_enabled}
										/>
									),
								}}
							/>
						)
					) : (
						otp_enabled && <Loader relative={true} background={false} />
					)}
				</div>
				<Dialog
					isOpen={dialogIsOpen}
					label="token-modal"
					theme={activeTheme}
					onCloseDialog={this.onCloseDialog}
				>
					<ApiKeyModal
						onCloseDialog={this.onCloseDialog}
						notificationType={dialogType}
						onGenerate={this.onGenerateToken}
						onRevoke={this.onRevokeToken}
						openContactForm={openContactForm}
						pending={pending}
					/>
				</Dialog>
				<Dialog
					isOpen={isCodeDialog}
					label="token-modal"
					theme={activeTheme}
					onCloseDialog={this.onCloseDialog}
				>
					<EmailCodeForm onSubmit={this.onSubmitEmail} pending={pending} />
				</Dialog>
			</div>
		);
	}
}

ApiKey.defaultProps = {
	tokens: [],
	openOtp: () => {},
	generateKey: () => {},
};

const mapStateToProps = (state) => ({
	tokens: state.user.tokens,
	fetching: state.user.fetching,
	error: state.user.error,
	activeTheme: state.app.theme,
	constants: state.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
	requestTokens: bindActionCreators(requestTokens, dispatch),
	tokenGenerated: bindActionCreators(tokenGenerated, dispatch),
	tokenRevoked: bindActionCreators(tokenRevoked, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(ApiKey));
