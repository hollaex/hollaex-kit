import React, { Component } from 'react';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import { subtract } from '../utils';
import { formatFiatAmount } from '../../../utils/currency';

const calculateSpread = (asks, bids) => {
  const lowerAsk = asks.length > 0 ? asks[0][0]: 0;
  const higherBid = bids.length > 0 ? bids[0][0]: 0;
  if (lowerAsk && higherBid) {
    return formatFiatAmount(subtract(lowerAsk, higherBid));
  }
  return '-';
}

class Orderbook extends Component {
  state = {
    dataBlockHeight: 0,
  }

  componentDidMount() {
    this.scrollTop();
  }

  componentWillReceiveProps(nextProps) {
    // this.scrollTop();
  }

  setRefs = (key) => (el) => {
    this[key] = el;
  }

  scrollTop = () => {
    if (this.wrapper && this.spreadWrapper) {
      const maxContentHeight = this.wrapper.offsetHeight - this.spreadWrapper.offsetHeight;
      const accumulatedHeight = this.bidsWrapper.scrollHeight + this.asksWrapper.scrollHeight
      const dataBlockHeight = maxContentHeight / 2;
      const needScroll = accumulatedHeight > maxContentHeight;
      const askDif = this.asksWrapper.scrollHeight - dataBlockHeight;

      if (needScroll && askDif > 0) {
        this.wrapper.scrollTop = askDif;
      }
      this.setState({ dataBlockHeight });
    }
  }

  render() {
    const { asks, bids, symbol, fiatSymbol } = this.props;
    const { dataBlockHeight } = this.state;
    const blockStyle = dataBlockHeight > 0 ? {
      maxHeight: dataBlockHeight,
      minHeight: dataBlockHeight,
    } : {};

    return (
      <div className="trade_orderbook-wrapper d-flex flex-column f-1">
        <EventListener
          target="window"
          onResize={this.scrollTop}
        />
        <div className="trade_orderbook-headers d-flex">
          <div className="f-1 trade_orderbook-cell">PRICE ({fiatSymbol})</div>
          <div className="f-1 trade_orderbook-cell">AMOUNT ({symbol})</div>
        </div>
        <div
          ref={this.setRefs('wrapper')}
          className={classnames(
            'trade_orderbook-content',
            'f-1',
            'overflow-y'
          )}
        >
          <div
            className={classnames(
              'trade_orderbook-asks',
              'd-flex',
              'flex-column-reverse',
            )}
            style={blockStyle}
            ref={this.setRefs('asksWrapper')}
          >
            {asks.map(([price, amount], index) => (
              <div
                key={`ask-${index}`}
                className={classnames('d-flex', 'value-row', 'align-items-center')}
              >
                <div className="f-1 trade_orderbook-cell trade_orderbook-cell-price ask">{price}</div>
                <div className="f-1 trade_orderbook-cell trade_orderbook-cell-amount">{amount}</div>
              </div>
            ))}
          </div>
          <div
            className="trade_orderbook-spread d-flex align-items-center"
            ref={this.setRefs('spreadWrapper')}
          >
            <div className="trade_orderbook-spread-text">{`${calculateSpread(asks, bids)} ${fiatSymbol} `}</div>spread.
          </div>
          <div
            className={classnames(
              'trade_orderbook-bids',
              'd-flex',
              'flex-column',
            )}
            ref={this.setRefs('bidsWrapper')}
            style={blockStyle}
          >
            {bids.map(([price, amount], index) => (
              <div
                key={`bid-${index}`}
                className={classnames('d-flex', 'value-row', 'align-items-center')}
              >
                <div className="f-1 trade_orderbook-cell trade_orderbook-cell-price bid">{price}</div>
                <div className="f-1 trade_orderbook-cell trade_orderbook-cell-amount">{amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Orderbook.defaultProps = {
  asks: [],
  bids: [],
  ready: false,
}

export default Orderbook;
