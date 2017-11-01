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

const ACTIONS = [
  'buy',
  'sell',
];

const FIAT_NAME = 'USD';

class OrderEntry extends Component {
  state = {
    activeTab: TYPES[0],
    activeAction: ACTIONS[0],
    formValues: {},
  }

  componentDidMount() {
    this.generateFormValues(this.state.activeTab);
  }

  changeTab = (activeTab) => () => {
    this.generateFormValues(activeTab);
    this.setState({ activeTab });
  }

  changeAction = (activeAction) => () => {
    this.setState({ activeAction });
  }

  evaluateOrder = (values) => {
    const side = this.state.activeAction;
    const type = this.state.activeTab;
    const { symbol, balance } = this.props;


    return evaluateOrder(symbol, balance, values, type, side);
  }

  onSubmit = (values) => {
    const order = {
      side: this.state.activeAction,
      type: this.state.activeTab,
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
    const { currencyName, onSubmitOrder, balance, symbol } = this.props
    const { activeTab, activeAction, formValues } = this.state;

    if (!balance.hasOwnProperty(`${symbol}_balance`)) {
      return <Loader relative={true} background={false} />;
    }

    return (
      <div className={classnames('trade_order_entry-wrapper', activeTab, 'd-flex', 'flex-column')}>
        <div className="trade_order_entry-selector d-flex">
          {TYPES.map((tab, index) =>
            <div
              key={`type-${index}`}
              className={classnames(
                'text-uppercase', 'text-center', 'pointer',
                { active: activeTab === tab }
              )}
              onClick={this.changeTab(tab)}
            >{tab}</div>
          )}
        </div>
        <div className="trade_order_entry-action_selector d-flex">
          {ACTIONS.map((action, index) =>
            <div
              key={`action-${index}`}
              className={classnames(
                'text-uppercase', 'd-flex', 'justify-content-center', 'align-items-center', 'pointer',
                { active: activeAction === action }
              )}
              onClick={this.changeAction(action)}
            >{action}</div>
          )}
        </div>
        <Form
          type={activeTab}
          buttonLabel={`${activeAction} ${currencyName}`}
          evaluateOrder={this.evaluateOrder}
          onSubmit={this.onSubmit}
          formValues={formValues}
          initialValues={{
            price: 0,
            size: 0,
            side: activeAction,
          }}
        >
          <Review
            currency={FIAT_NAME}
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
