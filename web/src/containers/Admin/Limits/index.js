import React, { Component } from 'react';
import { Table, Spin, notification, Input, Select } from 'antd';
import { CSVLink } from 'react-csv';

import UserLimitForm from './UserLimitForm';
import { requestLimits, performLimitUpdate } from './actions';
import { UPDATE_KEYS, CURRENCY_KEYS, COINS_FORM_FIELDS, getCurrencyColumns } from './constants';
import { ModalForm } from '../../../components';
import './index.css';

const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;
const Form = ModalForm('EditLimits', '');
const openNotification = () => {
	notification.open({
		message: 'Successfully updated'
	});
};

class Limits extends Component {
	state = {
		limits: [],
		fetched: false,
		loading: false,
		error: '',
		verification_level: null,
		update_type: '',
		columnsCsv: [],
		isEdit: false,
		editData: {},
		Fields: {},
		initialValues: {},
		isCustomContent: false
	};

	componentWillMount() {
		this.requestLimits();
		// setTimeout(() => {
		// 	const COLUMNS_CURRENCY_CSV = getCurrencyColumns(this.handleEdit, true);
		// 	this.setState({ columnsCsv: COLUMNS_CURRENCY_CSV });
		// }, 5000);
	}

	requestLimits = () => {
		this.setState({
			loading: true,
			error: ''
		});
		requestLimits()
			.then((res) => {
				this.setState({
					limits: res.data,
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
		}).then((res) => {
			this.requestLimits();
			openNotification();
		});
	};

	handleEdit = (value, data, keyIndex) => {
		const Fields = COINS_FORM_FIELDS[keyIndex];
		let initialValues = {};
		if (typeof data[keyIndex] === 'object') {
			const temp = data[keyIndex];
			Object.keys(temp).map(key => {
				initialValues[`${keyIndex}_${key}`] = temp[key];
			});
		} else {
			initialValues[keyIndex] = `${data[keyIndex]}`;
		}
		const isCustomContent = keyIndex === 'withdrawal_limits' || keyIndex === 'deposit_limits'
			? true
			: false;
		this.setState({
			isEdit: true,
			editData: { keyIndex, data },
			Fields,
			initialValues,
			isCustomContent
		});
	};

	onCancel = () => {
		this.setState({ isEdit: false });
	};

	onSubmit = (rowData) => (values) => {
		const { keyIndex, data } = rowData;
		let formProps = {};
		if (keyIndex === 'active' || keyIndex === 'allow_deposit' || keyIndex === 'allow_withdrawal') {
			formProps[keyIndex] = values[keyIndex] === 'true' ? true : false;
		} else if (keyIndex === 'deposit_limits' || keyIndex === 'withdrawal_limits') {
			const loopData = data[keyIndex];
			const tempData = {};
			if (Object.keys(loopData).length) {
				Object.keys(loopData).map(key => {
					tempData[key] = parseFloat(values[`${keyIndex}_${key}`]);
				});
				formProps[keyIndex] = tempData;
			}
		} else if (keyIndex === 'withdrawal_fee'
			|| keyIndex === 'min'
			|| keyIndex === 'max'
			|| keyIndex === 'increment_unit') {
			formProps[keyIndex] = parseFloat(values[keyIndex]);
		} else {
			formProps[keyIndex] = values[keyIndex];
		}
		if (data.id) {
			performLimitUpdate(data.id, { ...formProps, currency: data.symbol })
				.then((res) => {
					this.requestLimits();
					this.onCancel();
					openNotification();
				})
				.catch((error) => {
				});
		}
	};

	render() {
		const { limits, loading, error, isEdit, editData, Fields, initialValues, isCustomContent } = this.state;
		const COLUMNS_CURRENCY = getCurrencyColumns(this.handleEdit);
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
								headers={COLUMNS_CURRENCY}
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
							{/* <div>
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
						</div> */}
						</div>
					)}
				<Form
					visible={isEdit}
					title={editData.keyIndex}
					okText='Save'
					fields={Fields}
					CustomRenderContent={isCustomContent ? UserLimitForm : null}
					initialValues={initialValues}
					onSubmit={this.onSubmit(editData)}
					onCancel={this.onCancel}
				/>
			</div>
		);
	}
}

export default Limits;
