import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { AppBar } from '../../components';

const FLEX_CLASSES = ['d-flex', 'justify-content-center', 'align-items-center'];

const renderAppBar = () => {
  return <AppBar />
}

const renderNoUserButtons = () => (
  <div>
    <Link to='/login'>Login</Link>
    <Link to='/signup'>Sign Up</Link>
  </div>
);

const renderUserButtons = () => (
  <div>
    <Link to='/account'>account</Link>
    <Link to='/wallet'>wallet</Link>
  </div>
);

const renderButtons = (token) => token ? renderUserButtons() : renderNoUserButtons();

const renderHomeContent = (token, verifyingToken) => {
  return (
    <div className={classnames(...FLEX_CLASSES, 'home_container', {})}>
      HOME
      {!verifyingToken && renderButtons(token)}
    </div>
  )
}

class Home extends Component {
  render() {
    const { token, verifyToken } = this.props;
    return (
      <div className={classnames('app_container')}>
        {renderAppBar(this.props)}
        {renderHomeContent(token, verifyToken)}
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
