import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { AppBar } from '../../components';

import {
  APP_TITLE, FLEX_CENTER_CLASSES,
} from '../../config/constants';
const FLEX_CLASSES = ['d-flex', 'justify-content-center', 'align-items-center'];

const renderAppBar = (props) => {
  return <AppBar {...props} />
}

const renderHomeContent = () => {
  return (
    <div className={classnames(...FLEX_CENTER_CLASSES, 'home_container', {})}>
      HOME
    </div>
  )
}

class Home extends Component {
  render() {
    const { token, verifyToken, ...otherProps } = this.props;
    const appBarProps = {
      title: APP_TITLE,
      noBorders: true,
      token,
      verifyToken,
    };

    return (
      <div className={classnames('app_container')}>
        {renderAppBar(appBarProps)}
        {renderHomeContent()}
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
	token: store.auth.token,
  verifyToken: store.auth.verifyToken,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
