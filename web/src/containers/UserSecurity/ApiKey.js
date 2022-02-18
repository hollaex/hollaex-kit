import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	requestTokens,
	revokeToken,
	generateToken,
	tokenGenerated,
	tokenRevoked,
	editToken,
} from 'actions/userAction';
import { Table, Dialog, Loader, EmailCodeForm, OtpForm } from 'components';
import { generateHeaders } from './ApiKeyHeaders';
import ApiKeyModal, { TYPE_GENERATE, TYPE_REVOKE } from './ApiKeyModal';
import { openContactForm } from 'actions/appActions';
import { errorHandler } from '../../components/OtpForm/utils';
import { NoOtpEnabled, OtpEnabled } from './DeveloperSection';
import withConfig from 'components/ConfigProvider/withConfig';
import EditToken from './EditToken';

const OTP = 'OTP';
const EMAIL = 'EMAIL';

const INITIAL_STATE = {
	dialogIsOpen: false,
	dialogType: '',
	tokenId: -1,
	isCodeDialog: false,
	codeType: OTP,
	otp_code: '',
	editData: {},
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

	onRevokeToken = (otp_code) => {
		return revokeToken(this.state.tokenId, otp_code)
			.then((resp) => {
				const { data } = resp;
				this.props.tokenRevoked(data);
				this.onCloseDialog();
				this.requestTokens();
			})
			.catch(errorHandler);
	};

	onGenerateToken = (otp_code, name, email_code) => {
		return generateToken({ otp_code, name, email_code })
			.then(({ data }) => {
				this.props.tokenGenerated(data);
				this.requestTokens();
				return data;
			})
			.catch(errorHandler);
	};

	onEditToken = (values) => {
		return editToken({ ...values })
			.then(({ data }) => {
				this.requestTokens();
				return data;
			})
			.catch(errorHandler);
	};

	onSubmitOTP = ({ otp_code }) => {
		this.setState({
			otp_code,
			codeType: EMAIL,
		});
	};

	onSubmitEmail = ({ email_code }) => {
		const { otp_code, editData } = this.state;

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

		const { dialogIsOpen, dialogType, isCodeDialog, codeType } = this.state;
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
									expandedRowRender: (record) => (
										<EditToken {...record} onEdit={this.onEdit} />
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
					/>
				</Dialog>
				<Dialog
					isOpen={isCodeDialog}
					label="token-modal"
					theme={activeTheme}
					onCloseDialog={this.onCloseDialog}
				>
					{codeType === OTP && (
						<OtpForm
							onSubmit={this.onSubmitOTP}
							onClickHelp={openContactForm}
						/>
					)}
					{codeType === EMAIL && (
						<EmailCodeForm onSubmit={this.onSubmitEmail} />
					)}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(ApiKey));
