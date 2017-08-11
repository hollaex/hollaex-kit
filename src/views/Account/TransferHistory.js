import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { userDeposits,userWithdrawals } from '../../actions/userAction'

class TransferHistory extends Component {
	componentDidMount() {
		this.props.userDeposits();
		this.props.userWithdrawals();
	}
	componentWillReceiveProps(nextProps) {
		console.log('nextProps',nextProps.deposits);
	}
	render() {
		console.log('deposits',this.props.deposits);
		var transHistory=[];
		if(this.props.deposits.count){
			this.props.deposits.data.map(item=>{
				transHistory.push(item);
			})
		}
		if(this.props.withdrawals.count){
			this.props.withdrawals.data.map(item=>{
				transHistory.push(item);
			})
		}
		console.log('transHistory',transHistory);
		if(transHistory.length){
			var BTCTransferHistory=transHistory.map((data,index)=>{
		 		let dateTime= data.created_at.split('T', 2)
		 		let time=dateTime[1].split('.',1)
		 		if(data.currency=='btc'){
		 			return(
						<tr key={index} style={{borderBottom:'2px solid #81868a'}}>
							<td className="text-left time-td">
								<div>{dateTime[0]}</div>
								<div className='timeColor'>{time}</div>
							</td>
							<td>{data.type}</td>
							<td>Complete</td>
							<td className='green'>${data.amount}</td>
						</tr>
		 			)
		 		}
	 		})
	 		var FIATTransferHistory=transHistory.map((data,index)=>{
		 		let dateTime= data.created_at.split('T', 2)
		 		let time=dateTime[1].split('.',1)
		 		if(data.currency=='fiat'){
		 			return(
						<tr key={index} style={{borderBottom:'2px solid #81868a'}}>
							<td className="text-left time-td">
								<div>{dateTime[0]}</div>
								<div className='timeColor'>{time}</div>
							</td>
							<td>{data.type}</td>
							<td>Complete</td>
							<td className='green'>${data.amount}</td>
						</tr>
		 			)
		 		}
	 		})
		}
		return (
			<div>
				<div><h4>
					{this.props.transfer=='USD'?
						'USD Transfer History':'BTC Transfer History'
					}
					</h4>
				</div>
				<div className='tableView'>
					<table className='table text-right'>
						<tbody>
							<tr style={{borderBottom:'3px solid #81868a'}}>
								<td className="text-left" >Time</td>
								<td>Description</td>
								<td>Status</td>
								<td>Amount(USD)</td>
							</tr>
							{this.props.transfer=='USD'?
								FIATTransferHistory
							:
							 	BTCTransferHistory 
							}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
const mapDispatchToProps = dispatch => ({
    userDeposits:bindActionCreators(userDeposits, dispatch),
    userWithdrawals:bindActionCreators(userWithdrawals, dispatch),
})
const mapStateToProps = (state, ownProps) => ({
	deposits: state.user.deposits,
	withdrawals: state.user.withdrawals
})
TransferHistory.defaultProps = {
    deposits:{},
    withdrawals:{}
};
TransferHistory.propTypes = {
    deposits:PropTypes.object,
    withdrawals:PropTypes.object,
};
export default connect(mapStateToProps, mapDispatchToProps)(TransferHistory);
 