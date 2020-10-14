import React, { Component, Fragment } from 'react';
import { Card, Divider, Spin } from 'antd';
import { connect } from 'react-redux';

import { getConstants } from './action';
import { getAllPluginsData } from './Utils';

import './index.css';

class Plugins extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeTab: '',
			myPlugins: [],
			otherPlugins: [],
			loading: false,
			constants: {}
		};
	}

	componentDidMount() {
		this.generateCards();
		this.setState({ loading: true });
		getConstants()
			.then(res => {
				this.setState({ loading: false, constants: res });
			})
			.catch(err => {
				this.setState({ loading: false });
			});
	}

	componentDidUpdate(prevProps, prevState) {
		if ((JSON.stringify(this.state.constants) !== JSON.stringify(prevState.constants))
			|| (JSON.stringify(this.props.availablePlugins) !== JSON.stringify(prevProps.availablePlugins))) {
			this.generateCards();
		}
	}

	generateCards = () => {
		const { enabled = [] } = this.state.constants;
		// if (plugins) {
			let allPluginsData = getAllPluginsData(this.props.availablePlugins);
			let myPlugins = Object.keys(allPluginsData).filter((data) => enabled.includes(data));
			const otherPlugins = Object.keys(allPluginsData).filter((data) => !enabled.includes(data));
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

	render() {
		const { myPlugins, otherPlugins, loading, allPluginsData } = this.state;
		if (loading || this.props.pluginsLoading) {
			return (
				<div className="app_container-content">
					<Spin size="large" />
				</div>
			);
		}
		return (
			<div className="app_container-content">
				{(!this.props.availablePlugins.length) ? (
					<div>
						<h1>Plugins</h1>
						<div>No Available plugins</div>
					</div>
				) : (
					<Fragment>
						{myPlugins.length
							? <div className="mb-4">
								<h1>My Plugins</h1>
								<Divider />
								<div className="d-flex flex-wrap">
									{myPlugins.map((key) => {
										let plugin = allPluginsData[key] || {};
										return <Card className="card-width mb-4 mx-3"
											key={plugin.title}
											hoverable
											cover={<img src={plugin.icon} alt={plugin.title} />}
											onClick={() => this.onHandleCard(key)}>
											<h4>{plugin.title}</h4>
											<h6>{plugin.sub_title}</h6>
											<h6>{plugin.description}</h6>
										</Card>
									})}
								</div>
							</div>
							: null
						}
						{otherPlugins.length
							? <div className="my-2">
								<h1>{myPlugins.length ? 'Other Plugins' : 'Plugins'}</h1>
								<Divider />
								<div className="d-flex flex-wrap">
									{otherPlugins.map((key) => {
										let plugin = allPluginsData[key] || {};
										return <Card className="card-width mb-4 mx-3"
											key={plugin.title}
											hoverable
											cover={<img src={plugin.icon} alt={plugin.title} />}
											onClick={() => this.onHandleCard(key)}>
											<h4>{plugin.title}</h4>
											<h6>{plugin.sub_title}</h6>
											<h6>{plugin.description}</h6>
										</Card>
									})}
								</div>
							</div>
							: null
						}
					</Fragment>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	availablePlugins: state.app.availablePlugins,
	pluginsLoading: state.app.getPluginLoading
});

export default connect(mapStateToProps)(Plugins);
