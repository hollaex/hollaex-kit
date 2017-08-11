import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { userOrders } from '../../actions/userAction'
class TradeOrders extends Component {
	componentDidMount() {
		this.props.userOrders();
	}
	render() {
		return (
			<div>
				<div><h4>Open Trade Orders</h4></div>
				<div className='tableView'>
					<table className='table text-right'>
						<tbody>
							<tr>
								<td className="text-left">Type</td>
								<td>OrderTime</td>
								<td>Amount</td>
								<td>Filled(BTC)</td>
								<td>Unfilled amount</td>
								<td>OrderPrice(USD)</td>
								<td>Total order amount(USD)</td>
								<td><a href='#'>CancelAll</a></td>
							</tr>
							<tr className="table-success" style={{borderTop:'3px solid #81868a'}}>
								<td className="text-left">BUY</td>
								<td className="time-td">
									<div>2017-07-06</div>
									<div className='timeColor'>05:34:42</div>
								</td>
								<td>0.00994532</td>
								<td>0.0</td>
								<td>0.0</td>
								<td>$3,106</td>
								<td>$30.99</td>
								<td><a href='#'>Cancel</a></td>
							</tr>
							<tr className="table-danger">
								<td className="text-left">SELL</td>
								<td className="time-td">
									<div>2017-07-06</div>
									<div className='timeColor'>05:34:42</div>
								</td>
								<td>0.1000000</td>
								<td>0.0</td>
								<td>0.0</td>
								<td>$3,310.5</td>
								<td>$33.05</td>
								<td><a href='#'>Cancel</a></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
const mapDispatchToProps = dispatch => ({
    userOrders:bindActionCreators(userOrders, dispatch),
})
const mapStateToProps = (store, ownProps) => ({
	user: store.user
})
export default connect(mapStateToProps, mapDispatchToProps)(TradeOrders);