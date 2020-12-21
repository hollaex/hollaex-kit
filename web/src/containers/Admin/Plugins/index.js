import React, { Component } from 'react';
import { Spin, Tabs, message } from 'antd';
import { connect } from 'react-redux';

import { getPlugin, removePlugin, addPlugin } from './action';
import { getAllPluginsData } from './Utils';
import PluginList from './PluginList';

import './index.css';

const TabPane = Tabs.TabPane;

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
		};
	}

	componentDidMount() {
		this.generateCards();
		this.setState({ loading: true });
		this.getPlugin();
	}

	getPlugin = (page = 1, limit = 50, params = {}) => {
		this.setState({ isLoading: true });
		return getPlugin({ page, limit, ...params })
			.then((res) => {
				if (res && res.data) {
					this.setState({ loading: false, pluginData: res.data });
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
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
		this.setState({ isOpen: false, selectedPlugin: {}, type: '' });
	};

	render() {
		const { loading, constants, selectedPlugin, pluginData } = this.state;
		if (loading || this.props.pluginsLoading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}

		return (
			<div className="app_container-content admin-earnings-container">
				<Tabs>
					<TabPane tab="Explore" key="explore">
						<PluginList
							pluginData={pluginData}
							constants={constants}
							selectedPlugin={selectedPlugin}
							getAllPlugins={this.getAllPlugins}
							handleOpenAdd={this.handleOpenAdd}
							getPlugin={this.getPlugin}
						/>
					</TabPane>

					<TabPane tab="My plugins" key="my_plugin">
						<div>My plugin</div>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	availablePlugins: state.app.availablePlugins,
	pluginsLoading: state.app.getPluginLoading,
});

export default connect(mapStateToProps)(Plugins);
