import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { isMobile } from 'react-device-detect';

import { setLanguage, changeTheme, openContactForm } from '../../actions/appActions';
import { logout } from '../../actions/authAction';
import {
	updateUser,
	setUserData,
	setUsername,
	setUsernameStore
} from '../../actions/userAction';
import { Accordion, IconTitle, Button, HeaderSection, CustomTabs, CustomMobileTabs, CustomTabBar, MobileTabBar } from '../../components';
import SettingsForm, { generateFormValues } from './SettingsForm';
import UsernameForm, { generateUsernameFormValues } from './UsernameForm';
import LanguageForm, { generateLanguageFormValues } from './LanguageForm';

import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';

class UserSettings extends Component {
	state = {
		sections: [],
		tabs: [],
		dialogIsOpen: false,
		modalText: '',
		activeTab: 0
	};

	componentDidMount() {
		this.updateTabs(this.props, this.state.activeTab);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.updateTabs(this.props, this.state.activeTab);
		}
	}
	
	componentWillUpdate(nextProps, nextState) {
		if (this.state.activeTab !== nextState.activeTab && this.state.activeTab !== -1) {
			this.updateTabs(nextProps, nextState.activeTab);
		}
	}
	

	updateTabs = ({ username = '', settings = {} }, activeTab) => {
		const formValues = generateFormValues();
		const usernameFormValues = generateUsernameFormValues(
			settings.usernameIsSet
		);
		const languageFormValue = generateLanguageFormValues();

		const tabs = [
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_NOTIFICATION}
						icon={ICONS.SETTING_NOTIFICATION_ICON}
					/>
				) : (
						<CustomTabs
							title={STRINGS.USER_SETTINGS.TITLE_NOTIFICATION}
							icon={ICONS.SETTING_NOTIFICATION_ICON}
						/>
					),
				content: activeTab === 0 && (
					<div>
						Coming soon...
					</div>
				)
			}, {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_INTERFACE}
						icon={ICONS.SETTING_INTERFACE_ICON}
					/>
				) : (
						<CustomTabs
							title={STRINGS.USER_SETTINGS.TITLE_INTERFACE}
							icon={ICONS.SETTING_INTERFACE_ICON}
						/>
					),
				content: activeTab === 1 && (
					<SettingsForm
						onSubmit={this.onSubmitSettings}
						formFields={formValues}
						initialValues={settings}
					/>
				)
			}, {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_LANGUAGE}
						icon={ICONS.SETTING_LANGUAGE_ICON}
					/>
				) : (
						<CustomTabs
							title={STRINGS.USER_SETTINGS.TITLE_LANGUAGE}
							icon={ICONS.SETTING_LANGUAGE_ICON}
						/>
					),
				content: activeTab === 2 && (
					<LanguageForm
						onSubmit={this.onSubmitSettings}
						formFields={languageFormValue}
						initialValues={settings} />
				)
			}, {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_CHAT}
						icon={ICONS.SETTING_CHAT_ICON}
					/>
				) : (
						<CustomTabs
							title={STRINGS.USER_SETTINGS.TITLE_CHAT}
							icon={ICONS.SETTING_CHAT_ICON}
						/>
					),
				content: activeTab === 3 && (
					<UsernameForm
						onSubmit={this.onSubmitUsername}
						formFields={usernameFormValues}
						initialValues={{ username }}
					/>
				)
			}, {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_AUDIO_CUE}
						icon={ICONS.SETTING_AUDIO_ICON}
					/>
				) : (
						<CustomTabs
							title={STRINGS.USER_SETTINGS.TITLE_AUDIO_CUE}
							icon={ICONS.SETTING_AUDIO_ICON}
						/>
					),
				content: activeTab === 4 && (
					<div>
						Coming soon...
					</div>
				)
			}, {
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.USER_SETTINGS.TITLE_MANAGE_RISK}
						icon={ICONS.SETTING_RISK_ICON}
					/>
				) : (
						<CustomTabs
							title={STRINGS.USER_SETTINGS.TITLE_MANAGE_RISK}
							icon={ICONS.SETTING_RISK_ICON}
						/>
					),
				content: activeTab === 5 && (
					<div>
						Coming soon...
					</div>
				)
			}
		];

		this.setState({ tabs });
	};

	renderContent = (tabs, activeTab) => tabs[activeTab] && tabs[activeTab].content ? tabs[activeTab].content : <div></div>;

	onSubmitSettings = (settings) => {
		return updateUser({ settings })
			.then(({ data }) => {
				this.props.setUserData(data);
				this.props.changeLanguage(data.settings.language);
				this.props.changeTheme(data.settings.theme);
				localStorage.setItem("theme", data.settings.theme);
			})
			.catch((err) => {
				// console.log(err.response.data);
				const _error = err.response.data
					? err.response.data.message
					: err.message;
				throw new SubmissionError({ _error });
			});
	};

	onSubmitUsername = (values) => {
		return setUsername(values)
			.then(() => {
				this.props.setUsernameStore(values.username);
			})
			.catch((err) => {
				// console.log(err.response.data);
				const _error = err.response.data
					? err.response.data.message
					: err.message;
				throw new SubmissionError({ username: _error });
			});
	};

	logout = (message = '') => {
		this.props.logout(typeof message === 'string' ? message : '');
	};

	openContactForm = () => {
		this.props.openContactForm();
	};

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	render() {
		if (this.props.verification_level === 0) {
			return <div>Loading</div>;
		}

		const { activeTab, tabs } = this.state;
		return <div className="presentation_container apply_rtl verification_container">
			{!isMobile && <IconTitle
				text={STRINGS.ACCOUNTS.TAB_SETTINGS}
				textType="title"
			/>}
			<HeaderSection
				title={STRINGS.ACCOUNTS.TAB_SETTINGS}
				openContactForm={this.openContactForm}>
				<div className="header-content">
					<div>{STRINGS.USER_SETTINGS.TITLE_TEXT_1}</div>
					<div className="mb-3">{STRINGS.USER_SETTINGS.TITLE_TEXT_2}</div>
				</div>
			</HeaderSection>
			{!isMobile
				? <CustomTabBar activeTab={activeTab} setActiveTab={this.setActiveTab} tabs={tabs} />
				: <MobileTabBar activeTab={activeTab} renderContent={this.renderContent} setActiveTab={this.setActiveTab} tabs={tabs} />
			}
			{!isMobile ? this.renderContent(tabs, activeTab) : null}
			{isMobile &&
				<div className="my-4">
					<Button label={STRINGS.ACCOUNTS.TAB_SIGNOUT} onClick={this.logout} />
				</div>
			}
		</div>;
	}
}

const mapStateToProps = (state) => ({
	verification_level: state.user.verification_level,
	settings: state.user.settings,
	username: state.user.username,
	activeLanguage: state.app.language
});

const mapDispatchToProps = (dispatch) => ({
	setUsernameStore: bindActionCreators(setUsernameStore, dispatch),
	setUserData: bindActionCreators(setUserData, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	logout: bindActionCreators(logout, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
