import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import PropTypes from 'prop-types';
import moment from 'moment'
import { userOrders } from '../../actions/userAction'
class TradeOrders extends Component {
	state={
		currentPage:1,
		dataPerPage:10
	}
	componentDidMount() {
		this.props.userOrders();
	}
	render() {
		console.log('this.props.orders',this.props.orders);
		const { currentPage, dataPerPage } = this.state;
	 	if(this.props.orders.length){
		  	const indexOfLastOrder = currentPage * dataPerPage;
		   	const indexOfFirstOrder = indexOfLastOrder - dataPerPage;
		   	const currentData = this.props.orders.slice(indexOfFirstOrder, indexOfLastOrder);
	 		var tradeOrders=currentData.map((data,index)=>{
	 			return(
					<tr key={index} className={data.side=='buy'?`table-success`:data.side=='sell'?`table-danger`:null}>
						<td className="text-left">{data.side=='sell'?'SELL':'BUY'}</td>
						<td className="time-td">
							<div>{moment(data.created_at).format('YYYY-MM-DD')}</div>
							<div className='timeColor'>{moment(data.created_at).format('HH:mm:ss')}</div>
						</td>
						<td>{data.size}</td>
						<td>0.0</td>
						<td>0.0</td>
						<td>${data.price}</td>
						<td>$33.05</td>
						<td><a href='#'>Cancel</a></td>
					</tr>
	 			)
	 		})
	 		var pageNumbers = [];
		    for (let i = 1; i <= Math.ceil(this.props.orders.length/dataPerPage); i++) {
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
				<div><h4>Open Trade Orders</h4></div>
				<div className='tableView'>
					<table className='table text-right'>
						<thead>
							<tr style={{borderBottom:'3px solid #81868a'}}>
								<td className="text-left">Type</td>
								<td>OrderTime</td>
								<td>Amount(BTC)</td>
								<td>Filled(BTC)</td>
								<td>Unfilled amount</td>
								<td>OrderPrice(USD)</td>
								<td>Total order amount(USD)</td>
								<td><a href='#'>CancelAll</a></td>
							</tr>
						</thead>
						<tbody>
							 
							 {this.props.orders.length?tradeOrders:null}
						</tbody>
					</table>
				</div>
				<div id="page-numbers" className='d-flex justify-content-center mt-2'>
			        {this.props.orders.length?renderPageNumbers:null}
			    </div>
			</div>
		);
	}
	handleClick = (event) => {
	    this.setState({
	      currentPage: Number(event.target.id)
	    });
	}
}
const mapDispatchToProps = dispatch => ({
    userOrders:bindActionCreators(userOrders, dispatch),
})
const mapStateToProps = (state, ownProps) => ({
	orders: state.user.orders
})
TradeOrders.defaultProps = {
     orders:[]
};
TradeOrders.propTypes = {
     orders:PropTypes.array
};
export default connect(mapStateToProps, mapDispatchToProps)(TradeOrders);