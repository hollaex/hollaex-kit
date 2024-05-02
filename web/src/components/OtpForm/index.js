import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import renderFields from 'components/Form/factoryFields';
import { IconTitle, ActionNotification } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

class Form extends Component {
	state = {
		formValues: {},
	};

	UNSAFE_componentWillMount() {
		this.setFormValues();
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		if (
			this.props.dirty !== nextProps.dirty ||
			this.props.submitFailed !== nextProps.submitFailed ||
			this.props.valid !== nextProps.valid
		) {
			if (nextProps.dirty && nextProps.submitFailed && !nextProps.valid) {
				this.setFormRef(this.otpFormRef);
			}
		}
	};
	setFormValues = () => {
		const formValues = {
			otp_code: {
				type: 'pin',
				label: STRINGS['OTP_FORM.OTP_LABEL'],
				fullWidth: true,
			},
		};

		this.setState({ formValues });
	};

	setFormRef = (el) => {
		if (el) {
			this.otpFormRef = el;
			if (el.getElementsByTagName('input')[0])
				el.getElementsByTagName('input')[0].focus();
		}
	};

	render() {
		const {
			submitting,
			handleSubmit,
			error,
			onClickHelp,
			icons: ICONS,
			isEnableOtpForm,
		} = this.props;
		const { formValues } = this.state;

		return (
			<div className="otp_form-wrapper">
				{isEnableOtpForm ? (
					<React.Fragment>
						<IconTitle
							stringId="ACCOUNT_SECURITY.OTP.CONTENT.TITLE"
							text={STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.TITLE']}
							iconId="OTP_KEYS"
							iconPath={ICONS['OTP_KEYS']}
							className="w-100 m-0"
							textType="title"
						/>
						<div className="text-center my-4">
							{STRINGS['OTP_FORM.INPUT_TEXT']}
						</div>
					</React.Fragment>
				) : (
					<IconTitle
						stringId="OTP_FORM.OTP_TITLE"
						text={STRINGS['OTP_FORM.OTP_TITLE']}
						iconId="SET_NEW_PASSWORD"
						iconPath={ICONS['SET_NEW_PASSWORD']}
					/>
				)}
				{!isEnableOtpForm && (
					<div className="otp_form-title-wrapper">
						{onClickHelp && (
							<ActionNotification
								stringId="NEED_HELP_TEXT"
								text={STRINGS['NEED_HELP_TEXT']}
								onClick={onClickHelp}
								iconId="BLUE_QUESTION"
								iconPath={ICONS['BLUE_QUESTION']}
								status="information"
							/>
						)}
					</div>
				)}
				<form onSubmit={handleSubmit} className="w-100" ref={this.setFormRef}>
					<div className="w-100 otp_form-fields">
						{renderFields(formValues, {
							isSubmitting: submitting,
							error,
							handleSubmit,
						})}
					</div>
					{!isEnableOtpForm && (
						<div className="otp_form-info-text mt-0">
							{STRINGS['OTP_FORM.OTP_FORM_INFO']}
						</div>
					)}
					<div className={`${isEnableOtpForm && 'mt-0'} otp_form-subnote-text`}>
						{isEnableOtpForm
							? STRINGS['OTP_FORM.OTP_FORM_SUBNOTE_LINE_3']
							: `${STRINGS['OTP_FORM.OTP_FORM_SUBNOTE_LINE_1']} ${STRINGS['OTP_FORM.OTP_FORM_SUBNOTE_LINE_2']}`}
					</div>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: 'OtpForm',
})(withConfig(Form));
