import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import EventListener from 'react-event-listener';
import { bindActionCreators } from 'redux';

import { AppBar, QuickTrade, Footer } from '../../components';

import {
  APP_TITLE, FLEX_CENTER_CLASSES,
} from '../../config/constants';

import { requestQuickTrade } from '../../actions/orderbookAction';

import { TEXTS } from './constants';

const GROUP_CLASSES = [...FLEX_CENTER_CLASSES, 'd'];

const renderAppBar = (props) => {
  return <AppBar {...props} />
}

const QUICK_TRADE_INDEX = 1;
const INFORMATION_INDEX = 2;

const renderSection1Content = (classes = [], style = {}, onClickScrollTo = () => {}) => {
  const { SECTION_1 } = TEXTS;
  return (
    <div className={classnames(...classes, 'flex-column')} style={style}>
      <div className={classnames('f-1', ...FLEX_CENTER_CLASSES, 'flex-column')}>
        <h1>{SECTION_1.TITLE}</h1>
        <div>
          <p>{SECTION_1.TEXT_1}</p>
          <p>{SECTION_1.TEXT_2}</p>
        </div>
        <div>
          <div>{SECTION_1.BUTTON_1}</div>
          <div>{SECTION_1.BUTTON_2}</div>
        </div>
      </div>
      <div className={classnames('pointer', 'flex-0')}  onClick={onClickScrollTo}>V</div>
    </div>
  );
}

const renderQuickTradeSection = (style, onReviewQuickTrade, onRequestMarketValue, symbol, quickTradeData) => (
  <div
    className={classnames(...GROUP_CLASSES, 'quick_trade-section')}
    style={style}
  >
    <QuickTrade
      onReviewQuickTrade={onReviewQuickTrade}
      onRequestMarketValue={onRequestMarketValue}
      symbol={symbol}
      quickTradeData={quickTradeData}
    />
  </div>
);

class Home extends Component {
  state = {
    contentHeight: 0
  }

  setContainerRef = (el) => {
    if (el) {
      this.container = el;
      this.onResize();
    }
  }

  onResize = () => {
    if (this.container) {
      const height = this.container.clientHeight;
      this.setState({
        style: {
          minHeight: height,
          maxHeight: height,
        },
        height,
      });
    }
  }

  onClickScrollTo = (children = 0) => () => {
    if (this.container && typeof children === 'number') {
      const sections = this.container.children;
      if (children < sections.length) {
        sections[children].scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  }

  onReviewQuickTrade = () => {
    if (this.props.token) {
      this.props.router.push('account');
    } else {
      this.props.router.push('signup');
    }
  }

  onRequestMarketValue = (values) => {
    console.log('requestValue', values)
    this.props.requestQuickTrade(values);
  }

  render() {
    const { token, verifyToken, estimatedValue, symbol, quickTradeData, ...otherProps } = this.props;
    const { style } = this.state;
    const appBarProps = {
      title: APP_TITLE,
      noBorders: true,
      token,
      verifyToken,
      goToQuickTrade: this.onClickScrollTo(QUICK_TRADE_INDEX),
    };

    return (
      <div className={classnames('app_container', 'home_container')}>
        <EventListener
          target="window"
          onResize={this.onResize}
        />
        {renderAppBar(appBarProps)}
        <div
          className={classnames(
            'app_container-content',
            'flex-column',
            'overflow-y'
          )}
          ref={this.setContainerRef}
        >
          {renderSection1Content(GROUP_CLASSES, style, this.onClickScrollTo(QUICK_TRADE_INDEX))}
          {renderQuickTradeSection(style, this.onReviewQuickTrade, this.onRequestMarketValue, symbol, quickTradeData)}
          <div
            className={classnames(...GROUP_CLASSES)}
            style={style}
          >
            infor
          </div>
          <Footer className="c" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
	token: store.auth.token,
  verifyToken: store.auth.verifyToken,
  estimatedValue: 100,
  symbol: store.orderbook.symbol,
  quickTradeData: store.orderbook.quickTrade,
});

const mapDispatchToProps = (dispatch) => ({
  requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
