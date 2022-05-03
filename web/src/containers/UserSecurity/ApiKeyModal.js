import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loader, Notification, EmailCodeForm } from 'components';
import { NOTIFICATIONS } from 'actions/appActions';
import STRINGS from 'config/localizedStrings';
import { PopupInfo, TokenCreatedInfo } from './DeveloperSection';
import { formValueSelector } from 'redux-form';
import { TokenForm, generateFormValues, FORM_NAME } from './ApiKeyForm';
import { tokenKeyValidation } from 'components/Form/validations';
import withConfig from 'components/ConfigProvider/withConfig';

export const TYPE_REVOKE = 'TYPE_REVOKE';
export const TYPE_GENERATE = 'TYPE_GENERATE';

class ApiKeyModal extends Component {
	state = {
		dialogOtpOpen: false,
		loading: false,
		tokenName: '',
		tokenKey: '',
		secret: '',
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!this.state.dialogOtpOpen &&
			nextProps.tokenName !== this.props.tokenName
		) {
			this.setTokenName(nextProps.tokenName);
		}
	}

	setTokenName = (tokenName) => {
		this.setState({ tokenName });
	};

	onClickNext = () => {
		this.setState({ dialogOtpOpen: true });
	};

	getSubmitByType = (type) => {
		const { onRevoke, onGenerate } = this.props;

		switch (type) {
			case TYPE_REVOKE:
				return onRevoke;
			case TYPE_GENERATE:
			default:
				return onGenerate;
		}
	};

	getAssetByType = (type) => {
		switch (type) {
			case TYPE_REVOKE:
				return ['DEVELOPERS_TOKENS_POPUP.DELETE', 'TOKEN_TRASHED'];
			case TYPE_GENERATE:
			default:
				return ['DEVELOPERS_TOKENS_POPUP.GENERATE', 'TOKEN_GENERATE'];
		}
	};

	onSubmit = ({ otp_code, email_code }) => {
		this.setState({ loading: true });
		const { notificationType } = this.props;
		const { tokenName } = this.state;

		const submit = this.getSubmitByType(notificationType);

		return submit(otp_code, email_code, tokenName).then((res) => {
			if (typeof res === 'object') {
				const { apiKey, secret } = res;
				this.setState({
					tokenKey: apiKey,
					secret,
					dialogOtpOpen: false,
					loading: false,
				});
				this.onCloseDialog();
			} else {
				this.setState({
					tokenKey: res,
					secret: '',
					dialogOtpOpen: false,
					loading: false,
				});
			}
		});
	};

	onCloseDialog = () => {
		this.props.onCloseDialog();
	};

	render() {
		const { dialogOtpOpen, loading, tokenName, tokenKey, secret } = this.state;
		const {
			notificationType,
			openContactForm,
			icons: ICONS,
			pending,
		} = this.props;
		if (dialogOtpOpen) {
			return (
				<EmailCodeForm
					onSubmit={this.onSubmit}
					onClickHelp={openContactForm}
					pending={pending}
				/>
			);
		} else if (loading) {
			return <Loader relative={true} background={false} />;
		} else if (secret !== '') {
			const token = {
				tokenKey,
				secret,
			};
			return (
				<Notification
					iconId={'TOKEN_CREATED'}
					icon={ICONS['TOKEN_CREATED']}
					onClose={this.onCloseDialog}
					type={NOTIFICATIONS.CREATED_API_KEY}
				>
					<TokenCreatedInfo token={token} />
				</Notification>
			);
		} else {
			const [stringId, iconId] = this.getAssetByType(notificationType);

			return (
				<Notification
					iconId={iconId}
					icon={ICONS[iconId]}
					onBack={this.onCloseDialog}
					onNext={this.onClickNext}
					nextLabel={STRINGS[stringId]}
					stringId_nextLabel={stringId}
					disabledNext={
						notificationType === TYPE_GENERATE &&
						!!tokenKeyValidation(tokenName)
					}
					type={NOTIFICATIONS.GENERATE_API_KEY}
				>
					<PopupInfo
						type={notificationType === TYPE_REVOKE ? 'DELETE' : 'GENERATE'}
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
	activeTheme: state.app.theme,
});

export default connect(mapStateToForm)(withConfig(ApiKeyModal));
