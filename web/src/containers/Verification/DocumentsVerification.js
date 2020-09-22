import React, { Component } from 'react';
import { reduxForm, SubmissionError } from 'redux-form';
import moment from 'moment';
import {
	isBefore,
	requiredWithCustomMessage
} from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle, HeaderSection } from '../../components';
import STRINGS from '../../config/localizedStrings';
import {
	IdentificationFormSection,
	PORSection,
	SelfieWithPhotoId
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
		this.generateFormFields(this.props.activeLanguage);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateFormFields(nextProps.activeLanguage);
		}
	}

	generateFormFields = (language) => {
		// const FRONT_TYPE = 'PASSPORT';
		const formFields = {
			idDocument: {
				number: {
					type: 'text',
					label:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ID_NUMBER_LABEL"],
					placeholder:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ID_NUMBER_PLACEHOLDER"],
					validate: [
						requiredWithCustomMessage(
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.ID_NUMBER"]
						)
					],
					fullWidth: isMobile
				},
				issued_date: {
					type: 'date-dropdown',
					label:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.ISSUED_DATE_LABEL"],
					validate: [
						requiredWithCustomMessage(
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.ISSUED_DATE"]
						),
						isBefore()
					],
					endDate: moment().add(1, 'days'),
					language,
					fullWidth: isMobile
				},
				expiration_date: {
					type: 'date-dropdown',
					label:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.EXPIRATION_DATE_LABEL"],
					validate: [
						requiredWithCustomMessage(
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.EXPIRATION_DATE"]
						),
						isBefore(moment().add(15, 'years'))
					],
					endDate: moment().add(15, 'years'),
					addYears: 15,
					yearsBefore: 5,
					language,
					fullWidth: isMobile
				},
			},
			id: {
				type: {
					type: 'hidden'
				},
				front: {
					type: 'file',
					label:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.FRONT_LABEL"],
					placeholder:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.FRONT_PLACEHOLDER"],
					validate: [
						requiredWithCustomMessage(
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.FRONT"]
						)
					],
					fullWidth: isMobile
				}
			},
			proof_of_residency: {
				type: {
					type: 'hidden'
				},
				back: {
					type: 'file',
					label:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.POR_LABEL"],
					placeholder:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.POR_PLACEHOLDER"],
					validate: [
						requiredWithCustomMessage(
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.PROOF_OF_RESIDENCY"]
						)
					],
					fullWidth: isMobile
				}
			},
			selfieWithNote: {
				type: {
					type: 'hidden'
				},
				proof_of_residency: {
					type: 'file',
					label:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.SELFIE_PHOTO_ID_LABEL"],
					placeholder:
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS.SELFIE_PHOTO_ID_PLACEHOLDER"],
					validate: [
						requiredWithCustomMessage(
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.SELFIE_PHOTO_ID"]
						)
					],
					fullWidth: isMobile
				}
			}
		};

		this.setState({ formFields });
	};

	handleSubmit = (formValues) => {
		return updateDocuments(formValues)
			.then(({ data }) => {
				const values = {
					type: formValues.type,
					number: formValues.number,
					expiration_date: formValues.expiration_date,
					issued_date: formValues.issued_date,
					status: 1
				};

				this.props.moveToNextStep('documents', values);
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
		this.props.handleBack('document');
	};

	render() {
		const {
			idData,
			handleSubmit,
			pristine,
			submitting,
			valid,
			error,
			// skip,
			openContactForm,
			activeLanguage
		} = this.props;
		const { formFields } = this.state;
		return (
			<div className="presentation_container apply_rtl verification_container">
				<IconTitle text={STRINGS["USER_VERIFICATION.DOCUMENT_VERIFICATION"]} textType="title" />
				<form
					className="d-flex flex-column w-100 verification_content-form-wrapper"
					onSubmit={this.handleSubmit}
				>
					<HeaderSection
						title={STRINGS["USER_VERIFICATION.DOCUMENT_PROOF_SUBMISSION"]}
						icon={ICONS.VERIFICATION_DOCUMENT_NEW}
						openContactForm={openContactForm}
					>
						<IdentificationFormSection />
					</HeaderSection>
					{renderFields(formFields.idDocument)}
					{renderFields(formFields.id)}
					<div className="my-4"></div>

					{formFields.proof_of_residency && (
						<div>
							<HeaderSection
								title={
									STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.PROOF_OF_RESIDENCY"]
								}
							>
								<PORSection />
							</HeaderSection>
							{renderFields(formFields.proof_of_residency)}
						</div>
					)}
					<div className="my-4"></div>
					{formFields.selfieWithNote && (
						<div>
							<HeaderSection
								title={
									STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.TITLE"]
								}
							>
								<SelfieWithPhotoId />
							</HeaderSection>
							<div className="my-2">
								<img
									src={activeLanguage === 'en' ? ICONS.SELF_KYC_ID_EN : ICONS.SELF_KYC_ID_EN}
									className="verification_document-sample"
									alt="document-sample" />
							</div>
							{renderFields(formFields.selfieWithNote)}
						</div>
					)}
					{error && (
						<div className="warning_text">{getErrorLocalized(error)}</div>
					)}

					<div className="d-flex verification-buttons-wrapper">
						<div className="w-50">
							<Button
								type="button"
								onClick={this.onGoBack}
								label={STRINGS["USER_VERIFICATION.GO_BACK"]}
								disabled={submitting}
							/>
						</div>
						<div className="separator" />
						<div className="w-50">
							<Button
								type="button"
								onClick={handleSubmit(this.handleSubmit)}
								label={idData.status === 0 ? STRINGS["SUBMIT"] : `${STRINGS["RESUBMIT"]}*`}
								disabled={pristine || submitting || !valid || !!error}
							/>
							{idData.status !== 0 &&
								<span className="content-text">{STRINGS["USER_VERIFICATION.SUBMISSION_PENDING_TXT"]}</span>
							}
						</div>
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
