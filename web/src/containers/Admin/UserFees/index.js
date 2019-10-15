import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Tabs, notification } from 'antd';
import { CSVLink } from 'react-csv';

import ChangeFees from './changeFees';
import { feeUpdate } from './actions';
import { BlueLink } from '../../../components';
import { API_DOCS_URL } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

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
		selectedKey: '',
		tabData: [],
		activeKey: 0
	};

	componentDidMount() {
		if (Object.keys(this.props.pairs).length)
			this.constructData(this.props.pairs, this.props.config);
	}

	componentDidUpdate(prevProps) {
		if (JSON.stringify(prevProps.pairs) !== JSON.stringify(this.props.pairs)
			|| JSON.stringify(prevProps.config) !== JSON.stringify(this.props.config)) {
			this.constructData(this.props.pairs, this.props.config);
		}
	}

	constructData = (pairs = {}, config = {}) => {
		const sortedData = Object.keys(pairs).sort((a, b) => pairs[a].id - pairs[b].id);
		const selectedKey = this.state.selectedKey ? this.state.selectedKey : sortedData[0];
		if (sortedData.length) {
			this.renderData(pairs[selectedKey], config);
			this.setState({
				tabData: sortedData,
				selectedKey
			});
		}
	};

	renderData = (data, config) => {
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
		const verifyLevels = [];
		for (var count = 1; count <= parseInt((config.tiers || 0), 10); count++) {
			verifyLevels.push(count);
		}
		verifyLevels.forEach(level => {
			if (!temporalData[level]) {
				temporalData[level] = {
					verification_level: level
				};
			}
			temporalData[level][`${name}_maker_fee`] = maker_fees[level];
			temporalData[level][`${name}_taker_fee`] = taker_fees[level];
		});

		keys.forEach((key) => {
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
					? {
						title: 'verification levels',
						dataIndex: name,
						key: name + key
					}
					: key === '1'
						? { title: 'maker fees', dataIndex: name, key: name + key, render: d => (d === undefined ? null : `${d}%`) }
						: { title: 'taker fees', dataIndex: name, key: name + key, render: d => (d === undefined ? null : `${d}%`) };
			}),
			tableData: Object.values(temporalData),
			tableKeys
		});
	};

	changeIndex = (activeKey) => {
		this.setState({ selectedKey: activeKey }, () => {
			this.renderData(this.props.pairs[this.state.selectedKey], this.props.config);
		});
	};

	onLvlSelect = (value) => {
		this.setState({ verification_level: value });
	};

	onFeeSelect = (value) => {
		this.setState({ fee_type: value });
	};

	onSearch = (value) => {
		const { fee_type, verification_level, selectedKey } = this.state;
		const takerData = this.props.pairs[selectedKey] || {};
		const levels = { ...takerData[fee_type] };
		levels[verification_level] = Number(value);

		feeUpdate(selectedKey, {
			[fee_type]: { ...levels }
		})
			.then((res) => {
				// this.requestFees();
			})
			.then(openNotification())
			.catch((err) => { });
	};

	render() {
		const { loading, error, tabData, selectedKey } = this.state;
		const { config = {} } = this.props;
		return (
			<div className="app_container-content">
				{loading ? (
					<Spin size="large" />
				) : (
						<div>
							{error && <p>-{error}-</p>}
							<h1>Trading Pairs</h1>
							<Tabs
								onChange={(activeKey) => {
									this.changeIndex(activeKey);
								}}
								activeKey={selectedKey}
							>
								{tabData.map((tab, index) => {
									return (
										<TabPane tab={tab.toUpperCase()} key={tab}>
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
												rowKey={(data) => {
													return data.id;
												}}
											/>
											<div className="mb-3">
												{STRINGS.formatString(
													STRINGS.NOTE_FOR_EDIT_COIN,
													STRINGS.PAIRS,
													<BlueLink
														href={API_DOCS_URL}
														text={STRINGS.REFER_DOCS_LINK}
													/>
												)}
											</div>
											<h2>CHANGE USER FEES</h2>
											<ChangeFees
												config={config}
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

const mapStateToProps = (state) => ({
	config: state.app.config,
	pairs: state.app.pairs
});

export default connect(mapStateToProps)(UserFees);
