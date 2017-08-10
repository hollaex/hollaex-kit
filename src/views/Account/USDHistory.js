import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 

class USDHistory extends Component {
	render() {
		return (
			<div>
				<div><h4>USD Transfer History</h4></div>
				<div className='tableView'>
					<table className='table text-right'>
						<tr>
							<td className="text-left" >Time</td>
							<td>Description</td>
							<td>Status</td>
							<td>Amount(USD)</td>
						</tr>
						<tr style={{borderBottom:'2px solid #81868a',borderTop:'3px solid #81868a'}}>
							<td className="text-left time-td">
								<div>2017-07-06</div>
								<div className='timeColor'>05:34:42</div>
							</td>
							<td>Deposit from adrian</td>
							<td>Complete</td>
							<td className='green'>+$10,000</td>
						</tr>
						<tr style={{borderBottom:'2px solid #81868a'}}>
							<td className="text-left time-td">
								<div>2017-07-06</div>
								<div className='timeColor'>05:34:42</div>
							</td>
							<td>Withdrawal to linked bank account</td>
							<td>Complete</td>
							<td className='red'>-$5,000</td>
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
export default connect(mapStateToProps, mapDispatchToProps)(USDHistory);