import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, SubmissionError } from 'redux-form';
import {
	required,
	// exactLength,
	// onlyNumbers,
	maxLength
} from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle, HeaderSection } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { verifyBankData } from '../../actions/verificationActions';
import { getErrorLocalized } from '../../utils/errors';
import { isMobile } from 'react-device-detect';

const FORM_NAME = 'BankVerification';

class BankVerification extends Component {
	state = {
		formFields: {}
	};

	componentDidMount() {
		this.generateFormFields();
	}

	generateFormFields = () => {
		const formFields = {};

		formFields.bank_name = {
			type: 'text',
			label:
				STRINGS["USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_LABEL"],
			placeholder:
				STRINGS["USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_PLACEHOLDER"],
			validate: [required],
			fullWidth: isMobile
		};
		formFields.account_number = {
			type: 'text',
			label:
				STRINGS["USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_LABEL"],
			placeholder:
				STRINGS["USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_PLACEHOLDER"],
			validate: [
				required,
				maxLength(
					50,
					STRINGS["USER_VERIFICATION.BANK_ACCOUNT_FORM.VALIDATIONS.ACCOUNT_NUMBER_MAX_LENGTH"]
				)
			],
			maxLength: 50,
			fullWidth: isMobile
		};
		this.setState({ formFields });
	};

	handleSubmit = ({ ...rest }) => {
		return verifyBankData(rest)
			.then(({ data }) => {
				this.props.moveToNextStep('bank', {
					bank_data: data,
				});
				this.props.setActivePageContent('email');
			})
			.catch((err) => {
				const error = { _error: err.message };
				if (err.response && err.response.data) {
					error._error = err.response.data.message;
				}
				throw new SubmissionError(error);
			});
	
	};

	onGoBack = () => {
		this.props.setActivePageContent('email');
		this.props.handleBack('bank');
	};

	render() {
		const {
			handleSubmit,
			pristine,
			submitting,
			valid,
			error,
			openContactForm,
			icon
		} = this.props;
		const { formFields } = this.state;
		return (
			<div className="presentation_container apply_rtl verification_container">
				<IconTitle text={STRINGS["USER_VERIFICATION.BANK_VERIFICATION"]} textType="title" />
				<form className="d-flex flex-column w-100 verification_content-form-wrapper">
					<HeaderSection
						title={STRINGS["USER_VERIFICATION.TITLE_BANK_ACCOUNT"]}
						icon={icon}
						openContactForm={openContactForm}
					>
					<div className="my-2">{STRINGS["USER_VERIFICATION.BANK_VERIFICATION_TEXT_1"]}</div>
					<div className="my-2">{STRINGS["USER_VERIFICATION.BANK_VERIFICATION_TEXT_2"]}</div>
					<ul className="pl-4">
						<li className="my-1">{STRINGS["USER_VERIFICATION.BASE_WITHDRAWAL"]}</li>
						<li className="my-1">{STRINGS["USER_VERIFICATION.BASE_DEPOSITS"]}</li>
						<li className="my-1">{STRINGS["USER_VERIFICATION.WARNING.LIST_ITEM_3"]}</li>
					</ul>
					</HeaderSection>
					{renderFields(formFields)}
					{error && (
						<div className="warning_text">{getErrorLocalized(error)}</div>
					)}
					<div className="d-flex">
						<div className="w-50">
							<Button 
								label={STRINGS["USER_VERIFICATION.GO_BACK"]}
								onClick={this.onGoBack}
							/>
						</div>
						<div className="separator" />
						<div className="w-50">
							<Button
								label={STRINGS["SUBMIT"]}
								type="button"
								onClick={handleSubmit(this.handleSubmit)}
								disabled={pristine || submitting || !valid || !!error}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

const BankVerificationForm = reduxForm({
	form: FORM_NAME
})(BankVerification);

const mapStateToProps = (state) => {
	const values = {};
	return values;
};

export default connect(mapStateToProps)(BankVerificationForm);
