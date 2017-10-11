import React, { Component } from 'react';
import InputField from './InputField';

class FileField extends Component {

	onClick = (ev) => {
		this.fileInput.click();
	}

	onChange = (ev) => {
		this.props.input.onChange(ev.target.files[0]);
	}

	setRef = (el) => {
		this.fileInput = el;
	}

	render() {
		const { input, ...rest } = this.props;

		const myInput = {
			value: input.value ? input.value.name : '',
			onChange: () => {},
			readOnly: true,
		}
		return (
			<div>
				<InputField
					{...rest}
					type="text"
					input={myInput}
					onClick={this.onClick}
				/>
				<input
					type="file"
					className="input_file"
					multiple="false"
					accept="image/*"
					ref={this.setRef}
					onChange={this.onChange}
				/>
			</div>
		);
	}
}

export default FileField;
