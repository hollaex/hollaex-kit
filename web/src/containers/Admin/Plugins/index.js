import React, { Component } from 'react';
import { Spin, Tabs, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { RightOutlined } from '@ant-design/icons';

import { getAllPluginsData } from './Utils';
import PluginList from './PluginList';
import PluginDetails from './PluginDetails';
import PluginConfigure from './PluginConfigure';
import { removePlugin, requestPlugins } from './action';

import './index.css';

const TabPane = Tabs.TabPane;
const { Item } = Breadcrumb;

class Plugins extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '',
			myPlugins: [],
			otherPlugins: [],
			loading: false,
			constants: {},
			isOpen: false,
			selectedPlugin: {},
			type: '',
			isActive: false,
			pluginData: [],
			plugin: {},
		};
	}

	componentDidMount() {
		this.generateCards();
		this.setState({ loading: true });
		this.getPlugins();
	}

	getPlugins = (page = 1, limit = 50, params = {}) => {
		this.setState({ isLoading: true });
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

	removePlugin = () => {
		return removePlugin({ name: this.state.selectedPlugin.name })
			.then((res) => {
				console.log('res', res);
			})
			.catch((err) => {
				console.log('err', err);
			});
	};

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(this.state.constants) !==
				JSON.stringify(prevState.constants) ||
			JSON.stringify(this.props.availablePlugins) !==
				JSON.stringify(prevProps.availablePlugins)
		) {
			this.generateCards();
		}
	}

	generateCards = () => {
		const { enabled = [] } = this.state.constants;
		// if (plugins) {
		let allPluginsData = getAllPluginsData(this.props.availablePlugins);
		let myPlugins = Object.keys(allPluginsData).filter((data) =>
			enabled.includes(data)
		);
		const otherPlugins = Object.keys(allPluginsData).filter(
			(data) => !enabled.includes(data)
		);
		this.setState({ myPlugins, otherPlugins, allPluginsData });
		// }
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
		this.setState({
			isOpen: true,
			selectedPlugin: plugin,
		});
	};

	handleClose = () => {
		this.setState({
			isOpen: false,
			selectedPlugin: {},
			type: '',
			isActive: false,
		});
	};

	handleBreadcrumb = () => {
		this.setState({ isActive: true, type: 'configure' });
	};

	render() {
		const {
			loading,
			constants,
			selectedPlugin,
			pluginData,
			isActive,
			isOpen,
			type,
		} = this.state;
		if (loading || this.props.pluginsLoading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<div>
				{isOpen ? (
					<div className="plugins-wrapper">
						<Breadcrumb separator={<RightOutlined />}>
							<Item onClick={this.handleClose}>Explore</Item>
							<Item
								onClick={() =>
									this.setState({ type: 'pluginDetails', isActive: false })
								}
							>
								Plugin details
							</Item>
							{isActive ? (
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
								addPlugin={this.handleaddPlugin}
								removePlugin={this.removePlugin}
							/>
						)}
					</div>
				) : (
					<div className="app_container-content admin-earnings-container">
						<Tabs>
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
								<div>My plugins</div>
							</TabPane>
						</Tabs>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	availablePlugins: state.app.availablePlugins,
	pluginsLoading: state.app.getPluginLoading,
});

export default connect(mapStateToProps)(Plugins);
