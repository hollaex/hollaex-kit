import React, { Component } from 'react';
import EventListener from 'react-event-listener';
import classnames from 'classnames';
import { FieldContent } from './FieldWrapper';

class DropdownDateOption extends Component {
	state = {
		isOpen: false,
	};

	toogleOpen = () => {
		if (!this.props.disabled) {
			this.setState({ isOpen: !this.state.isOpen });
		}
	};

	onClickItem = (index) => () => {
		if (this.props.onChange) {
			this.props.onChange(index, this.props.options[index]);
		}
	};

	renderOptions = (options) => (
		<div className="dropdown-options-wrapper dropdown-date show-scroll">
			{options.map((option, index) => (
				<div
					key={index}
					className="dropdown-option pointer"
					onClick={this.onClickItem(index)}
				>
					{option}
				</div>
			))}
		</div>
	);

	clickAwayListener = (event) => {
		this.setState({ isOpen: false });
	};

	render() {
		const { date, id, valid, format, options, disabled = false } = this.props;
		const { isOpen } = this.state;

		return (
			<div onClick={this.toogleOpen} className={id}>
				{isOpen && (
					<EventListener target="document" onClick={this.clickAwayListener} />
				)}
				<FieldContent
					contentClassName={classnames('dropdown-triangle', {
						pointer: !disabled,
						not_allowed_cursor: disabled,
					})}
					valid={valid}
				>
					{date.format(format) || id}
					{isOpen && this.renderOptions(options)}
				</FieldContent>
			</div>
		);
	}
}

export default DropdownDateOption;
