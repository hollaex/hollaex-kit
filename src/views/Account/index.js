import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import AccountBalance from './AccountBalance';
import AccountSetup from './AccountSetup';
import SecuritySetup from './SecuritySetup';
import TradeOrders from './TradeOrders';
import TradeHistory from './TradeHistory';
import USDHistory from './USDHistory';
import BTCHistory from './BTCHistory';
import './styles/account.css'

 class AccountModify extends Component {
	state={
		buttonOne:true,
		buttonTwo:false,
		buttonThree:false,
		buttonFour:false,
		buttonFive:false,
		buttonSix:false,
		buttonSeven:false,
	}
	render() {
		var img = require('./images/user.png');
		var img2 = require('./images/success.png');
		return (
			<div className='mt-5'>
			    <div className="mt-5  text-center">
			    	<div><h3>My Account</h3></div>
			    </div>
			    <div className="tradeBorder mt-5 accountContainer d-flex flex-column" >
					<div className="row justify-content-center" style={{marginTop:'-1.8rem'}}>
						<div className="p-2">
					  		<button onClick={this.buttonOne} className={this.state.buttonOne?'accountActive':'notActive'}>
					  		{this.state.buttonOne?
					  			<img src={img2} width="40" height="40"/>
					  			:
					  			<img src={img} width="40" height="40" />
					  		}
					  		</button>
					  	</div>
						<div className="p-2">
					  		<button onClick={this.buttonTwo} className={this.state.buttonTwo?'accountActive':'notActive'}>
					  		{this.state.buttonTwo?
					  			<img src={img2} width="40" height="40"/>
					  			:
					  			<img src={img} width="40" height="40" />
					  		}
					  		</button>
					  	</div>
					 	<div className="p-2">
					  		<button onClick={this.buttonThree} className={this.state.buttonThree?'accountActive':'notActive'}>
					  		{this.state.buttonThree?
					  			<img src={img2} width="40" height="40"/>
					  			:
					  			<img src={img} width="40" height="40" />
					  		}
					  		</button>
					  	</div>
						<div className="p-2">
					  		<button onClick={this.buttonFour} className={this.state.buttonFour?'accountActive':'notActive'}>
					  		{this.state.buttonFour?
					  			<img src={img2} width="40" height="40"/>
					  			:
					  			<img src={img} width="40" height="40" />
					  		}
					  		</button>
						 </div>
						 <div className="p-2">
					  		<button onClick={this.buttonFive} className={this.state.buttonFive?'accountActive':'notActive'}>
					  		{this.state.buttonFive?
					  			<img src={img2} width="40" height="40"/>
					  			:
					  			<img src={img} width="40" height="40" />
					  		}
					  		</button>
						 </div>
						 <div className="p-2">
					  		<button onClick={this.buttonSix} className={this.state.buttonSix?'accountActive':'notActive'}>
					  		{this.state.buttonSix?
					  			<img src={img2} width="40" height="40"/>
					  			:
					  			<img src={img} width="40" height="40" />
					  		}
					  		</button>
						  </div>
						<div className="p-2">
					  		<button onClick={this.buttonSeven} className={this.state.buttonSeven?'accountActive':'notActive'}>
					  		{this.state.buttonSeven?
					  			<img src={img2} width="40" height="40"/>
					  			:
					  			<img src={img} width="40" height="40" />
					  		}
					  		</button>
						 </div>

					</div>
					<div className="col-lg-10 offset-lg-1 col-xs-12 mt-5 ">
						{this.state.buttonOne? <AccountBalance />
							: 
								this.state.buttonTwo?<AccountSetup />
							:
								this.state.buttonThree?<SecuritySetup />
							: 
								this.state.buttonFour?<TradeOrders />
							: 
								this.state.buttonFive?<TradeHistory />
							: 
								this.state.buttonSix?<USDHistory />
							:
								this.state.buttonSeven?<BTCHistory />
							:null
						}
					</div>
				</div>
			</div>
		);
	}
	buttonOne = () =>{
		this.setState({
		 	buttonOne:true,buttonTwo:false,buttonThree:false,buttonFour:false,buttonFive:false,buttonSix:false,buttonSeven:false
		})
	}
	buttonTwo = () =>{
		this.setState({
		 	buttonOne:false,buttonTwo:true,buttonThree:false,buttonFour:false,buttonFive:false,buttonSix:false,buttonSeven:false
		})
	}
	buttonThree = () =>{
		this.setState({
		 	buttonOne:false,buttonTwo:false,buttonThree:true,buttonFour:false,buttonFive:false,buttonSix:false,buttonSeven:false
		})
	}
	buttonFour = () =>{
		this.setState({
		 	buttonOne:false,buttonTwo:false,buttonThree:false,buttonFour:true,buttonFive:false,buttonSix:false,buttonSeven:false
		})
	}
	buttonFive = () =>{
		this.setState({
		 	buttonOne:false,buttonTwo:false,buttonThree:false,buttonFour:false,buttonFive:true,buttonSix:false,buttonSeven:false
		})
	}
	buttonSix = () =>{
		this.setState({
		 	buttonOne:false,buttonTwo:false,buttonThree:false,buttonFour:false,buttonFive:false,buttonSix:true,buttonSeven:false
		})
	}
	buttonSeven = () =>{
		this.setState({
		 	buttonOne:false,buttonTwo:false,buttonThree:false,buttonFour:false,buttonFive:false,buttonSix:false,buttonSeven:true
		})
	}
}
const mapDispatchToProps = dispatch => ({
    
})
const mapStateToProps = (store, ownProps) => ({
	user: store.user
})
export default connect(mapStateToProps, mapDispatchToProps)(AccountModify);
