import React from 'react';
import { connect } from 'react-redux';

const Account = ({ }) => {
  return (
    <div className="presentation_container">
      <h2>Account</h2>
      <div>
        Account page
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(Account);
