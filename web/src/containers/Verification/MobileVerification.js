import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	reduxForm,
	formValueSelector,
	SubmissionError,
	stopSubmit,
} from 'redux-form';
import { isMobile } from 'react-device-detect';

import { required } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import {
	Button,
	IconTitle,
	ElapsedTimer,
	HeaderSection,
} from '../../components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { PHONE_OPTIONS } from '../../utils/countries';
import { getErrorLocalized } from '../../utils/errors';
import {
	verifySmsCode,
	requestSmsCode,
} from '../../actions/verificationActions';
import { EditWrapper } from 'components';

const FORM_NAME = 'MobileVerification';
let loadingTimeOut = '';

class MobileVerification extends Component {
	state = {
		formFields: {},
		codeRequested: false,
		codeRequestLoading: false,
		isLoadingTimeUp: false,
		isTimer: false,
	};

	componentDidMount() {
		this.generateFormFields();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateFormFields();
		}
	}

	componentWillUnmount() {
		if (loadingTimeOut) {
			clearTimeout(loadingTimeOut);
		}
	}

	generateFormFields = (codeRequested = false, loading = false) => {
		const { icons: ICONS } = this.props;
		const formFields = {
			phone_country: {
				type: 'autocomplete',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_CODE_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_CODE_PLACEHOLDER',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_CODE_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_CODE_PLACEHOLDER'
					],
				options: PHONE_OPTIONS,
				validate: [required],
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
			phone_number: {
				type: 'text',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_PLACEHOLDER,USER_VERIFICATION.CODE_EXPIRES_IN',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_PLACEHOLDER'
					],
				validate: [required], // TODO ^\+?[1-9]\d{1,14}$
				notification: {
					stringId:
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CONNECTING_LOADING,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.SMS_SEND',
					text: loading
						? STRINGS[
								'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CONNECTING_LOADING'
						  ]
						: STRINGS[
								'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.SMS_SEND'
						  ],
					status: loading ? 'loading' : 'information',
					iconPath: loading
						? ICONS['CONNECT_LOADING']
						: ICONS['BLUE_ARROW_RIGHT'],
					useSvg: loading ? true : false,
					className: 'file_upload_icon',
					onClick: loading ? () => {} : this.handleSendSmsCode,
				},
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
			code: {
				type: 'text',
				stringId:
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.SMS_CODE_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.SMS_CODE_PLACEHOLDER',
				label:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.SMS_CODE_LABEL'
					],
				placeholder:
					STRINGS[
						'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.SMS_CODE_PLACEHOLDER'
					],
				disabled: !codeRequested,
				validate: [required],
				fullWidth: isMobile,
				ishorizontalfield: true,
			},
		};

		this.setState({ formFields });
	};

	handleSubmit = ({ phone_number, phone_country, code }) => {
		if (!this.state.codeRequested) {
			throw new SubmissionError({
				_error: 'Request sms code',
			});
		}
		const values = {
			phone: `${phone_country}${phone_number}`,
			code,
		};

		return verifySmsCode(values)
			.then(({ data }) => {
				this.props.moveToNextStep('mobile', values);
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

	handleSendSmsCode = () => {
		const { phone_number, phone_country } = this.props;
		if (phone_country && phone_number) {
			const phone = `${phone_country} ${phone_number}`;
			this.setState(
				{
					codeRequestLoading: true,
					codeRequested: false,
					isLoadingTimeUp: false,
				},
				() => {
					this.generateFormFields(false, true);
					this.checkLoadingTime();
				}
			);
			requestSmsCode(phone)
				.then(({ data }) => {
					// alert(STRINGS.formatString(STRINGS["SMS_SENT_TO"], phone).join(''));
					this.setState(
						{
							codeRequested: true,
							codeRequestLoading: false,
							isTimer: this.state.isLoadingTimeUp,
						},
						() => {
							let loading = this.state.isLoadingTimeUp ? false : true;
							this.generateFormFields(true, loading);
						}
					);
				})
				.catch((err) => {
					const error = {
						_error: STRINGS.formatString(
							STRINGS['SMS_ERROR_SENT_TO'],
							phone
						).join(''),
					};
					this.setState({ codeRequestLoading: false }, () => {
						this.generateFormFields();
					});
					this.props.dispatch(stopSubmit(FORM_NAME, error));
				});
		}
	};

	onGoBack = () => {
		this.props.setActivePageContent('email');
		this.props.handleBack('sms');
	};

	checkLoadingTime = () => {
		loadingTimeOut = setTimeout(() => {
			let isTimer = false;
			if (this.state.codeRequested) {
				this.generateFormFields(true, false);
				isTimer = true;
			}
			this.setState({ isLoadingTimeUp: true, isTimer });
		}, 3000);
	};

	onClearTimer = () => {
		this.setState({ isTimer: false, codeRequested: false }, () => {
			this.generateFormFields();
		});
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
		const { formFields, codeRequested, isTimer } = this.state;
		return (
			<div className="presentation_container apply_rtl verification_container">
				<IconTitle
					stringId="USER_VERIFICATION.PHONE_VERIFICATION"
					text={STRINGS['USER_VERIFICATION.PHONE_VERIFICATION']}
					textType="title"
					iconPath={ICONS['VERIFICATION_PHONE_NEW']}
				/>
				<form className="d-flex flex-column w-100 verification_content-form-wrapper">
					<div className="verification-form-panel mt-3 mb-5">
						<HeaderSection
							stringId="USER_VERIFICATION.PHONE_DETAILS"
							title={STRINGS['USER_VERIFICATION.PHONE_DETAILS']}
							openContactForm={openContactForm}
						>
							<div>
								<EditWrapper stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.PHONE_VERIFICATION_TXT">
									{
										STRINGS[
											'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.PHONE_VERIFICATION_TXT'
										]
									}
								</EditWrapper>
							</div>
							<div>
								<EditWrapper stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.PHONE_VERIFICATION_TXT_1">
									{
										STRINGS[
											'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.PHONE_VERIFICATION_TXT_1'
										]
									}
								</EditWrapper>
							</div>
							<div>
								<EditWrapper stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.PHONE_VERIFICATION_TXT_2">
									{
										STRINGS[
											'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.PHONE_VERIFICATION_TXT_2'
										]
									}
								</EditWrapper>
							</div>
						</HeaderSection>
						{renderFields(formFields)}
						<ElapsedTimer
							timerText={STRINGS['USER_VERIFICATION.CODE_EXPIRES_IN']}
							isLoading={isTimer}
							timeoutCallback={this.onClearTimer}
						/>
						<EditWrapper stringId="USER_VERIFICATION.CODE_EXPIRES_IN" />
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
								disabled={
									pristine || submitting || !valid || !!error || !codeRequested
								}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

const MobileVerificationForm = reduxForm({
	form: FORM_NAME,
})(MobileVerification);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) =>
	selector(state, 'phone_country', 'phone_number');

export default connect(mapStateToProps)(withConfig(MobileVerificationForm));
