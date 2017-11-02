import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import Review from './OrderEntryReview';
import Form, { FORM_NAME } from './OrderEntryForm';
import { formatNumber, formatFiatAmount } from '../../../utils/currency';
import { evaluateOrder, required, minValue, maxValue, normalizeInt, checkMarketPrice } from '../../../components/Form/validations';
import { Loader } from '../../../components';
import { LIMIT_VALUES, CURRENCIES } from '../../../config/constants';

const TYPES = [
  'market',
  'limit',
  // 'stop',
];

const SIDES = [
  'buy',
  'sell',
];

const FIAT_NAME = CURRENCIES.fiat.shortName;

class OrderEntry extends Component {
  state = {
    formValues: {},
    initialValues: {
      side: SIDES[0],
      type: TYPES[0],
    },
    orderPrice: 0,
    outsideFormError: '',
  }

  componentDidMount() {
    this.generateFormValues(this.state.activeTab);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.size !== this.props.size ||
      nextProps.side !== this.props.side ||
      nextProps.price !== this.props.price ||
      nextProps.type !== this.props.type
    ) {
      this.calculateOrderPrice(nextProps);
    }
  }

  calculateOrderPrice = (props) => {
    const { type, side } = props;
    const size = parseFloat(props.size || 0);
    const price = parseFloat(props.price || 0);

    let orderPrice = 0;
    if (props.side === 'sell') {
      const { bids } = props;
      orderPrice = checkMarketPrice(size, bids, type, side, price);
    } else {
      const { asks } = props;
      orderPrice = checkMarketPrice(size, asks, type, side, price);
    }

    let outsideFormError = '';

    if (type === 'market' && side === 'buy') {
      const values = {
        size, side, type, price,
      }
      const { symbol, balance } = props;

      outsideFormError = evaluateOrder(symbol, balance, values, type, side, orderPrice);
    }
    this.setState({ orderPrice, outsideFormError });
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
    const { currencyName, balance, symbol, type } = this.props
    const { initialValues, formValues, orderPrice, outsideFormError } = this.state;

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
          outsideFormError={outsideFormError}
        >
          <Review
            type={type}
            currency={FIAT_NAME}
            orderPrice={orderPrice}
            fees={fees}
            formatToCurrency={formatFiatAmount}
          />
        </Form>
      </div>
    );
  }
}

OrderEntry.defaultProps = {
  currencyName: 'Bitcoins',
}

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) => selector(state, 'price', 'size', 'side', 'type');

export default connect(mapStateToProps)(OrderEntry);
