import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	AppBar,
	TabController,
	CheckTitle,
	Dialog,
	Loader,
	Logout,
	Notification
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

// import BankVerification from './BankVerification';
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

const CONTENT_CLASS =
	'd-flex justify-content-center align-items-center f-1 flex-column verification_content-wrapper';

class Verification extends Component {
	state = {
		activeTab: -1,
		tabs: [],
		dialogIsOpen: false,
		user: {}
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
		if (activeTab > 3) {
			this.goToAccountPage();
		} else {
			this.updateTabs(user, this.props.activeLanguage, activeTab);
			this.setState({ user, activeTab });
		}
	};

	calculateActiveTab = ({
		bank_account,
		address,
		phone_number,
		id_data,
		full_name
	}) => {
		if (!address.country) {
			return 0;
		} else if (!phone_number) {
			return 1;
		} else if (!id_data.provided) {
			return 2;
		}
		return 3;
	};

	updateTabs = (
		user = {},
		activeLanguage = this.props.activeLanguage,
		activeTab = this.state.activeTab
	) => {
		if (activeTab === -1) {
			return;
		}
		const { full_name } = user;
		const tabs = [
			{
				title: (
					<CheckTitle
						title={STRINGS.USER_VERIFICATION.TITLE_IDENTITY}
						titleClassName={activeTab !== 0 ? 'title-inactive' : ''}
						icon={
							activeTab === 0
								? ICONS.VERIFICATION_ID
								: ICONS.VERIFICATION_ID_INACTIVE
						}
					/>
				),
				content: activeTab === 0 && (
					<div className={CONTENT_CLASS}>
						<IdentityVerification
							fullName={full_name}
							moveToNextStep={this.goNextTab}
							activeLanguage={activeLanguage}
							initialValues={identityInitialValues(user)}
							openContactForm={this.openContactForm}
						/>
					</div>
				)
			},
			{
				title: (
					<CheckTitle
						title={STRINGS.USER_VERIFICATION.TITLE_MOBILE}
						titleClassName={activeTab !== 1 ? 'title-inactive' : ''}
						icon={
							activeTab === 1
								? ICONS.VERIFICATION_MOBILE
								: ICONS.VERIFICATION_MOBILE_INACTIVE
						}
					/>
				),
				content: activeTab === 1 && (
					<div className={CONTENT_CLASS}>
						<MobileVerification
							initialValues={mobileInitialValues}
							moveToNextStep={this.goNextTab}
							activeLanguage={activeLanguage}
							openContactForm={this.openContactForm}
						/>
					</div>
				)
			},
			{
				title: (
					<CheckTitle
						title={STRINGS.USER_VERIFICATION.TITLE_ID_DOCUMENTS}
						titleClassName={activeTab !== 2 ? 'title-inactive' : ''}
						icon={
							activeTab === 2
								? ICONS.VERIFICATION_DOC
								: ICONS.VERIFICATION_DOC_INACTIVE
						}
					/>
				),
				content: activeTab === 2 && (
					<div className={CONTENT_CLASS}>
						<DocumentsVerification
							nationality={user.nationality}
							initialValues={{
								type: user.nationality === 'IR' ? 'id' : 'passport'
							}}
							moveToNextStep={this.goNextTab}
							skip={this.skip}
							activeLanguage={activeLanguage}
							openContactForm={this.openContactForm}
						/>
					</div>
				)
			}
		];

		this.setState({ tabs, activeTab });
	};

	goNextTab = (type, data) => {
		let user = { ...this.state.user };
		if (type === 'bank') {
			user.full_name = data.full_name;
			user.bank_data = {
				...this.state.user.bank_data,
				...data.bank_data
			};
		} else if (type === 'identity') {
			user = {
				...this.state.user,
				...data
			};
		} else if (type === 'mobile') {
			user.phone_number = data.phone;
		}
		const activeTab = this.state.activeTab + 1;
		this.setState({ activeTab, user }, () => {
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

	renderContent = (tabs, activeTab) => tabs[activeTab].content || <div>c</div>;

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
		const { activeLanguage, token } = this.props;
		const { activeTab, tabs, dialogIsOpen, dialogType } = this.state;

		if (activeTab === -1 && tabs.length > 0) {
			return (
				<div className="app_container">
					<Loader />
				</div>
			);
		}

		const languageClasses = getClasesForLanguage(activeLanguage, 'array');
		const fontClass = getFontClassForLanguage(activeLanguage);

		return (
			<div
				className={classnames('app_container', fontClass, languageClasses[0])}
			>
				<AppBar
					isHome={true}
					token={token}
					rightChildren={
						<Logout className="sidebar-row bar-logout" onLogout={this.onLogout} />
					}
				/>
				{activeTab < tabs.length ? (
					<div className="presentation_container apply_rtl verification_container">
						<TabController
							activeTab={activeTab}
							tabs={tabs}
							title={STRINGS.ACCOUNTS.TAB_VERIFICATION}
							titleIcon={ICONS.ID_GREY}
						/>
						<div className="inner_container">
							{activeTab > -1 && this.renderContent(tabs, activeTab)}
						</div>
					</div>
				) : (
					<div className="presentation_container apply_rtl verification_container">
						<TabController
							tabs={[]}
							title={STRINGS.ACCOUNTS.TAB_VERIFICATION}
							titleIcon={ICONS.ID_GREY}
						/>
						<div className="inner_container">complete</div>
					</div>
				)}
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
	fetchingAuth: state.auth.fetching
});

const mapDispatchToProps = (dispatch) => ({
	requestSmsCode: bindActionCreators(requestSmsCode, dispatch),
	verifySmsCode: bindActionCreators(verifySmsCode, dispatch),
	verifyBankData: bindActionCreators(verifyBankData, dispatch),
	logout: bindActionCreators(logout, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
