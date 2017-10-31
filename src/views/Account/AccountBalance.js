import React from 'react';
import { connect } from 'react-redux';
import numbro from 'numbro'
import math from 'mathjs';
import { Link } from 'react-router'
import { formatBtcAmount, formatFiatAmount } from '../../utils/string';

const renderBalanceTable = (balance, price) => {
	const { fiat_balance = 0, fiat_available = 0, btc_balance = 0, btc_available = 0 } = balance;
	const fiat_trade = math.chain(fiat_balance).subtract(fiat_available).done();
	const btc_trade = math.chain(btc_balance).subtract(btc_available).done();
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
								<div className='pl-3'>{formatFiatAmount(fiat_available)}</div>
								<div style={{backgroundColor:'#2aabe4'}} className='balance ml-1'></div>
							</div>
						</td>
					 	<td >
							<div style={{color:'#f15a25'}} className='row'>
								<div className='pl-3'>{formatBtcAmount(btc_available)}</div>
								<div style={{backgroundColor:'#f15a25'}} className='balance ml-1'></div>
							</div>
						</td>
					 	<td >Total in USD: {formatFiatAmount(math.chain(btc_available).multiply(price).add(fiat_available).done())}</td>
					</tr>
					<tr style={{borderTop:'2px solid #81868a'}}>
					 	<td>Balance in trade:</td>
						<td >
							<div style={{color:'#00a99e'}} className='row'>
								<div className='pl-3'>{formatFiatAmount(fiat_trade)}</div>
								<div style={{backgroundColor:'#00a99e'}} className='balance ml-1'></div>
							</div>
						</td>
						<td>
							<div style={{color:'#fbb03b'}} className='row'>
								<div className='pl-3'>{formatBtcAmount(btc_trade)}</div>
								<div style={{backgroundColor:'#fbb03b'}} className='balance ml-1'></div>
							</div>
						</td>
						<td>Total in USD: {formatFiatAmount(math.chain(btc_trade).multiply(price).add(fiat_trade).done())}</td>
					</tr>
					<tr style={{backgroundColor:'#e1e2e6'}}>
						<td></td>
						<td>{`Total USD assets : $${fiat_balance}`}<span className="pl-2">+</span></td>
						<td>{`Total BTC assets : ${btc_balance}`}<span className="pl-2">=</span></td>
						<td  className='accountActive '>
							<div>Total Asset in USD:${formatFiatAmount(math.chain(btc_balance).multiply(price).add(fiat_balance).done())}</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

const AccountBalance = ({ user, price }) => (
	<div className='col-lg-10 offset-lg-1'>
		<div  className='mt-4'><h3>Account Balance</h3></div>
		{user.id && renderBalanceTable(user.balance, price)}
		<div className="row mt-3">
			<div className='col-lg-6 '>
				 <Link to="/dashboard/deposit"><button className='accountButton'>DEPOSIT FUNDS</button></Link>
			</div>
			<div className='col-lg-6  '>
					<Link to="/dashboard/withdraw"><button className='accountButton'>WITHDRAW FUNDS</button></Link>
			</div>
		</div>
	</div>
);

const mapStateToProps = (store, ownProps) => ({
	user: store.user,
	price: store.orderbook.price
});

export default connect(mapStateToProps)(AccountBalance);
