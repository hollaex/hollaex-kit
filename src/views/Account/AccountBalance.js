import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class AccountBalance extends Component {
	render() {
		return (
			<div>
				<div  className='ml-1'><h3>Account Balance</h3></div>
				<div className='mt-5'>
					<div className="mr-1 ml-1">
						<table className="table">
							<tbody>
								<tr>
					               <td className=''></td>
					               <td className='td-width pl-5'>United States Dollar</td>
					               <td className='td-width text-center'>Bitcoin</td>    
					               <td className=''> </td>               
					            </tr>
					            <tr style={{borderTop:'3px solid #81868a'}}>
					               <td>Available balance:</td>
					               <td className='pr-5'>
						               {this.props.user.balance.fiat_balance==0?0 :
						               		<div style={{color:'#2aabe4'}} className='row'>
						               			<div className='ml-5 pl-2 '>{`$${this.props.user.balance.fiat_balance}`}</div>
						               			<div style={{backgroundColor:'#2aabe4'}} className='balance ml-1'></div>
						               		</div>
						               }
					               	</td>
					               <td className='text-center'>
						               {this.props.user.balance.btc_balance==0?0 :
						               		<div style={{color:'#f15a25'}} className='row'>
						               			<div className='ml-5 pl-5'>{`${this.props.user.balance.btc_balance}`}</div>
						               			<div style={{backgroundColor:'#f15a25'}} className='balance ml-1'></div>
						               		</div>
						               }
					               	</td>    
					               <td >Total in USD:$100,000</td>               
					            </tr>
					            <tr style={{borderTop:'2px solid #81868a'}}>
					               <td>Balance in trade:</td>
					               <td className='pr-5 text-center '>
						               {this.props.user.balance.fiat_pending==0?0 :
						               		<div style={{color:'#00a99e'}} className='row'>
						               			<div className='ml-5 pl-2 '>{`$${this.props.user.balance.fiat_pending}`}</div>
						               			<div style={{backgroundColor:'#00a99e'}} className='balance ml-1'></div>
						               		</div>
						               }
					               	</td>
					               <td className='text-center'>
					               		{this.props.user.balance.btc_pending==0?0 :
						               		<div style={{color:'#fbb03b'}} className='row'>
						               			<div className='ml-5 pl-5'>{`${this.props.user.balance.btc_pending}`}</div>
						               			<div style={{backgroundColor:'#fbb03b'}} className='balance ml-1'></div>
						               		</div>
						               }
					               </td>    
					               <td>Total in USD:0</td>               
					            </tr>
							</tbody>
						</table>
					</div>
					<div className='ml-3 mr-3'> 
						<div className='row' style={{backgroundColor:'#e1e2e6',fontSize:'0.7rem'}} >
							<div className="col-lg-6 offset-2 pt-3 pb-3 " >
								<span className="ml-5 pl-3">
									{`Total USD assets : $${this.props.user.balance.fiat_balance+this.props.user.balance.fiat_pending}`} 
									<span className="ml-3">+</span>
								</span>
								<span className= "ml-2" >
									{`Total BTC assets : ${this.props.user.balance.btc_balance+this.props.user.balance.btc_pending}`}
									<span className="ml-2">=</span>
								</span>
							</div>
							<div className='col-lg-4  pt-3 pb-3 accountActive '>Total Asset in USD:$100,000</div>
						</div>
					</div>
					<div className="row mt-3">
						 <button className='accountButton ml-3' >DEPOSIT FUNDS</button>
						 <button className='accountButton ml-4 ' >WITHDRAW FUNDS</button>
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