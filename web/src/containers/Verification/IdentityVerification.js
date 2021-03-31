import React, { Component } from 'react';
import moment from 'moment';
import { reduxForm, SubmissionError } from 'redux-form';
import {
	required,
	requiredBoolean,
	isBefore,
} from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle, HeaderSection } from '../../components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { COUNTRIES_OPTIONS } from '../../utils/countries';

import { isMobile } from 'react-device-detect';
import { getErrorLocalized } from '../../utils/errors';
import { updateUser } from '../../actions/userAction';
import { EditWrapper } from 'components';

const FORM_NAME = 'IdentityVerification';

class IdentityVerification extends Component {
	state = {
		formFields: {},
	};

	componentDidMount() {
		this.generateFormFields(this.props.activeLanguage, this.props.fullName);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateFormFields(nextProps.activeLanguage, nextProps.fullName);
		}
	}

	generateFormFields = (language, fullName = '') => {
		// const ID_NUMBER_TYPE = 'PASSPORT';
		const { icons: ICONS } = this.props;
		const formFields = {
			full_name: {
				type: 'text',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_PLACEHOLDER',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_PLACEHOLDER'
					],
				disabled: fullName.length > 0,
				validate: [required],
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
			gender: {
				type: 'select',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_PLACEHOLDER',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_PLACEHOLDER'
					],
				options: [
					{
						value: false,
						stringId:
							'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN',
						label:
							STRINGS[
								'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN'
							],
						icon: ICONS['GENDER_MALE'],
					},
					{
						value: true,
						stringId:
							'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN',
						label:
							STRINGS[
								'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN'
							],
						icon: ICONS['GENDER_FEMALE'],
					},
				],
				validate: [requiredBoolean],
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
			dob: {
				type: 'date-dropdown',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL',
				language: 'en',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL'
					],
				validate: [required, isBefore()],
				endDate: moment().add(1, 'days'),
				pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}',
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
			nationality: {
				type: 'autocomplete',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_PLACEHOLDER',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_PLACEHOLDER'
					],
				options: COUNTRIES_OPTIONS,
				validate: [required],
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
			country: {
				type: 'autocomplete',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_PLACEHOLDER',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_PLACEHOLDER'
					],
				options: COUNTRIES_OPTIONS,
				validate: [required],
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
			city: {
				type: 'text',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_PLACEHOLDER',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_PLACEHOLDER'
					],
				validate: [required],
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
			address: {
				type: 'text',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_PLACEHOLDER',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_PLACEHOLDER'
					],
				validate: [required],
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
			postal_code: {
				type: 'text',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_PLACEHOLDER',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_PLACEHOLDER'
					],
				validate: [required],
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
		};

		this.setState({ formFields });
	};

	handleSubmit = (values) => {
		if (this.props.fullName) {
			delete values.full_name;
		}
		return updateUser(values)
			.then(({ data }) => {
				this.props.moveToNextStep('identity', data);
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
		this.props.handleBack('kyc');
	};

	render() {
		const {
			handleSubmit,
			pristine,
			submitting,
			valid,
			error,
			openContactForm,
			icons: ICONS,
		} = this.props;
		const { formFields } = this.state;
		return (
			<div className="presentation_container apply_rtl verification_container">
				<IconTitle
					stringId="USER_VERIFICATION.IDENTITY_VERIFICATION"
					text={STRINGS['USER_VERIFICATION.IDENTITY_VERIFICATION']}
					textType="title"
					iconPath={ICONS['VERIFICATION_ID_NEW']}
				/>
				<form className="d-flex flex-column w-100 verification_content-form-wrapper">
					<div className="verification-form-panel mt-3 mb-5">
						<HeaderSection
							stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PERSONAL_INFORMATION"
							title={
								STRINGS[
									'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PERSONAL_INFORMATION'
								]
							}
							openContactForm={openContactForm}
						>
							<div className="my-1 verification-info-txt">
								<EditWrapper stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TEXT">
									{
										STRINGS[
											'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TEXT'
										]
									}
								</EditWrapper>
							</div>
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
								type="button"
								onClick={handleSubmit(this.handleSubmit)}
								label={STRINGS['SUBMIT']}
								disabled={pristine || submitting || !valid || !!error}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

const IdentityVerificationForm = reduxForm({
	form: FORM_NAME,
})(withConfig(IdentityVerification));

export default IdentityVerificationForm;
