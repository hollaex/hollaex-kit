import React, { Component } from 'react';
import { Table, Spin, notification, Input, Select } from 'antd';
import { CSVLink } from 'react-csv';

import { requestLimits, performLimitUpdate } from './actions';

const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;
const openNotification = () => {
	notification.open({
		message: 'Successfully updated'
		// description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
	});
};
const COLUMNS_CURRENCY = [],
	UPDATE_KEYS = [],
	CURRENCY_KEYS = [],
	HEADERS = [];

class Limits extends Component {
	state = {
		limits: [],
		fetched: false,
		loading: false,
		error: '',
		verification_level: null,
		update_type: ''
	};

	componentWillMount() {
		this.requestLimits();
	}

	requestLimits = () => {
		this.setState({
			loading: true,
			error: ''
		});
		const arr = [COLUMNS_CURRENCY, HEADERS, CURRENCY_KEYS, UPDATE_KEYS];
		arr.map((arr) => (arr.length = 0));
		requestLimits()
			.then((res) => {
				Object.keys(res[0]).forEach((name) =>
					name !== 'id' && name !== 'created_at' && name !== 'updated_at'
						? (COLUMNS_CURRENCY.push({
								title: name,
								dataIndex: name,
								key: name
						  }),
						  HEADERS.push({ label: name, dataIndex: name, key: name }),
						  name !== 'verification_level'
								? CURRENCY_KEYS.push({ value: name, label: name })
								: null)
						: null
				);
				res.forEach(({ verification_level: lvl }) => {
					UPDATE_KEYS.push({ value: lvl, label: lvl });
				});
				this.setState({
					limits: res,
					loading: false,
					fetched: true
				});
			})
			.catch((error) => {
				const message = error.message;
				this.setState({
					loading: false,
					error: message
				});
			});
	};
	onLvlSelect = (value, option) => {
		this.setState({ verification_level: value });
	};
	onTypeSelect = (value, option) => {
		this.setState({ update_type: value });
	};
	onSearch = (value) => {
		performLimitUpdate(this.state.verification_level, {
			[this.state.update_type]: Number(value)
		}).then(() => {
			this.requestLimits();
			openNotification();
		});
	};

	render() {
		const { limits, loading, error } = this.state;
		return (
			<div className="app_container-content">
				{loading ? (
					<Spin size="large" />
				) : (
					<div>
						{error && <p>-{error}-</p>}
						<h1>DAILY MAX LIMITS</h1>
						<CSVLink
							filename={'daily-max-limits.csv'}
							data={limits}
							headers={HEADERS}
						>
							Download table
						</CSVLink>
						<Table
							columns={COLUMNS_CURRENCY}
							dataSource={limits}
							rowKey={(data) => {
								return data.id;
							}}
						/>
						<div>
							<h2>CHANGE DAILY MAX LIMITS</h2>

							<InputGroup compact>
								<Select
									defaultValue={'Verification level'}
									style={{ width: '22%' }}
									onSelect={this.onLvlSelect}
								>
									{UPDATE_KEYS.map(({ value, label }, index) => (
										<Option value={value} key={index}>
											{label}
										</Option>
									))}
								</Select>
								<Select
									defaultValue={'Choose currency type'}
									style={{ width: '26%' }}
									onSelect={this.onTypeSelect}
								>
									{CURRENCY_KEYS.map(({ value, label }, index) => (
										<Option value={value} key={index}>
											{label}
										</Option>
									))}
								</Select>
								<Search
									placeholder="Update amount"
									enterButton="Save changes"
									size="default"
									style={{ width: '40%' }}
									onSearch={(value) => this.onSearch(value)}
								/>
							</InputGroup>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default Limits;
