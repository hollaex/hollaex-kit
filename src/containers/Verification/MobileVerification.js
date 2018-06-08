import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import { required } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { PHONE_OPTIONS } from '../../utils/countries';
import { ICONS } from '../../config/constants';
import { getErrorLocalized } from '../../utils/errors';
import {
	verifySmsCode,
	requestSmsCode
} from '../../actions/verificationActions';
import HeaderSection from './HeaderSection';
import { isMobile } from 'react-device-detect';

const FORM_NAME = 'MobileVerification';

class MobileVerification extends Component {
	state = {
		formFields: {},
		codeRequested: false
	};

	componentDidMount() {
		this.generateFormFields();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateFormFields();
		}
	}

	generateFormFields = (codeRequested = false) => {
		const formFields = {
			phone_country: {
				type: 'autocomplete',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.PHONE_CODE_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.PHONE_CODE_PLACEHOLDER,
				options: PHONE_OPTIONS,
				validate: [required],
				fullWidth: isMobile
			},
			phone_number: {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.PHONE_NUMBER_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.PHONE_NUMBER_PLACEHOLDER,
				validate: [required], // TODO ^\+?[1-9]\d{1,14}$
				notification: {
					text:
						STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
							.SMS_SEND,
					status: 'information',
					iconPath: ICONS.BLUE_ARROW_RIGHT,
					className: 'file_upload_icon',
					onClick: this.handleSendSmsCode
				},
				fullWidth: isMobile
			},
			code: {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.SMS_CODE_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.SMS_CODE_PLACEHOLDER,
				disabled: !codeRequested,
				validate: [required]
			},
			fullWidth: isMobile
		};

		this.setState({ formFields });
	};

	handleSubmit = ({ phone_number, phone_country, code }) => {
		if (!this.state.codeRequested) {
			throw new SubmissionError({
				_error: 'Request sms code'
			});
		}
		const values = {
			phone: `${phone_country}${phone_number}`,
			code
		};

		return verifySmsCode(values)
			.then(({ data }) => {
				this.props.moveToNextStep('mobile', values);
			})
			.catch((err) => {
				const error = { _error: err.message };
				if (err.response && err.response.data) {
					error._error = err.response.data.message;
				}
				throw new SubmissionError(error);
			});
	};

	handleSendSmsCode = () => {
		const { phone_number, phone_country } = this.props;
		if (phone_country && phone_number) {
			const phone = `${phone_country} ${phone_number}`;
			requestSmsCode(phone)
				.then(({ data }) => {
					alert(STRINGS.formatString(STRINGS.SMS_SENT_TO, phone).join(''));
					this.setState({ codeRequested: true }, () => {
						this.generateFormFields(true);
					});
				})
				.catch((err) => {
					alert(
						STRINGS.formatString(STRINGS.SMS_ERROR_SENT_TO, phone).join('')
					);
				});
		}
	};

	render() {
		const {
			handleSubmit,
			pristine,
			submitting,
			valid,
			error,
			openContactForm
		} = this.props;
		const { formFields, codeRequested } = this.state;
		return (
			<form className="d-flex flex-column w-100 verification_content-form-wrapper">
				<HeaderSection
					title={STRINGS.USER_VERIFICATION.TITLE_MOBILE_HEADER}
					openContactForm={openContactForm}
				/>
				{renderFields(formFields)}
				{error && (
					<div className="warning_text">{getErrorLocalized(error)}</div>
				)}
				<Button
					type="button"
					onClick={handleSubmit(this.handleSubmit)}
					label={STRINGS.NEXT}
					disabled={
						pristine || submitting || !valid || !!error || !codeRequested
					}
				/>
			</form>
		);
	}
}

const MobileVerificationForm = reduxForm({
	form: FORM_NAME
})(MobileVerification);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) =>
	selector(state, 'phone_country', 'phone_number');

export default connect(mapStateToProps)(MobileVerificationForm);
