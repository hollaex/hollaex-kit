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
		} = this.props;
		const { formValues } = this.state;

		return (
			<div className="otp_form-wrapper">
				<IconTitle
					stringId="OTP_FORM.OTP_TITLE"
					text={STRINGS['OTP_FORM.OTP_TITLE']}
					iconId="SET_NEW_PASSWORD"
					iconPath={ICONS['SET_NEW_PASSWORD']}
				/>
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
				<form onSubmit={handleSubmit} className="w-100" ref={this.setFormRef}>
					<div className="w-100 otp_form-fields">
						{renderFields(formValues, {
							isSubmitting: submitting,
							error,
							handleSubmit,
						})}
					</div>
					<div className="otp_form-info-text">
						{STRINGS['OTP_FORM.OTP_FORM_INFO']}
					</div>
					<div className="otp_form-subnote-text">
						{STRINGS['OTP_FORM.OTP_FORM_SUBNOTE_LINE_1']}
						{STRINGS['OTP_FORM.OTP_FORM_SUBNOTE_LINE_2']}
					</div>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: 'OtpForm',
})(withConfig(Form));
