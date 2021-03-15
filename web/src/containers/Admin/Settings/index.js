import React, { Component } from 'react';
import { Tabs, Row, Spin, Alert } from 'antd';
import { connect } from 'react-redux';

import {
	GeneralSettingsForm,
	EmailSettingsForm,
	SecuritySettingsForm,
	LinksSettingsForm,
	ThemeSettings,
} from './SettingsForm';
import { getConstants, updatePlugins } from './action';
import {
	generateAdminSettings,
	initialLightCoins,
	initialDarkCoins,
} from './Utils';

const TabPane = Tabs.TabPane;

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '',
			loading: false,
			error: '',
			constants: {},
			initialGeneralValues: {
				theme: 'white',
				valid_languages: 'en',
				country: 'global',
				new_user_is_activated: false,
			},
			initialEmailValues: {
				configuration: {
					timezone: 'utc',
					port: 587,
					send_email_to_support: false,
				},
				distribution: {},
			},
			initialSecurityValues: {},
			initialLinkValues: {},
			initialColors: {},
		};
	}

	componentDidMount() {
		this.getConstantData();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevState.constants) !==
			JSON.stringify(this.state.constants)
		) {
			this.getSettingsValues();
		}
	}

	tabChange = (activeTab) => {
		this.setState({ activeTab, error: '' });
	};

	getConstantData = () => {
		this.setState({ loading: true, error: '' });
		getConstants()
			.then((res) => {
				this.setState({ loading: false, constants: res });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({ loading: false, error: message });
			});
	};

	getSettingsValues = () => {
		const result = generateAdminSettings();
		let initialGeneralValues = { ...this.state.initialGeneralValues };
		const {
			title,
			description,
			defaults = {},
			emails = {},
			secrets = { smtp: {}, captcha: {} },
			accounts = {},
			captcha = {},
			links = {},
			color = {},
		} = this.state.constants || {};
		const { configuration = {}, distribution = {} } =
			this.state.initialEmailValues || {};
		const initialEmailValues = {
			configuration: { ...configuration, ...emails, ...secrets.smtp },
			distribution: { ...distribution, ...accounts },
		};
		Object.keys(result).forEach((utilsValue) => {
			if (this.state.constants[utilsValue] !== undefined) {
				if (
					utilsValue === 'valid_languages' &&
					typeof this.state.constants.valid_languages === 'string'
				) {
					initialGeneralValues[utilsValue] = this.state.constants[
						utilsValue
					].split(',');
				} else {
					initialGeneralValues[utilsValue] = this.state.constants[utilsValue];
				}
			}
		});
		initialGeneralValues = {
			...initialGeneralValues,
			...defaults,
			title,
			description,
		};

		let initialSecurityValues = {
			...captcha,
			...secrets.captcha,
		};
		if (secrets.allowed_domains) {
			initialSecurityValues.allowed_domains =
				typeof secrets.allowed_domains === 'string'
					? secrets.allowed_domains.split(',')
					: secrets.allowed_domains;
		}
		if (secrets.admin_whitelist) {
			initialSecurityValues.admin_whitelist =
				typeof secrets.admin_whitelist === 'string'
					? secrets.admin_whitelist.split(',')
					: secrets.admin_whitelist;
		}
		const initialLinkValues = { ...links };
		let initialColors = { ...color };
		let light = initialColors.light || {};
		let dark = initialColors.dark || {};
		Object.keys(this.props.coins).forEach((key) => {
			if (!light[`coin-${key}`]) {
				light[`coin-${key}`] = initialLightCoins[`coin-${key}`];
			}
			if (!dark[`dark-coin-${key}`]) {
				dark[`dark-coin-${key}`] = initialDarkCoins[`dark-coin-${key}`];
			}
		});
		initialColors.light = light;
		initialColors.dark = dark;
		this.setState({
			initialGeneralValues,
			initialEmailValues,
			initialSecurityValues,
			initialLinkValues,
			initialColors,
		});
	};

	submitSettings = (formProps, formKey) => {
		const { initialEmailValues, initialSecurityValues } = this.state;
		let formValues = {};
		if (formKey === 'general') {
			formValues = { defaults: {} };
			Object.keys(formProps).forEach((val) => {
				if (val === 'theme' || val === 'language' || val === 'country') {
					formValues.defaults[val] = formProps[val];
				} else if (
					val === 'valid_languages' &&
					typeof formProps[val] !== 'string'
				) {
					formValues[val] = formProps[val].join(',');
				} else if (val === 'new_user_is_activated') {
					if (typeof formProps[val] === 'string')
						formValues[val] = formProps[val] === 'true' ? true : false;
					else formValues[val] = formProps[val];
				} else {
					formValues[val] = formProps[val];
				}
			});
		} else if (formKey === 'email_distribution') {
			formValues = {};
			formValues.accounts = {
				admin: formProps.admin,
				support: formProps.support,
			};
			if (formProps.kyc) formValues.accounts.kyc = formProps.kyc;
			if (formProps.supervisor)
				formValues.accounts.supervisor = formProps.supervisor;
		} else if (formKey === 'email_configuration') {
			formValues = {};
			let compareValues = initialEmailValues.configuration || {};
			Object.keys(formProps).forEach((val) => {
				if (
					val === 'sender' ||
					val === 'timezone' ||
					val === 'send_email_to_support'
				) {
					if (compareValues[val] !== formProps[val]) {
						if (!formValues.emails) formValues.emails = {};
						formValues.emails[val] = formProps[val];
					}
					// } else if (val === 'kyc' || val === 'supervisor') {
					//     if (!formValues.accounts) formValues.accounts = {};
					//     formValues.accounts[val] = formProps[val];
				} else if (val === 'port') {
					if (compareValues[val] !== parseInt(formProps[val], 10)) {
						if (!formValues.secrets || !formValues.secrets.smtp)
							formValues.secrets = { smtp: {} };
						formValues.secrets.smtp[val] = parseInt(formProps[val], 10);
					}
				} else {
					if (compareValues[val] !== formProps[val]) {
						if (val === 'password') {
							if (!formProps[val].includes('*')) {
								if (!formValues.secrets || !formValues.secrets.smtp)
									formValues.secrets = { smtp: {} };
								formValues.secrets.smtp[val] = formProps[val];
							}
						} else {
							if (!formValues.secrets || !formValues.secrets.smtp)
								formValues.secrets = { smtp: {} };
							formValues.secrets.smtp[val] = formProps[val];
						}
					}
				}
			});
		} else if (formKey === 'security') {
			formValues = {};
			Object.keys(formProps).forEach((val) => {
				if (
					val === 'site_key' &&
					initialSecurityValues[val] !== formProps[val]
				) {
					if (!formValues.captcha) formValues.captcha = {};
					formValues.captcha[val] = formProps[val];
				} else if (val === 'secret_key') {
					if (
						initialSecurityValues[val] !== formProps[val] &&
						!formProps[val].includes('*')
					) {
						if (!formValues.secrets || !formValues.secrets.captcha)
							formValues.secrets = { captcha: {} };
						formValues.secrets.captcha[val] = formProps[val];
					}
				} else if (
					(val === 'allowed_domains' || val === 'admin_whitelist') &&
					initialSecurityValues[val] !== formProps[val]
				) {
					let domainData = formProps[val];
					if (!formValues.secrets) formValues.secrets = {};
					formValues.secrets[val] =
						typeof domainData === 'string' ? domainData.split(',') : domainData;
				} else if (initialSecurityValues[val] !== formProps[val]) {
					formValues[val] = formProps[val];
				}
			});
		} else if (formKey === 'links') {
			formValues.links = { ...formProps };
		} else if (
			formKey === 'miscellaneous' ||
			formKey === 'dark' ||
			formKey === 'light'
		) {
			formValues.color = this.state.constants.color || {};
			formValues.color[formKey] = { ...formProps };
		}
		if (!Object.keys(formValues).length) {
			this.setState({ error: 'Remove masked values from the secrets fields' });
			return false;
		}
		this.setState({ loading: true, error: '' });
		updatePlugins(formValues)
			.then((res) => {
				this.setState({ loading: false, constants: res });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({ loading: false, error: message });
			});
	};

	render() {
		const {
			loading,
			error,
			initialGeneralValues,
			initialEmailValues,
			initialSecurityValues,
			initialLinkValues,
			initialColors,
		} = this.state;
		return (
			<div className="app_container-content">
				<h1>Settings</h1>
				{error && (
					<Alert
						message="Error"
						className="m-top"
						description={error}
						type="error"
						showIcon
					/>
				)}
				{loading ? (
					<Spin size="large" />
				) : (
					<Tabs
						defaultActiveKey={this.state.activeTab}
						onChange={this.tabChange}
					>
						<TabPane tab={'General'} key={'general'}>
							<Row>
								<GeneralSettingsForm
									initialValues={initialGeneralValues}
									handleSubmitSettings={this.submitSettings}
								/>
							</Row>
						</TabPane>
						<TabPane tab={'Email'} key={'email'}>
							<Row>
								<EmailSettingsForm
									initialValues={initialEmailValues}
									handleSubmitSettings={this.submitSettings}
								/>
							</Row>
						</TabPane>
						<TabPane tab={'Security'} key={'security'}>
							<Row>
								<SecuritySettingsForm
									initialValues={initialSecurityValues}
									handleSubmitSettings={this.submitSettings}
								/>
							</Row>
						</TabPane>
						<TabPane tab={'Links'} key={'links'}>
							<Row>
								<LinksSettingsForm
									initialValues={initialLinkValues}
									handleSubmitSettings={this.submitSettings}
								/>
							</Row>
						</TabPane>
						<TabPane tab={'Theme'} key={'theme'}>
							<Row>
								<ThemeSettings
									initialValues={initialColors}
									handleSubmitSettings={this.submitSettings}
								/>
							</Row>
						</TabPane>
					</Tabs>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(Settings);
