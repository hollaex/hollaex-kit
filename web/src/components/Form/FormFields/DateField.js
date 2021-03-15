import React, { Component } from 'react';
import moment from 'moment';
import {
	SingleDatePicker,
	isInclusivelyAfterDay,
	isInclusivelyBeforeDay,
} from 'react-dates';
import FieldWrapper, { FieldContent } from './FieldWrapper';
import withConfig from 'components/ConfigProvider/withConfig';

const FIELDS = [
	{ key: 'year', label: 'Year' },
	{ key: 'month', label: 'Month' },
	{ key: 'day', label: 'Day' },
];

class DateField extends Component {
	state = {
		focused: false,
		date: moment(),
		display: {
			year: '',
			month: '',
			day: '',
		},
	};

	componentDidMount() {
		if (this.props.input.value) {
			this.onChangeInput(this.props.input.value);
			this.setDisplay(this.props.input.value, this.props.language);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.input.value !== this.props.input.value) {
			this.onChangeInput(nextProps.input.value);
		}
		if (nextProps.language !== this.props.language) {
			this.setDisplay(nextProps.input.value, nextProps.language);
		}
	}

	setDisplay = (dateString = '', language = this.props.defaults.language) => {
		const display = {};
		let date;
		date = moment(dateString);
		display.year = date.year();
		display.month = date.month() + 1;
		display.day = date.date();
		this.setState({ date, display });
	};

	onChangeInput = (value) => {
		this.onChangeInputValue(moment(value).valueOf());
	};

	onChangeInputValue = (unixtime) => {
		const { language, input } = this.props;
		const date = moment(unixtime);
		this.setDisplay(date.valueOf(), language);
		this.onChangeOpen(false);
		input.onChange(date.format());
	};

	onToogleOpen = (event) => {
		this.onChangeOpen(!this.state.focused);
	};

	onFocusChange = ({ focused }) => {
		this.onChangeOpen(focused);
	};

	onChangeOpen = (focused = false) => {
		this.setState({ focused });
	};

	renderValues = (display, valid) => {
		return (
			<div className="datefield-values-wrapper" onClick={this.onToogleOpen}>
				{FIELDS.map(({ key, label }) => (
					<FieldContent
						contentClassName="pointer dropdown-triangle"
						valid={valid}
						key={key}
					>
						{display[key] || label}
					</FieldContent>
				))}
			</div>
		);
	};

	isOutsideRange = (startDate, endDate) => (day) => {
		if (startDate && isInclusivelyBeforeDay(day, moment(startDate))) {
			return true;
		} else if (endDate && isInclusivelyAfterDay(day, moment(endDate))) {
			return true;
		}
		return false;
	};

	render() {
		const { focused, date, display } = this.state;
		const {
			meta: {
				// active = false,
				// error,
				// touched = false,
				invalid,
			},
			startDate,
			endDate,
		} = this.props;
		// const displayError = !active && touched && error;

		return (
			<div className="datefield-wrapper">
				<FieldWrapper
					{...this.props}
					onClick={this.onToogleOpen}
					valid={!invalid}
					hideUnderline={true}
				>
					{this.renderValues(display, invalid)}
				</FieldWrapper>
				<SingleDatePicker
					date={date} // momentPropTypes.momentObj or null
					onDateChange={this.onChangeInput} // PropTypes.func.isRequired
					focused={focused} // PropTypes.bool
					onFocusChange={this.onFocusChange} // PropTypes.func.isRequired
					keepOpenOnDateSelect={false}
					hideKeyboardShortcutsPanel={true}
					withPortal={true}
					numberOfMonths={1}
					isOutsideRange={this.isOutsideRange(startDate, endDate)}
					initialVisibleMonth={() => moment()}
				/>
			</div>
		);
	}
}

export default withConfig(DateField);
