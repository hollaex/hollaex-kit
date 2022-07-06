import React, { Component, Fragment } from 'react';
import { reduxForm, FormSection } from 'redux-form';
import { Button } from 'antd';
import _findLast from 'lodash/findLast';
import _findLastKey from 'lodash/findLastKey';
import { PlusOutlined } from '@ant-design/icons';

import renderFields from 'components/AdminForm/utils';

class FormWrapper extends Component {
	componentDidMount() {
		if (this.props.forceValidate) {
			this.props.form.validateFields();
		}
	}

	onSubmit = (formProps) => {
		return this.props.handleSubmitLinks(formProps);
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
		return (
			<div className="custom-form-wrapper flex-direction-column">
				{Object.keys(fields)
					.filter((key) => typeof fields[key] !== 'string')
					.map((key, index) => {
						let section = fields[key];
						return (
							<Fragment key={index}>
								<div className={section.className}>
									<Fragment>
										<div className={section.header.className}>
											{renderFields(
												section.header.fields,
												getFieldDecorator,
												this.props.initialValues
											)}
										</div>
									</Fragment>
								</div>
							</Fragment>
						);
					})}
			</div>
		);
	};

	render() {
		const {
			fields,
			buttonTxt = 'Save',
			handleSubmit,
			buttonSubmitting,
		} = this.props;
		let requiredCount = this.getNewIndexFromFields(fields);
		let requiredFields = {};
		let optionalFields = {};
		Object.keys(fields).forEach((item) => {
			if (fields[item].isRequired) {
				requiredFields = {
					...requiredFields,
					[item]: fields[item],
				};
			} else {
				optionalFields = {
					...optionalFields,
					[item]: fields[item],
				};
			}
		});
		return (
			<div>
				<form onSubmit={handleSubmit(this.onSubmit)}>
					<div className="mt-5">
						<FormSection name="required">
							<div>
								{Object.keys(requiredFields).length ? (
									<div className="mb-2">REQUIRED</div>
								) : null}
								{this.renderCustomFields(requiredFields)}
							</div>
						</FormSection>
						<FormSection name="optional">
							<div>
								{Object.keys(optionalFields).length ? (
									<div className="config-content mb-2 mt-5">OPTIONAL</div>
								) : null}
								{this.renderCustomFields(optionalFields)}
							</div>
						</FormSection>
					</div>
					<div className="payment-form-wrapper center-content">
						<div
							onClick={() => this.props.editColumn(`section_${requiredCount}`)}
							className="anchor"
						>
							<PlusOutlined style={{ color: '#FFFFFF' }} /> Add more payment
							details
						</div>
					</div>
					<Button
						block
						type="primary"
						htmlType="submit"
						className="green-btn minimal-btn"
						disabled={buttonSubmitting}
					>
						{buttonTxt}
					</Button>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: 'PaymentForm',
	enableReinitialize: true,
})(FormWrapper);
