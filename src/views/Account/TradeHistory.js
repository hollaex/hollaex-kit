import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 

class TradeHistory extends Component {
	render() {
		return (
			<div>
				<div><h4>Trade History</h4></div>
				<div className='tableView'>
					<table className='table text-right'>
						<tr>
							<td className="text-left">Type</td>
							<td>Time</td>
							<td>Amount(BTC)</td>
							<td>Price</td>
							<td>Amount(USD)</td>
							<td>Fee(USD)</td>
							<td>Amount Received</td>
						</tr>
						<tr className="table-success " style={{borderTop:'3px solid #81868a'}}>
							<td className="text-left">BUY</td>
							<td className="time-td">
								<div>2017-07-06</div>
								<div className='timeColor'>05:34:42</div>
							</td>
							<td>1.22594532</td>
							<td>3,115</td>
							<td>3,770</td>
							<td>-5</td>
							<td>1.22475698 BTC</td>
						</tr>
						<tr className="table-danger">
							<td className="text-left">SELL</td>
							<td className="time-td">
								<div>2017-07-06</div>
								<div className='timeColor'>05:34:42</div>
							</td>
							<td>0.5</td>
							<td>3,000</td>
							<td>1,500</td>
							<td>-5</td>
							<td>1,495 USD</td>
						</tr>
					</table>
				</div>
			</div>
		);
	}
}
const mapDispatchToProps = dispatch => ({
    
})
const mapStateToProps = (store, ownProps) => ({
	user: store.user
})
export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory);