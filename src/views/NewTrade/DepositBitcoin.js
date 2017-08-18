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
				if(orderType=='market'){
	            	this.props.createOrder(side,orderType,Number(formProps.amount));
				}
				else{
					this.props.createOrder(side,orderType,Number(formProps.amount),formProps.price);
				}
	        }
		return (
			<div>
				<div className="d-flex ml-2 mt-1">
	 		 		<div><h5 className="mr-3">{`${this.props.head} BITCOINS`}</h5></div>
	 		 		<div className="ml-5  pt-1">
	 		 			<Link to="#">{`DEPOSIT ${this.props.link}`}</Link>
	 		 		</div>
	 		 	</div>
	 		 	<div className="row">
	 		 		<div className="ml-4">
		 		 		<form onSubmit={ handleSubmit(onSubmit)}>
		 		 			<div className='d-flex'>
		 		 				<div>Balance:</div>
		 		 				<div className='ml-4 pl-2'>{this.props.balance}</div>
		 		 			</div>
		 		 			<div className='d-flex'>
					 			<div className="">OrderType:</div>
					 			<div className="row ml-4 " >
						 			 <input 
						 			 	type="button" 
						 			 	value='Limit' style={{height:'1.2rem',width:'4rem'}} 
						 			 	className={this.state.disable?`activeButton`:`normalButton`}
						 			 	onClick={this.handleLimit} 
						 			 	disabled={this.state.disable}/>
						 			 <input type="button"
					 			 		 value='Market'  
					 			 		 style={{height:'1.2rem',width:'4rem'}}
					 			 		 className={!this.state.disable?`activeButton`:`normalButton`}
					 			 		 onClick={this.handleMarket} 
					 			 		 disabled={!this.state.disable}/>
					 			</div>
		 		 			</div>
		 		 			<div className='d-flex'>
					 			<div className="mt-1">Amount:</div>
			 		 			<div className="mt-1 ml-3 pl-3">
						 			<Field
							            name='amount'
							            component={ renderInput }
							            type="text"
							            label="Spend All"
							            placeholder="BTC"
						         	/>   
						 		</div>
		 		 			</div>

					 		{ orderType=='market'?null:
					 			<div className='d-flex'>
			 		 				<div>Price:</div>
			 		 				<div className="ml-5">
							 			<Field
								            name='price'
								            component={ renderInput }
								            type="text"
								            label="Best Sell Price"
								            placeholder="AUD"
								         />  
						 			</div>
			 		 			</div>
					 		}
					 		<div className='d-flex'>
		 		 				<div className="mt-2">{`${this.props.total} total:`}</div>
		 		 				<div className="row pt-2">
						 			<div className="ml-3 mr-1" style={{fontWeight:'bold',fontSize:'0.75rem'}}>
						 				{`$${this.props.totalAmount}`}
						 			</div>
						 			<span> inc 0.7% Fee (inc GST)</span>
						 			<div>
						 				<button className='boxButton ml-1'>{`${this.props.btc} BTC >`}</button>
						 			</div>
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