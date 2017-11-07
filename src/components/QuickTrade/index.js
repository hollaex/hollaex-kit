import React, { Component } from 'react';
import classnames from 'classnames';

import { Button, CurrencyBall } from '../../components';

import { FLEX_CENTER_CLASSES, ICONS, CURRENCIES } from '../../config/constants';
import { fiatShortName, fiatFormatToCurrency, fiatSymbol } from '../../utils/currency';

const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'flex-column'];
const TEXTS = {
  TITLE: 'Quick',
  REVIEW: 'Review',
  ORDER: 'order',
  TOTAL_COST: 'Total cost',
}

const SIDES = ['buy', 'sell'];

const ToogleButton = ({ onToogle, values, selected }) => (
  <div className={classnames('toogle_button-wrapper', 'd-flex')}>
    <div className="toogle-side_line f-1"></div>
    <div className={classnames(
      'toogle-content', 'f-0', ...FLEX_CENTER_CLASSES,
    )}>
      <div className={classnames({ selected: values[0] === selected })}>{values[0]}</div>
      <div
        onClick={onToogle}
        className={classnames(
          'toogle-action_button',
          {
            left: values[0] === selected,
            right: values[1] === selected,
          }
        )}
      >
        <div className="toogle-action_button-display"></div>
      </div>
      <div className={classnames({ selected: values[1] === selected })}>{values[1]}</div>
    </div>
    <div className="toogle-side_line f-1"></div>
  </div>
);

const ReviewBlock = ({ value }) => (
  <div className={classnames('review-block-wrapper', 'd-flex', 'flex-column')}>
    <div className="font-weight-bold text-center">{TEXTS.TOTAL_COST}</div>
    <div className="d-flex currency-wrapper">
      <CurrencyBall symbol={fiatSymbol} name={fiatShortName} size="m" />
      {fiatFormatToCurrency(value)}
    </div>
  </div>
);

class QuickTrade extends Component {
  state = {
    side: SIDES[0],
  }

  onToogleSide = () => {
    const side = this.state.side === SIDES[0] ? SIDES[1] : SIDES[0];
    this.setState({ side });
  }

  render() {
    const { onReviewQuickTrade } = this.props;
    const { side } = this.state;
    return (
      <div className={classnames('quick_trade-wrapper', ...GROUP_CLASSES, 'b')}>
        <div className={classnames('quick_trade-section_wrapper', ...GROUP_CLASSES, 'c')}>
          <img src={ICONS.CHECK} alt="" />
          <div className="title">{`${TEXTS.TITLE} ${side}`}</div>
        </div>
        <div className={classnames('quick_trade-section_wrapper', ...GROUP_CLASSES, 'c')}>
          <ToogleButton
            values={SIDES}
            onToogle={this.onToogleSide}
            selected={side}
          />
        </div>
        <div className={classnames('quick_trade-section_wrapper', ...GROUP_CLASSES, 'c')}>
          input
        </div>
        <div className={classnames('quick_trade-section_wrapper', ...GROUP_CLASSES, 'c')}>
          <ReviewBlock
            value={122121.125}
          />
        </div>
        <div className={classnames('quick_trade-section_wrapper', ...GROUP_CLASSES, 'c')}>
          <Button
            label={`${TEXTS.REVIEW} ${side} ${TEXTS.ORDER}`}
            onClick={onReviewQuickTrade}
            disabled={!onReviewQuickTrade}
          />
        </div>
      </div>
    );
  }
}

export default QuickTrade;
