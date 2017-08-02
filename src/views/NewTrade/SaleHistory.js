import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class SaleHistory extends Component {
	render() {
		return (
			<div>
				<h5 className='pt-1'>SALE HISTORY</h5>
				<div className="row" >
					<div className="col-12" style={{overflowY:'scroll',height:'15rem'}} >
						<table className="table">
							<thead>
								<th>PRICE</th>
								<th>AMOUNT</th>
								<th>TIME OF SALE</th>
							</thead>
							<tbody>
								{
									(this.props.orderbook.trades.map((trade,i) => {
										return(
								            <tr key={i}>
								               <td style={{width: "40%"}}>{trade.price}</td>
								               <td style={{width: "25%"}}>{trade.size}</td>
								               <td style={{width: "25%"}}>{moment(trade.timestamp).format('HH:mm:ss')}</td>               
								            </tr>
										)
									}))
								}
								</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}


const mapStateToProps = (store, ownProps) => ({
	orderbook: store.orderbook
})
const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SaleHistory);