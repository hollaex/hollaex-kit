import React, { Component } from 'react';
import classnames from 'classnames';

import Review from './OrderEntryReview';
import Form from './OrderEntryForm';
import { formatNumber } from '../../../utils/currency';
import { evaluateOrder, required, minValue, maxValue, normalizeInt } from '../../../components/Form/validations';
import { Loader } from '../../../components';
import { LIMIT_VALUES } from '../../../config/constants';

const TYPES = [
  'market',
  'limit',
  // 'stop',
];

const SIDES = [
  'buy',
  'sell',
];

const FIAT_NAME = 'USD';

class OrderEntry extends Component {
  state = {
    formValues: {},
    initialValues: {
      side: SIDES[0],
      type: TYPES[0],
    },
    marketPrice: 0,
  }

  componentDidMount() {
    this.generateFormValues(this.state.activeTab);
  }

  evaluateOrder = (values) => {
    const { side, type } = values;
    const { symbol, balance } = this.props;

    return evaluateOrder(symbol, balance, values, type, side);
  }

  onSubmit = (values) => {
    const order = {
      ...values,
      size: formatNumber(values.size, 4),
      symbol: this.props.symbol,
    }

    if (values.price) {
      order.price = formatNumber(values.price);
    }

    return this.props.submitOrder(order);
  }

  generateFormValues = (type) => {
    const formValues = {
      type: {
        name: 'type',
        type: 'tab',
        options: TYPES,
        validate: [required],
      },
      side: {
        name: 'side',
        type: 'select',
        options: SIDES,
        validate: [required]
      },
      size: {
        name: 'size',
        label: 'Amount',
        type: 'number',
        placeholder: '0.00',
        step: 0.0001,
        validate: [required, minValue(LIMIT_VALUES.SIZE.MIN), maxValue(LIMIT_VALUES.SIZE.MAX)],
        currency: 'BTC',
      },
      price: {
        name: 'price',
        label: 'Price',
        type: 'number',
        placeholder: '0',
        validate: [required, minValue(LIMIT_VALUES.PRICE.MIN), maxValue(LIMIT_VALUES.PRICE.MAX)],
        normalize: normalizeInt,
        currency: 'USD',
      }
    };
    
    this.setState({ formValues });
  }

  render() {
    const { currencyName, onSubmitOrder, balance, symbol } = this.props
    const { initialValues, formValues, marketPrice } = this.state;

    const fees = 0;

    if (!balance.hasOwnProperty(`${symbol}_balance`)) {
      return <Loader relative={true} background={false} />;
    }

    return (
      <div className={classnames('trade_order_entry-wrapper', 'd-flex', 'flex-column')}>
        <Form
          currencyName={currencyName}
          evaluateOrder={this.evaluateOrder}
          onSubmit={this.onSubmit}
          formValues={formValues}
          initialValues={initialValues}
        >
          <Review
            currency={FIAT_NAME}
            marketPrice={marketPrice}
            fees={fees}
            orderTotal={marketPrice + fees}
          />
        </Form>
      </div>
    );
  }
}

OrderEntry.defaultProps = {
  currencyName: 'Bitcoins',
}

export default OrderEntry;
