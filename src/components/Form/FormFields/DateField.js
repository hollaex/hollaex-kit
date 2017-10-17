import React, { Component } from 'react';
import classnames from 'classnames';
import FieldWrapper, { FieldContent } from './FieldWrapper';
import { getFormattedDate } from '../../../utils/string';

class DateField extends Component {
  state = {
    isOpen: false,
    value: undefined,
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
    const splitedDate = date.split('-');
    return {
      year: splitedDate[0],
      month: splitedDate[1],
      day: splitedDate[2],
    }
  }

  onChangeInput = (value) => {
    const date = getFormattedDate(value);
    const display = this.calculateDisplay(date);
    this.setState({ value, display });
  }

  onChange = (event) => {
    const { value } = event.target;
    if (value) {
      const date = getFormattedDate(value);
      this.onChangeInput(date);
      this.props.input.onChange(date);
    }
  }

  onToogleOpen = (event) => {
    event.preventDefault();
    this.onChangeOpen(!this.state.isOpen);
  }

  onChangeOpen = (isOpen = false) => {
    this.setState({ isOpen });
    if (isOpen && this.input) {
      this.input.focus();
    }
  }

  clickAwayListener = (event) => {
    if (
      this.state.isOpen &&
      !event.target.id &&
      event.target.className.indexOf('dropdown') === -1
    ) {
      this.onChangeOpen(false);
    }
  }

  setInputRef = (el) => {
    this.input = el;
  }

  renderValues = (display, valid) => {
    return (
      <div className="datefield-values-wrapper" onClick={this.onToogleOpen}>
        <FieldContent contentClassName="pointer" valid={valid}>
          {display.year || 'Year'}
        </FieldContent>
        <FieldContent contentClassName="pointer" valid={valid}>
          {display.month || 'Month'}
        </FieldContent>
        <FieldContent contentClassName="pointer" valid={valid}>
          {display.day || 'Day'}
        </FieldContent>
      </div>
    );
  }
  render() {
    console.log(this.props)
    const { isOpen, value, display, min, max } = this.state;
    const {
      input,
      meta: { active = false, error, touched = false, invalid },
      ...rest,
    } = this.props;
    const displayError = !active && touched && error;

    return (
      <div  className="datefield-wrapper">
        <FieldWrapper
          {...this.props}
          valid={!invalid}
          hideUnderline={true}
        >
          {this.renderValues(display, invalid)}
        </FieldWrapper>
        <input
          {...rest}
          type="date"
          onChange={this.onChange}
          value={value}
          id={`${input.name}-date`}
        />
      </div>
    )
  }
}

export default DateField;
