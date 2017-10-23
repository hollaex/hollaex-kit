import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Deposit extends Component {

  render() {
    const { id, crypto_wallet } = this.props;

    if (!id) {
      return <div></div>;
    }

    return (
      <div>
        Deposit Page
        {JSON.stringify(crypto_wallet)}
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  id: store.user.id,
  crypto_wallet: store.user.crypto_wallet,
});

export default connect(mapStateToProps)(Deposit);
