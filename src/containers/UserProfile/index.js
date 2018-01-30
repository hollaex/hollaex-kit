import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ICONS } from '../../config/constants';
import { Accordion, Loader } from '../../components';
import Form from './Form';
import {
	generateFormValues as generateMobileFormValues,
	generateEmailFormValues
} from './MobileFormValues';
import {
	prepareInitialValues,
	generateFormValues as generateDataFormValues
} from './IdentificationFormValues';
import { generateFormValues as generateBankFormValues } from './BankAccountFormValues';
import { InformationSection } from './InformationSection';

import STRINGS from '../../config/localizedStrings';

const EmailForm = Form('EmailForm');
const MobileForm = Form('MobileForm');
const InformationForm = Form('InformationForm');
const BankForm = Form('BankForm');

class UserProfile extends Component {
	state = {
		sections: [],
		dataFormValues: {},
		mobileFormValues: {},
		bankFormValues: {},
		emailFormValues: {}
	};

	componentDidMount() {
		this.calculateFormValues(
			this.props.activeLanguage,
			this.props.verification_level,
			this.props.email,
			this.props.userData
		);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.calculateFormValues(
				nextProps.activeLanguage,
				nextProps.verification_level,
				nextProps.email,
				nextProps.userData
			);
			this.calculateSections(
				nextProps.verification_level,
				nextProps.email,
				nextProps.userData
			);
		} else if (
			nextProps.verification_level !== this.props.verification_level ||
			nextProps.userData.timestamp !== this.props.userData.timestamp
		) {
			this.calculateSections(
				nextProps.verification_level,
				nextProps.email,
				nextProps.userData
			);
		}
	}

	generateNotification = (
		verified = false,
		provided = false,
		verifyText = ''
	) => {
		return {
			text: verified
				? STRINGS.USER_VERIFICATION.COMPLETED
				: provided
					? STRINGS.USER_VERIFICATION.PENDING_VERIFICATION
					: verifyText,
			status: verified ? 'success' : provided ? 'information' : 'warning',
			iconPath: verified
				? ICONS.GREEN_CHECK
				: provided ? ICONS.BLUE_TIMER : ICONS.RED_ARROW,
			allowClick: false
		};
	};

	calculateFormValues = (language, verification_level, email, userData) => {
		const dataFormValues = generateDataFormValues(
			language,
			userData.nationality
		);
		const bankFormValues = generateBankFormValues();
		const mobileFormValues = generateMobileFormValues();
		const emailFormValues = generateEmailFormValues();
		this.setState(
			{ dataFormValues, mobileFormValues, bankFormValues, emailFormValues },
			() => {
				this.calculateSections(verification_level, email, userData);
			}
		);
	};

	calculateSections = (verification_level, email, userData) => {
		const {
			dataFormValues,
			mobileFormValues,
			bankFormValues,
			emailFormValues
		} = this.state;
		const {
			phone_number,
			full_name,
			bank_account = {},
			id_data = {}
		} = userData;
		const sections = [
			{
				title: STRINGS.USER_VERIFICATION.TITLE_EMAIL,
				subtitle: email,
				content: (
					<EmailForm initialValues={{ email }} formValues={emailFormValues} />
				),
				notification: this.generateNotification(
					true,
					true,
					STRINGS.USER_VERIFICATION.VERIFY_EMAIL
				)
			},
			{
				title: STRINGS.USER_VERIFICATION.TITLE_MOBILE_PHONE,
				subtitle: phone_number,
				content: (
					<MobileForm initialValues={userData} formValues={mobileFormValues}>
						<InformationSection onChangeValue={this.onOpenContactForm} />
					</MobileForm>
				),
				notification: this.generateNotification(
					!!phone_number,
					!!phone_number,
					STRINGS.USER_VERIFICATION.VERIFY_MOBILE_PHONE
				)
			},
			{
				title: STRINGS.USER_VERIFICATION.TITLE_PERSONAL_INFORMATION,
				subtitle: full_name,
				content: (
					<InformationForm
						initialValues={prepareInitialValues(userData)}
						formValues={dataFormValues}
					>
						<InformationSection
							text={
								verification_level === 1
									? STRINGS.USER_VERIFICATION
											.PENDING_VERIFICATION_PERSONAL_INFORMATION
									: ''
							}
							onChangeValue={this.onOpenContactForm}
						/>
					</InformationForm>
				),
				notification: this.generateNotification(
					verification_level > 1,
					!!full_name,
					STRINGS.USER_VERIFICATION.VERIFY_USER_DOCUMENTATION
				)
			},
			{
				title: STRINGS.USER_VERIFICATION.TITLE_BANK_ACCOUNT,
				subtitle: bank_account.card_number,
				content: bank_account.provided ? (
					<BankForm initialValues={bank_account} formValues={bankFormValues}>
						<InformationSection
							text={
								!bank_account.verified && bank_account.provided
									? STRINGS.USER_VERIFICATION.PENDING_VERIFICATION_BANK
									: ''
							}
							onChangeValue={this.onOpenContactForm}
						/>
					</BankForm>
				) : (
					<div>
						<InformationSection
							text=""
							onChangeValue={this.onOpenContactForm}
						/>
					</div>
				),
				notification: this.generateNotification(
					bank_account.verified,
					bank_account.provided,
					STRINGS.USER_VERIFICATION.VERIFY_BANK_ACCOUNT
				)
			},
			{
				title: STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS,
				content: (
					<div>
						{id_data.provided ? (
							<InformationSection
								text={
									id_data.type
										? ''
										: STRINGS.USER_VERIFICATION.PENDING_VERIFICATION_DOCUMENTS
								}
								onChangeValue={this.onOpenContactForm}
							/>
						) : (
							<InformationSection
								onChangeText={STRINGS.USER_VERIFICATION.GOTO_VERIFICATION}
								onChangeValue={this.goToVerification}
							/>
						)}
					</div>
				),
				disabled: id_data.verified,
				notification: this.generateNotification(
					id_data.verified,
					id_data.provided,
					STRINGS.USER_VERIFICATION.VERIFY_ID_DOCUMENTS
				)
			}
		];

		this.setState({ sections });
	};

	goToVerification = () => {
		if (this.props.goToVerification) {
			this.props.goToVerification();
		}
	};

	onOpenContactForm = () => {
		if (this.props.openContactForm) {
			this.props.openContactForm();
		}
	};

	render() {
		if (!this.props.id) {
			return <Loader />;
		}
		const { sections } = this.state;

		return (
			<div>
				<Accordion
					sections={sections}
					allowMultiOpen={true}
					wrapperId="app_container-main"
					doScroll={false}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	id: state.user.id,
	verification_level: state.user.verification_level,
	userData: state.user.userData,
	email: state.user.email,
	activeLanguage: state.app.language
});

export default connect(mapStateToProps)(UserProfile);
