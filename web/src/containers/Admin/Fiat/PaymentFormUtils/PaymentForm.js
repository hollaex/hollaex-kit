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

	renderCustomFields = (fields = {}, currentActiveTab = '') => {
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
										<div
											className={
												currentActiveTab && currentActiveTab === 'onRamp'
													? 'colorWrapper'
													: section.header.className
											}
										>
											{renderFields(
												section.header.fields,
												currentActiveTab && currentActiveTab !== 'onRamp'
													? true
													: false,
												getFieldDecorator,
												this.props.initialValues,
												currentActiveTab
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
			currentActiveTab = '',
			handleBack,
			pristine,
			valid,
		} = this.props;
		let requiredCount = (Object.keys(fields).length ?? 0) + 1;
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
		const btnEnabled = (pristine, valid, buttonSubmitting) => {
			if (
				valid &&
				((!pristine && !buttonSubmitting) || !pristine || !buttonSubmitting)
			) {
				return false;
			}
			return true;
		};

		return (
			<div className="payment-form-wrapper">
				<form onSubmit={handleSubmit(this.onSubmit)}>
					<div className="mt-5">
						<FormSection name="required">
							<div>
								{Object.keys(requiredFields).length ? (
									<div className="mb-2">REQUIRED</div>
								) : null}
								{this.renderCustomFields(requiredFields, currentActiveTab)}
							</div>
						</FormSection>
						<FormSection name="optional">
							<div>
								{Object.keys(optionalFields).length ? (
									<div className="config-content mb-2 mt-5">OPTIONAL</div>
								) : null}
								{this.renderCustomFields(optionalFields, currentActiveTab)}
							</div>
						</FormSection>
					</div>
					{currentActiveTab && currentActiveTab !== 'offRamp' ? (
						<div className="payment-form-wrapper center-content">
							<div
								onClick={() => this.props.addColumn(`section_${requiredCount}`)}
								className="anchor"
							>
								<PlusOutlined style={{ color: '#FFFFFF' }} /> Add more payment
								details
							</div>
						</div>
					) : null}
					<div className="btn-wrapper pt-5">
						<Button
							block
							type="ghost"
							className="minimal-btn"
							onClick={handleBack}
						>
							Back
						</Button>
						{currentActiveTab && currentActiveTab !== 'offRamp' ? (
							<Button
								block
								type="primary"
								htmlType="submit"
								className="green-btn minimal-btn"
								disabled={
									currentActiveTab && currentActiveTab === 'paymentAccounts'
										? buttonSubmitting
										: btnEnabled(pristine, valid, buttonSubmitting)
								}
							>
								{buttonTxt}
							</Button>
						) : null}
					</div>
				</form>
			</div>
		);
	}
}

export default reduxForm({
	form: 'PaymentForm',
	enableReinitialize: true,
})(FormWrapper);
