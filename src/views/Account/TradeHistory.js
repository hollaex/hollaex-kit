import React, { Component } from 'react';
import { connect } from 'react-redux';
import math from 'mathjs';
import moment from 'moment';
import { formatBtcAmount, formatFiatAmount } from '../../utils/string';
import DisplayTable from './DisplayTable';
import { userTrades } from '../../actions/userAction'

const Header = ({ cancelAll }) => (
	<thead>
    <tr style={{borderBottom:'3px solid #81868a'}}>
      <td className="text-left">Type</td>
      <td>Time</td>
      <td>Amount(BTC)</td>
      <td>Price</td>
      <td>Amount(USD)</td>
      <td>Fee(USD)</td>
      <td>Amount Received</td>
    </tr>
	</thead>
);

const Body = ({ data = [], cancelOrder }) => {
	return (
		<tbody>
			{data.map((item, index) => {
				return (
					<tr
						key={`data-row-${index}`}
						className={item.side === 'buy' ? 'table-success' : 'table-danger'}
					>
            <td className="text-left">{item.side.toUpperCase()}</td>
						<td className="time-td">
							<div>{moment(item.timestamp).format('YYYY-MM-DD')}</div>
							<div className='timeColor'>{moment(item.timestamp).format('HH:mm:ss')}</div>
						</td>
						<td>{formatBtcAmount(item.size)}</td>
						<td>${formatFiatAmount(item.price)}</td>
						<td>${formatFiatAmount(math.chain(item.price).multiply(item.size).done())}</td>
						<td>{formatFiatAmount(item.fee)}</td>
						<td>?? duplicated value??</td>
					</tr>
				)
			})}
		</tbody>
	);
}

class TradeHistory extends Component {
  componentWillMount() {
    this.props.getTrades();
  }
  // TODO add request more in pagination
  render() {
    const { trades, count, fetching } = this.props;
    return (
      <DisplayTable
        title="Trade History"
        data={trades.sort((a, b) => {
          return new Date(a) <= new Date(b);
        })}
        header={<Header />}
        body={<Body />}
        count={count}
      />
    );
  }
}

TradeHistory.defaultProps = {
  trades: [],
  count: 0,
  fetching: false,
}

const mapDispatchToProps = (dispatch) => ({
  getTrades: () => dispatch(userTrades()),
});

const mapStateToProps = (state) => ({
	trades: state.user.trades.data,
  count: state.user.trades.count,
  fetching: state.user.fetching,
});

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory);
