import React, { Component } from 'react';
import classnames from 'classnames';

import { reduxForm, Field, reset } from 'redux-form';

import { Button } from '../../../components';
import InputField from '../../../components/Form/TradeFormFields/InputField';
import { required, minValue, maxValue, normalizeInt } from '../../../components/Form/validations';

import { LIMIT_VALUES } from '../../../config/constants';

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
  state = {
    formValues: {},
  }

  componentDidMount() {
    this.generateFormValues(this.props.type);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.type !== this.props.type) {
      this.generateFormValues(nextProps.type);
    }
  }

  generateFormValues = (type) => {
    const formValues = {
      size: {
        name: 'size',
        label: 'Amount',
        type: 'number',
        placeholder: '0.00',
        step: 0.0001,
        validate: [required, minValue(LIMIT_VALUES.SIZE.MIN), maxValue(LIMIT_VALUES.SIZE.MAX)],
        currency: 'BTC',
      },
    };

    if (type === 'limit') {
      formValues.price = {
        name: 'price',
        label: 'Price',
        type: 'number',
        placeholder: '0',
        validate: [required, minValue(LIMIT_VALUES.PRICE.MIN), maxValue(LIMIT_VALUES.PRICE.MAX)],
        normalize: normalizeInt,
        currency: 'USD',
      };
    }
    this.setState({ formValues });
  }

  render() {
    const { formValues } = this.state;
    const {
      currency, children, buttonLabel, handleSubmit,
      submitting, pristine, error, valid,
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
