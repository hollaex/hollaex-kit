import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TabController, CheckTitle } from '../../components';
import { ICONS } from '../../config/constants';
import { UserProfile, UserSecurity } from '../';
import STRINGS from '../../config/localizedStrings';
import { openContactForm } from '../../actions/appActions';
class Account extends Component {
	state = {
		activeTab: -1,
		tabs: []
	};

	componentDidMount() {
		if (this.props.id) {
			this.updateTabs(this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.id !== this.props.id ||
			nextProps.verification_level !== this.props.verification_level ||
			nextProps.otp_enabled !== this.props.otp_enabled ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.updateTabs(nextProps);
		}
	}

	hasUserVerificationNotifications = (
		verification_level,
		bank_account = {},
		id_data = {}
	) => {
		if (verification_level >= 2 && bank_account.verified && id_data.verified) {
			return false;
		}
		return true;
	};

	updateTabs = ({ verification_level, otp_enabled, bank_account, id_data }) => {
		const activeTab = this.state.activeTab > -1 ? this.state.activeTab : 0;
		const tabs = [
			{
				title: (
					<CheckTitle
						title={STRINGS.ACCOUNTS.TAB_PROFILE}
						icon={ICONS.VERIFICATION_ID_INACTIVE}
						notifications={
							this.hasUserVerificationNotifications(
								verification_level,
								bank_account,
								id_data
							)
								? '!'
								: ''
						}
					/>
				),
				content: (
					<UserProfile
						goToVerification={this.goToVerification}
						openContactForm={this.openContactForm}
					/>
				)
			},
			{
				title: (
					<CheckTitle
						title={STRINGS.ACCOUNTS.TAB_SECURITY}
						icon={ICONS.SECURITY_GREY}
						notifications={!otp_enabled ? '!' : ''}
					/>
				),
				content: <UserSecurity />
			},
			{
				title: (
					<CheckTitle
						title={STRINGS.ACCOUNTS.TAB_SETTINGS}
						icon={ICONS.GEAR_GREY}
					/>
				),
				content: (
					<div className="d-flex justify-content-center align-items-center f-1">
						{STRINGS.ACCOUNTS.TAB_SETTINGS}
					</div>
				)
			}
		];

		this.setState({ tabs, activeTab });
	};

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	renderContent = (tabs, activeTab) => tabs[activeTab].content;

	openContactForm = () => {
		// console.log('here');
		this.props.openContactForm();
	};
	goToVerification = () => this.props.router.push('/verification');

	render() {
		const { id } = this.props;

		if (!id) {
			return <div>Loading</div>;
		}

		const { activeTab, tabs } = this.state;

		return (
			<div className="presentation_container apply_rtl">
				<TabController
					activeTab={activeTab}
					setActiveTab={this.setActiveTab}
					tabs={tabs}
					title={STRINGS.ACCOUNTS.TITLE}
					titleIcon={`${
						process.env.PUBLIC_URL
					}/assets/acounts/account-icons-01.png`}
				/>
				<div className="inner_container">
					{activeTab > -1 && this.renderContent(tabs, activeTab)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	verification_level: state.user.verification_level,
	otp_enabled: state.user.otp_enabled || false,
	id: state.user.id,
	bank_account: state.user.userData.bank_account,
	id_data: state.user.userData.id_data,
	activeLanguage: state.app.language
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
