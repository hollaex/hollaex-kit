import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OtpForm, Loader, Notification } from '../../components';
import { NOTIFICATIONS } from '../../actions/appActions';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { PopupInfo, TokenCreatedInfo } from './DeveloperSection';
import { formValueSelector } from 'redux-form';
import { TokenForm, generateFormValues, FORM_NAME } from './ApiKeyForm';
import { tokenKeyValidation } from '../../components/Form/validations';

export const TYPE_REVOKE = 'TYPE_REVOKE';
export const TYPE_GENERATE = 'TYPE_GENERATE';

class ApiKeyModal extends Component {
	state = {
		dialogOtpOpen: false,
		loading: false,
		tokenName: '',
		tokenKey: '',
		secret: ''
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!this.state.dialogOtpOpen &&
			nextProps.tokenName !== this.props.tokenName
		) {
			this.setTokenName(nextProps.tokenName);
		}
	}

	setTokenKey = (tokenKey) => {
		this.setState({ tokenKey });
	};
	setTokenName = (tokenName) => {
		this.setState({ tokenName });
	};
	onClickNext = () => {
		this.setState({ dialogOtpOpen: true });
	};

	onSubmit = (values) => {
		this.setState({ loading: true });
		const { otp_code } = values;
		const { tokenName } = this.state;
		let submit =
			this.props.notificationType === TYPE_REVOKE
				? this.props.onRevoke
				: this.props.onGenerate;
		return submit(otp_code, tokenName).then((res) => {
			if (typeof res === 'object') {
				const { apiKey, secret } = res;
				this.setState({
					tokenKey: apiKey,
					secret,
					dialogOtpOpen: false,
					loading: false
				});
			} else {
				this.setState({
					tokenKey: res,
					secret: '',
					dialogOtpOpen: false,
					loading: false
				});
			}
		});
	};

	onCloseDialog = () => {
		this.props.onCloseDialog();
	};

	render() {
		const {
			dialogOtpOpen,
			loading,
			tokenName,
			tokenKey,
			secret
		} = this.state;
		const { notificationType, openContactForm, activeTheme } = this.props;
		if (dialogOtpOpen) {
			return (
				<OtpForm onSubmit={this.onSubmit} onClickHelp={openContactForm} />
			);
		} else if (loading) {
			return <Loader relative={true} background={false} />;
		} else if (secret !== '') {
			const token = {
				tokenKey,
				secret
			};
			return (
				<Notification
					icon={
						ICONS[`TOKEN_CREATED${activeTheme === 'dark' ? '_DARK' : ''}`]
					}
					onClose={this.onCloseDialog}
					type={NOTIFICATIONS.CREATED_API_KEY}
				>
					<TokenCreatedInfo token={token} />
				</Notification>
			);
		} else {
			const icon =
				notificationType === TYPE_REVOKE
					? ICONS.TOKEN_TRASHED
					: ICONS[
							`TOKEN_GENERATE${activeTheme === 'dark' ? '_DARK' : ''}`
					  ];
			const nextLabel =
				notificationType === TYPE_REVOKE
					? STRINGS["DEVELOPERS_TOKENS_POPUP.DELETE"]
					: STRINGS["DEVELOPERS_TOKENS_POPUP.GENERATE"];
			return (
				<Notification
					icon={icon}
					onBack={this.onCloseDialog}
					onNext={this.onClickNext}
					nextLabel={nextLabel}
					disabledNext={
						notificationType === TYPE_GENERATE &&
						!!tokenKeyValidation(tokenName)
					}
					type={NOTIFICATIONS.GENERATE_API_KEY}
				>
					<PopupInfo
						type={
							notificationType === TYPE_REVOKE ? 'DELETE' : 'GENERATE'
						}
					/>
					<TokenForm formFields={generateFormValues(notificationType)} />
				</Notification>
			);
		}
	}
}

const selector = formValueSelector(FORM_NAME);
const mapStateToForm = (state) => ({
	tokenName: selector(state, 'name'),
	activeTheme: state.app.theme
});

export default connect(mapStateToForm)(ApiKeyModal);
