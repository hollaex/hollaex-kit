import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	requestTokens,
	revokeToken,
	generateToken,
	tokenGenerated,
	tokenRevoked,
} from '../../actions/userAction';
import { Table, Dialog, Loader } from '../../components';
import { generateHeaders } from './ApiKeyHeaders';
import ApiKeyModal, { TYPE_GENERATE, TYPE_REVOKE } from './ApiKeyModal';
import { openContactForm } from 'actions/appActions';
import { errorHandler } from '../../components/OtpForm/utils';
import { NoOtpEnabled, OtpEnabled } from './DeveloperSection';
import withConfig from 'components/ConfigProvider/withConfig';

const INITIAL_STATE = {
	dialogIsOpen: false,
	dialogType: '',
	tokenId: -1,
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
			})
			.catch(errorHandler);
	};

	onGenerateToken = (otp_code, name) => {
		return generateToken({ otp_code, name })
			.then(({ data }) => {
				this.props.tokenGenerated(data);
				return data;
			})
			.catch(errorHandler);
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

		const { dialogIsOpen, dialogType } = this.state;
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
