import React, { Component } from 'react';
import { Input, Button, Select, InputNumber, DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
let d = new Date();

class Filter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			secondaryType: 'text',
			selectedValue: '',
			placeholder: '',
			data: '',
		};
	}

	componentDidMount() {
		if (this.props.selectOptions && this.props.selectOptions.length) {
			this.setState({
				secondaryType: this.props.selectOptions[0].secondaryType,
				selectedValue: this.props.selectOptions[0].value,
				placeholder: this.props.selectOptions[0].secondaryPlaceHolder,
				defaultValue: this.props.selectOptions[0].secondaryDefaultValue,
			});
		}
	}

	onChangeInputValues = (e) => {
		const value = e.target.value;
		this.props.onChange(
			value,
			this.state.selectedValue,
			this.state.secondaryType
		);
	};

	onChangeNumberValues = (value) => {
		this.props.onChange(
			value,
			this.state.selectedValue,
			this.state.secondaryType
		);
	};

	onChangeDateValues = (value) => {
		this.props.onChange(
			value,
			this.state.selectedValue,
			this.state.secondaryType
		);
	};

	renderSecondaryContainer = () => {
		if (this.state.secondaryType === 'number') {
			return (
				<InputNumber
					size="small"
					placeholder={this.state.placeholder}
					onChange={this.onChangeNumberValues}
				/>
			);
		} else if (this.state.secondaryType === 'date-range') {
			return (
				<div>
					<RangePicker
						size="small"
						defaultValue={
							this.state.defaultValue
								? this.state.defaultValue
								: [moment(d, dateFormat), moment(d, dateFormat)]
						}
						format={dateFormat}
						onChange={this.onChangeDateValues}
					/>
				</div>
			);
		} else if (this.state.secondaryType === 'date') {
			return (
				<div>
					<DatePicker
						size="small"
						defaultValue={moment(d, dateFormat)}
						format={dateFormat}
						onChange={this.onChangeDateValues}
					/>
				</div>
			);
		}
		return (
			<Input
				size="small"
				placeholder={this.state.placeholder}
				onChange={this.onChangeInputValues}
			/>
		);
	};

	handleSelect = (value) => {
		const { selectOptions } = this.props;
		const options = selectOptions.filter((val) => val.value === value);
		this.props.onChange('', 'resetData');
		if (options.length) {
			this.setState({
				secondaryType: options[0].secondaryType,
				selectedValue: options[0].value,
				placeholder: options[0].secondaryPlaceHolder,
			});
		}
	};

	render() {
		const { selectOptions } = this.props;

		return (
			<div className="fields-container">
				<Select
					onChange={this.handleSelect}
					size="small"
					value={this.state.selectedValue}
				>
					{selectOptions.map((option, index) => (
						<Select.Option key={index} value={option.value}>
							{option.label}
						</Select.Option>
					))}
				</Select>
				{this.renderSecondaryContainer()}
				<Button
					className="button"
					size="small"
					onClick={this.props.onClickFilter}
				>
					Filter
				</Button>
			</div>
		);
	}
}

Filter.defaultProps = {
	selectOptions: [],
	onClickFilter: () => {},
};

export default Filter;
