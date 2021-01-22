import React, { Component } from 'react';
import EventListener from 'react-event-listener';
import classnames from 'classnames';
import keycode from 'keycode';
import { ReactSVG } from 'react-svg';
import FieldWrapper from './FieldWrapper';
import STRINGS from '../../../config/localizedStrings';

class DropdownField extends Component {
	state = {
		isOpen: false,
		visited: false,
		selectedItem: undefined,
		filter: '',
	};

	componentWillMount() {
		if (this.props.input.value || this.props.input.value === false) {
			this.setValue(this.props.input.value);
		} else if (this.props.defaultValue || this.props.defaultValue === false) {
			this.setValue(this.props.defaultValue, true);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.input.value !== this.props.input.value) {
			this.setValue(nextProps.input.value);
		}
	}

	onToogleOpen = (event) => {
		event.preventDefault();
		if (!this.props.disabled) {
			this.onChangeOpen(!this.state.isOpen);
			if (this.input && this.props.autocomplete) {
				setTimeout(() => {
					this.input.focus();
				}, 150);
			}
		}
	};

	onChangeOpen = (isOpen = false) => {
		this.setState({ isOpen, visited: true });
	};

	onSelectOption = (option, change = true) => () => {
		if (option.value === undefined) {
			this.setState({ isOpen: false, filter: '' });
		} else {
			this.setState({ selectedItem: option, isOpen: false, filter: '' });
			if (change) {
				this.props.input.onChange(option.value);
			}
		}
	};

	setValue = (value, change = false) => {
		const option = this.props.options.find((option) => option.value === value);
		if (option) {
			this.onSelectOption(option, change)();
		} else {
			this.onChangeOpen(false);
		}
	};

	setValueByLabel = (label) => {
		const option = this.props.options.find(this.filterOption(label));
		if (option) {
			this.onSelectOption(option)();
		} else {
			this.onChangeOpen(false);
		}
	};

	renderIcon = ({ icon = '', label = '' }) => {
		if (icon && typeof icon === 'string') {
			return icon.indexOf('.svg') > 0 ? (
				<ReactSVG
					src={icon}
					fallback={() => <span>{label}</span>}
					className={classnames('icon', 'option-icon')}
				/>
			) : (
				<img className="icon" src={icon} alt={label} />
			);
		}
		return icon;
	};

	renderOption = (option, index) => (
		<div
			id={`${this.props.input.name}-${option.value}-${index}`}
			key={`${this.props.input.name}-${option.value}-${index}`}
			onClick={this.onSelectOption(option)}
			className={classnames('dropdown-option', {
				pointer: !this.props.disabled,
			})}
		>
			{this.renderIcon(option)}
			{option.label}
		</div>
	);

	renderOptions = (options) => (
		<div className={classnames('dropdown-options-wrapper')}>
			{options.length > 0
				? options.map(this.renderOption)
				: this.renderOption(
						{ value: undefined, label: STRINGS['NO_OPTIONS'] },
						0
				  )}
		</div>
	);

	clickAwayListener = (event) => {
		if (
			this.state.isOpen &&
			!event.target.id &&
			event.target.className.indexOf('dropdown') === -1
		) {
			this.onChangeOpen(false);
		}
	};

	onChangeAutocomplete = (event) => {
		const filter = event.target.value;
		this.setState({ filter });
	};

	filterOption = (filter) => {
		const filterLC = filter.toLowerCase();
		return (option) => {
			const label = option.label.toLowerCase();
			return label.indexOf(filterLC) !== -1;
		};
	};

	setRefInput = (el) => {
		this.input = el;
	};

	onKeyDownHandler = (event) => {
		switch (keycode(event)) {
			case 'esc':
				this.onChangeOpen(false);
				break;
			case 'enter':
				this.setValueByLabel(this.state.filter);
				break;
			default:
				break;
		}
	};
	render() {
		const { options, placeholder, autocomplete, disabled } = this.props;
		const { isOpen, selectedItem, filter, visited } = this.state;

		const filteredOptions = autocomplete
			? options.filter(this.filterOption(filter))
			: options;
		return (
			<FieldWrapper {...this.props} focused={isOpen} visited={visited}>
				<EventListener target="document" onClick={this.clickAwayListener} />
				{autocomplete && isOpen && (
					<EventListener target="document" onKeyDown={this.onKeyDownHandler} />
				)}
				<div
					className={classnames('dropdown-content', {
						'dropdown-triangle': !disabled,
						disabled,
					})}
					onClick={this.onToogleOpen}
				>
					{autocomplete && (
						<input
							id="input-autocomplete"
							className={classnames('input_field-input', { hidden: !isOpen })}
							type="text"
							onChange={this.onChangeAutocomplete}
							placeholder={placeholder}
							ref={this.setRefInput}
							value={filter}
						/>
					)}
					{selectedItem && !isOpen ? (
						this.renderOption(selectedItem)
					) : (
						<div
							className={classnames('dropdown-placeholder placeholder', {
								hidden: autocomplete && isOpen,
							})}
						>
							{placeholder}
						</div>
					)}
				</div>
				{isOpen && this.renderOptions(filteredOptions)}
			</FieldWrapper>
		);
	}
}

DropdownField.defaultProps = {
	autocomplete: false,
};
export default DropdownField;
