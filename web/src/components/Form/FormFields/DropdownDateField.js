import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { range } from 'lodash';
import FieldWrapper from './FieldWrapper';
import DropdownDateOption from './DropdownDateOption';
import withConfig from 'components/ConfigProvider/withConfig';

const FIELDS = [
	{ key: 'year', label: 'Year' },
	{ key: 'month', label: 'Month' },
	{ key: 'day', label: 'Day' },
];
const LIMIT_YEARS = 100;

const FORMATS = {
	en: {
		year: 'YYYY',
		month: 'MM',
		day: 'DD',
	},
};

const generateDateLimits = (yearsBack = LIMIT_YEARS, yearsForward = 0) => {
	const nowMoment = moment();
	return {
		en: {
			maxYears: nowMoment.year() + yearsForward,
			minYears: nowMoment.year() - yearsBack,
			year: range(
				nowMoment.year() - yearsBack,
				nowMoment.year() + (yearsForward || 1)
			).reverse(),
		},
	};
};

class DropdownDateField extends Component {
	constructor(props) {
		super(props);
		const {
			defaults: { language: DEFAULT_LANGUAGE },
		} = this.props;

		this.state = {
			language: DEFAULT_LANGUAGE,
			focused: false,
			display: {
				year: '',
				month: '',
				day: '',
			},
			date: moment(),
			unixtime: 0,
			limits: {},
		};
	}

	componentWillMount() {
		let limits = {};

		if (this.props.addYears) {
			limits = generateDateLimits(this.props.yearsBefore, this.props.addYears);
		} else {
			limits = generateDateLimits();
		}
		this.setLimits(limits);
		this.setDisplay(limits, this.props.input.value, this.props.language);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.language !== this.props.language) {
			this.setDisplay(
				this.state.limits,
				nextProps.input.value,
				nextProps.language
			);
		}
	}

	setLimits = (limits) => {
		this.setState({ limits: limits || generateDateLimits() });
	};

	setDisplay = (
		limits,
		dateString = '',
		language = this.props.defaults.language
	) => {
		const display = {};
		let dateUnixtime = moment(dateString || new Date()).valueOf();
		moment.locale(language);
		const date = moment(dateUnixtime);
		moment.locale(this.props.defaults.language);
		display.en = {
			...limits.en,
			month: moment.months(),
			day: range(1, date.daysInMonth() + 1),
		};
		display[language] = {
			...limits.en,
			month: moment.months(),
			day: range(1, date.daysInMonth() + 1),
		};
		moment.locale(language);
		this.setState({ display, date, unixtime: date.valueOf(), language });
	};

	onChangeOption = (key) => (index, value) => {
		const { input } = this.props;
		const { unixtime, limits, language } = this.state;

		const date = moment(unixtime);
		if (key === 'year') {
			date.year(value);
		} else if (key === 'month') {
			date.month(index);
		} else if (key === 'day') {
			date.date(value);
		}

		this.setDisplay(limits, date.format(), language);
		input.onChange(date.format());
	};

	renderFields = (date, options, valid = false, formats, disabled) => {
		return (
			<div className="datefield-values-wrapper">
				{FIELDS.map(({ key, format }, index) => {
					return (
						<DropdownDateOption
							date={date}
							format={formats[key]}
							valid={valid}
							id={key}
							key={key}
							options={options[key]}
							onChange={this.onChangeOption(key)}
							disabled={disabled}
						/>
					);
				})}
			</div>
		);
	};

	render() {
		const { display, date, language } = this.state;
		const {
			meta: { invalid },
			disabled = false,
		} = this.props;
		return (
			<FieldWrapper
				{...this.props}
				valid={!invalid}
				hideUnderline={true}
				className={classnames('datefield-wrapper', { disabled })}
			>
				{display[language] &&
					this.renderFields(
						date,
						display[language],
						!invalid,
						FORMATS['en'],
						disabled
					)}
			</FieldWrapper>
		);
	}
}

export default withConfig(DropdownDateField);
