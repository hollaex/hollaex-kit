import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment'
import { userDeposits,userWithdrawals } from '../../actions/userAction'
import Pagination from './Pagination'

class USDHistory extends Component {
	state={
		currentPage:1,
		dataPerPage:5,
		depositData:false,
		withdrawData:false
	}
	componentDidMount() {
		this.props.userDeposits();
		this.props.userWithdrawals();
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.deposits!=this.props.deposits && nextProps.deposits.data.length) {
			this.setState({depositData:true})
		}
		if(nextProps.withdrawals!=this.props.withdrawals && nextProps.withdrawals.data.length){
			this.setState({withdrawData:true})
		}
	}
	render() {
		const { currentPage, dataPerPage } = this.state;
		var transHistory=[];
		if(this.state.depositData){
			this.props.deposits.data.map(item=>{
				transHistory.push(item);
			})
		}
		if(this.state.withdrawData){
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
			    {(this.state.depositData || this.state.withdrawData) ?
			    	<Pagination
				    	currentPage={ currentPage }
				    	pageLength={ pageNumbers.length }
				    	handleClick={this.handleClick}
						handleNext={this.handleNext}
						handlePrevious={this.handlePrevious}
						handleFirst={this.handleFirst}
						handleLast={this.handleLast}
				    />
				    :
				    null
			    }
				    
			</div>
		);
	}
	handleClick=(id)=> {
	    this.setState({ currentPage: id });
	}
	handleNext=()=> {
	    this.setState({ currentPage: this.state.currentPage+1 });
	}
	handlePrevious=()=> {
	    this.setState({ currentPage: this.state.currentPage-1 });
	}
	handleFirst=()=> {
	    this.setState({ currentPage: 1 });
	}
	handleLast=(lastPage)=> {
		this.setState({ currentPage: lastPage });
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