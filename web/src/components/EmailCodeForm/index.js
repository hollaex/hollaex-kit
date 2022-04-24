import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { required, validateOtp } from 'components/Form/validations';
import renderFields from 'components/Form/factoryFields';
import { EditWrapper, Button, IconTitle } from 'components';
import { sendEmailCode } from 'actions/userAction';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

class Form extends Component {
	state = {
		formValues: {},
	};

	componentWillMount() {
		this.setFormValues();
		sendEmailCode();
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
			email_code: {
				type: 'text',
				stringId:
					'EMAIL_CODE_FORM.LABEL,EMAIL_CODE_FORM.PLACEHOLDER,EMAIL_CODE_FORM.ERROR_INVALID',
				label: STRINGS['EMAIL_CODE_FORM.LABEL'],
				placeholder: STRINGS['EMAIL_CODE_FORM.PLACEHOLDER'],
				validate: [required],
				fullWidth: true,
			},
			otp_code: {
				type: 'number',
				stringId:
					'EMAIL_CODE_FORM.OTP_LABEL,EMAIL_CODE_FORM.OTP_PLACEHOLDER,EMAIL_CODE_FORM.ERROR_INVALID',
				label: STRINGS['EMAIL_CODE_FORM.OTP_LABEL'],
				placeholder: STRINGS['EMAIL_CODE_FORM.OTP_PLACEHOLDER'],
				validate: [
					required,
					validateOtp(STRINGS['EMAIL_CODE_FORM.ERROR_INVALID']),
				],
				fullWidth: true,
			},
		};

		this.setState({ formValues });
	};

	setFormRef = (el) => {
		if (el) {
			this.otpFormRef = el;
			el.getElementsByTagName('input')[0].focus();
		}
	};

	render() {
		const {
			handleSubmit,
			submitting,
			pristine,
			error,
			valid,
			icons: ICONS,
			pending,
		} = this.props;
		const { formValues } = this.state;

		return (
			<div className="otp_form-wrapper">
				<IconTitle
					stringId="EMAIL_CODE_FORM.TITLE"
					text={STRINGS['EMAIL_CODE_FORM.TITLE']}
					iconId="EMAIL_CODEE"
					iconPath={ICONS['EMAIL_CODE']}
				/>
				<div className="otp_form-title-wrapper">
					<span className="otp_form-title-text">
						<EditWrapper stringId="EMAIL_CODE_FORM.FORM_TITLE">
							{STRINGS['EMAIL_CODE_FORM.FORM_TITLE']}
						</EditWrapper>
					</span>
				</div>
				<form onSubmit={handleSubmit} className="w-100" ref={this.setFormRef}>
					<div className="w-100 otp_form-fields">
						{renderFields(formValues)}
						{error && <div className="warning_text">{error}</div>}
					</div>
					<EditWrapper stringId="EMAIL_CODE_FORM.BUTTON" />
					<Button
						label={STRINGS['EMAIL_CODE_FORM.BUTTON']}
						disabled={pristine || submitting || !valid || pending}
					/>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: 'EmailCodeForm',
})(withConfig(Form));
