import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class AccountBalance extends Component {
	render() {
		return (
			<div>
				<div  className='mt-4'><h3>Account Balance</h3></div>
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
					                {this.props.user.balance.fiat_balance==0?0 :
					               		<div style={{color:'#2aabe4'}} className='row'>
					               			<div className='pl-3'>{`$${this.props.user.balance.fiat_balance}`}</div>
					               			<div style={{backgroundColor:'#2aabe4'}} className='balance ml-1'></div>
					               		</div>
					               }
				               	</td>
				               <td >
					               {this.props.user.balance.btc_balance==0?0 :
					               		<div style={{color:'#f15a25'}} className='row'>
					               			<div className='pl-3'>{`${this.props.user.balance.btc_balance}`}</div>
					               			<div style={{backgroundColor:'#f15a25'}} className='balance ml-1'></div>
					               		</div>
					               }
				               	</td>    
				               <td >Total in USD:$100,000</td>               
				            </tr>
				            <tr style={{borderTop:'2px solid #81868a'}}>
				               <td>Balance in trade:</td>
				               <td >
					               {this.props.user.balance.fiat_pending==0?0 :
					               		<div style={{color:'#00a99e'}} className='row'>
					               			<div className='pl-3'>{`$${this.props.user.balance.fiat_pending}`}</div>
					               			<div style={{backgroundColor:'#00a99e'}} className='balance ml-1'></div>
					               		</div>
					               }
				               	</td>
				               <td>
				               		{this.props.user.balance.btc_pending==0?0 :
					               		<div style={{color:'#fbb03b'}} className='row'>
					               			<div className='pl-3'>{`${this.props.user.balance.btc_pending}`}</div>
					               			<div style={{backgroundColor:'#fbb03b'}} className='balance ml-1'></div>
					               		</div>
					               }
				               </td>    
				               <td>Total in USD:0</td>               
				            </tr>
				            <tr style={{backgroundColor:'#e1e2e6'}}>
				            	<td></td>
				            	<td>
					            	{`Total USD assets : $${this.props.user.balance.fiat_balance+this.props.user.balance.fiat_pending}`}
					            	<span className="pl-2">+</span>
				            	</td>
				            	<td>
				            		{`Total BTC assets : ${this.props.user.balance.btc_balance+this.props.user.balance.btc_pending}`}
									<span className="pl-2">=</span>
				            	</td>
				            	<td  className='accountActive '>
				            		<div>Total Asset in USD:$100,000</div>
				            	</td>
				            </tr>
						</tbody>
					</table>
				</div>
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
	user: store.user
})
export default connect(mapStateToProps, mapDispatchToProps)(AccountBalance);