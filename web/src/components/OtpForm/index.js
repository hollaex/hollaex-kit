import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { required, validateOtp } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle, ActionNotification } from '../';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

class Form extends Component {
	state = {
		formValues: {}
	};

	componentWillMount() {
		this.setFormValues();
	}

	UNSAFE_componentWillReceiveProps = (nextProps)=> {
		if (this.props.dirty !== nextProps.dirty
			|| this.props.submitFailed !== nextProps.submitFailed
			|| this.props.valid !== nextProps.valid) {
				if (nextProps.dirty && nextProps.submitFailed && !nextProps.valid) {
					this.setFormRef(this.otpFormRef);
				}
		}
	}
	setFormValues = () => {
		const formValues = {
			otp_code: {
				type: 'number',
				label: STRINGS["OTP_FORM.OTP_LABEL"],
				placeholder: STRINGS["OTP_FORM.OTP_PLACEHOLDER"],
				validate: [required, validateOtp(STRINGS["OTP_FORM.ERROR_INVALID"])],
				fullWidth: true
			}
		};

		this.setState({ formValues });
	};

	setFormRef = (el) => {
		if (el) {
			this.otpFormRef = el;
			el.getElementsByTagName('input')[0].focus()
		}
	}

	render() {
		const {
			handleSubmit,
			submitting,
			pristine,
			error,
			valid,
			onClickHelp
		} = this.props;
		const { formValues } = this.state;

		return (
			<div className="otp_form-wrapper">
				<IconTitle
					text={STRINGS["OTP_FORM.OTP_TITLE"]}
					iconPath={ICONS.OTP_CODE}
					useSvg={true}
				/>
				<div className="otp_form-title-wrapper">
					<span className="otp_form-title-text">
						{STRINGS["OTP_FORM.OTP_FORM_TITLE"]}
					</span>
					{onClickHelp && (
						<ActionNotification
							text={STRINGS["NEED_HELP_TEXT"]}
							onClick={onClickHelp}
							iconPath={ICONS.BLUE_QUESTION}
							status="information"
							useSvg={true}
						/>
					)}
				</div>
				<form onSubmit={handleSubmit} className="w-100" ref={this.setFormRef}>
					<div className="w-100 otp_form-fields">
						{renderFields(formValues)}
						{error && <div className="warning_text">{error}</div>}
					</div>
					<Button
						label={STRINGS["OTP_FORM.OTP_BUTTON"]}
						disabled={pristine || submitting || !valid}
					/>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: 'OtpForm'
})(Form);
