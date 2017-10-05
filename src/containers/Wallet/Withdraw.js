import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import { Button, IconTitle } from '../../components';
import renderFields from '../../components/Form/factoryFields';
import { required, validAddress, minValue, maxValue, checkBalance } from '../../components/Form/validations';
import { ICONS } from '../../config/constants';

import {
  MIN_VALUE_ERROR, MIN_VALUE_WITHDRAWAL,
  MAX_VALUE_ERROR, MAX_VALUE_WITHDRAWAL,
  LOWER_BALANCE, INVALID_ADDRESS,
} from './constants';

const generateFields = (symbol = '', available, fee) => ({
  address: {
    type: 'text',
    label: 'Destination address:',
    placeholder: 'Type the address',
    validate: [required, validAddress(symbol, INVALID_ADDRESS)],
  },
  amount: {
    type: 'number',
    label: 'Bitcoin amount to send',
    placeholder: 'Type the amount',
    step: 0.1,
    min: MIN_VALUE_WITHDRAWAL,
    max: MAX_VALUE_WITHDRAWAL,
    validate: [
      required,
      minValue(MIN_VALUE_WITHDRAWAL, MIN_VALUE_ERROR),
      maxValue(MAX_VALUE_WITHDRAWAL, MAX_VALUE_ERROR),
      checkBalance(available, LOWER_BALANCE, fee)
    ],
  }
});

class Form extends Component {
  state = {
    fields: {},
  }

  componentDidMount() {
    this.generateFields(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.symbol !== this.props.symbol ||
      nextProps.available !== this.props.available ||
      nextProps.fee !== this.props.fee
    ) {
      this.generateFields(nextProps);
    }
  }

  generateFields({ symbol, available, fee }) {
    const fields = generateFields(symbol, available, fee);
    this.setState({ fields });
  }

  render() {
    const { handleSubmit, submitting, pristine, error, valid, children } = this.props;
    const { fields } = this.state;
    return (
      <form onSubmit={handleSubmit} className="w-100">
        <div className="w-100">
          {renderFields(fields)}
          {error && <div className="warning_text">{error}</div>}
        </div>
        <Button
          label="Send"
          disabled={pristine || submitting || !valid}
        />
      </form>
    );
  }
}

export default reduxForm({
  form: 'WithdrawalForm',
})(Form);
