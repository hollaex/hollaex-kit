import React, { Component } from 'react';
import classnames from 'classnames';
import FieldWrapper from './FieldWrapper';

class FileField extends Component {
	state = {
		filename: ''
	}
	onClick = (ev) => {
		if (this.fileInput) {
			this.fileInput.click();
		}
	}

	onChange = (ev) => {
		const file = ev.target.files[0];
		this.setState({ filename: file.name });
		this.props.input.onChange(file);
	}

	setRef = (el) => {
		this.fileInput = el;
	}

	render() {
		const { placeholder } = this.props;
		const { filename } = this.state;

		const input = {
			onChange: this.onChange,
			ref: this.setRef,
			multiple: false,
			accept: 'image/*',
			style: { display: 'none' },
		}

		return (
			<FieldWrapper {...this.props} onClick={this.onClick}>
				<div onClick={this.onClick} className={classnames('pointer', { placeholder: !filename})}>
					{filename ? filename : placeholder}
				</div>
				<input
					type="file"
					className="input_file"
					{...input}
				/>
			</FieldWrapper>
		);
	}
}

export default FileField;
