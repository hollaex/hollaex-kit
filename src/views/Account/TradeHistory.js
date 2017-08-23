import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import PropTypes from 'prop-types';
import moment from 'moment'
import { userTrades } from '../../actions/userAction'
import Pagination from './Pagination'
 
class TradeHistory extends Component {
	state={
		currentPage:1,
		dataPerPage:5,
		data:false,
		lastPage:null
	}
	componentDidMount() {
		this.props.userTrades();
	}
	componentWillReceiveProps(nextProps) {
	 	if(nextProps.trades.data.length){
	 		let lastpage=Math.ceil(nextProps.trades.data.length/this.state.dataPerPage);
	 		this.setState({lastPage:lastpage,data:true})
	 	}
	 }
	render() {
		const { count, data }=this.props.trades
		const { currentPage, dataPerPage, lastPage } = this.state;
		if(this.state.data){
			data.sort((a,b)=>{
				a = new Date(a.timestamp);
			    b = new Date(b.timestamp);
			    return b-a;
			})
		  	const indexOfLastData = currentPage * dataPerPage;
		   	const indexOfFirstData = indexOfLastData - dataPerPage;
		   	const currentData = data.slice(indexOfFirstData, indexOfLastData);
	 		var tradeHistory=currentData.map((data,index)=>{
	 			return(
	 				<tr key={index} className={data.side=='buy'?`table-success`:data.side=='sell'?`table-danger`:null}>
						<td className="text-left">{data.side}</td>
						<td className="time-td">
							<div>{moment(data.timestamp).format('YYYY-MM-DD')}</div>
							<div className='timeColor'>{moment(data.timestamp).format('HH:mm:ss')}</div>
						</td>
						<td>{data.size}</td>
						<td>{data.price}</td>
						<td>{data.size*data.price}</td>
						<td>{data.fee}</td>
						<td>1.22475698 BTC</td>
					</tr>
	 			)
	 		})
	 	}
	 	console.log('state',currentPage);
		return (
			<div className='col-lg-10 offset-lg-1 '>
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
				{this.state.data?
					<Pagination
				    	currentPage={ currentPage }
				    	pageLength={ lastPage }
				    	handleClick={this.handleClick}
						handleNext={this.handleNext}
						handlePrevious={this.handlePrevious}
						handleFirst={this.handleFirst}
						handleLast={this.handleLast}
				    />
				    :null
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
    userTrades:bindActionCreators(userTrades, dispatch),
})
const mapStateToProps = (state, ownProps) => ({
	trades: state.user.trades, 
})
TradeHistory.defaultProps = {
     trades:{}
};
TradeHistory.propTypes = {
     trades:PropTypes.object
};
export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory);