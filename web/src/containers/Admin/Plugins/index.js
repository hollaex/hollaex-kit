import React, { Component, Fragment } from 'react';
import { Card, Divider, Spin } from 'antd';

import { getConstants } from './action';
import { allPluginsData } from './Utils';

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
				this.setState({ loading: false, constants: res.constants });
			})
			.catch(err => {
				this.setState({ loading: false });
			});
	}

	componentDidUpdate(prevProps, prevState) {
		if (JSON.stringify(this.state.constants) !== JSON.stringify(prevState.constants)) {
			this.generateCards();
		}
	}

	generateCards = () => {
		const { plugins = { enabled: '' } } = this.state.constants;
		if (plugins) {
			let enabledPlugins = plugins.enabled.split(',');
			let myPlugins = Object.keys(allPluginsData).filter((data) => enabledPlugins.includes(data));
			const otherPlugins = Object.keys(allPluginsData).filter((data) => !enabledPlugins.includes(data));
			this.setState({ myPlugins, otherPlugins });
		}
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
		const { myPlugins, otherPlugins, loading } = this.state;
		return (
			<div className="app_container-content">
				{loading ? (
					<Spin size="large" />
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

export default Plugins;
