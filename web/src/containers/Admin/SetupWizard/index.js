import React, { Component } from 'react';
import { Steps } from 'antd';

import TimeZone from './TimeZone';
import AccountSecurity from './AccountSecurity';
import Assets from './Assets';
import TradingInterface from './TradingInterface';
import EmailConfiguration from './EmailConfiguration';
import ExchangeReview from './Review';
import SetupComplete from './SetupComplete';
import { updatePlugins, getConstants } from '../Settings/action';

import './index.css';

const { Step } = Steps;

export default class SetupWizard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTab: 0,
			isReview: false,
			isConfirmScreen: false,
			constants: {},
			emailInitialvalues: {},
			timeZoneInitialValues: {
				timezone: 'UTC',
				language: 'en',
			},
		};
	}

	componentDidMount() {
		getConstants()
			.then((res) => {
				this.setConstants(res);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	onTabChange = (tab) => {
		this.setState({ currentTab: tab });
	};

	setConstants = (data) => {
		const { kit = {}, secrets = {} } = data;
		let timeZoneInitialValues = {
			language: kit.defaults && kit.defaults.language,
			timezone: secrets.emails && secrets.emails.timezone,
		};
		let emailInitialvalues = {
			site_key:
				kit.captcha && kit.captcha.site_key !== 'null'
					? kit.captcha.site_key
					: '',
			secret_key:
				secrets.captcha && secrets.captcha.secret_key !== 'null'
					? secrets.captcha.secret_key
					: '',
		};
		if (secrets.emails) {
			emailInitialvalues = {
				...emailInitialvalues,
				sender: secrets.emails.sender !== 'null' ? secrets.emails.sender : '',
				timezone:
					secrets.emails.timezone !== 'null' ? secrets.emails.timezone : '',
				audit: secrets.emails.audit !== 'null' ? secrets.emails.audit : '',
				send_email_to_support: secrets.emails.send_email_to_support
					? secrets.emails.send_email_to_support
					: false,
			};
		}
		if (secrets.smtp) {
			emailInitialvalues = {
				...emailInitialvalues,
				server: secrets.smtp.server !== 'null' ? secrets.smtp.server : '',
				port: secrets.smtp.port !== 'null' ? secrets.smtp.port : '',
				user: secrets.smtp.user !== 'null' ? secrets.smtp.user : '',
				password: secrets.smtp.password !== 'null' ? secrets.smtp.password : '',
			};
		}
		this.setState({
			constants: data,
			emailInitialvalues,
			timeZoneInitialValues,
		});
	};

	setPreview = (value = false) => {
		this.setState({ isReview: value });
	};

	setConfirm = (value = false) => {
		this.setState({ isConfirmScreen: value, isReview: false });
	};

	updateConstants = (formValues, callback = () => {}) => {
		updatePlugins(formValues)
			.then((res) => {
				this.setConstants(res);
				callback();
			})
			.catch((err) => {
				console.error(err);
			});
	};

	renderStep = () => {
		const { currentTab, constants } = this.state;
		switch (currentTab) {
			case 0:
				return (
					<TimeZone
						initialValues={this.state.timeZoneInitialValues}
						handleNext={this.onTabChange}
						updateConstants={this.updateConstants}
					/>
				);
			case 1:
				return <AccountSecurity handleNext={this.onTabChange} />;
			case 2:
				return (
					<Assets
						constants={constants.kit}
						handleNext={this.onTabChange}
						updateConstants={this.updateConstants}
					/>
				);
			case 3:
				return (
					<TradingInterface
						handleNext={this.onTabChange}
						updateConstants={this.updateConstants}
					/>
				);
			case 4:
				return (
					<EmailConfiguration
						handleNext={this.onTabChange}
						updateConstants={this.updateConstants}
						setPreview={this.setPreview}
						initialValues={this.state.emailInitialvalues}
					/>
				);
			default:
				return <div></div>;
		}
	};

	render() {
		const { isReview, isConfirmScreen, constants } = this.state;
		if (isReview) {
			return (
				<ExchangeReview
					constants={constants}
					setPreview={this.setPreview}
					setConfirm={this.setConfirm}
				/>
			);
		} else if (isConfirmScreen) {
			return <SetupComplete />;
		}
		return (
			<div className="wizard-container">
				<div className="content">
					<div>
						<div className="header">OPERATOR EXCHANGE KIT SETUP</div>
						<div className="description">
							Follow the 6-step exchange configuration. Any steps you are
							uncertain about you can complete at a later date.
						</div>
					</div>
					<div className="step-container">
						<div className="steps">
							<div className="step-title title-text">
								Steps <span className="description">(optional)</span>
							</div>
							<Steps
								current={this.state.currentTab}
								direction="vertical"
								onChange={this.onTabChange}
							>
								<Step title="1. Time zone & language" />
								<Step title="2. Admin account security" />
								<Step title="3. Assets & trading" />
								<Step title="4. Trading interface" />
								<Step title="5. Email" />
							</Steps>
						</div>
						<div className="step-separator"></div>
						<div className="step-content">{this.renderStep()}</div>
					</div>
				</div>
			</div>
		);
	}
}
