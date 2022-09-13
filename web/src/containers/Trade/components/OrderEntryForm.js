import React from 'react';
import { Collapse } from 'antd';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import STRINGS from '../../../config/localizedStrings';
import { Button } from '../../../components';
import renderFields from '../../../components/Form/factoryTradeFields';
import { isLoggedIn } from '../../../utils/token';

export const FORM_NAME = 'OrderEntryForm';

const validate = (values, props) => {
	const { evaluateOrder } = props;
	const error = {};
	error._error = evaluateOrder(values);
	return error;
};

const getFields = (formValues = {}, type = '', orderType = '') => {
	const fields = { ...formValues };

	if (type === 'market') {
		delete fields.price;
		delete fields.postOnly;
	}

	if (orderType !== 'stops') {
		delete fields.stop;
	}

	return fields;
};

const Form = ({
	children,
	buttonLabel,
	handleSubmit,
	submitting,
	pristine,
	error,
	valid,
	formValues,
	side,
	type,
	orderType,
	currencyName,
	outsideFormError,
	onReview,
	formKeyDown,
}) => {
	const fields = getFields(formValues, type, orderType);
	const errorText = error || outsideFormError;
	const hasPostOnly =
		Object.entries(fields).filter(([key]) => key === 'postOnly').length !== 0;
	return (
		<div className="trade_order_entry-form d-flex">
			<form
				className="trade_order_entry-form_inputs-wrapper"
				autocomplete="off"
				onSubmit={handleSubmit}
				onKeyDown={(e) => {
					if (!submitting && valid && !errorText && isLoggedIn())
						formKeyDown(e);
				}}
			>
				<div className="trade_order_entry-form_fields-wrapper">
					{Object.entries(fields)
						.filter(([key]) => key !== 'postOnly')
						.map(renderFields)}
					{hasPostOnly && (
						<Collapse defaultActiveKey={[]} bordered={false} ghost>
							<Collapse.Panel
								showArrow={false}
								header={
									<span className="underline-text">
										{STRINGS['ORDER_ENTRY_ADVANCED']}
									</span>
								}
								key="1"
							>
								{Object.entries(fields)
									.filter(([key]) => key === 'postOnly')
									.map(renderFields)}
							</Collapse.Panel>
						</Collapse>
					)}
					{errorText && (
						<div className="form-error warning_text font-weight-bold">
							{errorText}
						</div>
					)}
				</div>
				{children}
				<Button
					type="button"
					onClick={onReview}
					label={STRINGS.formatString(
						STRINGS['ORDER_ENTRY_BUTTON'],
						STRINGS[`SIDES_VALUES.${side}`] || '',
						currencyName
					).join(' ')}
					disabled={submitting || !valid || !!errorText || !isLoggedIn()}
					className={classnames('trade_order_entry-form-action', 'mb-1')}
				/>
			</form>
		</div>
	);
};

const EntryOrderForm = reduxForm({
	form: FORM_NAME,
	validate,
	enableReinitialize: true,
	// onSubmitSuccess: (result, dispatch) => dispatch(reset(FORM_NAME)),
})(Form);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) =>
	selector(state, 'price', 'size', 'side', 'type');

export default connect(mapStateToProps)(EntryOrderForm);
