import React, { Component } from 'react';
import { reduxForm, SubmissionError } from 'redux-form';
import { requiredWithCustomMessage } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle } from '../../components';
import STRINGS from '../../config/localizedStrings';
import HeaderSection, {
	IdentificationFormSection,
	PORSection
} from './HeaderSection';
import { getErrorLocalized } from '../../utils/errors';
import { updateDocuments } from '../../actions/userAction';

import { isMobile } from 'react-device-detect';
import { ICONS } from '../../config/constants';
const FORM_NAME = 'DocumentsVerification';

class DocumentsVerification extends Component {
	state = {
		formFields: {}
	};

	componentDidMount() {
		this.generateFormFields();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateFormFields();
		}
	}

	generateFormFields = () => {
		const FRONT_TYPE = 'PASSPORT';
		const formFields = {
			id: {
				type: {
					type: 'hidden'
				},
				front: {
					type: 'file',
					label:
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS[
							`${FRONT_TYPE}_LABEL`
						],
					placeholder:
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS[
							`${FRONT_TYPE}_PLACEHOLDER`
						],
					validate: [
						requiredWithCustomMessage(
							STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.FRONT
						)
					],
					fullWidth: isMobile
				}
			},
			proofOfResidence: {
				type: 'file',
				label:
					STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.POR_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS
						.POR_PLACEHOLDER,
				validate: [
					requiredWithCustomMessage(
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS
							.PROOF_OF_RESIDENCY
					)
				],
				fullWidth: isMobile
			}
		};

		this.setState({ formFields });
	};

	handleSubmit = (values) => {
		return updateDocuments(values)
			.then(({ data }) => {
				this.props.moveToNextStep('documents');
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
		this.props.setActivePageContent(0);
		this.props.setActiveTab(4);
	};

	render() {
		const {
			handleSubmit,
			pristine,
			submitting,
			valid,
			error,
			// skip,
			openContactForm
		} = this.props;
		const { formFields } = this.state;
		return (
			<div className="presentation_container apply_rtl verification_container">
				<IconTitle text={STRINGS.USER_VERIFICATION.DOCUMENT_VERIFICATION} textType="title" />
				<form
					className="d-flex flex-column w-100 verification_content-form-wrapper"
					onSubmit={this.handleSubmit}
				>
					<HeaderSection
						title={STRINGS.USER_VERIFICATION.DOCUMENT_PROOF_SUBMISSION}
						icon={ICONS.VERIFICATION_DOCUMENT_NEW}
						openContactForm={openContactForm}
					>
						<IdentificationFormSection />
					</HeaderSection>
					{renderFields(formFields.id)}

					{formFields.proofOfResidence && (
						<div>
							<HeaderSection
								title={
									STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION
										.PROOF_OF_RESIDENCY
								}
								openContactForm={openContactForm}
							>
								<PORSection />
							</HeaderSection>
							{renderFields(formFields.proofOfResidence)}
						</div>
					)}
					{error && (
						<div className="warning_text">{getErrorLocalized(error)}</div>
					)}

					<div className="d-flex verification-buttons-wrapper">
						<Button
							type="button"
							onClick={this.onGoBack}
							label={STRINGS.USER_VERIFICATION.GO_BACK}
							disabled={submitting}
						/>
						<div className="separator" />
						<Button
							type="button"
							onClick={handleSubmit(this.handleSubmit)}
							label={STRINGS.SUBMIT}
							disabled={pristine || submitting || !valid || !!error}
						/>
					</div>
				</form>
			</div>
		);
	}
}

const DocumentsVerificationForm = reduxForm({
	form: FORM_NAME
})(DocumentsVerification);

export default DocumentsVerificationForm;
