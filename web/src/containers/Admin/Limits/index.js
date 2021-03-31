import React, { Component } from 'react';
import { Table, Spin, notification } from 'antd';
import { CSVLink } from 'react-csv';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserLimitForm from './UserLimitForm';
import { performLimitUpdate } from './actions';
import STRINGS from '../../../config/localizedStrings';
import { getCoinsFormFields, getCurrencyColumns } from './constants';
import { API_DOCS_URL } from '../../../config/constants';
import { ModalForm, BlueLink } from '../../../components';

import { setCurrencies } from '../../../actions/appActions';

import './index.css';

const Form = ModalForm('EditLimits', '');
const openNotification = () => {
	notification.open({
		message: 'Successfully updated',
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
		isCustomContent: false,
		Level_value: '',
		customLevels: [],
		isApplyChanges: false,
	};

	componentWillMount() {
		if (Object.keys(this.props.coins).length) {
			this.requestLimits(this.props.coins);
		}
		// setTimeout(() => {
		// 	const COLUMNS_CURRENCY_CSV = getCurrencyColumns(this.handleEdit, true);
		// 	this.setState({ columnsCsv: COLUMNS_CURRENCY_CSV });
		// }, 5000);
	}

	componentDidMount() {
		if (Object.keys(this.props.coins).length) {
			this.requestLimits(this.props.coins);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (JSON.stringify(prevProps.coins) !== JSON.stringify(this.props.coins)) {
			this.requestLimits(this.props.coins);
		}
	}

	requestLimits = (coins) => {
		const sortedData = Object.keys(coins).sort(
			(a, b) => coins[a].id - coins[b].id
		);
		let limits = [];
		sortedData.forEach((coin) => {
			if (coins[coin]) {
				limits = [...limits, coins[coin]];
			}
		});
		this.setState({ limits });
	};

	onLvlSelect = (value, option) => {
		this.setState({ verification_level: value });
	};

	onTypeSelect = (value, option) => {
		this.setState({ update_type: value });
	};

	onSearch = (value) => {
		performLimitUpdate(this.state.verification_level, {
			[this.state.update_type]: Number(value),
		}).then((res) => {
			this.requestLimits();
			openNotification();
		});
	};

	onchange = (event, level) => {
		let customLevels = [...this.state.customLevels];
		const isData = customLevels.filter((val) => val === level).length;
		if (parseInt(event, 10) === 1 && !isData) {
			customLevels = [...customLevels, level];
		} else if (isData) {
			const temp = [];
			customLevels.forEach((key) => {
				if (key !== level) {
					temp.push(key);
				}
			});
			customLevels = temp;
		}
		this.setState({ customLevels });
	};

	handleEdit = (value, data, keyIndex) => {
		const { constants = {} } = this.props;
		const formFields = getCoinsFormFields(constants, this.onchange);
		const Fields = formFields[keyIndex];
		let initialValues = {};
		let customLevels = [];
		if (typeof data[keyIndex] === 'object') {
			const temp = data[keyIndex];
			Object.keys(temp).forEach((key) => {
				if (key <= parseInt(constants.user_level_number || 0, 10))
					if (temp[key] === 0 || temp[key] === -1) {
						initialValues[`${keyIndex}_${key}`] = `${temp[key]}`;
					} else {
						initialValues[`${keyIndex}_${key}`] = `1`;
						initialValues[`${keyIndex}_${key}_custom`] = `${temp[key]}`;
						customLevels = [...customLevels, parseInt(key, 10)];
					}
			});
		} else {
			initialValues[keyIndex] = `${data[keyIndex]}`;
		}
		const isCustomContent =
			keyIndex === 'withdrawal_limits' || keyIndex === 'deposit_limits'
				? true
				: false;
		this.setState({
			isEdit: true,
			editData: { keyIndex, data },
			Fields,
			initialValues,
			isCustomContent,
			customLevels,
		});
	};

	onCancel = () => {
		this.setState({ isEdit: false });
	};

	onSubmit = (rowData) => (values) => {
		const { keyIndex, data } = rowData;
		let formProps = {};
		if (
			keyIndex === 'active' ||
			keyIndex === 'allow_deposit' ||
			keyIndex === 'allow_withdrawal'
		) {
			formProps[keyIndex] = values[keyIndex] === 'true' ? true : false;
		} else if (
			keyIndex === 'deposit_limits' ||
			keyIndex === 'withdrawal_limits'
		) {
			const loopData = data[keyIndex];
			const tempData = {};
			if (Object.keys(loopData).length) {
				Object.keys(loopData).forEach((key) => {
					if (
						key <= parseInt(this.props.constants.user_level_number || 0, 10)
					) {
						let levelValue = parseFloat(values[`${keyIndex}_${key}`]);
						if (levelValue >= 1 && values[`${keyIndex}_${key}_custom`]) {
							levelValue = values[`${keyIndex}_${key}_custom`];
						}
						tempData[key] = parseFloat(levelValue);
					}
				});
				formProps[keyIndex] = tempData;
			}
		} else if (
			keyIndex === 'withdrawal_fee' ||
			keyIndex === 'min' ||
			keyIndex === 'max' ||
			keyIndex === 'increment_unit'
		) {
			formProps[keyIndex] = parseFloat(values[keyIndex]);
		} else {
			formProps[keyIndex] = values[keyIndex];
		}
		if (data.id) {
			performLimitUpdate(data.id, { ...formProps, currency: data.symbol })
				.then((res) => {
					const newData = this.state.limits.map((item) => {
						if (item.id === res.id) {
							return res;
						}
						return item;
					});
					this.props.setCurrencies(newData);
					this.setState({
						limits: newData,
					});
					return;
				})
				.then((res) => {
					this.onCancel();
					openNotification();
				})
				.catch((error) => {});
		}
	};

	render() {
		const {
			limits,
			loading,
			error,
			isEdit,
			editData,
			Fields,
			initialValues,
			isCustomContent,
			customLevels,
		} = this.state;
		const COLUMNS_CURRENCY = getCurrencyColumns(this.handleEdit);
		return (
			<div className="app_container-content">
				{loading ? (
					<Spin size="large" />
				) : (
					<div>
						{error && <p>-{error}-</p>}
						<h1>Coins</h1>
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
							scroll={{ x: true }}
						/>
						<div className="mb-3">
							{STRINGS.formatString(
								STRINGS['NOTE_FOR_EDIT_COIN'],
								STRINGS['COINS'],
								<BlueLink
									href={API_DOCS_URL}
									text={STRINGS['REFER_DOCS_LINK']}
								/>
							)}
						</div>
						{/* <div>
							<h2>CHANGE Coins</h2>

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
					okText="Save"
					fields={Fields}
					CustomRenderContent={isCustomContent ? UserLimitForm : null}
					customLevels={customLevels}
					initialValues={initialValues}
					onSubmit={this.onSubmit(editData)}
					onCancel={this.onCancel}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	constants: state.app.constants,
	coins: state.app.coins,
});

const mapDispatchToProps = (dispatch) => ({
	setCurrencies: bindActionCreators(setCurrencies, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Limits);
