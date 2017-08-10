import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 

export class BTCHistory extends Component {
	render() {
		return (
			<div>
				<div><h4>BTC Transfer History</h4></div>
				<div className='tableView'>
					<table className='table text-right'>
						<tr>
							<td className="text-left" >Time</td>
							<td>Description</td>
							<td>Status</td>
							<td>Amount(BTC)</td>
						</tr>
						<tr style={{borderBottom:'2px solid #81868a',borderTop:'3px solid #81868a'}}>
							<td className="text-left time-td">
								<div>2017-07-06</div>
								<div className='timeColor'>05:34:42</div>
							</td>
							<td>Received BTC from 32jQue9nhvrfdgFgdfRsdXfdg56fdf5ep</td>
							<td>Complete</td>
							<td className='green'>+0.5</td>
						</tr>
						<tr style={{borderBottom:'2px solid #81868a'}}>
							<td className="text-left time-td">
								<div>2017-07-06</div>
								<div className='timeColor'>05:34:42</div>
							</td>
							<td>Send BTC to 32jQue9nhvrfdgFgdfRsdXfdg56fdf5ep</td>
							<td>Pending (1 Confirmation)</td>
							<td className='red'>-0.5</td>
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
export default connect(mapStateToProps, mapDispatchToProps)(BTCHistory);