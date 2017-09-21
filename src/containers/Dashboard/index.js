import React from 'react';
import { connect } from 'react-redux';

const Dashboard = ({ price, symbol}) => {
  return (
    <div className="presentation_container">
      <h2>Dashboard</h2>
      <div>{`Current Price of 1 ${symbol}: ${price} USD`}</div>

    </div>
  );
}

const mapStateToProps = (state) => ({
  price: state.orderbook.price,
  symbol: state.orderbook.symbol,
});

export default connect(mapStateToProps)(Dashboard);
