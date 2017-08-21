import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'
import math from 'mathjs';
import { logout } from '../../actions/authAction'

const mapDispatchToProps = dispatch => ({
    logout:bindActionCreators(logout, dispatch),
})

class Sidebar extends Component {
	state={
		viewBitcoin:false,
		viewFiat:false,
		viewAssets:false,
	}
	_logout(e){
		this.props.logout();
	}
	_displayBalance() {
		let { fiat_balance, fiat_available, btc_balance, btc_available } = this.props.user.balance
		let fiat_trade = math.chain(fiat_balance).subtract(fiat_available).done()
		let btc_trade = math.chain(btc_balance).subtract(btc_available).done()
		let { price } = this.props.orderbook.trades[0]
		return(
			<div className='p-3 ml-3' style={{width:'100%'}}>
				<h6>BALANCE</h6>
				<div className='row p-2 pointer' onClick={this.viewBitcoin}>
					<div className='col-lg-1'>
						{this.state.viewBitcoin?
							<img src={require('./images/down.png')} width="10" height="10"/>
							:
							<img src={require('./images/right.png')} width="10" height="10"/>
						}
					</div>
					<div className='col-lg-4'>Bitcoin:</div>
					<div className='col-lg-6 text-right'>{btc_balance} BTC</div>
				</div>
				<div style={{borderBottom:'1px solid #7c8a96',fontSize:'0.7rem' }}>
					{this.state.viewBitcoin?
						<div className='pl-1 col-lg-11'>
							<div className='pt-2'>{`Available for trading: ${btc_balance - btc_available}`}</div>
							<div className='pt-2'>You have 1 open order resulting in a hold of 0.04545 placed on your btc balace.</div>
							<div className='pt-2'>{`Available for withdrawal: ${btc_available}`}</div>
						</div>:null
					}
				</div>
				<div className='row p-2 pointer'  onClick={this.viewFiat}>
					<div className='col-lg-1'>
						{this.state.viewFiat?
								<img src={require('./images/down.png')} width="10" height="10"/>
								:
								<img src={require('./images/right.png')} width="10" height="10"/>
						}
					</div>
					<div className='col-lg-4'>Fiat:</div>
					<div className='col-lg-6 text-right'>${fiat_balance}</div>
				</div>
				<div style={{borderBottom:'1px solid #7c8a96',fontSize:'0.7rem' }}>
					{this.state.viewFiat?
						<div className='pl-1 col-lg-11'>
							<div className='pt-2'>{`Available for trading: $${fiat_balance - fiat_available}`}</div>
							<div className='pt-2'>You have 1 open order resulting in a hold of 0.04545 placed on your btc balace.</div>
							<div className='pt-2'>{`Available for withdrawal: $${fiat_available}`}</div>
						</div>:null
					}
				</div>
				<div className='row p-2 pointer'  onClick={this.viewAssets}>
					<div className='col-lg-1'>
						{this.state.viewAssets?
								<img src={require('./images/down.png')} width="10" height="10"/>
								:
								<img src={require('./images/right.png')} width="10" height="10"/>
						}
					</div>
					<div className='col-lg-4'>Total Assets:</div>
					<div className='col-lg-6 text-right'>
						{ math.chain(btc_balance).multiply(price).add(fiat_balance).done()}
					</div>
				</div>
				<div style={{borderBottom:'1px solid #7c8a96',fontSize:'0.7rem' }}>
					{this.state.viewAssets?
						<div className='pl-1 col-lg-11'>
							<div className='pt-2'>{`Total available for trading: ${math.chain(btc_available).multiply(price).add(fiat_available).done()}`}</div>
							<div className='pt-2'>{`Total available for withdrawal: ${math.chain(btc_trade).multiply(price).add(fiat_trade).done()}`}</div>
						</div>:null
					}
				</div>
			</div>
		)
	}
	render() {
		return (
			<div className="col-md-2 sidebar">
				<img src={require('./images/user.png')} width="50" height="50" style={{borderRadius:'30px'}}/> 
				<ul>
					<li><Link to='/dashboard/account'>Account</Link></li>
					<li><Link to='/dashboard/exchange'>Exchange</Link></li>
					<li><Link to='/dashboard/deposit'>Deposit</Link></li>
					<li><Link to='/dashboard/withdraw'>Withdraw</Link></li>
					<li onClick={this._logout.bind(this)}>Logout</li>
				</ul>
				<div className='row sidebarBalance'>
					{(this.props.orderbook.trades.length > 0 && this.props.user.balance.btc_balance)
					?
						this._displayBalance()
					:
						null
					}
				</div>
			</div>
		);
	}
	viewBitcoin = () =>{
		this.setState({viewBitcoin:!this.state.viewBitcoin})
	}
	viewFiat = () =>{
		this.setState({viewFiat:!this.state.viewFiat})
	}
	viewAssets = () =>{
		this.setState({viewAssets:!this.state.viewAssets})
	}
}
const mapStateToProps = (store, ownProps) => ({
	user: store.user,
	orderbook: store.orderbook
})
export default connect(mapStateToProps,mapDispatchToProps)(Sidebar);
