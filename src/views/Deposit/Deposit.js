import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMe } from '../../actions/userAction'

const mapDispatchToProps = dispatch => ({
	getMe: bindActionCreators(getMe, dispatch),   
})
class Deposit extends Component {
	state={
		isBitcoin:true,
	}
	componentDidMount() {
		 this.props.getMe();
	}
	render() {
		var img = require('./images/QR.png');
		return (
			<div>
				<div className='text-center mt-5 pt-3'><h3>DEPOSIT</h3></div>
				 
				<div className="col-lg-8 offset-2 mt-5 ">
					<div className=" text-center tradeBorder" style={{height:'24rem'}}>
						<div className="row mt-4" style={{position:'relative',top:'-3rem'}}>
							<div className="col-lg-6 text-right pr-5">
								<button 
									onClick={this.openBitcoin}  
									className={this.state.isBitcoin?`activeButton`:`normalButton`}>
										Deposit Bitcoins
								</button>
							</div>
							<div className="col-lg-6 text-left pl-5">
								<button  
									onClick={this.closeBitcoin}
									className={this.state.isBitcoin?`normalButton`:`activeButton`}>
										Deposit Dollars
								</button>	
							</div>
						</div>
						{this.state.isBitcoin?
							<div className="mt-3">	
								<img src={img} width="150" height="150" className="mt-3" />
								<div className="mt-4" style={{fontSize:'0.66rem'}}>DEPOSIT BITCOIN AT THIS ADDRESS BELOW:</div>
								<div className="mt-2" style={{color:'rgb(50, 188, 235)'}}>
									<p>{this.props.user.crypto_wallet.bitcoin}</p>
								</div>
							</div>
							:
							<div className="col-lg-8 offset-2 ">	
								<div className='text-center pl-5 pr-5'>
									SEND DOLLARS TO THE BANK DETAILS BELOW
									ONLY USING THE BANK THAT IS UNDER YOUR NAME
								</div>
								<div className="mt-5 text-left pl-5" style={{color:'rgb(50, 188, 235)'}}>
									<p>bank of iran</p>
									<p>23193931913</p>
									<p>3413-32</p>
									<p>message code: 239321FF</p>
								</div>
							</div>
						}				
					</div>
				</div>
			</div>
		);
	}
	closeBitcoin=()=>{
		this.setState({
			isBitcoin:false
		})
	}
	openBitcoin=()=>{
		this.setState({
			isBitcoin:true
		})
	}
}
const mapStateToProps = (store, ownProps) => ({
	user: store.user
})

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);