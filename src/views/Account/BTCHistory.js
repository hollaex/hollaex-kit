import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { userDeposits,userWithdrawals } from '../../actions/userAction'

class BTCHistory extends Component {
	state={
		currentPage:1,
		dataPerPage:10
	}
	componentDidMount() {
		this.props.userDeposits();
		this.props.userWithdrawals();
	}
	render() {
		const { currentPage, dataPerPage } = this.state;
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
		transHistory.sort((a,b)=>{
			a = new Date(a.created_at);
		    b = new Date(b.created_at);
		    return b-a;
		})
		if(transHistory.length){
			var btcHistory=[];
			var fiatHistory=[];
			transHistory.map(data=>{
				if(data.currency=='btc'){
					btcHistory.push(data);
				}
			})
			const indexOfLastData = currentPage * dataPerPage;
		   	const indexOfFirstData = indexOfLastData - dataPerPage;
		   	const currentData = btcHistory.slice(indexOfFirstData, indexOfLastData);
			var transferHistory= currentData.map((data,index)=>{
		 		let dateTime= data.created_at.split('T', 2)
		 		let time=dateTime[1].split('.',1)
	 			return(
					<tr key={index} style={{borderBottom:'2px solid #81868a'}}>
						<td className="text-left time-td">
							<div>{dateTime[0]}</div>
							<div className='timeColor'>{time}</div>
						</td>
						<td>{data.type}</td>
						<td>{data.status?'Complete':'Pending'}</td>
						<td className='green'>{data.amount}</td>
					</tr>
	 			)
	 		})
	 		var pageNumbers = [];
		    for (let i = 1; i <= Math.ceil(btcHistory.length/dataPerPage); i++) {
		      	pageNumbers.push(i);
		    }
		    var renderPageNumbers = pageNumbers.map(number => {
		      	return (
				        <div
				          	key={number}
				          	id={number}
				          	onClick={this.handleClick}
				         	className={currentPage==number?`accountActive ml-1 pl-2 pr-2 `:`notActive ml-1  pl-2 pr-2`}
				         	style={{cursor:'pointer'}}
				        >
				         	{number} 
				        </div>
			      );
		    });
		}
		return (
			<div>
				<div><h4>BTC Transfer History</h4></div>
				<div className='tableView'>
					<table className='table text-right'>
						<tbody>
							<tr style={{borderBottom:'3px solid #81868a'}}>
								<td className="text-left" >Time</td>
								<td>Description</td>
								<td>Status</td>
								<td>Amount(BTC)</td>
							</tr>
							{btcHistory?transferHistory:null}
						</tbody>
					</table>
				</div>
				<div id="page-numbers" className='d-flex justify-content-center mt-2'>
			        {btcHistory?renderPageNumbers:null}
			    </div>
			</div>
		);
	}
	handleClick=(event)=> {
	    this.setState({
	      currentPage: Number(event.target.id)
	    });
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
BTCHistory.defaultProps = {
    deposits:{},
    withdrawals:{}
};
BTCHistory.propTypes = {
    deposits:PropTypes.object,
    withdrawals:PropTypes.object,
};
export default connect(mapStateToProps, mapDispatchToProps)(BTCHistory);
