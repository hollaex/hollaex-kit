import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { reduxForm, reset, formValueSelector } from 'redux-form';

import STRINGS from '../../../config/localizedStrings';
import { Button } from '../../../components';
import renderFields from '../../../components/Form/factoryTradeFields';

export const FORM_NAME = 'OrderEntryForm';

const validate = (values, props) => {
  const { evaluateOrder } = props;
  const error = {};
  error._error = evaluateOrder(values);
  return error;
}

const getFields = (formValues = {}, type = '') => {
  if (type === 'market') {
    const fields = {...formValues};
    delete fields.price;
    return fields;
  }
  return formValues
}

const Form = ({
  children, buttonLabel, handleSubmit,
  submitting, pristine, error, valid, formValues,
  side, type, currencyName, outsideFormError
}) => {
  const fields = getFields(formValues, type);
  const errorText = error || outsideFormError;

  return (
    <div className="trade_order_entry-form d-flex">
      <form
        className="trade_order_entry-form_inputs-wrapper"
        onSubmit={handleSubmit}
      >
        <div className="trade_order_entry-form_fields-wrapper">
          {Object.entries(fields).map(renderFields)}
          {errorText && <div className="form-error warning_text font-weight-bold">{errorText}</div>}
        </div>
        {children}
        <Button
          label={STRINGS.formatString(STRINGS.ORDER_ENTRY_BUTTON, STRINGS.SIDES_VALUES[side] || '', currencyName).join(' ')}
          disabled={pristine || submitting || !valid || !!errorText}
          className={classnames(
            'trade_order_entry-form-action'
          )}
        />
      </form>
    </div>
  );
}

const EntryOrderForm = reduxForm({
  form: FORM_NAME,
  validate,
  onSubmitSuccess: (result, dispatch) => dispatch(reset(FORM_NAME)),
})(Form);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) => selector(state, 'price', 'size', 'side', 'type');

export default connect(mapStateToProps)(EntryOrderForm);
