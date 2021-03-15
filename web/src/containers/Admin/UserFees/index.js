import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Spin, notification } from 'antd';
import { CSVLink } from 'react-csv';
import { bindActionCreators } from 'redux';
// import ChangeFees from './changeFees';
import UserFeesForm from './UserFeesForm';
import { feeUpdate } from './actions';
import { getPairsColumns, getPairsFormFields } from './constants';
import { ModalForm, BlueLink } from '../../../components';
import { API_DOCS_URL } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

import { setPairs } from '../../../actions/appActions';

// import {SELECT_KEYS} from "../Deposits/utils";

const Form = ModalForm('EditFees', '');

const openNotification = () => {
	notification.open({
		message: 'Successfully updated',
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
		activeKey: 0,
		fees: [],
		isEdit: false,
		editData: {},
		initialValues: {},
		isCustomContent: false,
	};

	componentDidMount() {
		if (Object.keys(this.props.pairs).length)
			this.constructData(this.props.pairs, this.props.constants);
	}

	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(prevProps.pairs) !== JSON.stringify(this.props.pairs) ||
			JSON.stringify(prevProps.constants) !==
				JSON.stringify(this.props.constants)
		) {
			this.constructData(this.props.pairs, this.props.constants);
		}
	}

	constructData = (pairs = {}) => {
		const sortedData = Object.keys(pairs).sort(
			(a, b) => pairs[a].id - pairs[b].id
		);
		if (sortedData.length) {
			let fees = [];
			sortedData.forEach((key) => {
				fees = [...fees, pairs[key]];
			});
			this.setState({
				fees,
			});
		}
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
			[fee_type]: { ...levels },
		})
			.then((res) => {
				this.renderData(res, this.props.constants);
			})
			.then(openNotification())
			.catch((err) => {});
	};

	handleClick = (value, data, keyIndex) => {
		const { constants = {} } = this.props;
		const formFields = getPairsFormFields(constants);
		const Fields = formFields[keyIndex];
		let initialValues = {};
		if (typeof data[keyIndex] === 'object') {
			const temp = data[keyIndex];
			Object.keys(temp).forEach((key) => {
				if (key <= parseInt(constants.user_level_number || 0, 10))
					initialValues[`${keyIndex}_${key}`] = temp[key];
			});
		} else {
			initialValues[keyIndex] = `${data[keyIndex]}`;
		}
		const isCustomContent =
			keyIndex === 'maker_fees' || keyIndex === 'taker_fees' ? true : false;

		this.setState({
			isEdit: true,
			Fields,
			editData: { keyIndex, data },
			initialValues,
			isCustomContent,
		});
	};

	onCancel = () => {
		this.setState({ isEdit: false });
	};

	onSubmit = (rowData) => (values) => {
		const { keyIndex, data } = rowData;
		let formProps = {};
		if (keyIndex === 'active') {
			formProps[keyIndex] = values[keyIndex] === 'true' ? true : false;
		} else if (keyIndex === 'taker_fees' || keyIndex === 'maker_fees') {
			const loopData = data[keyIndex];
			const tempData = {};
			if (Object.keys(loopData).length) {
				Object.keys(loopData).forEach((key) => {
					if (
						key <= parseInt(this.props.constants.user_level_number || 0, 10)
					) {
						let levelValue = parseFloat(values[`${keyIndex}_${key}`]);
						tempData[key] = levelValue;
					}
				});
				formProps[keyIndex] = tempData;
			}
		} else if (
			keyIndex === 'increment_price' ||
			keyIndex === 'increment_size' ||
			keyIndex === 'max_price' ||
			keyIndex === 'max_size' ||
			keyIndex === 'min_price' ||
			keyIndex === 'min_size'
		) {
			formProps[keyIndex] = parseFloat(values[keyIndex]);
		} else {
			formProps[keyIndex] = values[keyIndex];
		}
		if (data.id) {
			feeUpdate(data.name, formProps)
				.then((res) => {
					const newData = this.state.fees.map((item) => {
						if (item.id === res.id) {
							return res;
						}
						return item;
					});
					this.props.setPairs(newData);
					this.onCancel();
					// this.requestFees();
				})
				.then(openNotification())
				.catch((err) => {});
		}
	};

	render() {
		const {
			loading,
			error,
			fees,
			isEdit,
			editData,
			Fields,
			initialValues,
			isCustomContent,
		} = this.state;
		const pairColumns = getPairsColumns(this.handleClick);
		return (
			<div className="app_container-content">
				{loading ? (
					<Spin size="large" />
				) : (
					<div>
						{error && <p>-{error}-</p>}
						<h1>Trading Pairs</h1>
						<CSVLink
							filename={'daily-max-limits.csv'}
							data={fees}
							headers={pairColumns}
						>
							Download table
						</CSVLink>
						<Table
							columns={pairColumns}
							dataSource={fees}
							rowKey={(data) => {
								return data.id;
							}}
							scroll={{ x: true }}
						/>
						<div className="mb-3">
							{STRINGS.formatString(
								STRINGS['NOTE_FOR_EDIT_COIN'],
								STRINGS['PAIRS'],
								<BlueLink
									href={API_DOCS_URL}
									text={STRINGS['REFER_DOCS_LINK']}
								/>
							)}
						</div>
						{/* <h2>CHANGE USER FEES</h2>
							<ChangeFees
								constants={constants}
								onLvlSelect={this.onLvlSelect}
								onFeeSelect={this.onFeeSelect}
								onSearch={this.onSearch}
							/> */}
					</div>
				)}
				<Form
					visible={isEdit}
					title={editData.keyIndex}
					okText="Save"
					fields={Fields}
					CustomRenderContent={isCustomContent ? UserFeesForm : null}
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
	pairs: state.app.pairs,
});

const mapDispatchToProps = (dispatch) => ({
	setPairs: bindActionCreators(setPairs, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserFees);
