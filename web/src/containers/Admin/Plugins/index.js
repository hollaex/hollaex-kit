import React, { Component } from 'react';
import { Card, Divider } from 'antd';
import { connect } from 'react-redux';

import { allPluginsData } from './Utils';

import './index.css';

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
		const otherPlugins = Object.keys(allPluginsData).filter((data) => !enabledPlugins.includes(data));
		this.setState({ myPlugins, otherPlugins });
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
		const { myPlugins, otherPlugins } = this.state;
		return (
			<div className="app_container-content">
				<div className="mb-4">
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
				<div className="my-2">
					<h1>Other Plugins</h1>
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
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	enabledPlugins: state.app.enabledPlugins
});

export default connect(mapStateToProps)(Plugins);
