import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { required, validateOtp } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle, ActionNotification } from '../';

import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

class Form extends Component {
	state = {
		formValues: {},
	};

	componentWillMount() {
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
				type: 'number',
				stringId:
					'OTP_FORM.OTP_LABEL,OTP_FORM.OTP_PLACEHOLDER,OTP_FORM.ERROR_INVALID',
				label: STRINGS['OTP_FORM.OTP_LABEL'],
				placeholder: STRINGS['OTP_FORM.OTP_PLACEHOLDER'],
				validate: [required, validateOtp(STRINGS['OTP_FORM.ERROR_INVALID'])],
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
			onClickHelp,
			icons: ICONS,
		} = this.props;
		const { formValues } = this.state;

		return (
			<div className="otp_form-wrapper">
				<IconTitle
					stringId="OTP_FORM.OTP_TITLE"
					text={STRINGS['OTP_FORM.OTP_TITLE']}
					iconId="OTP_CODE"
					iconPath={ICONS['OTP_CODE']}
				/>
				<div className="otp_form-title-wrapper">
					<span className="otp_form-title-text">
						<EditWrapper stringId="OTP_FORM.OTP_FORM_TITLE">
							{STRINGS['OTP_FORM.OTP_FORM_TITLE']}
						</EditWrapper>
					</span>
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
				<form onSubmit={handleSubmit} className="w-100" ref={this.setFormRef}>
					<div className="w-100 otp_form-fields">
						{renderFields(formValues)}
						{error && <div className="warning_text">{error}</div>}
					</div>
					<EditWrapper stringId="OTP_FORM.OTP_BUTTON" />
					<Button
						label={STRINGS['OTP_FORM.OTP_BUTTON']}
						disabled={pristine || submitting || !valid}
					/>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: 'OtpForm',
})(withConfig(Form));
