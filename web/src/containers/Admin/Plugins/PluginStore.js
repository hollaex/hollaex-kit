import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin, Breadcrumb, Modal, message, Button } from 'antd';
import { LoadingOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';

import PluginList from './PluginList';
import PluginConfigure from './PluginConfigure';
import {
	removePlugin,
	requestPlugins,
	requestMyPlugins,
	updatePlugins,
	getPluginMeta,
	requestActivationsPlugin,
} from './action';
import { STATIC_ICONS } from 'config/icons';
import Spinner from './Spinner';
import AddThirdPartyPlugin from './AddPlugin';
import ConfirmPlugin from './ConfirmPlugin';

import './index.css';

const { Item } = Breadcrumb;

class Plugins extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nextType: 'explore',
			isConfirm: false,
			loading: false,
			constants: {},
			showSelected: false,
			selectedPlugin: {},
			type: '',
			isConfigure: false,
			pluginData: [],
			pluginMetaData: {},
			myPlugins: [],
			plugin: {},
			isVisible: false,
			isRemovePlugin: false,
			removePluginName: '',
			pluginCards: [],
			activatedPluginDetails: [],
			processing: false,
			thirdPartyType: 'upload_json',
			thirdPartyError: '',
			thirdParty: {},
			step: 1,
			jsonURL: '',
			isLoading: false,
		};
		this.removeTimeout = null;
	}

	componentDidMount() {
		this.setState({ isLoading: true });
		this.getPluginsData();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevState.pluginData) !==
				JSON.stringify(this.state.pluginData) ||
			JSON.stringify(prevState.myPlugins) !==
				JSON.stringify(this.state.myPlugins) ||
			JSON.stringify(prevState.pluginCards) !==
				JSON.stringify(this.state.pluginCards)
		) {
			this.constructPluginsData();
		}
	}

	componentWillUnmount() {
		if (this.removeTimeout) {
			clearTimeout(this.removeTimeout);
		}
	}

	getPluginsData = async () => {
		try {
			await this.getPlugins();
			await this.getMyPlugins();
			await this.getActivationsPlugin();
		} catch (err) {
			throw err;
		}
	};

	getActivationsPlugin = (params = {}) => {
		return requestActivationsPlugin(params)
			.then((res) => {
				if (res) {
					this.setState({ activatedPluginDetails: res });
				}
			})
			.catch((err) => {
				throw err;
			});
	};

	getMyPlugins = (params = {}) => {
		return requestMyPlugins(params)
			.then((res) => {
				if (res && res.data) {
					const {
						router,
						router: {
							location: { pathname, query: { plugin } = {} },
						},
					} = this.props;
					this.setState({ myPlugins: res.data }, () => {
						const pluginData = res.data.find(({ name }) => name === plugin);
						if (pluginData) {
							this.handleOpenPlugin(pluginData);
							this.handleBreadcrumb();
							router.push(pathname);
						}
					});
				}
				this.setState({ isLoading: false });
			})
			.catch((err) => {
				this.setState({ isLoading: false });
				throw err;
			});
	};

	getPlugins = (params = {}) => {
		// this.setState({ loading: true });
		return requestPlugins(params)
			.then((res) => {
				if (res && res.data) {
					let pluginCards = this.state.pluginCards;
					if (!params.search) {
						pluginCards = res.data.filter((val, key) => key <= 2);
					}
					this.setState({ loading: false, pluginData: res.data, pluginCards });
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
				throw err;
			});
	};

	constructPluginsData = () => {
		const { pluginData, myPlugins, selectedPlugin, pluginCards } = this.state;
		let currentPlugin = selectedPlugin;
		const myPluginsName = myPlugins.map((plugin) => plugin.name);
		const constructedPluginData = pluginData.map((plugin) => {
			const pluginValue = {
				...plugin,
				enabled: myPluginsName.includes(plugin.name),
			};
			if (plugin.name === selectedPlugin.name) {
				currentPlugin = pluginValue;
			}
			return pluginValue;
		});
		const constructedCards = pluginCards.map((plugin) => ({
			...plugin,
			enabled: myPluginsName.includes(plugin.name),
		}));

		this.setState({
			pluginData: constructedPluginData,
			pluginCards: constructedCards,
			selectedPlugin: currentPlugin,
		});
	};

	removePlugin = (params = {}) => {
		this.setState({
			isRemovePlugin: true,
			nextType: 'myPlugin',
			showSelected: false,
			isConfigure: false,
			tabKey: 'my_plugin',
		});
		return removePlugin(params)
			.then((res) => {
				this.setState({
					isRemovePlugin: false,
					removePluginName: params.name,
				});
				this.removeTimeout = setTimeout(() => {
					const myPlugins = this.state.myPlugins.filter(
						(plugin) => plugin.name !== this.state.removePluginName
					);
					this.setState({ removePluginName: '', myPlugins });
				}, 2000);
			})
			.catch((err) => {
				this.setState({ isRemovePlugin: false });
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
	};

	onChangeNextType = (nextType) => {
		this.setState({ nextType });
	};

	onHandleCard = (key) => {
		if (key) {
			this.props.router.push(`/admin/plugins/${key}`);
		}
	};

	handleOpenPlugin = async (plugin, plugin_type = '') => {
		const { pluginData, myPlugins, isConfigure } = this.state;
		let metaData = {};

		await getPluginMeta({ name: plugin.name })
			.then((res) => {
				if (res) {
					metaData = res;
				}
			})
			.catch((err) => {
				metaData = {};
			});

		if (plugin.version === 0) {
			this.setState({
				isVisible: true,
				showSelected: false,
				selectedPlugin: plugin,
				pluginMetaData: metaData,
			});
		} else if (
			pluginData.filter((value) => value.name === plugin.name).length ||
			myPlugins.filter((value) => value.name === plugin.name).length
		) {
			this.setState({
				nextType: 'configure',
				showSelected: true,
				selectedPlugin: plugin,
				pluginMetaData: metaData,
			});
			if (plugin_type === 'add_plugin' && !isConfigure) {
				this.setState({
					type: 'configure',
					isConfigure: true,
				});
			}
		} else {
			this.setState({
				isVisible: true,
				selectedPlugin: plugin,
				pluginMetaData: metaData,
			});
		}
	};

	handleClose = () => {
		this.setState({
			nextType: 'myPlugin',
			showSelected: false,
			selectedPlugin: {},
			type: '',
			isConfigure: false,
			tabKey: 'explore',
		});
	};

	handleBreadcrumb = () => {
		this.setState({ isConfigure: true, type: 'configure' });
	};

	onCancelModal = () => {
		this.setState({ isVisible: false });
	};

	handlePluginList = (plugin) => {
		this.setState({
			myPlugins: [...this.state.myPlugins, plugin],
		});
	};

	handleUpdatePluginList = (plugin) => {
		let currentPlugin = this.state.selectedPlugin;
		const myPlugins = this.state.myPlugins.map((value) => {
			if (plugin.name === value.name) {
				currentPlugin = plugin;
				return plugin;
			}
			return value;
		});
		this.setState({
			myPlugins,
			selectedPlugin: currentPlugin,
		});
	};

	handleRestart = (callback) => {
		this.setProcessing();
		setTimeout(() => {
			this.getPluginsData()
				.then(() => {
					this.setProcessing(false, callback);
				})
				.catch(() => {
					this.handleRestart(callback);
				});
		}, 30000);
	};

	setProcessing = (processing = true, callback) => {
		this.setState({ processing }, () => {
			if (callback) {
				callback();
			}
		});
	};

	handleRedirect = () => {
		this.setState({ type: 'configure', isConfigure: true });
	};

	handleUpdatePlugin = () => {
		this.handleStep(4);

		const body = {
			...this.state.thirdParty,
		};
		updatePlugins({ name: body.name }, body)
			.then((res) => {
				if (res) {
					message.success('Third party plugin updated successfully');
					this.onCancelModal();
				}
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
				this.onCancelModal();
			});
	};

	updateState = (thirdPartyError) => {
		this.setState({ thirdPartyError });
	};

	handleCancel = () => {
		this.setState({
			thirdParty: {},
			thirdPartyError: '',
			jsonURL: '',
		});
	};

	handleStep = (step) => {
		this.setState({ step, isVisible: true, isConfirm: true });
	};

	handleURL = (e) => {
		this.setState({ jsonURL: e.target.value });
	};

	handleChange = (e) => {
		if (e.target.value === 'upload_json') {
			this.setState({ thirdPartyType: 'upload_json' });
		} else {
			this.setState({ thirdPartyType: 'input_url' });
		}
		this.setState({ thirdPartyError: '', jsonURL: '' });
	};

	getJsonFromFile = async (file) => {
		return await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (function () {
				return function (e) {
					try {
						let json = JSON.parse(e.target.result);
						resolve(json);
					} catch (err) {
						message.error(err.toString());
						reject('Invalid format');
					}
				};
			})(file);
			reader.readAsText(file);
		});
	};

	checkJSON = (json) => {
		if (json && json.name && json.version && json.author) {
			return true;
		} else {
			return false;
		}
	};

	handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			try {
				const res = await this.getJsonFromFile(file);
				const check = this.checkJSON(res);
				if (check) {
					this.setState({ thirdParty: res, thirdPartyError: '' });
				} else {
					this.setState({
						thirdPartyError:
							'The file format is not correct. Please make sure it follows JSON standard',
					});
				}
			} catch (err) {
				this.setState({
					thirdPartyError:
						'The file format is not correct. Please make sure it follows JSON standard',
				});
			}
		}
	};

	getJSONFromURL = async () => {
		try {
			if (this.state.jsonURL) {
				const res = await axios.get(this.state.jsonURL);
				if (res.data) {
					const check = this.checkJSON(res.data);
					if (check) {
						this.setState({ thirdParty: res.data, thirdPartyError: '' });
						this.handleStep(3);
					} else {
						this.setState({
							thirdPartyError:
								'The file format is not correct. Please make sure it follows JSON standard',
						});
					}
				}
			} else {
				this.setState({ thirdPartyError: 'Enter valid JSON file URL' });
			}
		} catch (err) {
			this.setState({
				thirdPartyError:
					'The file format is not correct. Please make sure it follows JSON standard',
			});
		}
	};

	handleBack = () => {
		this.handleSetBack();
		this.handleStep(1);
	};

	handleSetBack = () => {
		this.setState({ thirdParty: {}, thirdPartyError: '' });
	};

	handleInput = (e) => {
		if (e.target.value === 'I UNDERSTAND') {
			this.setState({ isConfirm: false });
		} else {
			this.setState({ isConfirm: true });
		}
	};

	renderModalContent = () => {
		const {
			selectedPlugin,
			thirdPartyType,
			thirdPartyError,
			step,
			thirdParty,
			pluginMetaData,
		} = this.state;
		switch (step) {
			case 1:
				return (
					<div className="admin-plugin-modal-wrapper">
						<div className="d-flex">
							<img
								src={STATIC_ICONS.MANUAL_PLUGIN_UPGRADE}
								alt="manual-plugin-upgrade"
								className="pr-3"
							/>
							<div>Upgrade third-party plugin</div>
						</div>
						<div className="d-flex align-items-center mt-4">
							<div>
								{selectedPlugin.icon ? (
									<img
										src={selectedPlugin.icon}
										className="plugin-icon"
										alt="plugin-icon"
									/>
								) : (
									<img
										src={STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL}
										className="plugin-icon"
										alt="plugin-icon"
									/>
								)}
							</div>
							<div className="ml-4">
								<div>Name: {pluginMetaData.name}</div>
								<div>Current version: {pluginMetaData.version}</div>
							</div>
						</div>
						<div className="w-85 mt-4">
							You can upgrade this plugin to a newer version manually by
							uploading a .json file while maintaining the current plugin's
							configuration values.
						</div>
						<div className="mt-4">
							Would you like to proceed with the upgrade?
						</div>
						<div className="my-4 btn-wrapper d-flex justify-content-between mt-5">
							<Button
								type={'primary'}
								size="large"
								className={'add-btn w-48'}
								onClick={this.onCancelModal}
							>
								Back
							</Button>
							<Button
								type={'primary'}
								size="large"
								className={'add-btn w-48'}
								onClick={() => this.handleStep(2)}
							>
								Proceed
							</Button>
						</div>
					</div>
				);
			case 2:
				return (
					<AddThirdPartyPlugin
						header={'Upgrade third party plugin'}
						thirdPartyType={thirdPartyType}
						thirdPartyError={thirdPartyError}
						thirdParty={thirdParty}
						handleChange={this.handleChange}
						handleFileChange={this.handleFileChange}
						handleURL={this.handleURL}
						handleBack={this.handleBack}
						getJSONFromURL={this.getJSONFromURL}
						updateState={this.updateState}
						handleStep={this.handleStep}
					/>
				);
			case 3:
				return (
					<ConfirmPlugin
						header={'Upgrade third party plugin'}
						description={`Please acknowledge that you understand the possible ramifications of upgrade an unverified plugin to your exchange.`}
						pluginData={selectedPlugin}
						isConfirm={this.state.isConfirm}
						onHandleBack={this.handleBack}
						okBtnlabel={'Upgrde'}
						onHandleChange={this.handleInput}
						onHandleSubmit={this.handleUpdatePlugin}
					/>
				);
			case 4:
				return (
					<div className="p-2 modal-wrapper">
						<div className="">
							<div className="d-flex Spinner-wrapper">
								<div className="spinner-container">
									<Spin
										indicator={
											<LoadingOutlined style={{ fontSize: 24 }} spin />
										}
									/>
								</div>
								<div>Upgrading plugin</div>
							</div>
							<div className="ml-5 mt-5">
								<div>Please wait while the upgrade is being applied...</div>
							</div>
						</div>
					</div>
				);
			default:
				return (
					<div className="p-2 modal-wrapper">
						<div className="d-flex align-items-center">
							<div>
								{selectedPlugin.icon ? (
									<img
										src={selectedPlugin.icon}
										className="plugin-icon"
										alt="plugin-icon"
									/>
								) : (
									<img
										src={STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL}
										className="plugin-icon"
										alt="plugin-icon"
									/>
								)}
							</div>
							<div className="ml-3">
								<h2>{selectedPlugin.name}</h2>
								<div>This plugin is coming soon!</div>
							</div>
						</div>
					</div>
				);
		}
	};

	renderContent = () => {
		const {
			constants,
			selectedPlugin,
			pluginData,
			isConfigure,
			nextType,
			type,
			myPlugins,
			pluginCards,
			activatedPluginDetails,
		} = this.state;
		switch (nextType) {
			case 'configure':
				return (
					<div className="plugins-wrapper">
						<Breadcrumb separator={<RightOutlined />}>
							<Item onClick={() => this.onChangeNextType('explore')}>
								{' '}
								Store
							</Item>
							<Item
								onClick={() =>
									this.setState({ type: 'pluginDetails', isConfigure: false })
								}
							>
								Plugin details
							</Item>
							{isConfigure ? (
								<Item onClick={() => this.setState({ type: 'configure' })}>
									Configure
								</Item>
							) : null}
						</Breadcrumb>
						<PluginConfigure
							handleBreadcrumb={this.handleBreadcrumb}
							type={type}
							getActivationsPlugin={this.getActivationsPlugin}
							activatedPluginDetails={activatedPluginDetails}
							selectedPlugin={selectedPlugin}
							handlePluginList={this.handlePluginList}
							updatePluginList={this.handleUpdatePluginList}
							removePlugin={this.removePlugin}
							restart={this.handleRestart}
							handleRedirect={this.handleRedirect}
							handleStep={this.handleStep}
							router={this.props.router}
							onChangeNextType={this.onChangeNextType}
						/>
					</div>
				);
			case 'explore':
			default:
				return (
					<>
						<div
							className="underline-text m-3 pointer"
							onClick={() => this.props.router.push(`/admin/plugins`)}
						>{`<Back to my plugins.`}</div>

						<PluginList
							constants={constants}
							selectedPlugin={selectedPlugin}
							getPlugins={this.getPlugins}
							pluginCards={pluginCards}
							handleOpenPlugin={this.handleOpenPlugin}
							onChangeNextType={this.onChangeNextType}
							myPlugins={myPlugins}
							pluginData={pluginData}
						/>
					</>
				);
		}
	};

	render() {
		const { loading, isVisible, processing, nextType } = this.state;

		if (loading || this.props.pluginsLoading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}
		return (
			<div className="admin-plugins-wrapper">
				<div
					className={
						nextType === 'configure'
							? 'plugins-wrapper'
							: 'app_container-content admin-earnings-container admin-plugin-container'
					}
				>
					{this.renderContent()}
				</div>
				<Modal visible={isVisible} footer={null} onCancel={this.onCancelModal}>
					{this.renderModalContent()}
				</Modal>
				<Modal
					visible={processing}
					closable={false}
					centered={true}
					footer={null}
					maskClosable={false}
				>
					<div>
						<div>
							<h3 style={{ color: '#ffffff' }}>Plugins</h3>
						</div>
						<div className="d-flex align-items-center justify-content-center my-5 pt-3 pb-4">
							<Spinner />
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	availablePlugins: state.app.availablePlugins,
	pluginsLoading: state.app.getPluginLoading,
});

export default connect(mapStateToProps)(Plugins);
