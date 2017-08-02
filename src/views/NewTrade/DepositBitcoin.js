import React, { Component } from 'react';
import { Link } from 'react-router'
import { createOrder } from '../../actions/orderAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';

const validate = formProps => {
  const errors = {}
  if (!formProps.amount) {
    errors.amount = 'Required'
  }
  if (!formProps.price) {
    errors.price = 'Required'
  }
  return errors
}
const renderInput = ({ input, label, placeholder, id, type, meta: {touched, invalid, error }}) => (
	<div className=''>
		<input  {...input} type={type} placeholder={placeholder} style={{height:'1rem'}}/>
		<span className="ml-1">{label}</span>
		<span style={{color: 'red'}} className="ml-1">
	      { touched ? error : '' }
	    </span>
 	</div>
);
class DepositBitcoin extends Component {
	_createOrder() {
		let side = "buy" // buy or sell depending on the box
		let type = "limit" // TODO select between limit or market
		let amount = 100000 // TODO the amount in the box
		let price = 1000 // TODO the price in the box
		this.props.dispatch(createOrder(side, type, Number(amount), price))
	}
	state={
		buyOrderType:'limit',
		sellOrderType:'limit',
		disable:true,
	}
	render() {
			const { handleSubmit } = this.props;
			var side=this.props.head=='BUY'?'buy':'sell'
			var orderType=this.props.head=='BUY'?this.state.buyOrderType:this.state.sellOrderType
			const onSubmit = formProps => {
				let price=orderType=='market'?100:formProps.price
	            this.props.createOrder(side,orderType,Number(formProps.amount),price);
	        }
		return (
			<div>
				<div className="row ml-2 mt-1">
	 		 		<h5 className="mr-3">{`${this.props.head} BITCOINS`}</h5>
	 		 		<div className="ml-5  pt-1">
	 		 			<Link to="#">{`DEPOSIT ${this.props.link}`}</Link>
	 		 		</div>
	 		 	</div>
	 		 	<div className="row">
	 		 		<div className="ml-4">
	 		 			<div>Balance:</div>
				 		<div className="mt-1">OrderType:</div>
				 		<div className="mt-1">Amount:</div>
				 		{orderType=='market'?null:
				 			<div className="mt-1">Price:</div>
				 		}
				 		<div className="mt-2">{`${this.props.total} total:`}</div>
	 		 		</div>	
	 		 		<div>
	 		 		<form onSubmit={ handleSubmit(onSubmit)}>
				 		<div>{this.props.balance}</div>
				 		<div className="mt-1 row ml-1 " >
				 			 <input 
				 			 	type="button" 
				 			 	value='Limit' style={{height:'1.2rem',width:'4rem'}} 
				 			 	className={this.state.disable?`activeButton pb-3`:`normalButton`}
				 			 	onClick={this.handleLimit} 
				 			 	disabled={this.state.disable}/>
				 			 <input type="button"
				 			 		 value='Market'  
				 			 		 style={{height:'1.2rem',width:'4rem'}}
				 			 		 className={!this.state.disable?`activeButton`:`normalButton`}
				 			 		 onClick={this.handleMarket} 
				 			 		 disabled={!this.state.disable}/>
				 		</div>
				 		<div style={{position:'relative',top:'-0.4rem'}} className="mt-2">
				 			<Field
					            name='amount'
					            component={ renderInput }
					            type="text"
					            label="Spend All"
					            placeholder="BTC"
				         	/>   
				 		</div>
				 		{orderType=='market'?null:
				 			<div  style={{position:'relative',top:'-0.3rem'}} className="">
					 			<Field
						            name='price'
						            component={ renderInput }
						            type="text"
						            label="Best Sell Price"
						            placeholder="AUD"
						         />  
				 			</div>
				 		}
				 		
					 	<div className="row mt-1">
				 			<div className="ml-4 mr-1" style={{fontWeight:'bold',fontSize:'0.75rem'}}>
				 				{`$${this.props.totalAmount}`}
				 			</div>
				 			<span> inc 0.7% Fee (inc GST)</span>
				 			<div  style={{position:'relative',top:'-0.4rem'}}>
				 				<button className='boxButton ml-2'>{`${this.props.btc} BTC >`}</button>
				 			</div>
				 		</div>
				 	</form>
				 	</div>
	 		 	</div>
			</div>
		);
	}
	handleLimit=(e)=>{
		if(this.props.head=='BUY'){
			this.setState({buyOrderType: 'limit' })
		}
		if(this.props.head=='SELL'){
			this.setState({sellOrderType:'limit'})
		}
	 	this.setState({disable:true})
	}
	handleMarket=(e)=>{
		if(this.props.head=='BUY'){
			this.setState({buyOrderType:'market'})
		}
		if(this.props.head=='SELL'){
			this.setState({sellOrderType:'market'})
		}
		this.setState({disable:false})
	}
}
const mapStateToProps = (store, ownProps) => ({
    order: store.order,
    orderbook: store.orderbook
})
const mapDispatchToProps = dispatch => ({
	createOrder: bindActionCreators(createOrder, dispatch),
})
const form = reduxForm({
  validate
});
export default connect(mapStateToProps, mapDispatchToProps)(form(DepositBitcoin));