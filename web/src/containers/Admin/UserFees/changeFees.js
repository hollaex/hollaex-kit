import React, { Component } from 'react';
import { Input, Select } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;

const CURRENCY_KEYS = [
	{ value: 'taker_fees', label: 'Taker fees' },
	{ value: 'maker_fees', label: 'Maker fees' },
];

class ChangeFees extends Component {
	constructor(props) {
		super(props);
		this.state = {
			john: props.name,
		};
	}

	render() {
		const levels = [];
		for (let i = 1; i <= this.props.constants.user_level_number; i++) {
			levels.push({ value: `${i}`, label: `${i}` });
		}

		return (
			<div>
				{this.props.name}
				<InputGroup compact>
					<Select
						defaultValue={'Verification level'}
						style={{ width: '22%' }}
						onSelect={(e) => this.props.onLvlSelect(e)}
					>
						{levels.map(({ value, label }, index) => (
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
						placeholder="Update fees(%)"
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
