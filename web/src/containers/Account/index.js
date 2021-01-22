import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';

import { CheckTitle, MobileBarTabs, Loader } from '../../components';
import { IS_XHT } from '../../config/constants';
import { UserSecurity, UserSettings, Summary, Verification } from '../';
import STRINGS from '../../config/localizedStrings';
import { openContactForm } from '../../actions/appActions';

import withConfig from 'components/ConfigProvider/withConfig';

const getInitialTab = ({ name, path }) => {
	let activeTab = -1;
	let activeDevelopers = false;
	if (path === 'account') {
		activeTab = 0;
	} else if (path === 'summary') {
		activeTab = 0;
	} else if (path === 'security') {
		activeTab = 1;
	} else if (path === 'developers') {
		activeTab = 1;
		activeDevelopers = true;
	} else if (path === 'verification') {
		activeTab = 2;
	} else if (path === 'settings') {
		activeTab = 3;
		activeDevelopers = true;
	} else if (path === 'account/settings/username') {
		activeTab = 3;
		activeDevelopers = true;
	}
	return {
		activeTab,
		activeDevelopers,
	};
};

class Account extends Component {
	state = {
		activeTab: -1,
		tabs: [],
	};

	componentDidMount() {
		if (this.props.id) {
			this.updateTabs(this.props);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.id !== this.props.id ||
			nextProps.verification_level !== this.props.verification_level ||
			nextProps.otp_enabled !== this.props.otp_enabled ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.updateTabs(nextProps, false);
		} else if (nextProps.route.path !== this.props.route.path) {
			this.updateTabs(nextProps, true);
		}
	}

	hasUserVerificationNotifications = (
		verification_level,
		bank_account = {},
		id_data = {}
	) => {
		if (
			verification_level >= 2 &&
			bank_account.verified &&
			id_data.status === 3
		) {
			return false;
		}
		return true;
	};

	updateTabs = (
		{
			verification_level,
			otp_enabled,
			bank_account,
			id_data,
			full_name,
			phone_number,
			route,
			location,
			enabledPlugins,
		},
		updateActiveTab = false
	) => {
		const { icons: ICONS } = this.props;
		let activeTab = this.state.activeTab > -1 ? this.state.activeTab : 0;
		let activeDevelopers = false;

		if (updateActiveTab || this.state.activeTab === -1) {
			const initialValues = getInitialTab(route);
			activeTab = initialValues.activeTab;
			activeDevelopers = initialValues.activeDevelopers;
		}
		let verificationPending = false;
		if (
			verification_level < 1 &&
			!full_name &&
			enabledPlugins.includes('kyc')
		) {
			verificationPending = true;
		} else if (
			(id_data.status === 0 || id_data.status === 2) &&
			enabledPlugins.includes('kyc')
		) {
			verificationPending = true;
		} else if (!phone_number && enabledPlugins.includes('sms')) {
			verificationPending = true;
		} else if (
			!bank_account.filter((acc) => acc.status === 0 || acc.status === 2)
				.length &&
			enabledPlugins.includes('bank')
		) {
			verificationPending = true;
		}

		const tabs = [
			{
				title: isMobile ? (
					STRINGS['SUMMARY.TITLE']
				) : (
					<CheckTitle
						stringId="SUMMARY.TITLE"
						title={STRINGS['SUMMARY.TITLE']}
						iconId="TAB_SUMMARY"
						icon={ICONS['TAB_SUMMARY']}
					/>
				),
				content: <Summary router={this.props.router} />,
			},
			{
				title: isMobile ? (
					STRINGS['ACCOUNTS.TAB_SECURITY']
				) : (
					<CheckTitle
						stringId="ACCOUNTS.TAB_SECURITY"
						title={STRINGS['ACCOUNTS.TAB_SECURITY']}
						iconId="SECURITY_GREY"
						icon={ICONS['SECURITY_GREY']}
						notifications={!otp_enabled ? '!' : ''}
					/>
				),
				notifications: !otp_enabled ? '!' : '',
				content: <UserSecurity openApiKey={activeDevelopers} />,
			},
			{
				title: isMobile ? (
					STRINGS['ACCOUNTS.TAB_VERIFICATION']
				) : (
					<CheckTitle
						stringId="ACCOUNTS.TAB_VERIFICATION"
						title={STRINGS['ACCOUNTS.TAB_VERIFICATION']}
						iconId="TAB_SUMMARY"
						icon={ICONS['TAB_SUMMARY']}
					/>
				),
				notifications: verificationPending && !IS_XHT ? '!' : '',
				content: <Verification router={this.props.router} />,
			},
			{
				title: isMobile ? (
					STRINGS['ACCOUNTS.TAB_SETTINGS']
				) : (
					<CheckTitle
						stringId="ACCOUNTS.TAB_SETTINGS"
						title={STRINGS['ACCOUNTS.TAB_SETTINGS']}
						iconId="GEAR_GREY"
						icon={ICONS['GEAR_GREY']}
					/>
				),
				content: <UserSettings location={location} />,
			},
		];
		this.setState({ tabs, activeTab });
	};

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	renderContent = (tabs, activeTab) => tabs[activeTab].content;

	openContactForm = (data) => {
		this.props.openContactForm(data);
	};
	goToVerification = () => this.props.router.push('/verification');

	render() {
		const { id } = this.props;
		const { activeTab, tabs } = this.state;

		if (!id || activeTab === -1) {
			return <Loader />;
		}

		return isMobile ? (
			<div className="apply_rtl">
				<MobileBarTabs
					tabs={tabs}
					activeTab={activeTab}
					setActiveTab={this.setActiveTab}
				/>
				<div className="presentation_container apply_rtl content-with-bar overflow-y">
					<div className="inner_container">
						{activeTab > -1 && this.renderContent(tabs, activeTab)}
					</div>
				</div>
			</div>
		) : (
			<div className="presentation_container apply_rtl">
				{/* <TabController
					activeTab={activeTab}
					setActiveTab={this.setActiveTab}
					tabs={tabs}
					title={STRINGS["ACCOUNTS.TITLE"]}
					titleIcon={ICONS["ACCOUNT_LINE"]}
					iconId="ACCOUNT_LINE"
					className="account-tab"
				/> */}
				<div className="inner_container">
					{activeTab > -1 && this.renderContent(tabs, activeTab)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user,
	verification_level: state.user.verification_level,
	otp_enabled: state.user.otp_enabled || false,
	id: state.user.id,
	bank_account: state.user.userData.bank_account,
	id_data: state.user.userData.id_data,
	phone_number: state.user.userData.phone_number,
	full_name: state.user.userData.full_name,
	activeLanguage: state.app.language,
	enabledPlugins: state.app.enabledPlugins,
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Account));
