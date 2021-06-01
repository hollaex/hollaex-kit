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
			finished: 0,
			isReview: false,
			isConfirmScreen: false,
			constants: {},
			emailInitialvalues: {},
			timeZoneInitialValues: {
				timezone: 'UTC',
				language: 'en',
			},
			tradeInitialvalues: {
				pro_trade: true,
				quick_trade: true,
				chat: false,
				home_page: true,
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
		this.setState({ currentTab: tab, finished: tab });
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
		let tradeInitialvalues = { ...this.state.tradeInitialvalues };
		if (secrets.emails) {
			emailInitialvalues = {
				...emailInitialvalues,
				sender: secrets.emails.sender !== 'null' ? secrets.emails.sender : '',
				timezone:
					secrets.emails.timezone !== 'null' ? secrets.emails.timezone : '',
				audit: secrets.emails.audit !== 'null' ? secrets.emails.audit : '',
				// send_email_to_support: secrets.emails.send_email_to_support
				// 	? secrets.emails.send_email_to_support
				// 	: false,
			};
		}
		if (this.props.user && this.props.user.email && !emailInitialvalues.audit) {
			emailInitialvalues.audit = this.props.user.email;
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
		if (kit.features) {
			tradeInitialvalues = {
				...tradeInitialvalues,
				...kit.features,
			};
		}
		this.setState({
			constants: data,
			emailInitialvalues,
			timeZoneInitialValues,
			tradeInitialvalues,
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
		const {
			currentTab,
			constants,
			tradeInitialvalues,
			timeZoneInitialValues,
			emailInitialvalues,
		} = this.state;
		switch (currentTab) {
			case 0:
				return (
					<TimeZone
						initialValues={timeZoneInitialValues}
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
						initialValues={tradeInitialvalues}
						handleNext={this.onTabChange}
						updateConstants={this.updateConstants}
						kit={constants.kit}
					/>
				);
			case 4:
				return (
					<EmailConfiguration
						handleNext={this.onTabChange}
						updateConstants={this.updateConstants}
						setPreview={this.setPreview}
						initialValues={emailInitialvalues}
					/>
				);
			default:
				return <div></div>;
		}
	};

	tabClick = (tab) => {
		if (tab > this.state.finished) {
			return;
		}
		this.setState({ currentTab: tab });
	};

	render() {
		const { isReview, isConfirmScreen, constants, currentTab } = this.state;
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
							Follow the 5-step exchange configuration. Any steps you are
							uncertain about you can complete at a later date.
						</div>
					</div>
					<div className="step-container">
						<div className="steps">
							<div className="step-title title-text">
								Steps <span className="description">(optional)</span>
							</div>
							<Steps
								current={currentTab}
								direction="vertical"
								// onChange={this.onTabChange}
							>
								<Step
									title="1. Time zone & language"
									onClick={() => this.tabClick(0)}
								/>
								<Step
									title="2. Admin account security"
									onClick={() => this.tabClick(1)}
								/>
								<Step
									title="3. Assets & trading"
									onClick={() => this.tabClick(2)}
								/>
								<Step title="4. Features" onClick={() => this.tabClick(3)} />
								<Step title="5. Email" onClick={() => this.tabClick(4)} />
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
