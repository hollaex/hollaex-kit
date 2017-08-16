import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment'
import { userDeposits,userWithdrawals } from '../../actions/userAction'

class USDHistory extends Component {
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
			var fiatHistory=[];
			transHistory.map(data=>{
				if(data.currency=='fiat'){
					fiatHistory.push(data);
				}
			})
			const indexOfLastData = currentPage * dataPerPage;
		   	const indexOfFirstData = indexOfLastData - dataPerPage;
		   	const currentData = fiatHistory.slice(indexOfFirstData, indexOfLastData);
			var transferHistory= currentData.map((data,index)=>{
	 			return(
					<tr key={index} style={{borderBottom:'2px solid #81868a'}}>
						<td className="text-left time-td">
							<div>{moment(data.created_at).format('YYYY-MM-DD')}</div>
							<div className='timeColor'>{moment(data.created_at).format('HH:mm:ss')}</div>
						</td>
						<td>{data.type}</td>
						<td>{data.status?'Complete':'Pending'}</td>
						<td className='green'>${data.amount}</td>
					</tr>
	 			)
	 		})
	 		var pageNumbers = [];
		    for (let i = 1; i <= Math.ceil(fiatHistory.length/dataPerPage); i++) {
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
			<div className='col-lg-10 offset-lg-1 '>
				<div><h4>USD Transfer History</h4></div>
				<div className='tableView'>
					<table className='table text-right'>
						<tbody>
							<tr style={{borderBottom:'3px solid #81868a'}}>
								<td className="text-left" >Time</td>
								<td>Description</td>
								<td>Status</td>
								<td>Amount(USD)</td>
							</tr>
							{fiatHistory?transferHistory:null}
						</tbody>
					</table>
				</div>
				<div id="page-numbers" className='d-flex justify-content-center mt-2'>
			        {fiatHistory?renderPageNumbers:null}
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
USDHistory.defaultProps = {
    deposits:{},
    withdrawals:{}
};
USDHistory.propTypes = {
    deposits:PropTypes.object,
    withdrawals:PropTypes.object,
};
export default connect(mapStateToProps, mapDispatchToProps)(USDHistory);