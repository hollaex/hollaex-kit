import React, { Component, Fragment } from 'react';
import { reduxForm } from 'redux-form';
import { Button } from 'antd';
import _findLast from 'lodash/findLast';
import _findLastKey from 'lodash/findLastKey';

import renderFields from '../../../components/AdminForm/utils';

class FormWrapper extends Component {
	componentDidMount() {
		if (this.props.forceValidate) {
			this.props.form.validateFields();
		}
	}

	onSubmit = (formProps) => {
		this.props.handleSubmitLinks(formProps);
	};

	getNewIndexFromFields = (fields = {}) => {
		const finalColumn = _findLast(fields);
		if (finalColumn && finalColumn.header && finalColumn.header.fields) {
			const headerKey = _findLastKey(finalColumn.header.fields);
			if (headerKey) {
				let count = headerKey.replace('column_header_', '');
				return isNaN(count) ? count : parseInt(count, 10) + 1;
			}
		}
		return 1;
	};

	renderCustomFields = (fields = {}) => {
		const { getFieldDecorator } = this.props.form;
		let count = this.getNewIndexFromFields(fields);
		return (
			<div className="custom-form-wrapper">
				{Object.keys(fields)
					.filter((key) => typeof fields[key] !== 'string')
					.map((key, index) => {
						let section = fields[key];
						return (
							<Fragment key={index}>
								<div className={section.className}>
									{section.header ? (
										<Fragment>
											<div className={section.header.className}>
												{renderFields(
													section.header.fields,
													getFieldDecorator,
													this.props.initialValues
												)}
											</div>
											<span className="divider-horizontal"></span>
										</Fragment>
									) : null}
									{section.content ? (
										<div className={section.content.className}>
											{renderFields(
												section.content.fields,
												getFieldDecorator,
												this.props.initialValues
											)}
										</div>
									) : null}
									{section.bottomLink ? <div>{section.bottomLink}</div> : null}
								</div>
								{/* {index < Object.keys(fields).length - 1 ? ( */}
								<span className="divider-vertical"></span>
								{/* ) : null} */}
							</Fragment>
						);
					})}
				<div className="section-wrapper center-content">
					<Button
						block
						type="primary"
						onClick={() => this.props.addColumn(`section_${count}`)}
						className="green-btn"
					>
						Add column
					</Button>
				</div>
			</div>
		);
	};

	render() {
		const {
			fields,
			initialValues = {},
			customFields = false,
			buttonTxt = 'Save',
			handleSubmit,
		} = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<form>
					{customFields
						? this.renderCustomFields(fields)
						: renderFields(fields, getFieldDecorator, initialValues)}
					<Button
						block
						type="primary"
						htmlType="submit"
						className="green-btn minimal-btn"
						onClick={handleSubmit(this.onSubmit)}
					>
						{buttonTxt}
					</Button>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: 'FooterLinkForm',
	enableReinitialize: true,
})(FormWrapper);
