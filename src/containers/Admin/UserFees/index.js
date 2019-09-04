import React, { Component } from 'react';
import { Table, Spin, Tabs, notification } from 'antd';
import ChangeFees from './changeFees';
import { requestFees, feeUpdate } from './actions';
import { CSVLink } from 'react-csv';

// import {SELECT_KEYS} from "../Deposits/utils";

const TabPane = Tabs.TabPane;

const openNotification = () => {
	notification.open({
		message: 'Successfully updated'
		// description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
	});
};

class UserFees extends Component {
	state = {
		fetched: false,
		loading: false,
		error: '',
		verification_level: null,
		fee_type: '',
		temporalData: [],
		headers: [],
		newTab: [],
		selectedIndex: 0,
		data: [],
		activeKey: 0
	};

	componentWillMount() {
		this.requestFees();
	}

	requestFees = () => {
		this.setState({
			loading: true,
			error: ''
		});

		requestFees()
			.then((data) => {
				const newTab = [];
				const sortedData = data.data.sort((a, b) => a.id > b.id);

				this.renderData(sortedData[this.state.selectedIndex]);

				sortedData.forEach(({ name }) => {
					newTab.push(name);
				});

				this.setState({
					newTab,
					data: sortedData,
					loading: false,
					fetched: true
				});
			})
			.catch((error) => {
				console.log(error.data);
				const message = error.message;
				this.setState({
					loading: false,
					error: message
				});
			});
	};

	renderData = (data) => {
		const headers = [];
		const keys = [];
		const tableKeys = [];
		const temporalData = {};

		keys.push('verification_level');

		const { name, maker_fees, taker_fees } = data;
		temporalData[name] = {
			name,
			taker_fees,
			maker_fees
		};
		headers.push(name.toUpperCase());
		keys.push(`${name}_maker_fee`);
		headers.push(name.toUpperCase());
		keys.push(`${name}_taker_fee`);

		Object.entries(maker_fees).forEach(([level, value]) => {
			if (!temporalData[level]) {
				temporalData[level] = {
					verification_level: parseInt(level, 10)
				};
			}
			temporalData[level][`${name}_maker_fee`] = value;
		});
		Object.entries(taker_fees).forEach(([level, value]) => {
			if (!temporalData[level]) {
				temporalData[level] = {
					verification_level: parseInt(level, 10)
				};
			}
			temporalData[level][`${name}_taker_fee`] = value;
		});

		keys.map((key) => {
			tableKeys.push({
				label: key,
				dataIndex: key,
				key: key
			});
		});
		this.setState({
			temporalData: Object.values(temporalData),
			headers: Object.entries(keys).map(([key, name]) => {
				return name === 'verification_level'
					? { title: 'verification levels', dataIndex: name, key: name + key }
					: key === '1'
					? { title: 'maker fees', dataIndex: name, key: name + key }
					: { title: 'taker fees', dataIndex: name, key: name + key };
			}),
			tableData: Object.values(temporalData),
			tableKeys
		});
	};

	changeIndex = (activeKey) => {
		this.setState({ selectedIndex: activeKey }, () => {
			this.renderData(this.state.data[this.state.selectedIndex]);
		});
	};

	onLvlSelect = (value) => {
		this.setState({ verification_level: value });
	};

	onFeeSelect = (value) => {
		this.setState({ fee_type: value });
	};

	onSearch = (value) => {
		const { newTab, activeKey, fee_type, verification_level } = this.state;

		feeUpdate(newTab[activeKey], {
			[fee_type]: { [verification_level]: Number(value) }
		})
			.then((res) => {
				this.requestFees();
			})
			.then(openNotification())
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		const { loading, error, activeKey, data } = this.state;
		return (
			<div className="app_container-content">
				{loading ? (
					<Spin size="large" />
				) : (
					<div>
						{error && <p>-{error}-</p>}
						<h1>USER FEES</h1>
						<Tabs
							onChange={(activeKey) => {
								this.setState({ activeKey });
								this.changeIndex(activeKey);
							}}
							activeKey={String(activeKey)}
						>
							{this.state.newTab.map((tab, index) => {
								return (
									<TabPane tab={tab.toUpperCase()} key={index}>
										<CSVLink
											filename={'daily-max-limits.csv'}
											data={this.state.tableData}
											headers={this.state.tableKeys}
										>
											Download table
										</CSVLink>
										<Table
											columns={this.state.headers}
											dataSource={this.state.temporalData}
										/>
										<h2>CHANGE USER FEES</h2>
										<ChangeFees
											onLvlSelect={this.onLvlSelect}
											onFeeSelect={this.onFeeSelect}
											onSearch={this.onSearch}
										/>
									</TabPane>
								);
							})}
						</Tabs>
					</div>
				)}
			</div>
		);
	}
}

export default UserFees;
