import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';

import { updatePlugins } from './action';
import { allPluginsData } from './Utils';

class Plugins extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeTab: '',
			myPlugins: [],
			otherPlugins: []
		};
	}

	componentDidMount() {
		this.generateCards();
	}

	componentDidUpdate(prevProps) {
		if (JSON.stringify(this.props.enabledPlugins) !== JSON.stringify(prevProps.enabledPlugins)) {
			this.generateCards();
		}
	}

	generateCards = () => {
		const { enabledPlugins } = this.props;
		let myPlugins = [ ...enabledPlugins ];
		// enabledPlugins.forEach((data) => {
		// 	if (allPluginsData[data]) myPlugins = [ ...myPlugins, allPluginsData[data] ];
		// });
		const otherPlugins = Object.keys(allPluginsData).filter((data) => !enabledPlugins.includes(data));
		// let otherPlugins = [];
		// otherPluginKeys.forEach((data) => {
		// 	if (allPluginsData[data]) otherPlugins = [ ...otherPlugins, allPluginsData[data] ];
		// });
		// let myPlugins = [];
		// enabledPlugins.forEach((data) => {
		// 	if (allPluginsData[data]) myPlugins = [ ...myPlugins, allPluginsData[data] ];
		// });
		// const otherPluginKeys = Object.keys(allPluginsData).filter((data) => !enabledPlugins.includes(data));
		// let otherPlugins = [];
		// otherPluginKeys.forEach((data) => {
		// 	if (allPluginsData[data]) otherPlugins = [ ...otherPlugins, allPluginsData[data] ];
		// });
		this.setState({ myPlugins, otherPlugins });
	};

	tabChange = (activeTab) => {
		this.setState({ activeTab });
	};

	handleSubmitPlugins = () => {
		console.log('formProps');
	}

	handleSubmitVault = (formProps, key) => {
		let formValues = {
			plugins: {
				configuration: {
					[key]: formProps
				}
			}
		};
		console.log('formProps', formProps, key, formValues);
		updatePlugins(formValues)
			.then((data) => {
				console.log('data', data);
			})
			.catch((error) => {
				console.log('error', error);
			});
	};

	onHandleCard = (key) => {
		console.log('onHandleCard', key);
	};

	render() {
		const { myPlugins, otherPlugins } = this.state;
		console.log('this.props.', this.props.constants);
		return (
			<div className="app_container-content">
				<h1>My Plugins</h1>
				<div className="d-flex flex-wrap">
					{myPlugins.map((key) => {
						let plugin = allPluginsData[key] || {};
						return <Card className="cardStyle w-25 mb-4 mx-3"
							key={plugin.title}
							hoverable
							cover={<img src={plugin.icon} alt={plugin.title} />}
							onClick={() => this.onHandleCard(key)}>
							<h3>{plugin.title}</h3>
							<h5>{plugin.sub_title}</h5>
							<div>{plugin.description}</div>
						</Card>
					})}
				</div>
				<h1>Other Plugins</h1>
				<div className="d-flex flex-wrap">
					{otherPlugins.map((key) => {
						let plugin = allPluginsData[key] || {};
						return <Card className="cardStyle w-25 mb-4 mx-3"
							key={plugin.title}
							hoverable
							cover={<img src={plugin.icon} alt={plugin.title} />}
							onClick={() => this.onHandleCard(key)}>
							<h3>{plugin.title}</h3>
							<h5>{plugin.sub_title}</h5>
							<div>{plugin.description}</div>
						</Card>
					})}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	enabledPlugins: state.app.enabledPlugins,
	constants: state.app.constants
});

export default connect(mapStateToProps)(Plugins);
