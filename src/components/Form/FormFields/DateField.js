import React, { Component } from 'react';
import FieldWrapper, { FieldContent } from './FieldWrapper';
import { getFormattedDate } from '../../../utils/string';
import { SingleDatePicker, isInclusivelyAfterDay, isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment';

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
    }
  }

  componentDidMount() {
    if (this.props.input.value) {
      this.onChangeInput(this.props.input.value);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.input.value !== this.props.input.value) {
      this.onChangeInput(nextProps.input.value);
    }
  }

  calculateDisplay = (date = '') => {
    const splitedDate =  getFormattedDate(date).split('-');
    return {
      year: splitedDate[0],
      month: splitedDate[1],
      day: splitedDate[2],
    }
  }

  onChangeInput = (value) => {
    const date = moment(value);
    const display = this.calculateDisplay(date);
    this.setState({ date, display });
    this.props.input.onChange(date.format());
  }

  onToogleOpen = (event) => {
    this.onChangeOpen(!this.state.focused);
  }

  onFocusChange = ({ focused }) => {
    this.onChangeOpen(focused);
  }

  onChangeOpen = (focused = false) => {
    this.setState({ focused });
  }

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
  }

  isOutsideRange = (startDate, endDate) => (day) => {
    if (startDate && isInclusivelyBeforeDay(day, moment(startDate))) {
      return true;
    } else if (endDate && isInclusivelyAfterDay(day, moment(endDate))) {
      return true;
    }
    return false;
  }

  render() {
    const { focused, date, display } = this.state;
    const {
      meta: {
        // active = false,
        // error,
        // touched = false,
        invalid
      },
      startDate,
      endDate,
    } = this.props;

    // const displayError = !active && touched && error;

    return (
      <div className="datefield-wrapper">
        <FieldWrapper
          {...this.props}
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
    )
  }
}

export default DateField;
