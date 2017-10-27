import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';

import { reduxForm, Field } from 'redux-form';

import InputField from '../../../components/Form/TradeFormFields/InputField';
import { required, minValue, maxValue, normalizeInt } from '../../../components/Form/validations';

import { LIMIT_VALUES } from '../../../config/constants';

const renderFormField = ([key, values], index) => {
  return <Field key={key} component={InputField} {...values} />
};

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
    const { currency, children, buttonLabel, handleSubmit } = this.props;

    return (
      <div className="trade_order_entry-form d-flex">
        <form className="trade_order_entry-form_inputs-wrapper">
          {Object.entries(formValues).map(renderFormField)}
          {children}
          <div
            className="trade_order_entry-form-action text-uppercase d-flex justify-content-center align-items-center pointer"
            onClick={handleSubmit}
          >
            {buttonLabel}
          </div>
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
  form: 'OrderEntry',
})(Form);
