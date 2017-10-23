import React, { Component } from 'react';
import classnames from 'classnames';
import math from 'mathjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class TransferHistory extends Component {

  render() {
    const { id, trades } = this.props;

    if (!id) {
      return <div></div>;
    }

    return (
      <div>
        Trade history
        {JSON.stringify(trades)}
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  id: store.user.id,
  trades: store.user.trades,
});

export default connect(mapStateToProps)(TransferHistory);
