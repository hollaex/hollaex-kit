import React, { Component } from 'react';
import { Tabs, Row } from 'antd';
import { connect } from 'react-redux';
import { S3Form, SNSForm, Freshdesk } from './pluginForm';
import { updatePlugins } from './action';

const TabPane = Tabs.TabPane;

class Plugins extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeTab: ''
		};
	}

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

	render() {
		console.log('this.props.', this.props.constants);
		return (
			<div className="app_container-content">
				<h1>Plugins</h1>
				<Tabs onChange={this.tabChange}>
					<TabPane tab={'S3'} key={'s3'}>
						<Row>
							<S3Form handleSubmitVault={this.handleSubmitVault} />
						</Row>
					</TabPane>
					<TabPane tab={'SNS'} key={'sns'}>
						<Row>
							<SNSForm handleSubmitVault={this.handleSubmitVault} />
						</Row>
					</TabPane>
					<TabPane tab={'Freshdesk'} key={'freshdesk'}>
						<Row>
							<Freshdesk handleSubmitVault={this.handleSubmitVault} />
						</Row>
					</TabPane>
				</Tabs>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	enabledPlugins: state.app.enabledPlugins,
	constants: state.app.constants	
});

export default connect(mapStateToProps)(Plugins);
