import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Spin, Alert, Divider, Switch, Button } from 'antd';
import { bindActionCreators } from 'redux';
import { change } from 'redux-form';

import PluginForm from './pluginForm';
import { updatePlugins, getConstants, connectVault, requestVaultSupportCoins, disconnectVault } from './action';
import { getAllPluginsData, getPluginsForm } from './Utils';
import { setConfig } from '../../../actions/appActions';
import Chat from '../Chat';
import Vault from './Vault';
import Announcement from './Announcement';

class PluginServices extends Component {
	constructor(props) {
		super(props)
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
			vaultSupportCoins: []
		};
	}

	componentDidMount() {
		this.getConstantData();
		if (this.props.params) {
			this.getServices(this.props.params.services);
			if (this.props.params.services &&
				this.props.params.services === 'vault') {
				this.requestVaultSupportCoins();
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if ((JSON.stringify(this.props.params) !== JSON.stringify(prevProps.params)
			|| JSON.stringify(this.state.constants) !== JSON.stringify(prevState.constants)
			|| JSON.stringify(this.props.availablePlugins) !== JSON.stringify(prevProps.availablePlugins))
			&& this.props.params.services) {
			this.getServices(this.props.params.services);
		}
		if (JSON.stringify(this.props.params) !== JSON.stringify(prevProps.params) &&
			this.props.params.services &&
			this.props.params.services === 'vault') {
			this.requestVaultSupportCoins();
		}
	}

	getConstantData = () => {
		this.setState({ loading: true, error: '' });
		getConstants()
			.then((res) => {
				this.setState({ loading: false, constants: { ...res.constants } });
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
					fetched: true
				});
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({
					loading: false,
					error: message
				});
			});
	};

	getServices = (services = '') => {
		const { api_name = '', secrets = { vault: {} }, plugins = { enabled: '' } } = this.state.constants;
		const allPluginsData = getAllPluginsData(this.props.availablePlugins);
		const pluginData = allPluginsData[services] || {}
		const title = pluginData.title ? pluginData.title : '';
		if (!allPluginsData[services]) {
			this.props.router.push('/admin/plugins');
		}
		let connectStatus = false;
		let initialValues = {}
		if (services === 'vault' && secrets[services]) {
			if (plugins.enabled.includes(services)) {
				connectStatus = true;
			}
			initialValues = {
				...secrets[services],
				name: api_name
			};
			const apiName = this.normalizeAPIName(api_name);
			if (apiName !== api_name) {
				setTimeout(() => {
					this.props.change('PLUGINS_FORM', 'name', apiName);
				}, 200);
			}
		} else if ((services === 'bank' || services === 'chat') && plugins.enabled) {
			if (plugins.enabled.includes(services)) {
				connectStatus = true;
				initialValues = {};
			}
		} else {
			if (pluginData.key) {
				// need to remove when configurations removed from plugins
				if (plugins.configuration &&
					plugins.configuration[pluginData.key]) {
					initialValues = {
						...plugins.configuration[pluginData.key]
					}
				}
				if (plugins.enabled.includes(services)) {
					connectStatus = true;
				}
				if (secrets.plugins &&
					secrets.plugins[pluginData.key]) {
					let temp = secrets.plugins[pluginData.key];
					initialValues = {
						...initialValues,
						...secrets.plugins[pluginData.key]
					}
					if (pluginData.key === 's3' && Object.keys(temp).length) {
						Object.keys(temp).forEach(data => {
							if (data !== 'id_docs_bucket') {
								initialValues = {
									...initialValues,
									[data]: temp[data].write ? temp[data].write : temp[data].read
								}
							}
						});
					}
				}
			} else if (plugins.enabled.includes(services)) {
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
			serviceLoading: false
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
		const { plugins = { enabled: '', configuration: {} } } = this.state.constants;
		let formValues = {
			plugins: {
				...plugins
			}
		};
		if (!plugins.enabled.includes(service)) {
			formValues.plugins.enabled = plugins.enabled ? `${plugins.enabled},${service}` : service;
		}
		return this.updateConstants(formValues);
	};

	disablePlugins = (service) => {
		const {
			plugins = { configuration: {} }
		} = this.state.constants;
		let enabled = plugins.enabled;
		if (plugins.enabled.includes(service)) {
			let temp = plugins.enabled.split(',');
			enabled = temp.filter(val => val !== service).join(',');
		}
		let formValues = {
			plugins: {
				...plugins,
				enabled
			}
		}
		this.updateConstants(formValues, true);
		this.handleDeactivate();
	};

	handleSubmitPlugins = (formProps, service) => {
		const { plugins = { enabled: '', configuration: {} }, secrets = { plugins: {} } } = this.state.constants;
		let enabled = plugins.enabled;
		if (!plugins.enabled.includes(service)) {
			enabled = plugins.enabled ? `${plugins.enabled},${service}` : service;
		}
		let formValues = {
			plugins: {
				// ...plugins,
				enabled,
				configuration: {}
			},
			secrets: {}
		};
		if (service === 'vault') {
			formValues = {
				key: formProps.key,
				secret: formProps.secret,
				name: formProps.name
			};
			return this.connectVault(formValues);
		} else if (service !== 'bank' && service !== 'chat') {
			const { key, secret, ...rest } = formProps;
			const allPluginsData = getAllPluginsData(this.props.availablePlugins);
			const pluginData = allPluginsData[service] || {};
			formValues.secrets.plugins = { ...secrets.plugins };
			if (pluginData.key === 's3') {
				// formValues.plugins.configuration[pluginData.key] = rest;
				formValues.secrets.plugins[pluginData.key] = {
					...rest,
					key: { read: key, write: key },
					secret: { read: secret, write: secret }
				};
			} else if (pluginData.key === 'freshdesk') {
				// formValues.plugins.configuration[pluginData.key] = rest;
				formValues.secrets.plugins[pluginData.key] = { key, ...rest };
			} else if (pluginData.key === 'zendesk') {
				// formValues.plugins.configuration[pluginData.key] = rest;
				formValues.secrets.plugins[pluginData.key] = { key, ...rest };
			} else {
				// formValues.plugins.configuration[pluginData.key] = rest;
				formValues.secrets.plugins[pluginData.key] = { key, secret, ...rest };
			}
		}
		this.setState({ loading: true });
		return this.updateConstants(formValues);
	};

	connectVault = (formProps) => {
		this.setState({ loading: true, error: '' });
		return connectVault(formProps)
			.then((data) => {
				this.setState({
					loading: false
				});
				this.getConstantData();
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
					loading: false
				});
				this.getConstantData();
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({ loading: false, error: message });
			})
	}

	connectCoinToVault = (formProps = { connected_coins: [] }, coin) => {
		let formValues = { ...formProps };
		if (!formValues.connected_coins.includes(coin)) {
			formValues.connected_coins = [
				...formProps.connected_coins,
				coin
			];
		}
		this.connectVault(formValues);
	};

	updateConstants = (formProps) => {
		this.setState({ error: '' });
		return updatePlugins(formProps)
			.then((data) => {
				this.setState({ constants: { ...data }, loading: false, serviceLoading: false });
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				this.setState({ loading: false, error: message, serviceLoading: false });
			});
	};

	pluginsDisplay = ({ services, connectStatus, initialValues }, fields) => {
		switch (services) {
			case 'vault':
				return (
					connectStatus
						? initialValues.secret && initialValues.key
							? <Vault
								coins={this.props.coins}
								initialValues={initialValues}
								supportedCoins={this.state.vaultSupportCoins}
								connectCoinToVault={this.connectCoinToVault}
							/>
							: <PluginForm
								initialValues={initialValues}
								services={services}
								fields={fields}
								handleSubmitPlugins={this.handleSubmitPlugins}
							/>
						: null
				)
			case 'chat': {
				return (
					connectStatus
						? <Chat />
						: null
				)
			}
			case 'kyc':
			case 'freshdesk':
			case 'zendesk':
			case 'sms':
				return (
					connectStatus && fields && Object.keys(fields).length
						? <PluginForm
							initialValues={initialValues}
							services={services}
							fields={fields}
							handleSubmitPlugins={this.handleSubmitPlugins}
						/>
						: null
				);
			case 'announcement':
					return (
						connectStatus
						? <Announcement />
						: null
					)
			default:
				return <div />
		}
	}

	render() {
		const { title, services, connectStatus, loading, error, serviceLoading, initialValues } = this.state;
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
				{(loading || this.props.pluginsLoading) ? (
					<Spin size="large" />
				) : (
						<div>
							<div className="d-flex align-items-center">
								<div className="d-flex align-items-center">
									<h1>{title}</h1>
									<div className="mx-4">
										<Switch loading={serviceLoading} checked={connectStatus} onChange={this.handleSwitch} />
									</div>
								</div>
								{
									(services === 'vault' &&
										connectStatus &&
										initialValues.secret &&
										initialValues.key
									) ?
										<Button
											type="primary"
											className='ml-auto'
											onClick={this.disconnectVault}
										>
											Disconnect
										</Button>
										: null
								}
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
		)
	}
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	coins: state.app.coins,
	availablePlugins: state.app.availablePlugins,
	pluginsLoading: state.app.getPluginLoading
});

const mapDispatchToProps = (dispatch) => ({
	setConfig: bindActionCreators(setConfig, dispatch),
	change: bindActionCreators(change, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PluginServices);
