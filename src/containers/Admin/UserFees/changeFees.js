import React, { Component } from 'react';
import { Table, Spin, Tabs, Input, Select, Button } from 'antd';

import { requestFees } from './actions';

import { COLUMNS_FEES } from './constants';
import { performLimitUpdate } from '../Limits/actions';
// import {SELECT_KEYS} from "../Deposits/utils";

const TabPane = Tabs.TabPane;

const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;

const UPDATE_KEYS = [
	{ value: '1', label: '1' },
	{ value: '2', label: '2' },
	{ value: '3', label: '3' },
	{ value: '4', label: '4' },
	{ value: '5', label: '5' },
	{ value: '6', label: '6' }
];

const CURRENCY_KEYS = [
	{ value: 'taker_fees', label: 'Taker fees' },
	{ value: 'maker_fees', label: 'Maker fees' }
];

class ChangeFees extends Component {
	constructor(props) {
		super(props);
		this.state = {
			john: props.name
		};
	}
	// onSearch = (value) => {
	//     console.log(value);
	//     // let num = Number(value);
	//     // performLimitUpdate(this.state.verification_level, { [this.state.update_type] : num })
	//     //     .then(()=>{this.requestLimits();
	//     //             openNotification();
	//     //         }
	//     //     );
	// };

	render() {
		return (
			<div>
				{this.props.name}
				<InputGroup compact>
					<Select
						defaultValue={'Verification level'}
						style={{ width: '22%' }}
						onSelect={(e) => this.props.onLvlSelect(e)}
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
						onSelect={(e) => this.props.onFeeSelect(e)}
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
						onSearch={(value) => this.props.onSearch(value)}
					/>
				</InputGroup>
			</div>
		);
	}
}

export default ChangeFees;
