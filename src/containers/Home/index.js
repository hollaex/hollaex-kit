import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import EventListener from 'react-event-listener';
import { bindActionCreators } from 'redux';

import { AppBar, Footer } from '../../components';

import {
  APP_TITLE,
} from '../../config/constants';

import { requestQuickTrade } from '../../actions/orderbookAction';

import { TEXTS } from './constants';

import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';

const renderAppBar = (props) => {
  return <AppBar {...props} />
}

const QUICK_TRADE_INDEX = 1;
const INFORMATION_INDEX = 2;
const MIN_HEIGHT = 450;

class Home extends Component {
  state = {
    height: 0,
    style: {
      minHeight: MIN_HEIGHT,
    }
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
          // maxHeight: height,
        },
        height,
      });
      // this.onClickScrollTo(0)();
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

  goTo = (path) => () => {
    this.props.router.push(path);
  }

  onReviewQuickTrade = () => {
    if (this.props.token) {
      this.goTo('account')();
    } else {
      this.goTo('signup')();
    }
  }

  render() {
    const {
      token, verifyToken, estimatedValue, symbol, quickTradeData, requestQuickTrade, ...otherProps
    } = this.props;
    const { style } = this.state;

    return (
      <div className={classnames('app_container', 'home_container', 'app_background')}>
        <EventListener
          target="window"
          onResize={this.onResize}
        />
        <AppBar
          title={APP_TITLE}
          noBorders={true}
          token={token}
          verifyToken={verifyToken}
          goToQuickTrade={this.onClickScrollTo(QUICK_TRADE_INDEX)}
        />
        <div
          className={classnames(
            'app_container-content',
            'flex-column',
            'overflow-y'
          )}
          ref={this.setContainerRef}
        >
          <Section1
            style={{ minHeight: style.minHeight > MIN_HEIGHT ? style.minHeight : MIN_HEIGHT}}
            onClickScrollTo={this.onClickScrollTo(INFORMATION_INDEX)}
            onClickRegister={this.goTo('signup')}
            token={token}
          />
          <Section2
            style={style}
            onReviewQuickTrade={this.onReviewQuickTrade}
            onRequestMarketValue={requestQuickTrade}
            symbol={symbol}
            quickTradeData={quickTradeData}
          />
          <Section3
            style={style}
            onClickRegister={this.goTo('signup')}
            token={token}
          />
          <Footer />
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
