import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import PropTypes from 'prop-types';
import moment from 'moment'
import { userOrders, cancelOrder, cancelAllOrders } from '../../actions/userAction'
class TradeOrders extends Component {
	state={
		currentPage:1,
		dataPerPage:10,
	}
	componentDidMount() {
		this.props.userOrders();
	}
	render() {
		const { currentPage, dataPerPage } = this.state;
	 	if(this.props.orders.length){
	 		var TradeOrders=this.props.orders;
		  	const indexOfLastOrder = currentPage * dataPerPage;
		   	const indexOfFirstOrder = indexOfLastOrder - dataPerPage;
		   	const currentData = this.props.orders.slice(indexOfFirstOrder, indexOfLastOrder);
	 		var tradeOrders=currentData.map((data,index)=>{
	 			return(
					<tr key={index} className={data.side=='buy'?`table-success`:data.side=='sell'?`table-danger`:null}>
						<td className="text-left">{data.side=='sell'?'SELL':'BUY'}</td>
						<td>{data.size}</td>
						<td>0.0</td>
						<td>0.0</td>
						<td>${data.price}</td>
						<td>$33.05</td>
						<td><CancelOrder Id={data.id} cancelOrder={this.props.cancelOrder}/></td>
					</tr>
	 			)
	 		})
	 		TradeOrders.sort((a,b)=>{
				a = new Date(a.price);
			    b = new Date(b.price);
			    return b-a;
			})
	 		var topThreeOrders=TradeOrders.map((data,index)=>{
	 			if(index<3){
		 			return(
						<tr key={index} className={data.side=='buy'?`table-success`:data.side=='sell'?`table-danger`:null}>
							<td className="text-left">{data.side=='sell'?'SELL':'BUY'}</td>
							<td>{data.size}</td>
							<td>0.0</td>
							<td>0.0</td>
							<td>${data.price}</td>
							<td>$33.05</td>
							<td><CancelOrder Id={data.id} cancelOrder={this.props.cancelOrder}/></td>
						</tr>
		 			)
	 			}
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
			<div>
			{this.props.view=='trade'?
				<div>
					<table className='table text-right'>
							<thead>
								 <Header cancelAll={this.props.cancelAll} />
							</thead>
							<tbody>
								 {this.props.orders.length?topThreeOrders:null}
							</tbody>
						</table>
				</div>
			:
				<div className='col-lg-10 offset-lg-1 '>
					<div><h4>Open Trade Orders</h4></div>
					<div className='tableView'>
						<table className='table text-right'>
							<thead>
								<Header cancelAll={this.props.cancelAll} />
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
			}
			</div>
		);
	}
	handleClick = (event) => {
	    this.setState({
	      currentPage: Number(event.target.id)
	    });
	}
	 
}
const CancelOrder=(props)=>{
	const deleteOrder = () => {
	  	 props.cancelOrder(props.Id);
    };
	return(
		<div>
			<a href='#' onClick={deleteOrder}>Cancel</a>
		</div>
	)
}
const Header=(props)=>{
	const cancelAll = () => {
	  	 props.cancelAll();
    };
	return(
		<tr style={{borderBottom:'3px solid #81868a'}}>
			<td className="text-left">Type</td>
			<td>Amount(BTC)</td>
			<td>Filled(BTC)</td>
			<td>Unfilled amount</td>
			<td>OrderPrice(USD)</td>
			<td>Total order amount(USD)</td>
			<td><a href='#' onClick={cancelAll}>Cancel All</a></td>
		</tr>
	)
}
const mapDispatchToProps = dispatch => ({
    userOrders:bindActionCreators(userOrders, dispatch),
    cancelAll:bindActionCreators(cancelAllOrders, dispatch),
    cancelOrder:bindActionCreators(cancelOrder, dispatch),
})
const mapStateToProps = (state, ownProps) => ({
	orders: state.user.userOrders,
	cancelData: state.user.cancel
})
TradeOrders.defaultProps = {
     orders:[],
     cancelData:{}
};
TradeOrders.propTypes = {
     orders:PropTypes.array,
     cancelData:PropTypes.object
};
export default connect(mapStateToProps, mapDispatchToProps)(TradeOrders);