import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Spin, Alert, Divider, Switch, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { change } from 'redux-form';

import PluginForm from './pluginForm';
import {
	updatePlugins,
	getConstants,
	getPlugins,
	updatePluginsService,
	connectVault,
	requestVaultSupportCoins,
	disconnectVault,
	connectPlugin,
	disconnectPlugin,
} from './action';
import { getAllPluginsData, getPluginsForm } from './Utils';
import { setConfig } from '../../../actions/appActions';
import Chat from '../Chat';
import Vault from './Vault';
import Announcement from './Announcement';

class PluginServices extends Component {
	constructor(props) {
		super(props);
		this.state = {
			services: '',
			formService: '',
			isOpenConfirm: false,
			title: '',
			connectStatus: false,
			initialValues: {},
			loading: false,
			serviceLoading: false,
			error: '',
			constants: {},
			vaultSupportCoins: [],
			pluginsData: {},
		};
	}

	componentDidMount() {
		this.getConstantData();
		if (this.props.params) {
			this.getPluginsData(this.props.params.services);
			this.getServices(this.props.params.services);
			if (
				this.props.params.services &&
				this.props.params.services === 'vault'
			) {
				this.requestVaultSupportCoins();
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			(JSON.stringify(this.props.params) !== JSON.stringify(prevProps.params) ||
				JSON.stringify(this.state.constants) !==
					JSON.stringify(prevState.constants) ||
				JSON.stringify(this.props.availablePlugins) !==
					JSON.stringify(prevProps.availablePlugins) ||
				JSON.stringify(this.state.pluginsData) !==
					JSON.stringify(prevState.pluginsData)) &&
			this.props.params.services
		) {
			this.getServices(this.props.params.services);
		}
		if (
			JSON.stringify(this.props.params) !== JSON.stringify(prevProps.params) &&
			this.props.params.services
		) {
			this.getPluginsData(this.props.params.services);
			if (this.props.params.services === 'vault') {
				this.requestVaultSupportCoins();
			}
		}
	}

	getConstantData = () => {
		this.setState({ loading: true, error: '' });
		getConstants()
			.then((res) => {
				this.setState({ loading: false, constants: { ...res } });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({ loading: false, error: message });
			});
	};

	getPluginsData = (service) => {
		this.setState({ loading: true, error: '' });
		getPlugins(service)
			.then((res) => {
				this.setState({
					loading: false,
					pluginsData: {
						...this.state.pluginsData,
						[service]: res,
					},
				});
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({ loading: false, error: message });
			});
	};

	requestVaultSupportCoins = () => {
		this.setState({ loading: true, error: '' });
		requestVaultSupportCoins()
			.then((res) => {
				this.setState({
					vaultSupportCoins: res.data,
					loading: false,
					fetched: true,
				});
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message,
				});
			});
	};

	getServices = (services = '') => {
		const { enabled = [] } = this.state.constants;
		const initialData = this.state.pluginsData[services] || {};
		const allPluginsData = getAllPluginsData(this.props.availablePlugins);
		const pluginData = allPluginsData[services] || {};
		const title = pluginData.title ? pluginData.title : '';
		if (!allPluginsData[services]) {
			this.props.router.push('/admin/plugins');
		}
		let connectStatus = false;
		let initialValues = {};
		if (services === 'vault') {
			if (enabled.includes(services)) {
				connectStatus = true;
			}
			initialValues = {
				...initialData,
			};
			if (initialData.name) {
				const apiName = this.normalizeAPIName(initialData.name);
				if (apiName !== initialData.name) {
					setTimeout(() => {
						this.props.change('PLUGINS_FORM', 'name', apiName);
					}, 200);
				}
			}
		} else if ((services === 'bank' || services === 'chat') && enabled) {
			if (enabled.includes(services)) {
				connectStatus = true;
				initialValues = {};
			}
		} else {
			if (pluginData.key) {
				if (enabled.includes(services)) {
					connectStatus = true;
				}
				initialValues = { ...initialData };
				if (pluginData.key === 's3' && Object.keys(initialData).length) {
					Object.keys(initialData).forEach((data) => {
						if (data !== 'id_docs_bucket') {
							initialValues = {
								...initialValues,
								[data]: initialData[data].write
									? initialData[data].write
									: initialData[data].read,
							};
						}
					});
				}
			} else if (enabled.includes(services)) {
				connectStatus = true;
			}
		}
		this.setState({ services, title, connectStatus, initialValues });
	};

	normalizeAPIName = (name = '') => {
		const exchangeNameRegex = /[^a-zA-Z0-9_-]/g;
		let apiName = name.replace(/\s+/g, ' ');
		apiName = apiName.replace(/ /g, '_');
		return apiName.replace(exchangeNameRegex, '');
	};

	handleDeactivate = () => {
		this.setState({
			isOpenConfirm: !this.state.isOpenConfirm,
			serviceLoading: false,
		});
	};

	handleSwitch = (checked) => {
		if (checked) {
			this.enablePlugins(this.state.services);
		} else {
			this.handleDeactivate();
		}
		this.setState({ serviceLoading: true });
	};

	enablePlugins = (service) => {
		const { enabled = [] } = this.state.constants;
		let formValues = {
			enabled: [...enabled],
		};
		if (!enabled.includes(service)) {
			formValues.enabled = [...formValues.enabled, service];
		}
		return this.connectPlugins();
	};

	disablePlugins = (service) => {
		// const {
		// 	plugins = { configuration: {} }
		// } = this.state.constants;
		// let enabled = plugins.enabled;
		// if (plugins.enabled.includes(service)) {
		// 	let temp = plugins.enabled.split(',');
		// 	enabled = temp.filter(val => val !== service).join(',');
		// }
		// let formValues = {
		// 	plugins: {
		// 		...plugins,
		// 		enabled
		// 	}
		// }
		this.disconnectPlugins();
		this.handleDeactivate();
	};

	handleSubmitPlugins = (formProps, service) => {
		// const { plugins = { enabled: '', configuration: {} } } = this.state.constants;
		// let enabled = plugins.enabled;
		// if (!plugins.enabled.includes(service)) {
		// 	enabled = plugins.enabled ? `${plugins.enabled},${service}` : service;
		// }
		let formValues = {};
		if (service === 'vault') {
			formValues = {
				key: formProps.key,
				name: formProps.name,
			};
			if (formProps.secret && !formProps.secret.includes('*')) {
				formValues.secret = formProps.secret;
			}
			return this.connectVault(formValues);
		} else if (service !== 'bank' && service !== 'chat') {
			const { key, secret, auth, ...rest } = formProps;
			const allPluginsData = getAllPluginsData(this.props.availablePlugins);
			const pluginData = allPluginsData[service] || {};
			formValues = { ...rest };
			if (key && !key.includes('*')) {
				formValues.key = key;
			}
			if (secret && !secret.includes('*')) {
				formValues.secret = secret;
			}
			if (auth && !auth.includes('*')) {
				formValues.auth = auth;
			}
			if (pluginData.key === 's3') {
				// formValues.plugins.configuration[pluginData.key] = rest;
				formValues = {
					...rest,
				};
				if (key && !key.includes('*')) {
					formValues.key = { read: key, write: key };
				}
				if (secret && !secret.includes('*')) {
					formValues.secret = { read: secret, write: secret };
				}
				// } else if (pluginData.key === 'freshdesk') {
				// 	// formValues.plugins.configuration[pluginData.key] = rest;
				// 	formValues.secrets.plugins[pluginData.key] = { key, ...rest };
				// } else if (pluginData.key === 'zendesk') {
				// 	// formValues.plugins.configuration[pluginData.key] = rest;
				// 	formValues.secrets.plugins[pluginData.key] = { key, ...rest };
				// } else {
				// 	// formValues.plugins.configuration[pluginData.key] = rest;
				// 	formValues.secrets.plugins[pluginData.key] = { key, secret, ...rest };
			}
		}
		this.setState({ loading: true });
		return this.updatePlugins(formValues);
	};

	connectVault = (formProps) => {
		this.setState({ loading: true, error: '' });
		return connectVault(formProps)
			.then((data) => {
				this.setState({
					loading: false,
				});
				this.getConstantData();
				this.getPluginsData(this.props.params.services);
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({ loading: false, error: message });
			});
	};

	disconnectVault = () => {
		this.setState({ loading: true, error: '' });
		return disconnectVault()
			.then((data) => {
				this.setState({
					loading: false,
				});
				this.getConstantData();
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({ loading: false, error: message });
			});
	};

	connectCoinToVault = (formProps = { connected_coins: [] }, coin) => {
		// let formValues = { ...formProps };
		let connected_coins = formProps.connected_coins || [];
		let formValues = {
			coins: connected_coins,
		};
		if (!formValues.coins.includes(coin)) {
			formValues.coins = [...connected_coins, coin];
		}
		this.connectVault(formValues);
	};

	connectPlugins = () => {
		return connectPlugin(this.state.services)
			.then((res) => {
				this.getConstantData();
				this.setState({ serviceLoading: false });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				message.error(message);
				this.setState({ serviceLoading: false });
			});
	};

	disconnectPlugins = () => {
		return disconnectPlugin(this.state.services)
			.then((res) => {
				this.getConstantData();
				this.setState({ serviceLoading: false });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				message.error(message);
				this.setState({ serviceLoading: false });
			});
	};

	updateConstants = (formProps) => {
		this.setState({ error: '' });
		return updatePlugins(formProps)
			.then((data) => {
				this.setState({
					constants: { ...data },
					loading: false,
					serviceLoading: false,
				});
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message,
					serviceLoading: false,
				});
			});
	};

	updatePlugins = (formProps) => {
		return updatePluginsService(this.state.services, formProps)
			.then((data) => {
				this.setState({
					pluginsData: {
						...this.state.pluginsData,
						[this.state.services]: data,
					},
					loading: false,
					serviceLoading: false,
				});
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message,
					serviceLoading: false,
				});
			});
	};

	pluginsDisplay = ({ services, connectStatus, initialValues }, fields) => {
		switch (services) {
			case 'vault':
				return connectStatus ? (
					initialValues.secret && initialValues.key ? (
						<Vault
							coins={this.props.coins}
							initialValues={initialValues}
							supportedCoins={this.state.vaultSupportCoins}
							connectCoinToVault={this.connectCoinToVault}
						/>
					) : (
						<PluginForm
							initialValues={initialValues}
							services={services}
							fields={fields}
							handleSubmitPlugins={this.handleSubmitPlugins}
						/>
					)
				) : null;
			case 'chat': {
				return connectStatus ? <Chat /> : null;
			}
			case 'kyc':
			case 'freshdesk':
			case 'zendesk':
			case 'sms':
				return connectStatus && fields && Object.keys(fields).length ? (
					<PluginForm
						initialValues={initialValues}
						services={services}
						fields={fields}
						handleSubmitPlugins={this.handleSubmitPlugins}
					/>
				) : null;
			case 'announcement':
				return connectStatus ? <Announcement /> : null;
			default:
				return <div />;
		}
	};

	render() {
		const {
			title,
			services,
			connectStatus,
			loading,
			error,
			serviceLoading,
			initialValues,
		} = this.state;
		const fields = getPluginsForm(services);
		return (
			<div className="app_container-content">
				{error && (
					<Alert
						message="Error"
						className="m-top"
						description={error}
						type="error"
						showIcon
					/>
				)}
				{loading || this.props.pluginsLoading ? (
					<Spin size="large" />
				) : (
					<div>
						<div className="d-flex align-items-center">
							<div className="d-flex align-items-center">
								<h1>{title}</h1>
								<div className="mx-4">
									<Switch
										loading={serviceLoading}
										checked={connectStatus}
										onChange={this.handleSwitch}
									/>
								</div>
							</div>
							{services === 'vault' &&
							connectStatus &&
							initialValues.secret &&
							initialValues.key ? (
								<Button
									type="primary"
									className="ml-auto"
									onClick={this.disconnectVault}
								>
									Disconnect
								</Button>
							) : null}
						</div>
						<Divider />
						{this.pluginsDisplay(this.state, fields)}
						<Modal
							title={`Deactivate ${title}`}
							visible={this.state.isOpenConfirm}
							onOk={() => this.disablePlugins(services)}
							onCancel={this.handleDeactivate}
						>
							<div>Do you really want to Deactivate?</div>
						</Modal>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	coins: state.app.coins,
	availablePlugins: state.app.availablePlugins,
	pluginsLoading: state.app.getPluginLoading,
});

const mapDispatchToProps = (dispatch) => ({
	setConfig: bindActionCreators(setConfig, dispatch),
	change: bindActionCreators(change, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PluginServices);
