import React, { Component } from 'react';
import { connect } from 'react-redux';
import numbro from 'numbro';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'
import math from 'mathjs';
import { logout } from '../../actions/authAction'
import { formatBtcAmount, formatFiatAmount } from '../../utils/string';

const IMG_DOWN = require('./images/down.png');
const IMG_RIGHT = require('./images/right.png');
const IMG_SIZE = '10';

class Sidebar extends Component {
	state={
		viewBitcoin:false,
		viewFiat:false,
		viewAssets:false,
	}

	_displayBalance(price, balance, orders) {
    const btcOrdersCount = orders.filter((order) => order.side === 'sell').length;
    const fiatOrdersCount = orders.length - btcOrdersCount;
		let { fiat_balance, fiat_available, btc_balance, btc_available } = balance;
		let fiat_trade = math.chain(fiat_balance).subtract(fiat_available).done()
		let btc_trade = math.chain(btc_balance).subtract(btc_available).done()
		return(
			<div className='p-3 ml-3' style={{width:'100%'}}>
				<h6>BALANCE</h6>
				<div className='row p-2 pointer' onClick={this.viewBitcoin}>
					<div className='col-lg-1'>
            <img src={this.state.viewBitcoin ? IMG_DOWN : IMG_RIGHT} width={IMG_SIZE} height={IMG_SIZE} />
					</div>
					<div className='col-lg-4'>Bitcoin:</div>
					<div className='col-lg-6 text-right'>{btc_balance} BTC</div>
				</div>
				<div style={{borderBottom:'1px solid #7c8a96',fontSize:'0.7rem' }}>
					{this.state.viewBitcoin?
						<div className='pl-1 col-lg-11'>
							<div className='pt-2'>Available for trading:
								<span className='green'> {formatBtcAmount(btc_available)}</span>
							</div>
              {btcOrdersCount > 0 &&
                <div className='pt-2'>You have {btcOrdersCount} open order{btcOrdersCount > 1 ? 's' : ''} resulting in a hold of {formatBtcAmount(btc_trade)} placed on your btc balance.</div>
              }
							<div className='pt-2'>Available for withdrawal:
								<span className='green'> {formatBtcAmount(btc_available)}</span>
							</div>
						</div>:null
					}
				</div>
				<div className='row p-2 pointer'  onClick={this.viewFiat}>
					<div className='col-lg-1'>
            <img src={this.state.viewFiat ? IMG_DOWN : IMG_RIGHT} width={IMG_SIZE} height={IMG_SIZE} />
					</div>
					<div className='col-lg-4'>Fiat:</div>
					<div className='col-lg-6 text-right'>${formatFiatAmount(fiat_balance)}</div>
				</div>
				<div style={{borderBottom:'1px solid #7c8a96',fontSize:'0.7rem' }}>
					{this.state.viewFiat?
						<div className='pl-1 col-lg-11'>
							<div className='pt-2'>Available for trading:
								<span className='green'> ${formatFiatAmount(fiat_available)}</span>
							</div>
              {fiatOrdersCount > 0 &&
                <div className='pt-2'>You have {fiatOrdersCount} open order{fiatOrdersCount > 1 ? 's' : ''} resulting in a hold of {formatFiatAmount(fiat_trade)} placed on your fiat balance.</div>
              }
							<div className='pt-2'>Available for withdrawal:
								<span className='green'> ${formatFiatAmount(fiat_available)}</span>
							</div>
						</div>:null
					}
				</div>
				<div className='row p-2 pointer'  onClick={this.viewAssets}>
					<div className='col-lg-1'>
            <img src={this.state.viewAssets ? IMG_DOWN : IMG_RIGHT} width={IMG_SIZE} height={IMG_SIZE} />
					</div>
					<div className='col-lg-4'>Total Assets:</div>
					<div className='col-lg-6 text-right'>
						${formatFiatAmount(math.chain(btc_balance).multiply(price).add(fiat_balance).done())}
					</div>
				</div>
				<div style={{borderBottom:'1px solid #7c8a96',fontSize:'0.7rem' }}>
					{this.state.viewAssets?
						<div className='pl-1 col-lg-11'>
							<div className='pt-2'>Total available for trading:
								<span className='green'> ${formatFiatAmount(math.chain(btc_available).multiply(price).add(fiat_available).done())}</span>
							</div>
							<div className='pt-2'>Total available for withdrawal:
								<span className='green'> ${formatFiatAmount(math.chain(btc_trade).multiply(price).add(fiat_trade).done())}</span>
							</div>
						</div>:null
					}
				</div>
			</div>
		)
	}
	render() {
    const { price, user, logout, orders } = this.props;
		return (
			<div className="col-md-2 sidebar">
				<img src={require('./images/user.png')} width="50" height="50" style={{borderRadius:'30px'}}/>
				<ul>
					<li><Link to='/dashboard/account'>Account</Link></li>
					<li><Link to='/dashboard/exchange'>Exchange</Link></li>
					<li><Link to='/dashboard/deposit'>Deposit</Link></li>
					<li><Link to='/dashboard/withdraw'>Withdraw</Link></li>
					<li onClick={logout}>Logout</li>
				</ul>
				<div className='row sidebarBalance'>
          {user.id && this._displayBalance(price, user.balance, orders)}
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

const mapDispatchToProps = (dispatch) => ({
    logout: bindActionCreators(logout, dispatch),
})

const mapStateToProps = (store) => ({
	user: store.user,
	orderbook: store.orderbook,
  orders: store.order.activeOrders,
  price: store.orderbook.price
})
export default connect(mapStateToProps,mapDispatchToProps)(Sidebar);
