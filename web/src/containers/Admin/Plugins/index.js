import React, { Component } from 'react';
import { Spin, Tabs, Breadcrumb, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { RightOutlined } from '@ant-design/icons';

import PluginList from './PluginList';
import PluginConfigure from './PluginConfigure';
import MyPlugins from './MyPlugins';
import { removePlugin, requestPlugins, requestMyPlugins } from './action';
import { STATIC_ICONS } from 'config/icons';
import Spinner from './Spinner';

import './index.css';

const TabPane = Tabs.TabPane;
const { Item } = Breadcrumb;

class Plugins extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '',
			loading: false,
			constants: {},
			showSelected: false,
			selectedPlugin: {},
			type: '',
			isConfigure: false,
			pluginData: [],
			myPlugins: [],
			plugin: {},
			isVisible: false,
			isRemovePlugin: false,
			removePluginName: '',
			tabKey: 'explore',
			pluginCards: [],
			processing: false,
		};
		this.removeTimeout = null;
	}

	componentDidMount() {
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
		} catch (err) {
			throw err;
		}
	};

	getMyPlugins = (page = 1, limit = 50, params = {}) => {
		return requestMyPlugins({ page, limit, ...params })
			.then((res) => {
				if (res && res.data) {
					this.setState({ myPlugins: res.data });
				}
			})
			.catch((err) => {
				throw err;
			});
	};

	getPlugins = (page = 1, limit = 50, params = {}) => {
		// this.setState({ loading: true });
		return requestPlugins({ page, limit, ...params })
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

	tabChange = (activeTab) => {
		this.setState({ activeTab });
	};

	onHandleCard = (key) => {
		if (key) {
			this.props.router.push(`/admin/plugins/${key}`);
		}
	};

	handleOpenPlugin = (plugin) => {
		const { pluginData, myPlugins } = this.state;
		if (plugin.version === 0) {
			this.setState({
				isVisible: true,
				showSelected: false,
				selectedPlugin: plugin,
			});
		} else if (
			pluginData.filter((value) => value.name === plugin.name).length ||
			myPlugins.filter((value) => value.name === plugin.name).length
		) {
			this.setState({
				showSelected: true,
				selectedPlugin: plugin,
			});
		} else {
			this.setState({
				isVisible: true,
				selectedPlugin: plugin,
			});
		}
	};

	handleClose = () => {
		this.setState({
			showSelected: false,
			selectedPlugin: {},
			type: '',
			isConfigure: false,
		});
	};

	handleBreadcrumb = () => {
		this.setState({ isConfigure: true, type: 'configure' });
	};

	onCancelModal = () => {
		this.setState({ isVisible: false, selectedPlugin: {} });
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

	render() {
		const {
			loading,
			constants,
			selectedPlugin,
			pluginData,
			isConfigure,
			showSelected,
			type,
			isVisible,
			myPlugins,
			tabKey,
			removePluginName,
			pluginCards,
			processing,
		} = this.state;
		if (loading || this.props.pluginsLoading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<div className="admin-plugins-wrapper">
				{showSelected ? (
					<div className="plugins-wrapper">
						<Breadcrumb separator={<RightOutlined />}>
							<Item onClick={this.handleClose}>Explore</Item>
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
							selectedPlugin={selectedPlugin}
							handlePluginList={this.handlePluginList}
							updatePluginList={this.handleUpdatePluginList}
							removePlugin={this.removePlugin}
							restart={this.handleRestart}
						/>
					</div>
				) : (
					<div className="app_container-content admin-earnings-container admin-plugin-container">
						<Tabs defaultActiveKey={tabKey}>
							<TabPane tab="Explore" key="explore">
								<PluginList
									pluginData={pluginData}
									constants={constants}
									selectedPlugin={selectedPlugin}
									handleOpenPlugin={this.handleOpenPlugin}
									getPlugins={this.getPlugins}
									pluginCards={pluginCards}
								/>
							</TabPane>

							<TabPane tab="My plugins" key="my_plugin">
								<MyPlugins
									removePluginName={removePluginName}
									handleOpenPlugin={this.handleOpenPlugin}
									handlePluginList={this.handlePluginList}
									getPlugins={this.getPlugins}
									getMyPlugins={this.getMyPlugins}
									myPlugins={myPlugins}
									pluginData={pluginData}
									restart={this.handleRestart}
								/>
							</TabPane>
						</Tabs>
					</div>
				)}
				<Modal visible={isVisible} footer={null} onCancel={this.onCancelModal}>
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
