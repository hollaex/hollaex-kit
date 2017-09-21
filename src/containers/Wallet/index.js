import React from 'react';
import { connect } from 'react-redux';

const Wallet = ({ }) => {
  return (
    <div className="presentation_container">
      <h2>Wallet</h2>
      <div>
        Account page
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(Wallet);
