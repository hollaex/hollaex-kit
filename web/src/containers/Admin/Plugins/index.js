import React, { Component } from 'react';
import { Spin, Tabs, Breadcrumb, Modal } from 'antd';
import { connect } from 'react-redux';
import { RightOutlined } from '@ant-design/icons';

import PluginList from './PluginList';
import PluginDetails from './PluginDetails';
import PluginConfigure from './PluginConfigure';
import MyPlugins from './MyPlugins';
import { removePlugin, requestPlugins, requestMyPlugins } from './action';
import { STATIC_ICONS } from 'config/icons';

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
			tabKey: 'explore',
		};
	}

	componentDidMount() {
		this.getPluginsData();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevState.pluginData) !==
				JSON.stringify(this.state.pluginData) ||
			JSON.stringify(prevState.myPlugins) !==
				JSON.stringify(this.state.myPlugins)
		) {
			this.constructPluginsData();
		}
	}

	getPluginsData = async () => {
		await this.getPlugins();
		await this.getMyPlugins();
	};

	getMyPlugins = (page = 1, limit = 50, params = {}) => {
		return requestMyPlugins({ page, limit, ...params })
			.then((res) => {
				console.log('requestMyPlugins', res);
				if (res && res.data) {
					this.setState({ myPlugins: res.data });
				}
			})
			.catch((err) => {});
	};

	getPlugins = (page = 1, limit = 50, params = {}) => {
		// this.setState({ loading: true });
		return requestPlugins({ page, limit, ...params })
			.then((res) => {
				if (res && res.data) {
					this.setState({ loading: false, pluginData: res.data });
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	};

	constructPluginsData = () => {
		const { pluginData, myPlugins } = this.state;
		const selectedPlugins = myPlugins.map((plugin) => plugin.name);
		const constructedPluginData = pluginData.map((plugin) => ({
			...plugin,
			enabled: selectedPlugins.includes(plugin.name),
		}));
		this.setState({ pluginData: constructedPluginData });
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
				this.setState({ isRemovePlugin: false });
				this.getPluginsData();
			})
			.catch((err) => {
				this.setState({ isRemovePlugin: false });
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

	handleOpenAdd = (plugin) => {
		if (
			this.state.pluginData.filter((value) => value.name === plugin.name).length
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
						{type === 'configure' ? (
							<PluginConfigure selectedPlugin={selectedPlugin} />
						) : (
							<PluginDetails
								handleBreadcrumb={this.handleBreadcrumb}
								selectedPlugin={selectedPlugin}
								removePlugin={this.removePlugin}
							/>
						)}
					</div>
				) : (
					<div className="app_container-content admin-earnings-container admin-plugin-container">
						<Tabs defaultActiveKey={tabKey}>
							<TabPane tab="Explore" key="explore">
								<PluginList
									pluginData={pluginData}
									constants={constants}
									selectedPlugin={selectedPlugin}
									handleOpenAdd={this.handleOpenAdd}
									getPlugins={this.getPlugins}
								/>
							</TabPane>

							<TabPane tab="My plugins" key="my_plugin">
								<MyPlugins
									selectedPlugin={selectedPlugin}
									getPlugins={this.getPlugins}
									getMyPlugins={this.getMyPlugins}
									myPlugins={myPlugins}
									pluginData={pluginData}
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
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	availablePlugins: state.app.availablePlugins,
	pluginsLoading: state.app.getPluginLoading,
});

export default connect(mapStateToProps)(Plugins);
