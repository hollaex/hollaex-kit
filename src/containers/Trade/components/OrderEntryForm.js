import React, { Component } from 'react';
import classnames from 'classnames';

import { reduxForm, Field, reset } from 'redux-form';

import { Button } from '../../../components';
import InputField from '../../../components/Form/TradeFormFields/InputField';

const FORM_NAME = 'OrderEntryForm';

const renderFormField = ([key, values], index) => {
  return <Field key={key} component={InputField} {...values} />
};

const validate = (values, props) => {
  const { evaluateOrder } = props;
  const error = {};
  error._error = evaluateOrder(values);
  return error;
}

class Form extends Component {
  render() {
    const {
      currency, children, buttonLabel, handleSubmit,
      submitting, pristine, error, valid, formValues,
    } = this.props;

    return (
      <div className="trade_order_entry-form d-flex">
        <form
          className="trade_order_entry-form_inputs-wrapper"
          onSubmit={handleSubmit}
        >
          {Object.entries(formValues).map(renderFormField)}
          {error && <div className="warning_text">{error}</div>}
          {children}
          <Button
            label={buttonLabel}
            disabled={pristine || submitting || !valid}
            className={classnames(
              'trade_order_entry-form-action'
            )}
          />
        </form>
      </div>
    );
  }
}

Form.defaultProps = {
  type: 'market',
  currency: 'USD'
}

export default reduxForm({
  form: FORM_NAME,
  validate,
  onSubmitSuccess: (result, dispatch) => dispatch(reset(FORM_NAME)),
})(Form);
