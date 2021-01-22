import React from 'react';
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
					{Object.entries(fields).map(renderFields)}
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
					className={classnames('trade_order_entry-form-action')}
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
