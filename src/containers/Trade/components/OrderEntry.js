import React, { Component } from 'react';
import classnames from 'classnames';
import Review from './OrderEntryReview';
import Form from './OrderEntryForm';
import { formatNumber } from '../../../utils/currency';
import { evaluateOrder } from '../../../components/Form/validations';

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
  }

  changeTab = (activeTab) => () => {
    this.setState({ activeTab });
  }

  changeAction = (activeAction) => () => {
    this.setState({ activeAction });
  }

  evaluateOrder = (values) => {
    const side = this.state.activeAction;
    const type = this.state.activeTab;
    const { symbol, balance } = this.props;

    if (!balance[`${symbol}_balance`]) {
      return 'No balance';
    }

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

  render() {
    const { currencyName, onSubmitOrder, balance, symbol } = this.props
    const { activeTab, activeAction } = this.state;

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
        {balance[`${symbol}_balance`] &&
          <Form
            type={activeTab}
            buttonLabel={`${activeAction} ${currencyName}`}
            evaluateOrder={this.evaluateOrder}
            onSubmit={this.onSubmit}
          >
            <Review
              currency={FIAT_NAME}
            />
          </Form>
        }
      </div>
    );
  }
}

OrderEntry.defaultProps = {
  currencyName: 'Bitcoins',
}

export default OrderEntry;
