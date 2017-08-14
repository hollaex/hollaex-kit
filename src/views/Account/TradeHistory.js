import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import PropTypes from 'prop-types';
import { userTrades } from '../../actions/userAction'
 
class TradeHistory extends Component {
	state={
		currentPage:1,
		dataPerPage:10
	}
	componentDidMount() {
		this.props.userTrades();
	}
	 
	render() {
	 	const { count, data }=this.props.trades
		const { currentPage, dataPerPage } = this.state;
	 	if(count){
		  	const indexOfLastData = currentPage * dataPerPage;
		   	const indexOfFirstData = indexOfLastData - dataPerPage;
		   	const currentData = data.slice(indexOfFirstData, indexOfLastData);
	 		var tradeHistory=currentData.map((data,index)=>{
		 		let dateTime= data.timestamp.split('T', 2)
		 		let time=dateTime[1].split('.',1)
	 			return(
	 				<tr key={index} className={data.side=='buy'?`table-success`:data.side=='sell'?`table-danger`:null}>
						<td className="text-left">{data.side}</td>
						<td className="time-td">
							<div>{dateTime[0]}</div>
							<div className='timeColor'>{time}</div>
						</td>
						<td>{data.size}</td>
						<td>{data.price}</td>
						<td>{data.size*data.price}</td>
						<td>{data.fee}</td>
						<td>1.22475698 BTC</td>
					</tr>
	 			)
	 		})
	 		var pageNumbers = [];
		    for (let i = 1; i <= Math.ceil(data.length/dataPerPage); i++) {
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
				<div><h4>Trade History</h4></div>
				<div className='tableView'>
					<table className='table text-right'>
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
						<tbody>
							{tradeHistory}
						</tbody>
					</table>
				</div>
				<div id="page-numbers" className='d-flex justify-content-center mt-2'>
			        {count?renderPageNumbers:null}
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
    userTrades:bindActionCreators(userTrades, dispatch),
})
const mapStateToProps = (state, ownProps) => ({
	trades: state.user.trades
})
TradeHistory.defaultProps = {
     trades:{}
};
TradeHistory.propTypes = {
     trades:PropTypes.object
};
export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory);