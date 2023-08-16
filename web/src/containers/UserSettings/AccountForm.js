import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';

import { deleteUser } from 'actions/userAction';
import {
	openContactForm,
	setNotification,
	NOTIFICATIONS,
} from 'actions/appActions';
import renderFields from 'components/Form/factoryFields';
import { FieldError } from 'components/Form/FormFields/FieldWrapper';
import {
	Dialog,
	Button,
	IconTitle,
	EditWrapper,
	StrictConfirmationForm,
	EmailCodeForm,
} from 'components';
import { required, username } from 'components/Form/validations';
import { getErrorLocalized } from 'utils/errors';
import STRINGS from 'config/localizedStrings';

export const generateUsernameFormValues = (disabled = false) => ({
	username: {
		type: 'text',
		stringId: 'USERNAME_LABEL,USERNAME_PLACEHOLDER',
		validate: [required, username],
		label: STRINGS['USERNAME_LABEL'],
		placeholder: STRINGS['USERNAME_PLACEHOLDER'],
		disabled,
		fullWidth: isMobile,
		ishorizontalfield: true,
	},
});

class Form extends Component {
	state = {
		isOpen: false,
		isEmailCodeForm: false,
		pending: false,
		showDangerZone: false,
	};

	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(this.props.initialValues) !==
			JSON.stringify(prevProps.initialValues)
		) {
			this.props.initialize(this.props.initialValues);
		}
	}

	onOpen = () => this.setState({ isOpen: true });

	onClose = () => this.setState({ isOpen: false, isEmailCodeForm: false });

	openEmailCodeForm = () => this.setState({ isEmailCodeForm: true });

	onError = (err) => {
		this.onClose();
		const message =
			err.response && err.response.data && err.response.data.message
				? err.response.data.message
				: err.message || JSON.stringify(err);
		this.props.setNotification(NOTIFICATIONS.ERROR, message);
	};

	onSubmitDeletion = ({ otp_code, email_code }) => {
		this.setState({ pending: true });

		deleteUser(email_code, otp_code)
			.then(this.onClose)
			.catch(this.onError)
			.finally(() => this.setState({ pending: false }));
	};

	renderDeleteUser = () => {
		const { showDangerZone } = this.state;

		return showDangerZone ? (
			<div className="danger-zone p-4 important-text">
				<div className="bold pb-2">
					<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.TITLE">
						{STRINGS['USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.TITLE']}
					</EditWrapper>
				</div>
				<div>
					<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.TEXT">
						{STRINGS['USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.TEXT']}
					</EditWrapper>
				</div>
				<div>
					<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.LINK_PH,USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.LINK">
						{STRINGS.formatString(
							STRINGS[
								'USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.LINK_PH'
							],
							<span onClick={this.onOpen} className="underline-text pointer">
								{
									STRINGS[
										'USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.LINK'
									]
								}
							</span>
						)}
					</EditWrapper>
				</div>
			</div>
		) : (
			<div className="mb-3">
				<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.ACCESS.TEXT,USER_SETTINGS.DELETE_ACCOUNT.ACCESS.LINK">
					{STRINGS.formatString(
						STRINGS['USER_SETTINGS.DELETE_ACCOUNT.ACCESS.TEXT'],
						<span
							onClick={() => this.setState({ showDangerZone: true })}
							className="underline-text pointer"
						>
							{STRINGS['USER_SETTINGS.DELETE_ACCOUNT.ACCESS.LINK']}
						</span>
					)}
				</EditWrapper>
			</div>
		);
	};

	render() {
		const { isOpen, isEmailCodeForm, pending } = this.state;
		const {
			handleSubmit,
			submitting,
			pristine,
			error,
			valid,
			formFields,
			ICONS,
			openContactForm,
		} = this.props;

		return (
			<Fragment>
				<div className="settings-form-wrapper">
					<div className="settings-form">
						<IconTitle
							stringId="USER_SETTINGS.TITLE_CHAT"
							text={STRINGS['USER_SETTINGS.TITLE_CHAT']}
							textType="title"
							iconPath={ICONS['SETTING_CHAT_ICON']}
						/>
						<div className="pr-4">
							{renderFields(formFields)}
							{error && (
								<div className="warning_text">{getErrorLocalized(error)}</div>
							)}
							{!formFields.username.disabled && (
								<FieldError
									className="warning_text mb-4"
									displayError={true}
									error={STRINGS['USERNAME_WARNING']}
									stringId="USERNAME_WARNING"
								/>
							)}
							<div className="py-3">{this.renderDeleteUser()}</div>
						</div>
					</div>
					<div className="d-flex align-items-center justify-content-center">
						<EditWrapper stringId="SETTING_BUTTON" />
						<Button
							onClick={handleSubmit}
							label={STRINGS['SETTING_BUTTON']}
							disabled={pristine || submitting || !valid}
						/>
					</div>
				</div>
				{isOpen && (
					<Dialog
						isOpen={isOpen}
						label="delete-account-modal"
						onCloseDialog={this.onClose}
						shouldCloseOnOverlayClick={false}
						showCloseText={true}
						compressed={false}
					>
						{isEmailCodeForm ? (
							<EmailCodeForm
								onSubmit={this.onSubmitDeletion}
								onClickHelp={openContactForm}
								pending={pending}
							/>
						) : (
							<StrictConfirmationForm
								onClose={this.onClose}
								onSubmit={this.openEmailCodeForm}
							>
								<div className="text-center warning_text py-4 font-title">
									<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.TITLE">
										{STRINGS['USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.TITLE']}
									</EditWrapper>
								</div>

								<div>
									<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.TEXT_1">
										{
											STRINGS[
												'USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.TEXT_1'
											]
										}
									</EditWrapper>
								</div>
								<div className="my-3">
									<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.TEXT_2">
										{STRINGS.formatString(
											STRINGS[
												'USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.TEXT_2'
											],
											<span>
												"
												{
													STRINGS[
														'USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.KEY'
													]
												}
												"
											</span>
										)}
									</EditWrapper>
								</div>
							</StrictConfirmationForm>
						)}
					</Dialog>
				)}
			</Fragment>
		);
	}
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	reduxForm({
		form: 'UsernameForm',
	})(Form)
);
