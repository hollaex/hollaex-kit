import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, SubmissionError } from 'redux-form';
import {
	required,
	// exactLength,
	// onlyNumbers,
	maxLength,
} from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle, HeaderSection } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { verifyBankData } from '../../actions/verificationActions';
import { getErrorLocalized } from '../../utils/errors';
import { isMobile } from 'react-device-detect';
import { EditWrapper } from 'components';

const FORM_NAME = 'BankVerification';

class BankVerification extends Component {
	state = {
		formFields: {},
	};

	componentDidMount() {
		this.generateFormFields();
	}

	generateFormFields = () => {
		const formFields = {};

		formFields.bank_name = {
			type: 'text',
			stringId:
				'USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_LABEL,USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_PLACEHOLDER',
			label:
				STRINGS[
					'USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_LABEL'
				],
			placeholder:
				STRINGS[
					'USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_PLACEHOLDER'
				],
			validate: [required],
			fullWidth: isMobile,
			ishorizontalfield: true,
		};
		formFields.account_number = {
			type: 'text',
			stringId:
				'USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_LABEL,USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_PLACEHOLDER,USER_VERIFICATION.BANK_ACCOUNT_FORM.VALIDATIONS.ACCOUNT_NUMBER_MAX_LENGTH',
			label:
				STRINGS[
					'USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_LABEL'
				],
			placeholder:
				STRINGS[
					'USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_PLACEHOLDER'
				],
			validate: [
				required,
				maxLength(
					50,
					STRINGS[
						'USER_VERIFICATION.BANK_ACCOUNT_FORM.VALIDATIONS.ACCOUNT_NUMBER_MAX_LENGTH'
					]
				),
			],
			maxLength: 50,
			fullWidth: isMobile,
			ishorizontalfield: true,
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
			icon,
			// iconId,
		} = this.props;
		const { formFields } = this.state;
		return (
			<div className="presentation_container apply_rtl verification_container">
				<IconTitle
					stringId="USER_VERIFICATION.BANK_VERIFICATION"
					text={STRINGS['USER_VERIFICATION.BANK_VERIFICATION']}
					textType="title"
					iconPath={icon}
				/>
				<form className="d-flex flex-column w-100 verification_content-form-wrapper">
					<div className="verification-form-panel mt-3 mb-5">
						<HeaderSection
							stringId="USER_VERIFICATION.TITLE_BANK_ACCOUNT"
							title={STRINGS['USER_VERIFICATION.TITLE_BANK_ACCOUNT']}
							openContactForm={openContactForm}
						>
							<div className="my-2">
								<EditWrapper stringId="USER_VERIFICATION.BANK_VERIFICATION_TEXT_1">
									{STRINGS['USER_VERIFICATION.BANK_VERIFICATION_TEXT_1']}
								</EditWrapper>
							</div>
							<div className="my-2">
								<EditWrapper stringId="USER_VERIFICATION.BANK_VERIFICATION_TEXT_2">
									{STRINGS['USER_VERIFICATION.BANK_VERIFICATION_TEXT_2']}
								</EditWrapper>
							</div>
							<ul className="pl-4">
								<li className="my-1">
									<EditWrapper stringId="USER_VERIFICATION.BASE_WITHDRAWAL">
										{STRINGS['USER_VERIFICATION.BASE_WITHDRAWAL']}
									</EditWrapper>
								</li>
								<li className="my-1">
									<EditWrapper stringId="USER_VERIFICATION.BASE_DEPOSITS">
										{STRINGS['USER_VERIFICATION.BASE_DEPOSITS']}
									</EditWrapper>
								</li>
								<li className="my-1">
									<EditWrapper stringId="USER_VERIFICATION.WARNING.LIST_ITEM_3">
										{STRINGS['USER_VERIFICATION.WARNING.LIST_ITEM_3']}
									</EditWrapper>
								</li>
							</ul>
						</HeaderSection>
						{renderFields(formFields)}
						{error && (
							<div className="warning_text">{getErrorLocalized(error)}</div>
						)}
					</div>
					<div className="d-flex justify-content-center align-items-center mt-2">
						<div className="f-1 d-flex justify-content-end verification-buttons-wrapper">
							<EditWrapper stringId="USER_VERIFICATION.GO_BACK" />
							<Button
								label={STRINGS['USER_VERIFICATION.GO_BACK']}
								onClick={this.onGoBack}
							/>
						</div>
						<div className="separator" />
						<div className="f-1 verification-buttons-wrapper">
							<EditWrapper stringId="SUBMIT" />
							<Button
								label={STRINGS['SUBMIT']}
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
	form: FORM_NAME,
})(BankVerification);

const mapStateToProps = (state) => {
	const values = {};
	return values;
};

export default connect(mapStateToProps)(BankVerificationForm);
