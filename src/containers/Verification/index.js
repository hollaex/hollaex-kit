import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	AppBar,
	CheckTitle,
	Dialog,
	Loader,
	Logout,
	Notification,
	MobileBarTabs,
	PanelInformationRow
} from '../../components';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import {
	requestSmsCode,
	verifySmsCode,
	verifyBankData,
	getUserData
} from '../../actions/verificationActions';
import { logout } from '../../actions/authAction';

import BankVerification from './BankVerification';
import { isBrowser, isMobile } from 'react-device-detect';
import VerificationHome from './VerificationHome';
import IdentityVerification from './IdentityVerification';
import MobileVerification from './MobileVerification';
import DocumentsVerification from './DocumentsVerification';
import { mobileInitialValues, identityInitialValues } from './utils';
import {
	getClasesForLanguage,
	getFontClassForLanguage
} from '../../utils/string';
import { ContactForm } from '../';
import { NOTIFICATIONS } from '../../actions/appActions';
import { getThemeClass } from '../../utils/theme';
import BankVerificationHome from './BankVerificationHome';
import IdentityVerificationHome from './IdentityVerificationHome';
import MobileVerificationHome from './MobileVerificationHome';
import DocumentsVerificationHome from './DocumentsVerificationHome';
import MobileTabs from './MobileTabs';

// const CONTENT_CLASS =
// 	'd-flex justify-content-center align-items-center f-1 flex-column verification_content-wrapper';

class Verification extends Component {
	state = {
		activeTab: -1,
		tabs: [],
		dialogIsOpen: false,
		user: {},
		activePage: 0
	};

	componentDidMount() {
		if (this.props.token) {
			this.init(this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.fetchingAuth && this.props.fetchingAuth) {
			this.init(nextProps);
		} else if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.updateTabs(this.state.user, nextProps.activeLanguage);
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.state.activeTab !== nextState.activeTab && this.state.activeTab !== -1) {
			this.updateTabs(this.state.user, this.props.activeLanguage, nextState.activeTab);
		}
	}
	
	init = (props) => {
		getUserData()
			.then(({ data }) => {
				this.setUserData(data);
			})
			.catch((err) => {
				// TODO what to do in case of error
			});
	};

	setUserData = (user = {}) => {
		const activeTab = this.calculateActiveTab(user);
		if (activeTab > 4) {
			this.goToAccountPage();
		} else {
			this.updateTabs(user, this.props.activeLanguage, activeTab);
			this.setState({ user, activeTab });
		}
	};

	calculateActiveTab = ({
		email,
		bank_account,
		address,
		phone_number,
		id_data,
		full_name
	}) => {
		if (!email) {
			return 0
		} else if (!bank_account.length) {
			return 1;
		} else if (!address.country) {
			return 2;
		} else if (!phone_number) {
			return 3;
		} else if (!id_data.provided) {
			return 4;
		}
		return 0;
	};

	updateTabs = (
		user = {},
		activeLanguage = this.props.activeLanguage,
		activeTab = this.state.activeTab
	) => {
		if (activeTab === -1) {
			return;
		}
		const { email, bank_account, address, id_data, phone_number } = user;
		let bank_status = 0;
		if (bank_account.length) {
			if (bank_account.filter(data => data.status === 3).length) {
				bank_status = 3;
			} else if (bank_account.filter(data => data.status === 1).length) {
				bank_status = 1;
			} else if (bank_account.filter(data => data.status === 2).length) {
				bank_status = 2;
			}
		}
		const identity_status = address.country 
				? id_data.status === 3
					? 3 : 1
				: 1;
		const tabs = [
			{
				title: isMobile ? (
					<MobileTabs
						title={STRINGS.USER_VERIFICATION.TITLE_EMAIL}
						className={activeTab === 0 ? 'active_mobile_tab' : ''}
						icon={ICONS.VERIFICATION_EMAIL_NEW}
						statusCode={email ? 3 : 0}
					/>
				) : (
					<CheckTitle
						title={STRINGS.USER_VERIFICATION.TITLE_EMAIL}
						titleClassName={activeTab !== 0 ? 'title-inactive' : ''}
						className={activeTab === 0 ? 'active-tab-icon' : ''}
						icon={ICONS.VERIFICATION_EMAIL_NEW}
						statusCode={email ? 3 : 0}
					/>
				),
				content: activeTab === 0 && (
					<div>
						<PanelInformationRow
							label={STRINGS.USER_VERIFICATION.MY_EMAIL}
							information={email}
							className={"title-font"}
							disable
						/>
					</div>
				)
			},
			{
				title: isMobile ? (
					<MobileTabs
						title={STRINGS.USER_VERIFICATION.TITLE_BANK}
						className={activeTab === 1 ? 'active_mobile_tab' : ''}
						icon={ICONS.VERIFICATION_BANK_NEW}
						statusCode={bank_status}
					/>
				) : (
					<CheckTitle
						title={STRINGS.USER_VERIFICATION.TITLE_BANK}
						titleClassName={activeTab !== 1 ? 'title-inactive' : ''}
						className={activeTab === 1 ? 'active-tab-icon' : ''}
						icon={ICONS.VERIFICATION_BANK_NEW}
						statusCode={bank_status}
					/>
				),
				content: (<BankVerificationHome
							user={user}
							setActiveTab={this.setActiveTab}
							setActivePageContent={this.setActivePageContent}
						/>
				)
			},
			{
				title: isMobile ? (
					<MobileTabs
						title={STRINGS.USER_VERIFICATION.TITLE_IDENTITY}
						className={activeTab === 2 ? 'active_mobile_tab' : ''}
						icon={ICONS.VERIFICATION_ID_NEW}
						statusCode={identity_status}
					/>
				) : (
					<CheckTitle
						title={STRINGS.USER_VERIFICATION.TITLE_IDENTITY}
						titleClassName={activeTab !== 2 ? 'title-inactive' : ''}
						className={activeTab === 2 ? 'active-tab-icon' : ''}
						icon={ICONS.VERIFICATION_ID_NEW}
						statusCode={identity_status}
					/>
				),
				content: (<IdentityVerificationHome
						user={user}
						setActiveTab={this.setActiveTab}
						setActivePageContent={this.setActivePageContent} />)
			},
			{
				title: isMobile ? (
					<MobileTabs
						title={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PHONE}
						className={activeTab === 3 ? 'active_mobile_tab' : ''}
						icon={ICONS.VERIFICATION_PHONE_NEW}
						statusCode={!phone_number ? 0 : 3}
					/>
				) : (
					<CheckTitle
						title={STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PHONE}
						titleClassName={activeTab !== 3 ? 'title-inactive' : ''}
						className={activeTab === 3 ? 'active-tab-icon' : ''}
						icon={ICONS.VERIFICATION_PHONE_NEW}
						statusCode={!phone_number ? 0 : 3}
					/>
				),
				content: (<MobileVerificationHome user={user} setActivePageContent={this.setActivePageContent} />)
			},
			{
				title: isMobile ? (
					<MobileTabs
						title={STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS}
						className={activeTab === 4 ? 'active_mobile_tab' : ''}
						icon={ICONS.VERIFICATION_DOCUMENT_NEW}
						statusCode={id_data.status}
					/>
				) : (
					<CheckTitle
						title={STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS}
						titleClassName={activeTab !== 4 ? 'title-inactive' : ''}
						className={activeTab === 4 ? 'active-tab-icon' : ''}
						icon={ICONS.VERIFICATION_DOCUMENT_NEW}
						statusCode={id_data.status}
					/>
				),
				content: (<DocumentsVerificationHome user={user} setActivePageContent={this.setActivePageContent} />)
			}
		];

		this.setState({ tabs, activeTab });
	};

	goNextTab = (type, data) => {
		let user = { ...this.state.user };
		if (type === 'bank') {
			user.bank_account = [
				...data.bank_data
			];
		} else if (type === 'identity') {
			user = {
				...this.state.user,
				...data
			};
		} else if (type === 'mobile') {
			user.phone_number = data.phone;
		}
		const activeTab = this.state.activeTab;
		this.setState({ user, activeTab }, () => {
			if (activeTab >= this.state.tabs.length) {
				this.setState({ dialogIsOpen: true, dialogType: 'complete' });
			} else {
				this.updateTabs(user, this.props.activeLanguage);
			}
		});
	};

	goToAccountPage = () => this.props.router.push('/account');
	goToExir = () => this.props.router.push('/account');

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	setActivePageContent = activePage => {
		this.setState({ activePage });
	};

	renderContent = (tabs, activeTab) => tabs[activeTab].content || <div>c</div>;

	renderPageContent = (tabProps) => {
		const { activePage, activeTab, tabs, user } = this.state;
		const { activeLanguage } = this.props;
		switch (activePage) {
			case 0:
				return <VerificationHome
						activeTab={activeTab}
						tabProps={tabProps}
						tabs={tabs}
						openContactForm={this.openContactForm}
						setActiveTab={this.setActiveTab}
						renderContent={this.renderContent} />;
			case 1:
				return <BankVerification
						icon={ICONS.VERIFICATION_BANK_NEW}
						openContactForm={this.openContactForm}
						setActivePageContent={this.setActivePageContent}
						setActiveTab={this.setActiveTab}
						moveToNextStep={this.goNextTab} />
			case 2:
				return <IdentityVerification
						icon={ICONS.VERIFICATION_BANK_NEW}
						fullName={user.full_name}
						moveToNextStep={this.goNextTab}
						activeLanguage={activeLanguage}
						initialValues={identityInitialValues(user)}
						openContactForm={this.openContactForm}
						setActivePageContent={this.setActivePageContent}
						setActiveTab={this.setActiveTab} />
			case 3:
				return <MobileVerification
						initialValues={mobileInitialValues(user.address)}
						moveToNextStep={this.goNextTab}
						activeLanguage={activeLanguage}
						openContactForm={this.openContactForm}
						setActiveTab={this.setActiveTab}
						setActivePageContent={this.setActivePageContent}
					/>
			case 4:
				return <DocumentsVerification
						nationality={user.nationality}
						initialValues={{
							type: user.nationality === 'IR' ? 'id' : 'passport'
						}}
						moveToNextStep={this.goNextTab}
						skip={this.skip}
						activeLanguage={activeLanguage}
						openContactForm={this.openContactForm}
						setActiveTab={this.setActiveTab}
						setActivePageContent={this.setActivePageContent}
					/>
			default:
				return;
		}
	};

	onCloseDialog = () => this.setState({ dialogIsOpen: false });

	skip = () => {
		this.setState({ dialogIsOpen: true, dialogType: 'skip' });
	};

	openContactForm = () => {
		this.setState({ dialogIsOpen: true, dialogType: 'contact' });
	};
	renderDialogContent = (type) => {
		switch (type) {
			case 'skip':
			case 'complete':
				const data = {
					type,
					onClick: this.goToExir
				};
				return <Notification type={NOTIFICATIONS.VERIFICATION} data={data} />;
			case 'contact':
				return (
					<ContactForm
						onSubmitSuccess={this.onCloseDialog}
						onClose={this.onCloseDialog}
					/>
				);
			default:
				return <div />;
		}
	};

	onLogout = () => this.props.logout('');

	render() {
		const { activeLanguage, token, activeTheme, router, location } = this.props;
		const { activeTab, tabs, dialogIsOpen, dialogType, user } = this.state;

		if (activeTab === -1 && tabs.length > 0) {
			return (
				<div className="app_container">
					<Loader />
				</div>
			);
		}

		const languageClasses = getClasesForLanguage(activeLanguage, 'array');
		const fontClass = getFontClassForLanguage(activeLanguage);
		const tabProps = {
			tabs: activeTab < tabs.length ? tabs : [],
			title: STRINGS.ACCOUNTS.TAB_VERIFICATION,
			titleIcon: ICONS.ID_GREY
		};
		return (
			<div
				className={classnames(
					'app_container-main',
					'my-3',
					getThemeClass(activeTheme),
					fontClass,
					languageClasses[0],
					{
						'layout-mobile': isMobile,
						'layout-desktop': isBrowser
					}
				)}
			>
				{/* {!isMobile && <AppBar
					isHome={true}
					token={token}
					theme={activeTheme}
					router={router}
					location={location}
					user={user}
					logout={this.onLogout}
					rightChildren={
						<Logout
							className="sidebar-row bar-logout"
							onLogout={this.onLogout}
						/>
					}
				/>} */}
				{/* {isMobile && <MobileTabBar {...tabProps} activeTab={activeTab} setActiveTab={this.setActiveTab} />} */}
				{this.renderPageContent(tabProps)}
				<Dialog
					isOpen={dialogIsOpen}
					label="hollaex--verification-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={dialogType !== 'complete'}
					showCloseText={false}
				>
					{this.renderDialogContent(dialogType)}
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	activeLanguage: state.app.language,
	token: state.auth.token,
	activeTheme: state.app.theme,
	fetchingAuth: state.auth.fetching,
	user: state.user
});

const mapDispatchToProps = (dispatch) => ({
	requestSmsCode: bindActionCreators(requestSmsCode, dispatch),
	verifySmsCode: bindActionCreators(verifySmsCode, dispatch),
	verifyBankData: bindActionCreators(verifyBankData, dispatch),
	logout: bindActionCreators(logout, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
