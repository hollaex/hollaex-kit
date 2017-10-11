import React, { Component } from 'react';
import classnames from 'classnames';
import FieldWrapper from './FieldWrapper';

class DropdownField extends Component {
  state = {
    isOpen: false,
    selectedItem: undefined
  }

  componentWillMount() {
    if (
      this.props.input.value ||
      this.props.input.value === false
    ) {
      this.setValue(this.props.input.value);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.input.value !== this.props.input.value) {
      this.setValue(nextProps.input.value);
    }
  }

  onToogleOpen = (event) => {
    event.preventDefault();
    this.onChangeOpen(!this.state.isOpen);
  }

  onChangeOpen = (isOpen = false) => {
    this.setState({ isOpen });
  }

  onSelectOption = (option) => () => {
    this.setState({ selectedItem: option, isOpen: false });
    this.props.input.onChange(option.value);
  }

  setValue = (value, change = false) => {
    const option = this.props.options.find((option) => option.value === value);
    if (option) {
      this.setState({ selectedItem: option });
      if (change) {
        this.props.input.onChange(option.value);
      }
    }
  }

  renderIcon = ({ icon = '', label = '' }) => {
    if (icon.indexOf('.') > 0) {
      return <img src={icon} alt={label} />
    }
    return;
  }
  renderOption = (option) => (
    <div
      key={`${this.props.input.name}-${option.value}`}
      onClick={this.onSelectOption(option)}
      className={classnames('dropdown-option', 'pointer')}
    >
      {this.renderIcon(option)}
      {option.label}
    </div>
  );

  renderOptions = (options) => (
    <div className={classnames('dropdown-options-wrapper')}>
      {options.map(this.renderOption)}
    </div>
  )

  render() {
    const { options, placeholder } = this.props;
    const { isOpen, selectedItem } = this.state;

    return (
      <FieldWrapper {...this.props} focused={isOpen}>
        <div className="dropdown-content dropdown-triangle" onClick={this.onToogleOpen}>
          {selectedItem && !isOpen ?
            this.renderOption(selectedItem):
            <div className="placeholder">Select an option</div>
          }
        </div>
        {isOpen && this.renderOptions(options)}
      </FieldWrapper>
    );
  }
}

export default DropdownField;
