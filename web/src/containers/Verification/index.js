import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _get from 'lodash/get';
import {
	CustomTabs,
	CustomMobileTabs,
	Dialog,
	Loader,
	Notification,
	PanelInformationRow,
	Button,
	SmartTarget,
	EditWrapper,
} from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { logout, requestVerificationEmail } from 'actions/authAction';
import { MAX_NUMBER_BANKS } from 'config/constants';

import { isBrowser, isMobile } from 'react-device-detect';
import VerificationHome from './VerificationHome';
import MobileVerification from './MobileVerification';
import VerificationSentModal from './VerificationSentModal';
import {
	mobileInitialValues,
	identityInitialValues,
	documentInitialValues,
} from './utils';
import { getClasesForLanguage, getFontClassForLanguage } from 'utils/string';
import { ContactForm } from 'containers';
import { NOTIFICATIONS, openContactForm } from 'actions/appActions';
import { setMe, updateDocuments, updateUser } from 'actions/userAction';
import { getThemeClass } from 'utils/theme';
import MobileVerificationHome from './MobileVerificationHome';
// import MobileTabs from './MobileTabs';
import { verifyBankData } from 'actions/verificationActions';
import { getErrorLocalized } from 'utils/errors';
import { required, maxLength } from 'components/Form/validations';
import { getCountry } from 'containers/Verification/utils';
import { getFormatTimestamp } from 'utils/utils';
import { COUNTRIES_OPTIONS } from 'utils/countries';
import { verificationTabsSelector } from './selector';
// const CONTENT_CLASS =
// 	'd-flex justify-content-center align-items-center f-1 flex-column verification_content-wrapper';
import UserPaymentVerification from './UserPaymentVerification';
import UserPaymentVerificationHome from './UserPaymentVerificationHome';

class Verification extends Component {
	state = {
		activeTab: -1,
		tabs: [],
		currentTabs: [],
		dialogIsOpen: false,
		user: {},
		activePage: 'email',
		showVerificationSentModal: false,
	};

	componentDidMount() {
		const {
			user,
			router: {
				location: { search, query },
			},
		} = this.props;

		if (user) {
			this.setUserData(user, () => {
				const { currentTabs } = this.state;

				let initial_tab = -1;

				// The initial_tab logic is added to support old plugins logic
				if (query && query.initial_tab) {
					initial_tab = currentTabs.findIndex(
						(tab) => tab === query.initial_tab
					);
				} else if (search) {
					initial_tab = currentTabs.findIndex(
						(tab) => tab === this.getTabBySearch(search)
					);
				}

				if (initial_tab !== -1) {
					this.setState({ activeTab: initial_tab }, this.openCurrentTab);
				}
			});
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.user.email !== this.props.user.email ||
			nextProps.user.phone_number !== this.props.user.phone_number ||
			JSON.stringify(nextProps.user.address) !==
				JSON.stringify(this.props.user.address) ||
			JSON.stringify(nextProps.user.id_data) !==
				JSON.stringify(this.props.user.id_data)
		) {
			this.setUserData(nextProps.user);
		}
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.updateTabs(this.state.user, nextProps.activeLanguage);
		}
	}

	UNSAFE_componentWillUpdate(nextProps, nextState) {
		if (
			this.state.activeTab !== nextState.activeTab &&
			this.state.activeTab !== -1
		) {
			this.updateTabs(
				nextState.user,
				nextProps.activeLanguage,
				nextState.activeTab
			);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { activeTab } = this.state;
		if (prevState.activeTab !== activeTab) {
			this.openCurrentTab();
		}
	}

	getTabBySearch = (search) => {
		if (search) {
			if (search.includes('email')) {
				return 'email';
			} else if (search.includes('phone')) {
				return 'sms';
			} else if (search.includes('identity')) {
				return 'kyc';
			} else if (search.includes('banks')) {
				return 'bank';
			}
		}

		return '';
	};

	translateTabKey = (key) => {
		switch (key) {
			case 'email':
				return 'email';
			case 'sms':
				return 'phone';
			case 'kyc':
				return 'identity';
			case 'bank':
				return 'banks';
			default:
				return '';
		}
	};

	openCurrentTab = () => {
		const { activeTab, currentTabs } = this.state;
		const { router } = this.props;
		const currentTab = this.translateTabKey(currentTabs[activeTab]);

		router.push(`/verification?${currentTab}`);
	};

	setUserData = (user = {}, cb) => {
		const calculatedData = this.calculateActiveTab(user);
		if (calculatedData.activeTab > 4) {
			this.goToAccountPage();
		} else {
			this.updateTabs(
				user,
				this.props.activeLanguage,
				calculatedData.activeTab,
				calculatedData.currentTabs
			);
			this.setState(
				{
					user,
					activeTab: calculatedData.activeTab,
					currentTabs: calculatedData.currentTabs,
				},
				() => {
					if (cb) {
						cb();
					}
				}
			);
		}
	};

	calculateActiveTab = ({
		email,
		bank_account,
		address,
		phone_number,
		id_data,
		full_name,
	}) => {
		const {
			enabledPlugins,
			router: {
				location: { query: { initial_tab } = {} },
			},
			availableRemotePlugins,
			ultimate_fiat,
		} = this.props;
		const availablePlugins = [
			'kyc',
			'bank',
			'sms',
			'user_payments',
			...availableRemotePlugins,
		];
		let currentTabs = ['email'];
		if (enabledPlugins.length) {
			const temp = enabledPlugins.filter((val) =>
				availablePlugins.includes(val)
			);
			currentTabs = [...currentTabs, ...temp];
		}

		if (ultimate_fiat) {
			currentTabs = [...currentTabs, 'user_payments'];
		}

		const sortingArray = ['email', 'sms', 'kyc', 'bank', 'user_payments'];
		currentTabs.sort(
			(a, b) => sortingArray.indexOf(a) - sortingArray.indexOf(b)
		);
		let activeTab = 0;
		if (initial_tab && currentTabs.indexOf(initial_tab) !== -1) {
			activeTab = currentTabs.indexOf(initial_tab);
		} else if (!email && currentTabs.indexOf('email') !== -1) {
			activeTab = currentTabs.indexOf('email');
		} else if (!bank_account.length && currentTabs.indexOf('bank') !== -1) {
			activeTab = currentTabs.indexOf('bank');
		} else if (!address.country && currentTabs.indexOf('kyc') !== -1) {
			activeTab = currentTabs.indexOf('kyc');
		} else if (!phone_number && currentTabs.indexOf('sms') !== -1) {
			activeTab = currentTabs.indexOf('sms');
		}

		const sortedNonDynamicTabs = currentTabs.filter((tab) =>
			sortingArray.includes(tab)
		);

		return {
			activeTab,
			currentTabs: [...sortedNonDynamicTabs, ...availableRemotePlugins],
		};
	};

	sendVerificationEmail = () => {
		const { user: { email } = {} } = this.props;
		return requestVerificationEmail({ email })
			.then(() => {
				this.setState({ showVerificationSentModal: true });
			})
			.catch((error) => {
				if (error.response && error.response.status === 404) {
					this.setState({ showVerificationSentModal: true });
				} else {
					const errors = {};
					if (error.response) {
						errors._error = error.response.data.message;
					} else {
						errors._error = error.message;
					}
					console.error(errors);
				}
			});
	};

	getRemoteTabUtils = () => {
		const { remoteTabs, icons: ICONS } = this.props;
		const tabUtils = {};
		Object.entries(remoteTabs).forEach(
			([
				tab_key,
				{
					home: { string_id, icon_id, target },
				},
			]) => {
				tabUtils[tab_key] = {
					title: isMobile ? (
						<CustomMobileTabs
							title={STRINGS[string_id]}
							icon={ICONS[icon_id]}
						/>
					) : (
						<CustomTabs
							stringId={string_id}
							title={STRINGS[string_id]}
							iconId={icon_id}
							icon={ICONS[icon_id]}
						/>
					),
					content: (
						<SmartTarget
							id={target}
							handleBack={this.handleBack}
							setActivePageContent={this.setActivePageContent}
						/>
					),
				};
			}
		);
		return tabUtils;
	};

	getRemoteTabPageContent = (activePage) => {
		const { remoteTabs, openContactForm, availableRemotePlugins } = this.props;

		if (availableRemotePlugins.includes(activePage)) {
			const {
				[activePage]: {
					verification: { target },
				},
			} = remoteTabs;
			return (
				<SmartTarget
					id={target}
					openContactForm={openContactForm}
					setActivePageContent={this.setActivePageContent}
					handleBack={this.handleBack}
					moveToNextStep={this.goNextTab}
				/>
			);
		} else {
			return <div>No content</div>;
		}
	};

	updateTabs = (
		user = {},
		activeLanguage = this.props.activeLanguage,
		activeTab = this.state.activeTab,
		currentTabs = this.state.currentTabs
	) => {
		if (activeTab === -1) {
			return;
		}
		const { icons: ICONS } = this.props;
		const { email, bank_account, id_data, phone_number, email_verified } = user;
		let bank_status = 0;
		if (bank_account.length) {
			if (bank_account.filter((data) => data.status === 3).length) {
				bank_status = 3;
			} else if (bank_account.filter((data) => data.status === 1).length) {
				bank_status = 1;
			} else if (bank_account.filter((data) => data.status === 2).length) {
				bank_status = 2;
			}
			// if (id_data.status !== 3) {
			// 	bank_status = 1;
			// }
			if (
				bank_account.length ===
				bank_account.filter((data) => data.status === 0).length
			) {
				bank_status = 0;
			}
		}
		const identity_status = id_data.status || 0;
		const tabUtils = {
			email: {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS['USER_VERIFICATION.TITLE_EMAIL']}
						icon={ICONS['VERIFICATION_EMAIL_NEW']}
						statusCode={email_verified ? 3 : 0}
					/>
				) : (
					<CustomTabs
						stringId="USER_VERIFICATION.TITLE_EMAIL"
						title={STRINGS['USER_VERIFICATION.TITLE_EMAIL']}
						iconId="VERIFICATION_EMAIL_NEW"
						icon={ICONS['VERIFICATION_EMAIL_NEW']}
						statusCode={email_verified ? 3 : 0}
					/>
				),
				content: activeTab === 0 && (
					<div>
						<PanelInformationRow
							label={STRINGS['USER_VERIFICATION.MY_EMAIL']}
							information={email}
							className={'title-font'}
							disable
						/>
						{!email_verified && (
							<div className="mt-4">
								<EditWrapper stringId="USER_VERIFICATION.EMAIL_VERIFICATION" />
								<Button
									className="caps"
									label={STRINGS['USER_VERIFICATION.EMAIL_VERIFICATION']}
									onClick={this.sendVerificationEmail}
								/>
							</div>
						)}
					</div>
				),
			},
			bank: {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS['USER_VERIFICATION.TITLE_BANK']}
						icon={ICONS['VERIFICATION_BANK_NEW']}
						statusCode={bank_status}
					/>
				) : (
					<CustomTabs
						stringId="USER_VERIFICATION.TITLE_BANK"
						title={STRINGS['USER_VERIFICATION.TITLE_BANK']}
						iconId="VERIFICATION_BANK_NEW"
						icon={ICONS['VERIFICATION_BANK_NEW']}
						statusCode={bank_status}
					/>
				),
				content: (
					<SmartTarget
						id="REMOTE_COMPONENT__BANK_VERIFICATION_HOME"
						handleBack={this.handleBack}
						setActivePageContent={this.setActivePageContent}
						MAX_NUMBER_BANKS={MAX_NUMBER_BANKS}
					/>
				),
			},
			kyc: {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS['USER_VERIFICATION.TITLE_IDENTITY']}
						icon={ICONS['VERIFICATION_ID_NEW']}
						statusCode={identity_status}
					/>
				) : (
					<CustomTabs
						stringId="USER_VERIFICATION.TITLE_IDENTITY"
						title={STRINGS['USER_VERIFICATION.TITLE_IDENTITY']}
						iconId="VERIFICATION_ID_NEW"
						icon={ICONS['VERIFICATION_ID_NEW']}
						statusCode={identity_status}
					/>
				),
				content: (
					<SmartTarget
						id="REMOTE_COMPONENT__KYC_VERIFICATION_HOME"
						handleBack={this.handleBack}
						setActivePageContent={this.setActivePageContent}
						getFormatTimestamp={getFormatTimestamp}
						getCountry={getCountry}
					/>
				),
			},
			sms: {
				title: isMobile ? (
					<CustomMobileTabs
						title={
							STRINGS[
								'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PHONE'
							]
						}
						icon={ICONS['VERIFICATION_PHONE_NEW']}
						statusCode={!phone_number ? 0 : 3}
					/>
				) : (
					<CustomTabs
						stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PHONE"
						title={
							STRINGS[
								'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PHONE'
							]
						}
						iconId="VERIFICATION_PHONE_NEW"
						icon={ICONS['VERIFICATION_PHONE_NEW']}
						statusCode={!phone_number ? 0 : 3}
					/>
				),
				content: (
					<MobileVerificationHome
						user={user}
						setActivePageContent={this.setActivePageContent}
					/>
				),
			},
			user_payments: {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS['USER_PAYMENT.TITLE']}
						icon={ICONS['VERIFICATION_USER_PAYMENT']}
					/>
				) : (
					<CustomTabs
						stringId="USER_PAYMENT.TITLE"
						title={STRINGS['USER_PAYMENT.TITLE']}
						iconId="VERIFICATION_USER_PAYMENT"
						icon={ICONS['VERIFICATION_USER_PAYMENT']}
					/>
				),
				content: (
					<UserPaymentVerificationHome
						user={user}
						setActivePageContent={this.setActivePageContent}
						handleBack={this.handleBack}
					/>
				),
			},
			...this.getRemoteTabUtils(),
		};
		let tabs = [];
		currentTabs.forEach((key) => {
			if (tabUtils[key]) tabs = [...tabs, tabUtils[key]];
		});

		this.setState({ tabs, activeTab });
	};

	goNextTab = (type, data) => {
		let user = { ...this.state.user };
		if (type === 'bank' || type === 'user_payments') {
			user.bank_account = [...data.bank_data];
		} else if (type === 'identity') {
			user = {
				...this.state.user,
				...data,
			};
		} else if (type === 'mobile') {
			user.phone_number = data.phone;
		} else if (type === 'documents') {
			user.id_data = { ...data };
		}
		const activeTab = this.state.activeTab;
		this.props.setMe(user);
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

	setActiveTab = (activeTab, event) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.setState({ activeTab });
	};

	handleBack = (tabKey, event) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (tabKey) {
			let activeTab = this.state.currentTabs.indexOf(tabKey);
			activeTab = activeTab >= 0 ? activeTab : 0;
			this.setState({ activeTab });
		}
	};

	setActivePageContent = (activePage) => {
		this.setState({ activePage });
	};

	renderContent = (tabs, activeTab) => {
		return tabs[activeTab].content || <div>c</div>;
	};

	renderPageContent = (tabProps) => {
		const { activePage, activeTab, tabs, user } = this.state;
		const {
			activeLanguage,
			icons: ICONS,
			openContactForm,
			constants,
		} = this.props;
		switch (activePage) {
			case 'email':
				return (
					<VerificationHome
						activeTab={activeTab}
						tabProps={tabProps}
						tabs={tabs}
						openContactForm={openContactForm}
						setActiveTab={this.setActiveTab}
						renderContent={this.renderContent}
					/>
				);
			case 'bank':
				return (
					<SmartTarget
						id="REMOTE_COMPONENT__BANK_VERIFICATION"
						iconId="VERIFICATION_BANK_NEW"
						icon={ICONS['VERIFICATION_BANK_NEW']}
						openContactForm={openContactForm}
						setActivePageContent={this.setActivePageContent}
						handleBack={this.handleBack}
						moveToNextStep={this.goNextTab}
						verifyBankData={verifyBankData}
						getErrorLocalized={getErrorLocalized}
						maxLength={maxLength}
						required={required}
					/>
				);
			case 'kyc':
				return (
					<SmartTarget
						id="REMOTE_COMPONENT__KYC_VERIFICATION"
						openContactForm={openContactForm}
						setActivePageContent={this.setActivePageContent}
						handleBack={this.handleBack}
						moveToNextStep={this.goNextTab}
						setActiveTab={this.setActiveTab}
						identityInitialValues={identityInitialValues}
						documentInitialValues={documentInitialValues}
						updateDocuments={updateDocuments}
						updateUser={updateUser}
						countries_options={COUNTRIES_OPTIONS}
					/>
				);
			case 'sms':
				return (
					<MobileVerification
						initialValues={mobileInitialValues(
							user.address,
							_get(constants, 'defaults')
						)}
						moveToNextStep={this.goNextTab}
						activeLanguage={activeLanguage}
						openContactForm={openContactForm}
						handleBack={this.handleBack}
						setActivePageContent={this.setActivePageContent}
					/>
				);
			case 'user_payments':
				return (
					<UserPaymentVerification
						iconId="VERIFICATION_USER_PAYMENT"
						icon={ICONS['VERIFICATION_USER_PAYMENT']}
						moveToNextStep={this.goNextTab}
						openContactForm={openContactForm}
						setActivePageContent={this.setActivePageContent}
						handleBack={this.handleBack}
					/>
				);
			default:
				return this.getRemoteTabPageContent(activePage);
		}
	};

	onCloseDialog = () => this.setState({ dialogIsOpen: false });

	skip = () => {
		this.setState({ dialogIsOpen: true, dialogType: 'skip' });
	};

	renderDialogContent = (type) => {
		switch (type) {
			case 'skip':
			case 'complete':
				const data = {
					type,
					onClick: this.goToExir,
				};
				return <Notification type={NOTIFICATIONS.VERIFICATION} data={data} />;
			case 'contact':
				return (
					<ContactForm
						initialValues={{ category: 'verify' }}
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
		const { activeLanguage, activeTheme, icons: ICONS } = this.props;
		const {
			activeTab,
			tabs,
			dialogIsOpen,
			dialogType,
			showVerificationSentModal,
		} = this.state;
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
			title: STRINGS['ACCOUNTS.TAB_VERIFICATION'],
			titleIcon: ICONS['ID_GREY'],
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
						'layout-desktop': isBrowser,
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
					theme={activeTheme}
				>
					{this.renderDialogContent(dialogType)}
				</Dialog>
				<VerificationSentModal
					isOpen={showVerificationSentModal}
					onCloseDialog={() => {
						this.setState({ showVerificationSentModal: false });
					}}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const remoteTabs = verificationTabsSelector(state);
	const availableRemotePlugins = Object.keys(remoteTabs);

	return {
		ultimate_fiat: state.app.features.ultimate_fiat,
		activeLanguage: state.app.language,
		// token: state.auth.token,
		activeTheme: state.app.theme,
		user: state.user,
		enabledPlugins: state.app.enabledPlugins,
		constants: state.app.constants,
		remoteTabs,
		availableRemotePlugins,
	};
};

const mapDispatchToProps = (dispatch) => ({
	setMe: bindActionCreators(setMe, dispatch),
	logout: bindActionCreators(logout, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Verification));
