import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import math from 'mathjs';

class AccountBalance extends Component {
	_displayBalanceTable() {
		let { fiat_balance, fiat_available, btc_balance, btc_available } = this.props.user.balance
		let fiat_trade = math.chain(fiat_balance).subtract(fiat_available).done()
		let btc_trade = math.chain(btc_balance).subtract(btc_available).done()
		let { price } = this.props.orderbook.trades[0]
		return(
			<div className='tableView'>
				<table className="table" style={{width:'99%'}}>
					<tbody>
						<tr>
			               <td></td>
			               <td>United States Dollar</td>
			               <td>Bitcoin</td>    
			               <td></td>               
			            </tr>
			            <tr style={{borderTop:'3px solid #81868a'}}>
			               <td>Available balance:</td>
			               <td>
				               		<div style={{color:'#2aabe4'}} className='row'>
				               			<div className='pl-3'>{`$${fiat_available}`}</div>
				               			<div style={{backgroundColor:'#2aabe4'}} className='balance ml-1'></div>
				               		</div>
				               
			               	</td>
			               <td >
				               		<div style={{color:'#f15a25'}} className='row'>
				               			<div className='pl-3'>{`${btc_available}`}</div>
				               			<div style={{backgroundColor:'#f15a25'}} className='balance ml-1'></div>
				               		</div>
				               
			               	</td>    
			               <td >Total in USD: {math.chain(btc_available).multiply(price).add(fiat_available).done()}</td>               
			            </tr>
			            <tr style={{borderTop:'2px solid #81868a'}}>
			               <td>Balance in trade:</td>
			               <td >
				               		<div style={{color:'#00a99e'}} className='row'>
				               			<div className='pl-3'>{`$${fiat_balance - fiat_available}`}</div>
				               			<div style={{backgroundColor:'#00a99e'}} className='balance ml-1'></div>
				               		</div>
				               
			               	</td>
			               <td>
				               		<div style={{color:'#fbb03b'}} className='row'>
				               			<div className='pl-3'>{`${btc_balance - btc_available}`}</div>
				               			<div style={{backgroundColor:'#fbb03b'}} className='balance ml-1'></div>
				               		</div>
				               
			               </td>    
			               <td>Total in USD: {math.chain(btc_trade).multiply(price).add(fiat_trade).done()}</td>               
			            </tr>
			            <tr style={{backgroundColor:'#e1e2e6'}}>
			            	<td></td>
			            	<td>
				            	{`Total USD assets : $${fiat_balance}`}
				            	<span className="pl-2">+</span>
			            	</td>
			            	<td>
			            		{`Total BTC assets : ${btc_balance}`}
								<span className="pl-2">=</span>
			            	</td>
			            	<td  className='accountActive '>
			            		
			            		<div>Total Asset in USD:${math.chain(btc_balance).multiply(price).add(fiat_balance).done()}</div>
			            			
			            	</td>
			            </tr>
					</tbody>
				</table>
			</div>
		)
	}

	render() {
		return (
			<div>
				<div  className='mt-4'><h3>Account Balance</h3></div>
				{(this.props.orderbook.trades.length > 0 && this.props.user.balance.btc_balance)
				?
					this._displayBalanceTable()
				:
					null
				}
				<div className="row mt-3">
					<div className='col-lg-6 '>
						 <button className='accountButton'>DEPOSIT FUNDS</button>
					</div>
					<div className='col-lg-6  '>
						  <button className='accountButton'>WITHDRAW FUNDS</button>
					</div>
				</div>
			</div>
		);
	}
}
const mapDispatchToProps = dispatch => ({
    
})
const mapStateToProps = (store, ownProps) => ({
	user: store.user,
	orderbook: store.orderbook
})
export default connect(mapStateToProps, mapDispatchToProps)(AccountBalance);